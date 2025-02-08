import express from 'express';
import Subject from '../models/Subject';

const subjectRouter = express.Router();

// Create a new subject
subjectRouter.post('/add', async (req, res) => {
    const { year, semester, subjectId, subjectName, credit } = req.body;

    try {
        const newSubject = new Subject({
            year,
            semester,
            subjectId,
            subjectName,
            credit,
        });

        await newSubject.save();
        res.status(201).json({ message: 'Subject added successfully', subject: newSubject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add subject', error });
    }
});

// Get all subjects
subjectRouter.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subjects', error });
    }
});

// get the subject next to the calculated semester
subjectRouter.get('/sem', async (req, res) => {
    const { year, semester } = req.query;
    try {
        const query: any = {};
        if (year) query.year = year;
        if (semester) query.semester = semester;

        const subjects = await Subject.find(query);
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subjects', error });
    }
});

// Delete a subject by subjectId
subjectRouter.delete('/remove/:subjectId', async (req, res) => {
    const { subjectId } = req.params;

    try {
        const deletedSubject = await Subject.findByIdAndDelete(subjectId);

        if (!deletedSubject) {
            res.status(404).json({ message: 'Subject not found' });
            return;
        }

        res.status(200).json({ message: 'Subject deleted successfully', subject: deletedSubject });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subject', error });
    }
});


export default subjectRouter;
