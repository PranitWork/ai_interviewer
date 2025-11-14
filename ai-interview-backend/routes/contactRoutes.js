import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { sendContactMessage } from "../controllers/ContactController.js";


const router = express.Router();

// POST /api/contact
router.post("/", protect ,sendContactMessage);

export default router;
