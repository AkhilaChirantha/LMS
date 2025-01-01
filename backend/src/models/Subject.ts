import mongoose, { Schema, Document } from 'mongoose';

interface ISubject extends Document {
    year: number;
    semester: number;
    subjectId: string;
    subjectName: string;
    credit: number;
  }

const SubjectSchema = new Schema({
    year: { type: String, required: true },
    semester: { type: String, required: true },
    subjectId: { type: String, required: true },
    subjectName: { type: String, required: true },
    credit: { type: Number, required: true },
});

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
