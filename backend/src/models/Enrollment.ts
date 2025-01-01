import mongoose, { Schema, Types } from "mongoose";

const EnrollmentSchema = new Schema({
    username: { type: String, required: true, ref: "User" },
    subjectId: { 
        type: Schema.Types.Mixed, // Mixed type to accept both ObjectId and string
        required: true,
        validate: {
            validator: (value: any) => {
                return Types.ObjectId.isValid(value) || typeof value === "string";
            },
            message: "Invalid subjectId format. Must be an ObjectId or a string."
        }
    },
    grade: { type: String},
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;
