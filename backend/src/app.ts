import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import subjectRouter from './routes/subjectRoutes';
import enrolmentRouter from './routes/enrollmentRoutes';
import LecEnrollRouter from './routes/lecEnrollRoutes';


// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRouter);
app.use('/api/enrolments', enrolmentRouter);
app.use('/api/lecenrollments', LecEnrollRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
