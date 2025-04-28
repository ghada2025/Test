
import { Message } from "../models/contact.js";
import nodemailer from "nodemailer";

export async function createContact(req, res) {
    try {
        const { email, message } = req.body;

        // ✅ Vérification de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "❌ Email invalide." });
        }

        // ✅ Sauvegarde du message dans la base
        const newMessage = new Message({ email, message });
        await newMessage.save();

        // ✅ Création du transporteur
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "khenieneghada@gmail.com",
                pass: "ygob acxr xvmq agpx",
            },
        });

        // ✅ Envoi du message vers l'école
        await transporter.sendMail({
            from: email, // email de l'étudiant
            to: "ghada.webdeveloper@gmail.com", // email de l'école
            subject: "📩 Nouveau message depuis la plateforme",
            text: message,
        });

        // ✅ Envoi de confirmation vers l'étudiant
        await transporter.sendMail({
            from: '"Support École 📚" <schoolName@gmail.com>', // l'école répond
            to: email, // email de l'étudiant
            subject: "✅ Nous avons bien reçu votre message",
            text: `Bonjour,\n\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\nVoici une copie de votre message :\n"${message}"\n\nMerci de nous avoir contactés !`,
        });

        res.status(201).json({ message: "✅ Message envoyé, enregistré, et confirmation envoyée." });

    } catch (error) {
        console.error("❌ Erreur dans contact us :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}
