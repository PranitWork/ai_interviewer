import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser
} from "../controllers/authController.js";
import { googleLogin } from "../utils/googleAuth.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);
router.get("/logout", logoutUser);

export default router;
