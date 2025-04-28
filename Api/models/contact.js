import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        maxlength: 500,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: false, 
    },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);

