import express from "express";
import { generateFeedbackReport } from "../controllers/feedbackController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/generate", protect, generateFeedbackReport);

export default router;
