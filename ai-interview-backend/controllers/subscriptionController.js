// controllers/subscriptionController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Coupon from "../models/Coupan.js"; // FIXED filename

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: safe compare hex strings
function safeCompareHex(a, b) {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (err) {
    return false;
  }
}

// Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    let { plan, coupon, name, email } = req.body;
    if (!plan) return res.status(400).json({ success: false, message: "Plan required" });

    plan = plan.trim().toLowerCase();
    const selectedPlan = await Plan.findOne({ name: plan });
    if (!selectedPlan)
      return res.status(400).json({ success: false, message: "Invalid plan" });

    // PRICE UNITS: Plan.price is stored in paise (integer)
    let pricePaise = Number(selectedPlan.price); // already paise
    if (!Number.isInteger(pricePaise) || pricePaise <= 0)
      return res.status(500).json({ success: false, message: "Invalid plan price" });

    let discountAmountPaise = 0;
    let couponCode = coupon ? String(coupon).trim().toUpperCase() : null;

    if (couponCode) {
      const couponDoc = await Coupon.findOne({ code: couponCode });
      if (!couponDoc) return res.status(400).json({ success: false, message: "Invalid coupon" });
      if (new Date(couponDoc.expiresAt) < new Date()) return res.status(400).json({ success: false, message: "Coupon expired" });
      if (couponDoc.usedCount >= couponDoc.maxUses)
        return res.status(400).json({ success: false, message: "Coupon usage limit reached" });

      // discount in paise (integer)
      discountAmountPaise = Math.round((pricePaise * couponDoc.discountPercent) / 100);
      pricePaise = pricePaise - discountAmountPaise;
    }

    if (pricePaise <= 0) return res.status(400).json({ success: false, message: "Invalid final amount" });

    // Expire existing active subscriptions for this user
    await Subscription.updateMany(
      { user: req.user._id, status: "active" },
      { $set: { status: "expired" } }
    );

    // Create Razorpay order (Razorpay expects amount in paise)
    const order = await razorpay.orders.create({
      amount: pricePaise,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
      notes: {
        userId: req.user._id.toString(),
        plan,
        coupon: couponCode || "",
      },
    });

    // Create a pending subscription record
    await Subscription.create({
      user: req.user._id,
      plan,
      razorpayOrderId: order.id,
      status: "pending",
      billingName: name,
      billingEmail: email,
      couponCode,
      discountAmount: discountAmountPaise, // store paise
      finalPricePaise: pricePaise, // store paise
    });

    return res.json({
      success: true,
      id: order.id,
      amount: pricePaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    console.error("createCheckoutSession error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Webhook handler (route must use express.raw({ type: "application/json" }))
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!signature || !secret) {
      console.warn("Missing signature or webhook secret");
      return res.status(400).json({ success: false, message: "Bad request" });
    }

    // IMPORTANT: req.body is raw Buffer because route uses express.raw
    const body = req.body instanceof Buffer ? req.body.toString("utf8") : JSON.stringify(req.body);

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (!safeCompareHex(expected, signature)) {
      console.warn("Invalid webhook signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload || {};
    const payment = payload.payment ? payload.payment.entity : null;

    // PAYMENT CAPTURED / SUCCESS (handle only if order_id exists)
    if (event === "payment.captured" && payment?.order_id) {
      const subscription = await Subscription.findOne({ razorpayOrderId: payment.order_id });
      if (!subscription) {
        // nothing to do
        return res.json({ success: true });
      }

      const planDetails = await Plan.findOne({ name: subscription.plan });
      const durationDays = planDetails?.durationDays || 30;
      const now = new Date();

      subscription.razorpayPaymentId = payment.id;
      subscription.status = "active";
      subscription.currentPeriodEnd = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
      await subscription.save();

      // Apply coupon usage (atomic increment)
      if (subscription.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: subscription.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }

      // Update user plan and reset usage counters
      await User.findByIdAndUpdate(subscription.user, {
        plan: subscription.plan,
        planExpiresAt: subscription.currentPeriodEnd,
        subscriptionId: subscription._id,
        usage: {
          interviewsConducted: 0,
          answersEvaluated: 0,
          feedbacksGenerated: 0,
        },
      });

      return res.json({ success: true });
    }

    // PAYMENT FAILED
    if (event === "payment.failed" && payment?.order_id) {
      await Subscription.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "failed" }
      );
    }

    // Handle other events as needed...
    return res.json({ success: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ success: false });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!subscription)
      return res.json({ success: true, plan: "free", status: "inactive", expiry: null });

    // Auto-expire if past currentPeriodEnd
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date() && subscription.status === "active") {
      subscription.status = "expired";
      await subscription.save();

      await User.findByIdAndUpdate(subscription.user, {
        plan: "free",
        planExpiresAt: null,
        subscriptionId: null,
      });

      return res.json({ success: true, plan: "free", status: "expired", expiry: null });
    }

    res.json({
      success: true,
      plan: subscription.plan,
      status: subscription.status,
      expiry: subscription.currentPeriodEnd,
    });
  } catch (e) {
    console.error("getSubscriptionStatus error:", e);
    res.status(500).json({ success: false });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!sub) return res.status(404).json({ success: false, message: "No subscription" });
    if (sub.status !== "active")
      return res.status(400).json({ success: false, message: "Subscription not active" });

    if (sub.razorpaySubscriptionId) {
      await razorpay.subscriptions.cancel(sub.razorpaySubscriptionId);
    }

    sub.status = "canceled";
    await sub.save();

    await User.findByIdAndUpdate(sub.user, {
      plan: "free",
      planExpiresAt: null,
      subscriptionId: null,
    });

    res.json({ success: true, message: "Subscription canceled" });
  } catch (e) {
    console.error("cancelSubscription error:", e);
    res.status(500).json({ success: false });
  }
};
