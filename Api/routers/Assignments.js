import express from "express";
import {
  getStudentAssignments,       // 👀 
  createAssignment,     // ➕       
  deleteAssignment,     // ❌ 
  submitAssignment,      // 📬 
  getSubmissionsByTeacher,
  updateAssignment // ✏️
} from "../controllers/Assignments.js";

const router = express.Router();

// 👀 Voir tous les devoirs d’un étudiant
router.get("/", getStudentAssignments);

// 👀📄 
router.get("/teacher", getSubmissionsByTeacher);

// ➕ Créer un nouveau devoir
router.post("/", createAssignment);

// ❌ Supprimer un devoir
router.delete("/:id", deleteAssignment);

// 📬 Soumettre un devoir (étudiant)
router.post("/submit", submitAssignment);

// ✏️ Modifier soumettre un devoir
router.put("/submit", updateAssignment);

export { router as assignmentRouter };
