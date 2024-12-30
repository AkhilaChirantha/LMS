import express  from "express";
import Enrollment from "../models/Enrollment";
import User from "../models/User";
import Subject from "../models/Subject";

const enrolmentRouter = express.Router();

// Add a new Enrollment 

enrolmentRouter.post('/add', async (req, res) => {
    try {
        const { username, subjectId } = req.body;

        //validate Inputs
        if (!username || !subjectId) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        // Check if the student exists
        const student  = await User.findOne({ username });
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }

        // Check if the subject exists
        const subject = await Subject.findOne({ subjectId });
        if(!subject){
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        

        // Check if the student is already enrolled in the subject
        const enrollmentExists = await Enrollment.findOne({ username, subjectId });
        if (enrollmentExists) {

           res.status(400).json({ message: 'This student is already enrolled in this subject.' });
           return;
        }

        // If no existing enrollment, proceed to create a new one
        const newEnrollment = new Enrollment({ username, subjectId });
        await newEnrollment.save();

        res.status(201).json({ message: 'Enrollment added successfully', newEnrollment });



    } catch (error) {
        console.error("Error adding Enrollment part...", error);
        res.status(500).json({ message: 'Error adding Enrollment' });
        return;
        
    }

    
});

    //Get All enrollments 
    
    enrolmentRouter.get('/all', async (req, res) => {
        const { username, subjectId } = req.body;
        try {
            const enrollments = await Enrollment.find().populate(username).populate(subjectId);
            res.status(200).json(enrollments);
            return;

        } catch (error) {
            console.error("Error getting Enrollment", error);
            res.status(500).json({ message: 'Error getting Enrollment' });
            return;
        }
    })

export default enrolmentRouter