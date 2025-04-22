import express from "express";
import {
  getCoursesThisWeek,          // 📅 
  getWeeklyCoursesBySubject, // 📘 
  createCourse,                // ➕ 
  updateCourse,                // ✏️ 
  deleteCourse,                 // ❌ 
  getOneCourse,
  getCoursesByTeacher
} from "../controllers/Courses.js";

const router = express.Router();

// 📅 Tous les cours de cette semaine (pour une classe)
router.get("/week", getCoursesThisWeek);

// 📘 Tous les cours de cette semaine avec un sujet spécifique
router.get("/weekSubject/:id", getWeeklyCoursesBySubject);

// 👀 Voir un seul cours
router.get("/:id", getOneCourse);

// 👀 Voir tous les cours d’un enseignant
router.get("/", getCoursesByTeacher);

// ➕ Créer un nouveau cours
router.post("/", createCourse);

// ✏️ Modifier un cours
router.put("/:id", updateCourse);

// ❌ Supprimer un cours
router.delete("/:id", deleteCourse);

export { router as courseRouter };
