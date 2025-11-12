import express from "express";
import {
  verifyAndRegister,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  currentUser,
  sendOtp
} from "../controllers/authController.js";
import { googleLogin } from "../utils/googleAuth.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/current-user",protect,currentUser);
router.post("/register", verifyAndRegister);
router.post("/send-otp", sendOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);
router.get("/logout", logoutUser);

export default router;
