import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, enum: ["free", "pro", "enterprise"], unique: true },
  price: Number,
  maxInterviews: Number,
  maxFeedbacks: Number,
  durationDays: Number, // how long plan lasts
});
export default mongoose.model("Plan", planSchema);