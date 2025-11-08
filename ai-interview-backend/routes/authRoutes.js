import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  currentUser
} from "../controllers/authController.js";
import { googleLogin } from "../utils/googleAuth.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/current-user",protect,currentUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);
router.get("/logout", logoutUser);

export default router;
