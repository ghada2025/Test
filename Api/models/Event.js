import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    endTime: String,
    location: String,
    allDay: { type: Boolean, default: false },
    color: { type: String, enum: ['yellow', 'blue', 'purple', 'red', 'green'] }, // Etiquette de couleur pour le calendrier
    students:{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true });

export const Event = mongoose.model("Event", EventSchema);
