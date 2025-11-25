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
    const { plan, coupon, name, email } = req.body;

    if (!plan) {
      return res
        .status(400)
        .json({ success: false, message: "Plan is required" });
    }

    // 🔍 Validate plan (case-sensitive: "Free"/"Pro"/"Advance")
    const selectedPlan = await Plan.findOne({ name: plan });
    if (!selectedPlan) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan" });
    }

    // amount in ₹ (e.g. 199, 1599)
    let amount = selectedPlan.price;
    let discountAmount = 0;
    let couponCode = coupon ? coupon.toUpperCase() : null;

    // 🎟 Coupon logic
    if (couponCode) {
      const couponDoc = await Coupon.findOne({ code: couponCode });

      if (!couponDoc) {
        return res.json({ success: false, message: "Invalid coupon code" });
      }

      if (couponDoc.expiresAt < new Date()) {
        return res.json({ success: false, message: "Coupon expired" });
      }

      if (couponDoc.usedCount >= couponDoc.maxUses) {
        return res.json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      discountAmount = Math.round((amount * couponDoc.discountPercent) / 100);
      amount = amount - discountAmount;
    }

    if (amount <= 0) {
      return res.json({
        success: false,
        message: "Final amount must be greater than 0",
      });
    }

    // 💰 Convert to paise for Razorpay
    const finalAmountPaise = amount * 100;

    // ❌ Expire any existing active subscriptions for this user
    await Subscription.updateMany(
      { user: req.user._id, status: "active" },
      { status: "expired" }
    );

    // 🧾 Create Razorpay order
    const order = await razorpay.orders.create({
      amount: finalAmountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan,
        coupon: couponCode || "none",
        name: name || "",
        email: email || "",
      },
    });

    // 💾 Create Subscription row
    await Subscription.create({
      user: req.user._id,
      plan, // "Free" | "Pro" | "Advance"
      razorpayOrderId: order.id,
      status: "pending",

      billingName: name || undefined,
      billingEmail: email || undefined,

      couponCode: couponCode || undefined,
      discountAmount,
      finalPrice: amount,
    });

    return res.json({
      success: true,
      id: order.id,
      amount: finalAmountPaise,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

/**
 * POST /api/subscription/webhook
 * Razorpay webhook endpoint
 */
export const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const digest = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (digest !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;
    const subscriptionEntity = req.body.payload?.subscription?.entity;

    switch (event) {
      case "payment.captured": {
        const entity = paymentEntity;
        if (!entity?.order_id) break;

        const subscription = await Subscription.findOne({
          razorpayOrderId: entity.order_id,
        });

        if (!subscription) break;

        const planDetails = await Plan.findOne({ name: subscription.plan });
        const duration = planDetails?.durationDays || 30;

        subscription.razorpayPaymentId = entity.id;
        subscription.status = "active";
        subscription.currentPeriodEnd = new Date(
          Date.now() + duration * 24 * 60 * 60 * 1000
        );
        await subscription.save();

        // ✅ Increment coupon usage only on successful payment
        if (subscription.couponCode) {
          await Coupon.findOneAndUpdate(
            { code: subscription.couponCode },
            { $inc: { usedCount: 1 } }
          );
        }

        // ✅ Update user plan + expiry + subscriptionId + reset usage
        await User.findByIdAndUpdate(subscription.user, {
          plan: subscription.plan,
          planExpiresAt: subscription.currentPeriodEnd,
          subscriptionId: subscription._id.toString(),
          usage: {
            interviewsConducted: 0,
            answersEvaluated: 0,
            feedbacksGenerated: 0,
          },
        });

        break;
      }

      case "payment.failed": {
        const entity = paymentEntity;
        if (!entity?.order_id) break;

        await Subscription.findOneAndUpdate(
          { razorpayOrderId: entity.order_id },
          { status: "failed" }
        );
        break;
      }

      case "subscription.cancelled": {
        const entity = subscriptionEntity;
        if (!entity?.id) break;

        const sub = await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: entity.id },
          { status: "canceled" },
          { new: true }
        );

        if (sub) {
          // downgrade user to Free
          await User.findByIdAndUpdate(sub.user, {
            plan: "Free",
            planExpiresAt: null,
            subscriptionId: null,
          });
        }

        break;
      }

      default:
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// 🔵 GET STATUS
export const getSubscriptionStatus = async (req, res) => {
  try {
    // get latest subscription for this user
    const subscription = await Subscription.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .exec();

    if (!subscription) {
      return res.json({
        success: true,
        plan: "free",
        status: "inactive",
        expiry: null,
      });
    }

    // auto-expire if past
    if (
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date() &&
      subscription.status === "active"
    ) {
      subscription.status = "expired";
      await subscription.save();

      // downgrade user as well
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
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch status" });
  }
};

// 🔴 CANCEL SUBSCRIPTION
export const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!sub) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription" });
    }

    if (sub.status !== "active") {
      return res
        .status(400)
        .json({ success: false, message: "Subscription is not active" });
    }

    // if you are using Razorpay recurring plans
    if (sub.razorpaySubscriptionId) {
      await razorpay.subscriptions.cancel(sub.razorpaySubscriptionId);
    }

    sub.status = "canceled";
    await sub.save();

    // downgrade user
    await User.findByIdAndUpdate(sub.user, {
      plan: "Free",
      planExpiresAt: null,
      subscriptionId: null,
    });

    res.json({ success: true, message: "Subscription canceled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cancel failed" });
  }
};
