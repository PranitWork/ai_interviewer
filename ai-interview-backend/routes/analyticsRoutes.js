import express from "express";
import { getUserAnalytics, getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👤 User analytics
router.get("/user/", protect, getUserAnalytics);

// 🧑‍💼 Admin analytics
router.get("/admin/", protect, adminOnly, getAdminAnalytics);

export default router;
