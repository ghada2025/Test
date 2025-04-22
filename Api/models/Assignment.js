import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    submission: [{
        answer: String,
        submittedAt: { type: Date },
        status: {
            type: String,
            enum: ['Upcoming', 'Done'],
            default: 'Upcoming'
        },
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }
    }]
}, { timestamps: true });


export const Assignment = mongoose.model("Assignment", AssignmentSchema);