import mongoose from "mongoose";


// 🗂️ Représente la soumission d’un quiz complet par un étudiant

const QuizSubmissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },  // 👨
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },  // 📝      
    submittedAt: { type: Date, default: Date.now }, // 🕒 
    score: { type: Number, default: 0 }, // ✅ Number, // 🧮 
});


export const QuizSubmission = mongoose.model("QuizSubmission", QuizSubmissionSchema);
