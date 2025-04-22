import express from "express";
import {
    registerTeacher,    // ✍️ Enregistrement d'un teacher 
    loginTeacher,       // 🔑 Connexion d'un teacher
    getMyProfile,
    getTeacherClasses,       // 👤 Récupération du profil 
} from "../controllers/Teachers.js";

const router = express.Router();

router.post("/register", registerTeacher);// ✍️ 
router.post("/login", loginTeacher);// 🔑 
router.get("/me", getMyProfile);// 👤 
router.get("/classe/:teacherId" , getTeacherClasses) // ✅  récupérer les classes d'un enseignant 

export { router as teacherRouter };