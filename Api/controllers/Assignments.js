import { Assignment } from "../models/Assignment.js";
import { Course } from "../models/Course.js";
import { Student } from "../models/Student.js";

// 📝 Voir tous les devoirs d’un étudiant pour tous les cours de sa classe
export async function getStudentAssignments(req, res) {
    try {
        const studentId = req.cookies.student;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Étudiant introuvable" });
        const courses = await Course.find({ classe: student.classe }).select("_id");
        const courseIds = courses.map(c => c._id);
        // 🔢 Date du début de la semaine (lundi)
        const today = new Date();
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // 
        firstDay.setHours(0, 0, 0, 0);
    
        // 🔢 Date de fin de la semaine (dimanche)
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        
        // Récupère tous les devoirs de la classe de l'étudiant
        const allAssignments = await Assignment.find({ course: { $in: courseIds }, createdAt: { $gte: firstDay, $lte: lastDay }, }).populate("course", "name");

        // Pour chaque devoir, garde uniquement la soumission de l'étudiant
        const filteredAssignments = allAssignments.map(assign => {
            const studentSubmission = assign.submission.find(s => s.student.toString() === studentId);
            return {
                _id: assign._id,
                title: assign.title,
                description: assign.description,
                dueDate: assign.dueDate,
                course: assign.course,
                submission: studentSubmission ? studentSubmission : { answer: "", submittedAt: null, status: "Upcoming" },
            };
        });

        res.status(200).json(filteredAssignments);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des devoirs :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const getSubmissionsByTeacher = async (req, res) => {
    try {
        const teacherId = req.cookies.teacher;
    
        // 🎓 Tous les cours du prof
        const courses = await Course.find({ teacher: teacherId }, "_id");
        const courseIds = courses.map(c => c._id);
    
        // 📥 Tous les devoirs avec soumissions
        const assignments = await Assignment.find({
            course: { $in: courseIds },
            "submission.0": { $exists: true }
        }).populate({
            path: "submission.student",
            select: "firstName lastName email classe",
            populate: {
            path: "classe",
            select: "name"
            }
        });
        const filteredAssignments = assignments.map(assignment => ({
            title: assignment.title,
            content: assignment.description,
            numberOfSubmissions: assignment.submission.length,
            submission: assignment.submission.map(sub => ({
            name: sub.student.firstName + " " + sub.student.lastName,
            email: sub.student.email,
            answer: sub.answer,
            joinDate: sub.submittedAt,
            id: sub.student._id,
            class: sub.student.classe?.name || null
            }))
        }));
    
        res.status(200).json(filteredAssignments);
    } catch (err) {
        console.error("❌ Erreur soumissions prof :", err.message);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// ➕ Créer un nouveau devoir
export async function createAssignment(req, res) {
    try {
        const { title, description, dueDate, course } = req.body;
    
        
        const foundCourse = await Course.findOne({ title: course });
    
        if (!foundCourse) {
            return res.status(404).json({ message: "Cours non trouvé" });
        }
    
        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            course: foundCourse._id, 
        });
    
        await newAssignment.save();
    
        res.status(201).json({ message: "📝 Devoir créé avec succès", assignment: newAssignment });
    } catch (error) {
        console.error("❌ Erreur lors de la création du devoir :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// ❌ Supprimer un devoir
export async function deleteAssignment(req, res) {
    try {
        const { id } = req.params;
    
        const deleted = await Assignment.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "❌ Devoir introuvable" });
    
        res.status(200).json({ message: "🗑️ Devoir supprimé avec succès" });
    
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du devoir :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

// 📬 Soumettre un devoir
export async function submitAssignment(req, res) {
    try {
        const studentId = req.cookies.student;
        const { answer , assignmentId } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "❌ Devoir introuvable" });
        }

        // 🔍 Vérifier si l'étudiant a déjà soumis
        const alreadySubmitted = assignment.submission.find(
            s => s.student.toString() === studentId
        );
        if (alreadySubmitted) {
            return res.status(400).json({ message: "📨 Devoir déjà soumis" });
        }

        // ✅ Ajouter la soumission avec status "Done"
        assignment.submission.push({
            student: studentId,
            answer,
            submittedAt: new Date(),
            status: "Done"
        });

        await assignment.save();

        res.status(200).json({ message: "📬 Devoir soumis avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la soumission du devoir :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}


// 📝 Modifier soumettre un devoir 
export async function updateAssignment(req, res) {
    try {
        const studentId = req.cookies.student;
        const { answer , assignmentId } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "❌ Devoir introuvable" });
        }

        // 🔍 Vérifier si l'étudiant a deja soumis
        const alreadySubmitted = assignment.submission.find(
            s => s.student.toString() === studentId
        );
        if (!alreadySubmitted) {
            return res.status(400).json({ message: "📨 Devoir non soumis" });
        }

        // ✅ Modifier la soumission
        alreadySubmitted.answer = answer;
        alreadySubmitted.submittedAt = new Date();
        alreadySubmitted.status = "Done";

        await assignment.save();
    
        res.status(200).json({ message: "✏️ la soumission modifié avec succès", assignment });
    } catch (error) {
        console.error("❌ Erreur lors de la modification du devoir :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}