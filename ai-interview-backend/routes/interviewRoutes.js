import express from "express";
import { startInterview, evaluateAnswer, getInterviewById, getUserInterviews } from "../controllers/interviewController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/start", protect, startInterview);
router.post("/evaluate", protect, evaluateAnswer);

router.get("/:id", protect, getInterviewById);
router.get("/", protect, getUserInterviews);


export default router;
