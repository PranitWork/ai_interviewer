import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: String,
  questions: Array,
  answers: Array,
  feedback: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Interview", interviewSchema);
