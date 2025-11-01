import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  report: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);
