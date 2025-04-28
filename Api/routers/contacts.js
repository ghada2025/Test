import express from "express";
import { createContact } from "../controllers/contacts.js";


const router = express.Router();

router.post("/", createContact);

export { router as contactRouter };