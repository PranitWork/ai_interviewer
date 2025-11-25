// models/Plan.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["free", "pro", "advance"],
    unique: true,
    required: true,
  },
  price: { type: Number, required: true }, // ₹ Rupees
  maxInterviews: { type: Number, default: 3 },
  maxFeedbacks: { type: Number, default: 6 },
  durationDays: { type: Number, default: 30 },
});

export default mongoose.model("Plan", planSchema);
