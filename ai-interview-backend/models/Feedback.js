import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  interview: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  report: {
    technicalScore: Number,
    communication: String,
    confidence: String,
    strengths: [String],
    weaknesses: [String],
    summary: String,
  },
}, { timestamps: true });


export default mongoose.model("Feedback", feedbackSchema);
