import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },

  discountPercent: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },

  expiresAt: {
    type: Date,
    required: true,
  },

  maxUses: {
    type: Number,
    default: 1000,    // you can modify
  },

  usedCount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Coupon", couponSchema);
