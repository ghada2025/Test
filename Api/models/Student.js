import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    grade: String,
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe" },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

export  const Student = mongoose.model("Student", StudentSchema)