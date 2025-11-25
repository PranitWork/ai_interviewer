import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    plan: {
      type: String,
      enum: ["free", "pro", "advance"],
      default: "free", // ✅ fixed
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySubscriptionId: String, // for recurring later

    status: {
      type: String,
      enum: ["inactive", "pending", "active", "canceled", "expired", "failed"],
      default: "inactive",
    },

    currentPeriodEnd: Date,

    billingName: String,
    billingEmail: String,

    couponCode: String,
    discountAmount: { type: Number, default: 0 }, 
    finalPrice: Number, 
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
