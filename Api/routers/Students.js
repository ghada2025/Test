import express from "express";
import {
    registerStudent,    // ✍️ Enregistrement d'un étudiant sans grade
    loginStudent,       // 🔑 Connexion de l'étudiant
    getMyProfile,       // 👤 Récupération du profil 
    updateStudentGrade  // ✏️ Mise à jour du grade
} from "../controllers/Students.js";

const router = express.Router();

router.post("/register", registerStudent);// ✍️ 
router.post("/login", loginStudent);// 🔑 
router.get("/me", getMyProfile);// 👤 
router.put("/grade", updateStudentGrade);// ✏️ 


export { router as studentRouter };

