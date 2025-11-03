import express from "express";
import { generateFeedbackReport, getAllFeedbacks, getFeedbackByInterview } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkPlanLimits } from "../middleware/planMiddleware.js";

const router = express.Router();

router.post("/generate", protect, checkPlanLimits, generateFeedbackReport);
router.get("/all", protect, getAllFeedbacks);
router.get("/:interviewId", protect, getFeedbackByInterview);

export default router;
