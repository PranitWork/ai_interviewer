import Razorpay from "razorpay";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 CREATE CHECKOUT SESSION
export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;
    const selectedPlan = await Plan.findOne({ name: plan });
    if (!selectedPlan)
      return res.status(400).json({ success: false, message: "Invalid plan" });

    const amount = selectedPlan.price; // in paise

    await Subscription.updateMany(
      { user: req.user._id, status: "active" },
      { status: "expired" }
    );

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan },
    };

    const order = await razorpay.orders.create(options);

    await Subscription.create({
      user: req.user._id,
      plan,
      razorpayOrderId: order.id,
      status: "pending",
    });

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
};

// 🟡 HANDLE WEBHOOK
export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const digest = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (digest !== signature)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    const event = req.body.event;
    const entity =
      req.body.payload?.payment?.entity ||
      req.body.payload?.subscription?.entity;

    switch (event) {
      case "payment.captured": {
        const subscription = await Subscription.findOne({
          razorpayOrderId: entity.order_id,
        });
        if (!subscription) break;

        const planDetails = await Plan.findOne({ name: subscription.plan });
        const duration = planDetails?.durationDays || 30;

        subscription.razorpayPaymentId = entity.id;
        subscription.status = "active";
        subscription.currentPeriodEnd = new Date(Date.now() + duration * 86400000);
        await subscription.save();
        break;
      }

      case "payment.failed": {
        await Subscription.findOneAndUpdate(
          { razorpayOrderId: entity.order_id },
          { status: "failed" }
        );
        break;
      }

      case "subscription.cancelled": {
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: entity.id },
          { status: "canceled" }
        );
        break;
      }

      default:
        console.log("Unhandled Razorpay event:", event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false });
  }
};

// 🔵 GET STATUS
export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    if (!subscription)
      return res.json({ success: true, plan: "free", status: "inactive" });

    if (
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date()
    ) {
      subscription.status = "expired";
      await subscription.save();
    }

    res.json({
      success: true,
      plan: subscription.plan,
      status: subscription.status,
      expiry: subscription.currentPeriodEnd,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch status" });
  }
};

// 🔴 CANCEL SUBSCRIPTION
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });
    if (!sub)
      return res.status(404).json({ success: false, message: "No subscription" });

    if (sub.status !== "active")
      return res.status(400).json({ success: false, message: "Not active" });

    if (sub.razorpaySubscriptionId) {
      await razorpay.subscriptions.cancel(sub.razorpaySubscriptionId);
    }

    sub.status = "canceled";
    await sub.save();

    res.json({ success: true, message: "Subscription canceled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};
