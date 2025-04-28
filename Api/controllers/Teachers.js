import bcrypt from "bcrypt";
import { Teacher } from "../models/Teacher.js";
import { Classe } from "../models/classe.js";
import { Student } from "../models/Student.js";
import { Assignment } from "../models/Assignment.js";
import { Quiz } from "../models/Quiz.js";
import { Course } from "../models/Course.js";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

// 👤 Récupérer le profil du teacher connecté
export async function getMyProfile(req, res) {
    try {
        const teacherId = req.cookies.teacher; // 📦 On récupère l'id du cookie

        if (!teacherId) {
            return res.status(401).json({ message: "Non autorisé 🚫" });
        }

        const teacher = await Teacher.findById(teacherId)

        if (!teacher) {
            return res.status(404).json({ message: "Enseignant introuvable ❌" });
        }

        res.json({ teacher }); // ✅ Envoie du profil
    } catch (error) {
        console.log("❌ Erreur dans getMyProfile :", error);
        res.status(500).json({ message: "Erreur lors de la récupération du profil 🚨" });
    }
}

// ✍️ Enregistrement d’un enseignant
export async function registerTeacher(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 🔎 Vérifie si l'email existe déjà
        const TeacherExists = await Teacher.findOne({ email });
        if (TeacherExists) {
            return res.status(400).json({ message: "Email déjà utilisé 📧" });
        }

        // 🔐 Hash du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newTeacher = new Teacher({
            firstName,
            lastName,
            email,
            password: hash
        });

        await newTeacher.save();
        res.status(201).json({ teacher: newTeacher }); // ✅ Succès

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur 💥", error: error.message });
    }
}

// 🔑 Connexion d’un enseignant
export async function loginTeacher(req, res) {
    try {
        const { email, password } = req.body;

        // 🔎 Recherche du teacher
        const teacher = await Teacher.findOne({ email });

        if (!teacher) {
            await new Promise(resolve => setTimeout(resolve, 50)); // 💤 protection brute force
            return res.status(400).json({ message: "Email ou mot de passe invalide ❌" });
        }

        // 🔐 Vérification du mot de passe
        const passwordMatch = bcrypt.compareSync(password, teacher.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Email ou mot de passe invalide ❌" });
        }
        res.clearCookie('student' , { path: '/' , httpOnly: true });
        // 🍪 Création du cookie de session
        const options = {
            maxAge: MILLISECONDS_IN_A_DAY * 14, // 📅 14 jours
            httpOnly: true, // 🔒 sécurité
            path: '/',
        };
        res.cookie("teacher", teacher.id, options); // ✅ cookie envoyé
        res.json({ teacher }); // 🏁 Succès

    } catch (error) {
        console.log("❌ Erreur dans loginTeacher :", error);
        res.status(500).json({ message: "Erreur lors de la connexion 🔐" });
    }
}

// ✅ Contrôleur pour récupérer les classes d'un enseignant avec pourcentage
export async function getTeacherClasses(req, res) {
    try {
        const teacherId = req.cookies.teacher; //  📦 Récupérer l'ID de l'enseignant via cookie

        const classes = await Classe.find({ teacher: teacherId }).populate("students", "firstName lastName email");

        const simplifiedClasses = classes.map(classe => {
            const numberOfStudents = classe.students.length;
            const maxStudents = 40;
            const percentage = Math.round((numberOfStudents / maxStudents) * 100);

            return {
                name: classe.name,
                students: numberOfStudents,
                value: percentage
            };
        });

        res.status(200).json(simplifiedClasses);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des classes du professeur :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export async function getTeacherStats(req, res) {
    try{
        const teacherId = req.cookies.teacher;

        if (!teacherId) {
            return res.status(401).json({ message: "Enseignant non authentifié" });
        }

        const classes = await Classe.find({ teacher: teacherId });
        const classIds = classes.map(cls => cls._id);
        const numberOfClasses = classes.length;

        const totalStudents = await Student.countDocuments({ classe: { $in: classIds } });

        const teacherCourses1 = await Course.find({ teacher: teacherId }).select('_id');
        const courseIds = teacherCourses1.map(course => course._id);
        const totalAssignments = await Assignment.countDocuments({ course: { $in: courseIds } });

        const teacherCourses2 = await Course.find({ teacher: teacherId, quiz: { $ne: null } });
        const totalQuizzes = teacherCourses2.length;


        res.status(200).json({
            numberOfClasses,
            totalStudents,
            totalAssignments,
            totalQuizzes,
        });

    } catch (error ){
        res.status(500).json({ message: "Erreur lors du chargement des statistiques", error });
    }
}