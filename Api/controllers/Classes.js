import { Teacher } from "../models/Teacher.js";
import { Student } from "../models/Student.js";
import { Classe } from "../models/classe.js";

// ➕ Créer une nouvelle classe avec des étudiants
export async function createClass(req, res) {
    try {
        const teacherId = req.cookies.teacher;
        const { name, students } = req.body;

        // 📛 Validation de base
        if (!name || !teacherId) {
            return res.status(400).json({ message: "🛑 Name, Grade et Teacher sont requis." });
        }

        // 🔁 Vérifier si une classe avec ce nom existe déjà
        const existing = await Classe.findOne({ name });
        if (existing) {
            return res.status(409).json({ message: "⚠️ Une classe avec ce nom existe déjà." });
        }

        // 👨‍🏫 Vérifier si le professeur existe
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "❌ Enseignant introuvable." });
        }

        // 👩‍🎓👨‍🎓 Vérifier que les IDs des étudiants sont valides
        const validStudents = await Student.find({ _id: { $in: students } });
        if (validStudents.length !== students.length) {
            return res.status(400).json({ message: "🚫 Un ou plusieurs étudiants sont invalides." });
        }

        // ✅ Vérifier que le nombre d'étudiants ne dépasse pas 40
        if (students.length > 40) {
            return res.status(400).json({ message: "🚫 Une classe ne peut pas contenir plus de 40 étudiants." });
        }

        // ✅ Créer la classe
        const newClass = new Classe({
            name,
            teacher: teacherId,
            students
        });

        await newClass.save();

        // 🔁 Mettre à jour chaque étudiant avec sa classe
        await Student.updateMany(
            { _id: { $in: students } },
            { $set: { classe: newClass._id } }
        );

        res.status(201).json({
            message: "✅ Classe créée avec succès, étudiants mis à jour.",
            classe: newClass
        });

    } catch (error) {
        console.error("🚨 Erreur création classe :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// NOT TESTING YET  🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️🤷‍♀️ 
// ✏️ Modifier une classe (name, grade, teacher, students)
export async function updateClass(req, res) {
    try {
        const { id } = req.params;
        const { name, grade, teacher, students } = req.body;
    
        const updatedClass = await Classe.findByIdAndUpdate(
            id,
            {
            name,     // 🏷️ Nom de la classe 
            grade,    // 🎓 Niveau
            teacher,  // 👩‍🏫 ID de l'enseignant
            students  // 👨‍🎓 Liste des IDs des étudiants
            },
            { new: true }
        );
    
        if (!updatedClass) {
            return res.status(404).json({ message: "❌ Classe introuvable" });
        }
    
        res.status(200).json({
            message: "✅ Classe mise à jour avec succès",
            updatedClass
        });

    } catch (error) {
        console.error("❌ Erreur lors de la mise à jour de la classe :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// ❌ Supprimer une classe
export async function deleteClass(req, res) {
    try {
        const { id } = req.params;
    
        const deletedClass = await Classe.findByIdAndDelete(id);
    
        if (!deletedClass) {
            return res.status(404).json({ message: "❌ Classe introuvable" });
        }
    
        res.status(200).json({
            message: "🗑️ Classe supprimée avec succès",
            deletedClass
        });
    
    } catch (error) {
        console.error("❌ Erreur lors de la suppression de la classe :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}


