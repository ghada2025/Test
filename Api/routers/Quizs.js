import express from "express";
import {
                      
  createQuiz,         // ➕ Créer un quiz
  submitQuiz,         // 📨 Soumettre un quiz
  updateQuiz,          // ✏️ Modifier un quiz
  deleteQuiz          // 🗑️ Supprimer un quiz
} from "../controllers/Quizs.js";


const router = express.Router();

router.post("/", createQuiz);  // ➕ 
router.post("/submit/:quizId", submitQuiz); // 📨
router.delete("/:quizId", deleteQuiz);// 🗑️
router.put("/:quizId", updateQuiz);// ✏️

export { router as quizRouter };
