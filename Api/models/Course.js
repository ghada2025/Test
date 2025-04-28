import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    subject: String,
    title: String,
    description: String,
    startDate: Date,
    content : String,
    endDate: Date,
    startTime: String,
    endTime: String,
    color: String,
    videoUrl: String,

    // 🔁 Références
    classe: { type: mongoose.Schema.Types.ObjectId, ref: "Classe" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        default: null,
    },
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
