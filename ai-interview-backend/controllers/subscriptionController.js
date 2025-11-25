import Razorpay from "razorpay";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import Coupon from "../models/Coupan.js"; // ✅ missing earlier

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


export const createCheckoutSession = async (req, res) => {
  try {
    let { plan, coupon, name, email } = req.body;
    plan = plan?.toLowerCase();

    if (!plan) {
      return res.status(400).json({ success: false, message: "Plan is required" });
    }

    const selectedPlan = await Plan.findOne({ name: plan });
    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    let amount = selectedPlan.price;
    let discountAmount = 0;
    const couponCode = coupon ? coupon.toUpperCase() : null;

    if (couponCode) {
      const couponDoc = await Coupon.findOne({ code: couponCode });

      if (!couponDoc) return res.json({ success: false, message: "Invalid coupon code" });
      if (couponDoc.expiresAt < new Date()) return res.json({ success: false, message: "Coupon expired" });
      if (couponDoc.usedCount >= couponDoc.maxUses)
        return res.json({ success: false, message: "Coupon usage limit reached" });

      discountAmount = Math.round(amount * (couponDoc.discountPercent / 100));
      amount -= discountAmount;
    }

    if (amount <= 0)
      return res.json({ success: false, message: "Amount must be > 0" });

    const amountPaise = amount * 100;

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
        coupon: couponCode || "none",
        name,
        email,
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

    res.json({
      success: true,
      id: order.id,
      amount: amountPaise,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Checkout error" });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    if (signature !== expected) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (event === "payment.captured") {
      const sub = await Subscription.findOne({ razorpayOrderId: payment.order_id });
      if (!sub) return res.json({ success: true });

      const planDetails = await Plan.findOne({ name: sub.plan });
      const duration = planDetails?.durationDays || 30;

      sub.razorpayPaymentId = payment.id;
      sub.status = "active";
      sub.currentPeriodEnd = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
      await sub.save();

      if (sub.couponCode) {
        await Coupon.findOneAndUpdate({ code: sub.couponCode }, { $inc: { usedCount: 1 } });
      }

      await User.findByIdAndUpdate(sub.user, {
        plan: sub.plan,
        planExpiresAt: sub.currentPeriodEnd,
        subscriptionId: sub._id.toString(),
        usage: {
          interviewsConducted: 0,
          answersEvaluated: 0,
          feedbacksGenerated: 0,
        },
      });
    }

    if (event === "payment.failed") {
      await Subscription.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        { status: "failed" }
      );
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

export const getSubscriptionStatus = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!sub) {
      return res.json({ success: true, plan: "free", status: "inactive", expiry: null });
    }

    if (sub.currentPeriodEnd < new Date() && sub.status === "active") {
      sub.status = "expired";
      await sub.save();

      await User.findByIdAndUpdate(sub.user, {
        plan: "free",
        planExpiresAt: null,
        subscriptionId: null,
      });
    }

    res.json({
      success: true,
      plan: sub.plan,
      status: sub.status,
      expiry: sub.currentPeriodEnd,
    });
  } catch {
    res.status(500).json({ success: false, message: "Status error" });
  }
};


export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!sub) return res.status(404).json({ success: false, message: "No subscription found" });
    if (sub.status !== "active")
      return res.status(400).json({ success: false, message: "Subscription is not active" });

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
  } catch {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};
