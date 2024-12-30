import mongoose,{Schema, Document} from "mongoose";

interface IEnrollment extends Document{
    username: String;
    subjectId: String;
}

const EnrollmentSchema: Schema = new Schema({
    username :{type: "string", required: true, ref:'User' },
    subjectId: {type: "string", required: true, ref:'Subject' },
});

const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export default Enrollment;
