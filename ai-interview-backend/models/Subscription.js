import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
  priceId: String, // Stripe or Razorpay price ID
  paymentId: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);


export default Subscription;
