
import { Course } from "../models/Course.js";
import { Quiz } from "../models/Quiz.js";
import { QuizSubmission } from "../models/QuizSubmission .js";
import { Student } from "../models/Student.js";

// ➕ Créer un quiz
export async function createQuiz(req, res) {
    try {
        const { courseId, questions } = req.body;

        const formattedQuestions = questions.map(q => ({
            title: q.title,
            question: q.question,
            options: q.options,
            answers: q.answers,
            type: q.type || "QCM"
        }));

        const newQuiz = new Quiz({
        course: courseId,
        questions: formattedQuestions
        });

        await newQuiz.save();

        // 🟢 Mise à jour du cours pour y ajouter l'ID du quiz
        await Course.findByIdAndUpdate(courseId, { quiz: newQuiz._id });

        res.status(201).json({
        message: "✅ Quiz créé et lié au cours avec succès",
        quiz: newQuiz
        });

    } catch (error) {
        console.error("❌ Erreur lors de la création du quiz :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// 📨 Soumettre un quiz
export async function submitQuiz(req, res) {
    try {
        const studentId = req.cookies.student;
        const { quizId } = req.params;
        const { score } = req.body;

        // 🔍 Vérifier si ce quiz existe
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
        return res.status(404).json({ message: "Quiz introuvable ❌" });
        }

        // ⛔ Vérifier si l'étudiant a déjà soumis ce quiz
        const alreadySubmitted = await QuizSubmission.findOne({ student: studentId, quiz: quizId });
        if (alreadySubmitted) {
        return res.status(400).json({ message: "Quiz déjà soumis 📩" });
        }

        // 📝 Créer une nouvelle soumission
        const submission = new QuizSubmission({
        student: studentId,
        quiz: quizId, 
        score,
        });

        await submission.save();

        // Trouver le cours lié à ce quiz
        const course = await Course.findOne({ quiz: quizId });
        if (!course) return res.status(404).json({ message: "Cours introuvable" });

         // Mettre à jour l'étudiant : ajouter ce cours à completedCourses
        await Student.findByIdAndUpdate(studentId, {
            $addToSet: { completedCourses: course._id } // $addToSet évite les doublons
        });
        res.status(201).json({
        message: "Quiz soumis avec succès 📨",
        score,
        total: quiz.questions.length,
        });

    } catch (error) {
        console.error("❌ Erreur lors de la soumission du quiz :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 🗑️ Supprimer un quiz
export async function deleteQuiz(req, res) {
    try {
        const { quizId } = req.params;
        await Quiz.findByIdAndDelete(quizId);
        res.status(200).json({ message: "Quiz supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du quiz :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// ✏️ Modifier un quiz
export async function updateQuiz(req, res) {
    try {
        const { quizId } = req.params;
        const { title, description, questions } = req.body;
        await Quiz.findByIdAndUpdate(quizId, { title, description, questions });
        res.status(200).json({ message: "Quiz modifié avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la modification du quiz :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

