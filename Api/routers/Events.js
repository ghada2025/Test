import express from "express";
import {
    getEvents,                  // 📅  
    createEvent,                // ➕ 
    updateEvent,                // ✏️ 
    deleteEvent                 // ❌ 
} from "../controllers/Events.js";


const router = express.Router();

// 📅 Tous les Events pour 15 jours d'un étudiant 
router.get("/", getEvents);

// ➕ Créer un nouvel Event
router.post("/", createEvent);

// ✏️ Modifier un Event
router.put("/:id", updateEvent);

// ❌ Supprimer un Event
router.delete("/:id", deleteEvent);

export { router as eventRouter };