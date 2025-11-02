import express from "express";
import { getAllUsers, getUserProfile, updateUserProfile, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/all",protect, getAllUsers);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/:id", protect, deleteUser);

export default router;