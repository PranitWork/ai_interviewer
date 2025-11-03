import express from "express";
import { getAllUsers, getUserProfile, updateUserProfile, deleteUser, updateUserPlan } from "../controllers/userController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all",protect, getAllUsers);
router.get("/profile", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);
router.delete("/:id", protect, deleteUser);

router.put("/:id/plan", protect, adminOnly, updateUserPlan);

export default router;