import mongoose from "mongoose";

const ClasseSchema = new mongoose.Schema({
    name: String, // ex: "1st grade", "2nd grade", etc.
    grade: String, // ex: "Primary", "Secondary", "College"
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

export const Classe = mongoose.model("Classe", ClasseSchema);