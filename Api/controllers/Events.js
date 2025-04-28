import { Event } from "../models/Event.js";
import { Student } from "../models/Student.js";


// ➕ Créer un nouvel evenement
export async function createEvent(req, res) {
    try {
        const studentId = req.cookies.student;
        const { 
            title, 
            description, 
            startDate, 
            endDate, 
            location, 
            startTime, 
            endTime, 
            allDay, 
            color 
        } = req.body;

        // 🔍 Vérifier les conflits de date/heure
        const overlappingEvents = await Event.find({
            startDate: new Date(startDate),
            student: studentId,
            $or: [
                {                                // ✅ ici : EXISTANT.startTime < NEW.endTime  
                    startTime: { $lt: endTime }, // si l'événement existant commence AVANT la fin du nouveau
                    endTime: { $gt: startTime } // et se termine APRÈS le début du nouveau
                },                              // ✅ ici : EXISTANT.endTime > NEW.startTime
                {
                    allDay: true
                }
            ]
        });

        if (overlappingEvents.length > 0) {
            return res.status(400).json({ message: "⚠️ Un événement est déjà prévu à cette période." });
        }

        const newEvent = new Event({
            title,
            description,
            startDate,
            endDate,
            startTime,
            endTime,
            location,
            allDay,
            student: studentId,
            color
        });

        await newEvent.save();

        await Student.findByIdAndUpdate(studentId, {
            $push: { events: newEvent._id } 
        });

        res.status(201).json({
            message: "✅ Événement créé avec succès",
            event: newEvent
        });
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'événement:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 📆 Recuperer tous les evenements
export async function getEvents(req, res) {
    try {
        const studentId = req.cookies.student;

        if (!studentId) {
            return res.status(401).json({ message: "Non autorisé 🚫" });
        }

        const today = new Date();
        const after15Days = new Date();
        after15Days.setDate(today.getDate() + 15);
        const events = await Event.find({
        startDate: { $gte: today, $lte: after15Days }
        });

        res.json({ events });
    } catch (error) {
        console.error("❌ Error getting events:", error);
        res.status(500).json({ message: "Error server" });
    }
}

// ❌ Supprimer un evenement
export async function deleteEvent(req, res) { 
    try {
        const { id } = req.params; // id event 
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "❌ Event not found" });
        }
        res.json({ message: "🗑️ Event deleted successfully", event: deletedEvent });
    } catch (error) {
        console.error("❌ Error deleting event:", error);
        res.status(500).json({ message: "Error server" });
    }
}

// ✏️ Modifier un evenement
export async function updateEvent(req, res) {
    try {
        const { id } = req.params; // id event
        const { title, description, startDate, endDate, startTime, endTime, location, allDay, color } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, startDate, endDate, startTime, endTime, location, allDay, color }, { new: true });
        if (!updatedEvent) { 
            return res.status(404).json({ message: "❌ Event not found" });
        } 
        res.json({ message: "✏️ Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error("❌ Error updating event:", error);
        res.status(500).json({ message: "Error server" });
    } 
}  