import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "pro", "advance"], default: "free" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySubscriptionId: String, // optional if using Razorpay subscriptions
    status: { type: String, default: "inactive" }, // active, canceled, expired
    currentPeriodEnd: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
