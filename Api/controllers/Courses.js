import { Classe } from "../models/classe.js";
import { Course } from "../models/Course.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";

// ➕ Créer un nouveau cours
export async function createCourse(req, res) {
    try {
        const {
        subject,
        title,
        description,
        date,
        startTime,
        endTime,
        color,
        classe,    
        teacher,   
        videoUrl,
        } = req.body;

        // 🔎 Trouver la classe par son nom
        const existingClass = await Classe.findOne({ name: classe });
        if (!existingClass) {
        return res.status(404).json({ message: "❌ Classe introuvable." });
        }

        // 🔎 Trouver l’enseignant par son prénom + nom
        const [firstName, ...lastNameParts] = teacher.split(" ");
        const lastName = lastNameParts.join(" ");
        const existingTeacher = await Teacher.findOne({ firstName, lastName });
        if (!existingTeacher) {
        return res.status(404).json({ message: "❌ Enseignant introuvable." });
        }

        // ✅ Création du cours
        const newCourse = new Course({
        subject,
        title,
        description,
        date,
        startTime,
        endTime,
        color,
        classe: existingClass._id,
        teacher: existingTeacher._id,
        videoUrl,
        });

        await newCourse.save();
        
        res.status(201).json({
        message: "✅ Cours créé avec succès",
        course: newCourse,
        });

    } catch (error) {
        console.error("❌ Erreur lors de la création du cours :", error);
        res.status(500).json({
        message: "Erreur serveur lors de la création du cours",
        error: error.message,
        });
    }
}

// 📅 Tous les cours de cette semaine pour une classe
export async function getCoursesThisWeek(req, res) {
    try {
        const studentId = req.cookies.student; // 🍪 depuis les cookies
        console.log(studentId)
        // 🔍 Trouver l'étudiant avec sa classe
        const student = await Student.findById(studentId).populate("classe");
        if (!student || !student.classe) {
            return res.status(404).json({ message: "❌ Étudiant ou classe introuvable." });
        }
        // 🔢 Date du début de la semaine (lundi)
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // 
        firstDay.setHours(0, 0, 0, 0);
        // 🔢 Date de fin de la semaine (dimanche)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        // 🔎 Recherche des cours de cette classe entre lundi et dimanche
        const courses = await Course.find({
            classe: student.classe, 
            date: { $gte: firstDay, $lte: lastDay },
            }).populate("teacher", "firstName lastName")
            .populate("classe", "name");
        res.json({
            message: "✅ Cours de cette semaine récupérés avec succès",
            courses
        });
    
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des cours :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// 📘 Obtenir tous les cours de cette semaine pour une classe et un sujet précis
export async function getWeeklyCoursesBySubject(req, res) {
    try {
        const studentId = req.cookies.student; // 🍪 depuis les cookies
        const { id } = req.params; // 🔍 id du cours

        //  Trouver la classe de l'étudiant
        const studente = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Étudiant introuvable" });

        const classeId = studente.classe; // 🏫

        //  Trouver le cours pour récupérer le subject
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: "Cours introuvable" });

        const subject = course.subject; // 📚


        if (!classeId || !subject || !studentId) {
            return res.status(400).json({ message: "🚫 Les champs classeId, subject et studentId sont obligatoires" });
        }

        // 🗓️ Début et fin de la semaine
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);

        // 🔍 Tous les cours de la semaine (avec le quiz associé)
        const weeklyCourses = await Course.find({
            classe: classeId,
            subject,
            date: { $gte: firstDay, $lte: lastDay }
        });

        // 📘 Récupère l'étudiant
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Étudiant introuvable" });

        // 🧹 Tri en deux tableaux
        const completedCoursesThisWeek = [];
        const incompletedCoursesThisWeek = [];

        weeklyCourses.forEach(course => {
            if (student.completedCourses.includes(course._id)) {
                completedCoursesThisWeek.push(course);
            } else {
                incompletedCoursesThisWeek.push(course);
            }
        });

        res.json({
            completed: completedCoursesThisWeek,
            incompleted: incompletedCoursesThisWeek
        });

    } catch (err) {
        console.error("❌ Erreur dans getWeeklyCourses :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
}

// 📚 Obtenir un cours par son id
export async function getOneCourse(req, res) {
    try {
        const { id } = req.params;
    
        const course = await Course.findById(id)
            .populate("classe", "name")      
            .populate("teacher", "firstName lastName") 
            .populate("quiz");               
    
        if (!course) {
            return res.status(404).json({ message: "Cours introuvable ❌" });
        }
    
        res.status(200).json({ course });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du cours :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 📚 get all courses of a teacher
export async function getCoursesByTeacher(req, res) {
    try {
        const teacherId = req.cookies.teacher; 
    
        const courses = await Course.find({ teacher: teacherId })
            .populate("classe", "name")      
            .populate("teacher", "firstName lastName")                
        if (!courses) {
            return res.status(404).json({ message: "Cours introuvable ❌" });
        }
    
        res.status(200).json({ courses });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des cours :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

//NOT TESTED YET  👀
// ✏️ Modifier un cours
export async function updateCourse(req, res) {
    try {
        const { id } = req.params;
        const {
            subject,
            title,
            description,
            date,
            startTime,
            endTime,
            videoUrl,
            quiz,
            classe,
            teacher
        } = req.body;
    
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
            subject,
            title,
            description,
            date,
            startTime,
            endTime,
            videoUrl,
            quiz,
            classe,
            teacher
            },
            { new: true }
        );
    
        if (!updatedCourse) {
            return res.status(404).json({ message: "❌ Cours introuvable" });
        }
    
        res.json({
            message: "✅ Cours mis à jour avec succès",
            course: updatedCourse
        });
    
    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour du cours :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// ❌ Supprimer un cours
export async function deleteCourse(req, res) {
    try {
        const { id } = req.params;
    
        const deletedCourse = await Course.findByIdAndDelete(id);
    
        if (!deletedCourse) {
            return res.status(404).json({ message: "❌ Cours non trouvé" });
        }
    
        res.json({
            message: "🗑️ Cours supprimé avec succès",
            course: deletedCourse
        });
    
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du cours :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}







