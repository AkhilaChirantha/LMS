import express from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User'; // Import User model

const userRoutes = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
userRoutes.post('/register', async (req, res): Promise<void> => {
  const {
    fname,
    lname,
    dob,
    gender,
    email,
    password,
    comfirmpassword,
    role,
    phone1,
    phone2,
    username,
    program,
    batch,
    teachingSubject,
    termsAgreed,
  } = req.body;

  // Check if passwords match
  if (password !== comfirmpassword) {
    res.status(400).json({ message: 'Passwords do not match' });
    return;
  }

  try {
    // Check if email already exists
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      fname,
      lname,
      dob,
      gender,
      email,
      password: hashedPassword,
      role,
      phone1,
      phone2,
      username,
      program,
      batch,
      teachingSubject,
      termsAgreed,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully', user: savedUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
userRoutes.post('/login', async (req, res): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid username or password' });
      return;
    }

    // Send success response (you can include additional data if needed)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin only
 */
userRoutes.get('/', async (_req, res): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default userRoutes;
