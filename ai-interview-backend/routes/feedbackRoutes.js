import express from "express";
import { generateFeedbackReport, getAllFeedbacks, getFeedbackByInterview } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateFeedbackReport);
router.get("/all", protect, getAllFeedbacks);
router.get("/:interviewId", protect, getFeedbackByInterview);

export default router;
