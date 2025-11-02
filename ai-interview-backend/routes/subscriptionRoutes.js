import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createCheckoutSession);
router.post("/webhook", express.json({ type: "*/*" }), handleWebhook);
router.get("/status", protect, getSubscriptionStatus);
router.put("/cancel", protect, cancelSubscription);

export default router;
