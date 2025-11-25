import express from "express";
import {
  createCheckoutSession,
  getSubscriptionStatus,
  cancelSubscription,
  handleWebhook,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/api/subscription/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

router.post("/create", protect, createCheckoutSession);
router.get("/status", protect, getSubscriptionStatus);
router.put("/cancel", protect, cancelSubscription);

export default router;
