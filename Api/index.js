import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/connect-db.js";
import cookieParser from "cookie-parser";
import { teacherRouter } from "./routers/Teachers.js";
import { studentRouter } from "./routers/Students.js";
import { classRouter } from "./routers/classes.js";
import { courseRouter } from "./routers/Courses.js";
import { eventRouter } from "./routers/Events.js";
import { quizRouter } from "./routers/Quizs.js";
import { assignmentRouter } from "./routers/Assignments.js";


const app = express();

// 🔗 Connexion à la base de données
connectDB();

// 🛡️ Middleware de sécurité
app.use(helmet());

// ✅ Middleware CORS
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
        optionsSuccessStatus: 200,
    }
));

// 📦 Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// 📌 Routes
app.use("/course", courseRouter);
app.use("/class", classRouter);
app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/event", eventRouter);
app.use("/quiz", quizRouter);
app.use("/assignment", assignmentRouter);

// 🏓 Route de test pour vérifier si le serveur fonctionne
app.get("/ping", (req, res) => {
    res.send("pong");
});

// 🚀 Démarrage du serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
