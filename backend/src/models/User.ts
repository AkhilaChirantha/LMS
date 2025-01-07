import mongoose, { Document, Schema } from 'mongoose';

// Interface for User
export interface IUser extends Document {
  fname: string;
  lname: string;
  dob: Date;
  gender: 'Male' | 'Female' | 'NotPrefer';
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'administrator';
  phone1: string;
  phone2?: string;
  username?: string;
  program?: string;
  batch?: string;
  teachingSubject?: string;
  termsAgreed: boolean;
}

// User Schema
const UserSchema: Schema = new Schema<IUser>({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'NotPrefer'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'lecturer', 'administrator'], required: true },
  phone1: { type: String, required: true },
  phone2: { type: String },
  username: { type: String, unique: true },
  program: { type: String },
  batch: { type: String, required: true},
  teachingSubject: { type: String },
  termsAgreed: { type: Boolean, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);
