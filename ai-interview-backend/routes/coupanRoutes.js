import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { applyCoupon, createCoupon } from "../controllers/coupanController.js";


const router = express.Router();

router.post("/create",protect,adminOnly, createCoupon); // make admin only
router.post("/apply",protect, applyCoupon);

export default router;
