import express from "express";
import { getUserAnalytics, getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 👤 User analytics
router.get("/user/analytics", protect, getUserAnalytics);

// 🧑‍💼 Admin analytics
router.get("/admin/analytics", protect, adminOnly, getAdminAnalytics);

export default router;
