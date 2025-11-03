import Razorpay from "razorpay";
import crypto from "crypto";
import Plan from "../models/Plan.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

// ✅ Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------------------------------------------------
// 🟢 CREATE CHECKOUT SESSION
// -------------------------------------------------------------
export const createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body;

    // 1️⃣ Validate plan
    const selectedPlan = await Plan.findOne({ name: plan });
    if (!selectedPlan)
      return res.status(400).json({ message: "Invalid plan selected" });

    const amount = selectedPlan.price; // already in paise

    // 2️⃣ Expire previous active subscriptions
    await Subscription.updateMany(
      { user: req.user._id, status: "active" },
      { status: "expired" }
    );

    // 3️⃣ Create Razorpay order
    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId: req.user._id.toString(), plan },
    };

    const order = await razorpay.orders.create(options);

    // 4️⃣ Create local subscription record
    await Subscription.create({
      user: req.user._id,
      plan,
      razorpayOrderId: order.id,
      status: "pending",
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create payment session" });
  }
};

// -------------------------------------------------------------
// 🟡 HANDLE WEBHOOK
// -------------------------------------------------------------
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;
    const payload =
      req.body.payload?.payment?.entity ||
      req.body.payload?.subscription?.entity;

    switch (event) {
      // ✅ PAYMENT SUCCESS
      case "payment.captured": {
        const orderId = payload.order_id;
        const paymentId = payload.id;

        const subscription = await Subscription.findOne({
          razorpayOrderId: orderId,
        });
        if (!subscription) break;

        const planDetails = await Plan.findOne({ name: subscription.plan });
        const durationDays = planDetails?.durationDays || 30;

        subscription.razorpayPaymentId = paymentId;
        subscription.status = "active";
        subscription.currentPeriodEnd = new Date(
          Date.now() + durationDays * 24 * 60 * 60 * 1000
        );

        await subscription.save();
        break;
      }

      // ❌ PAYMENT FAILED
      case "payment.failed": {
        const orderId = payload.order_id;
        await Subscription.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: "failed" }
        );
        break;
      }

      // 🚫 SUBSCRIPTION CANCELED (if using recurring)
      case "subscription.cancelled": {
        const subId = payload.id;
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          { status: "canceled" }
        );
        break;
      }

      default:
        console.log("⚠️ Unhandled Razorpay event:", event);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(500).json({ message: "Webhook error" });
  }
};

// -------------------------------------------------------------
// 🔵 GET SUBSCRIPTION STATUS
// -------------------------------------------------------------
export const getSubscriptionStatus = async (req, res) => {
  try {
    let subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription)
      return res.json({ plan: "free", status: "inactive", expiry: null });

    // Auto-expire if date passed
    if (
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd < new Date()
    ) {
      subscription.status = "expired";
      await subscription.save();
    }

    res.json({
      plan: subscription.plan,
      status: subscription.status,
      expiry: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    res.status(500).json({ message: "Failed to fetch subscription status" });
  }
};

// -------------------------------------------------------------
// 🔴 CANCEL SUBSCRIPTION
// -------------------------------------------------------------
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    if (!subscription)
      return res.status(404).json({ message: "No active subscription found" });

    if (subscription.status !== "active")
      return res.status(400).json({ message: "Subscription is not active" });

    // Optional: Cancel on Razorpay if using recurring subs
    if (subscription.razorpaySubscriptionId) {
      await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
    }

    subscription.status = "canceled";
    await subscription.save();

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("❌ Cancel subscription error:", error);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};
