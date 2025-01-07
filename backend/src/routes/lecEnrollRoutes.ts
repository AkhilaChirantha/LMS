import express  from "express";
import User from "../models/User";
import Subject from "../models/Subject";
import { Types } from "mongoose";
import LecEnroll from "../models/LecEnroll";

const LecEnrollRouter = express.Router();

// Add a new Enrollment 

LecEnrollRouter.post('/addlec', async (req, res) => {
    try {
        const { username, subjectId} = req.body;

        //validate Inputs
        if (!username || !subjectId) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        // Check if the student exists
        const lecturer  = await User.findOne({ username });
        if (!lecturer) {
            res.status(404).json({ message: 'Lecturer is not found' });
            return;
        }

        // Check if the subject exists
        const subject = await Subject.findOne({ subjectId });
        if(!subject){
            res.status(404).json({ message: 'Subject not found' });
            return;
        }
        

        // Check if the student is already enrolled in the subject
        const enrollmentExists = await LecEnroll.findOne({ username, subjectId });
        if (enrollmentExists) {

           res.status(400).json({ message: 'This Lecture is already enrolled in this subject.' });
           return;
        }

        // If no existing enrollment, proceed to create a new one
        const newEnrollment = new LecEnroll({ username, subjectId, subjectName: subject.subjectName, });
        await newEnrollment.save();

        res.status(201).json({ message: 'Enrollment added successfully', newEnrollment });
        return;



    } catch (error) {
        console.error("Error adding Enrollment part...", error);
        res.status(500).json({ message: 'Error adding Enrollment' });
        return;
        
    }

    
});

    //Get All enrollments     
LecEnrollRouter.get('/alllec', async (req, res) => {
        const { username, subjectId} = req.body;
        try {
            const enrollments = await LecEnroll.find().populate(username).populate(subjectId);
            res.status(200).json(enrollments);
            return;

        } catch (error) {
            console.error("Error getting Enrollment", error);
            res.status(500).json({ message: 'Error getting Enrollment' });
            return;
        }
    })


    // Get Enrollments by username
   // Get Enrollments by username
LecEnrollRouter.get('/bylecturer/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find all enrollments for the provided username
        const enrollments = await LecEnroll.find({ username }).lean();

        if (!enrollments.length) {
            res.status(404).json({ message: 'No enrollments found for this Lecturer.' });
            return;
        }

        // Enrich enrollments with subject details
        const results = await Promise.all(
            enrollments.map(async (enrollment) => {
                let subjectDetails = null;

                if (typeof enrollment.subjectId === 'string') {
                    // Find subject by string subjectId
                    subjectDetails = await Subject.findOne({ subjectId: enrollment.subjectId }).lean();
                } else if (Types.ObjectId.isValid(enrollment.subjectId)) {
                    // Find subject by ObjectId
                    subjectDetails = await Subject.findById(enrollment.subjectId).lean();
                }

                return {
                    username: enrollment.username,
                    subjectId: enrollment.subjectId,
                    subjectDetails, // Include enriched subject details
                };
            })
        );

        res.status(200).json(results);
    } catch (error) {
        console.error("Error getting Enrollment by username:", error);
        res.status(500).json({ message: 'Error fetching enrollments' });
    }
});


    //Get All students' subjects with Grades
    
    LecEnrollRouter.get('/allresultlec', async (req, res) => {
        const { username, subjectId,  } = req.body;
        try {
            const enrollments = await LecEnroll.find().populate(username).populate(subjectId);
            res.status(200).json(enrollments);
            return;

        } catch (error) {
            console.error("Error getting Enrollment", error);
            res.status(500).json({ message: 'Error getting Enrollment' });
            return;
        }
    })

  


export default LecEnrollRouter