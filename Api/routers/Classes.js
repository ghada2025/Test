import express from "express";
import { 
  createClass,       // ➕ 
  updateClass,       // ✏️ 
  deleteClass        // ❌ 
} from "../controllers/Classes.js";

const router = express.Router();

// ➕ Créer une nouvelle classe
router.post("/", createClass);

// ✏️ Modifier une classe (ajout d’un élève ou d’un enseignant)
router.put("/:id", updateClass);

// ❌ Supprimer une classe
router.delete("/:id", deleteClass);

export { router as classRouter };
