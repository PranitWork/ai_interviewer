import Razorpay from "razorpay";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Coupon from "../models/Coupan.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✔️ Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    let { plan, coupon, name, email } = req.body;
    if (!plan) return res.status(400).json({ success: false, message: "Plan required" });

    plan = plan.trim().toLowerCase(); // FIX ✔
    const selectedPlan = await Plan.findOne({ name: plan });

    if (!selectedPlan)
      return res.status(400).json({ success: false, message: "Invalid plan" });

    // Price stored in ₹ in DB
    let amount = selectedPlan.price;
    let discountAmount = 0;

    let couponCode = coupon ? coupon.toUpperCase() : null;

    if (couponCode) {
      const couponDoc = await Coupon.findOne({ code: couponCode });

      if (!couponDoc) return res.json({ success: false, message: "Invalid coupon" });
      if (couponDoc.expiresAt < new Date()) return res.json({ success: false, message: "Coupon expired" });
      if (couponDoc.usedCount >= couponDoc.maxUses)
        return res.json({ success: false, message: "Coupon usage limit reached" });

      discountAmount = Math.round((amount * couponDoc.discountPercent) / 100);
      amount -= discountAmount;
    }

    if (amount <= 0) return res.json({ success: false, message: "Invalid final amount" });

    // Convert to paise
    const amountPaise = amount * 100;

    // Expire existing active subscriptions
    await Subscription.updateMany(
      { user: req.user._id, status: "active" },
      { status: "expired" }
    );

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
      notes: {
        userId: req.user._id.toString(),
        plan,
        coupon: couponCode || "",
      },
    });

    await Subscription.create({
      user: req.user._id,
      plan,
      razorpayOrderId: order.id,
      status: "pending",
      billingName: name,
      billingEmail: email,
      couponCode,
      discountAmount,
      finalPrice: amount,
    });

    return res.json({
      success: true,
      id: order.id,
      amount: amountPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = JSON.stringify(req.body);

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature)
      return res.status(400).json({ success: false, message: "Invalid signature" });

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    // PAYMENT SUCCESS
    if (event === "payment.captured" && payment?.order_id) {
      const subscription = await Subscription.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (!subscription) return res.json({ success: true });

      const planDetails = await Plan.findOne({ name: subscription.plan });
      const duration = planDetails?.durationDays || 30;

      subscription.razorpayPaymentId = payment.id;
      subscription.status = "active";
      subscription.currentPeriodEnd = new Date(Date.now() + duration * 86400000);
      await subscription.save();

      // Apply coupon
      if (subscription.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: subscription.couponCode },
          { $inc: { usedCount: 1 } }
        );
      }

      // UPDATE USER PLAN NOW — FIXED 🔥
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

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!subscription)
      return res.json({ success: true, plan: "free", status: "inactive", expiry: null });

    // Auto expire
    if (subscription.currentPeriodEnd < new Date() && subscription.status === "active") {
      subscription.status = "expired";
      await subscription.save();

      await User.findByIdAndUpdate(subscription.user, {
        plan: "free",
        planExpiresAt: null,
        subscriptionId: null,
      });
    }

    res.json({
      success: true,
      plan: subscription.plan,
      status: subscription.status,
      expiry: subscription.currentPeriodEnd,
    });
  } catch (e) {
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
    res.status(500).json({ success: false });
  }
};
