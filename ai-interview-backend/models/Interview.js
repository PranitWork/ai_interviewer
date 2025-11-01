import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: String,
  questions: [
    {
      question: String,
      category: String,
    }
  ],
  answers: [
    {
      question: String,
      answer: String,
      feedback: {
        score: Number,
        comment: String,
        suggestions: String,
      }
    }
  ],
  feedbackSummary: {
    averageScore: Number,
    strengths: [String],
    weaknesses: [String],
    summary: String,
  },
  status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
  voiceRecordingUrl: String,
  duration: Number,
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);