import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
    year: { type: String, required: true },
    semester: { type: String, required: true },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    credit: { type: Number, required: true },
});

const Subject = mongoose.model('Subject', SubjectSchema);

export default Subject;
