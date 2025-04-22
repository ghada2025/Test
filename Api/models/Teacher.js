import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", TeacherSchema);

