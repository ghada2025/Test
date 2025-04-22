import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: String,
    question: String,
    options: [String],
    answers: [String],
    type: {
        type: String,
        enum: ['QCS', 'QCM', 'FIG'],
        default: 'QCM'
    }
});


const QuizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    questions: [QuestionSchema]
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", QuizSchema);