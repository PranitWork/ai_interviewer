import express from "express";
import { startInterview, evaluateAnswer } from "../controllers/interviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/start", protect, startInterview);
router.post("/evaluate", protect, evaluateAnswer);

export default router;
