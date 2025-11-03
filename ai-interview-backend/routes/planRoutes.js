import express from "express";
import { createPlan, updatePlan, getAllPlans } from "../controllers/planController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin should be able to manage plans
router.post("/", protect, adminOnly, createPlan);
router.put("/:id", protect, adminOnly, updatePlan);

// Optional public route to list plans
router.get("/", getAllPlans);

export default router;
