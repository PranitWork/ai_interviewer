"use client";

import { motion } from "framer-motion";
import { Gauge, MessageSquare, SmilePlus, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";

export default function FeedbackSection() {
  // 🧩 Mock feedback data (replace with backend data later)
  const feedback = {
    technicalScore: 8,
    communication: "Excellent clarity and structured answers.",
    confidence: "Good overall confidence; consistent tone.",
    strengths: [
      "Strong understanding of React and state management.",
      "Well-structured problem-solving approach.",
      "Good command over communication and explanation.",
    ],
    weaknesses: [
      "Needs improvement in backend optimization concepts.",
      "Could elaborate more on database scaling techniques.",
    ],
    summary:
      "Overall, you performed strongly in the interview. Your answers were clear and well-organized, demonstrating good technical expertise and communication. A bit more focus on advanced backend optimization and architectural decisions could improve your performance even further.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10"
    >
      {/* ===== HEADER ===== */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">AI Interview Feedback</h2>
        <p className="text-voxy-muted text-sm">
          Here’s your personalized feedback from the AI interviewer based on your performance.
        </p>
      </div>

      {/* ===== TECHNICAL SCORE ===== */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="max-w-md mx-auto bg-voxy-surface/80 border border-voxy-border rounded-2xl p-6 backdrop-blur-lg shadow-lg text-center"
      >
        <div className="relative w-40 h-40 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="10"
              fill="none"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: 0, strokeDashoffset: 440 }}
              animate={{
                strokeDasharray: 440,
                strokeDashoffset: 440 - (440 * feedback.technicalScore) / 10,
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Gauge size={28} className="text-voxy-primary mb-1" />
            <p className="text-3xl font-bold">{feedback.technicalScore}/10</p>
            <span className="text-xs text-voxy-muted">Technical Score</span>
          </div>
        </div>
      </motion.div>

      {/* ===== COMMUNICATION & CONFIDENCE ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="text-voxy-primary" size={20} />
            <h3 className="text-lg font-semibold">Communication</h3>
          </div>
          <p className="text-sm text-voxy-muted leading-relaxed">
            {feedback.communication}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-md shadow-lg"
        >
          <div className="flex items-center gap-3 mb-3">
            <SmilePlus className="text-voxy-secondary" size={20} />
            <h3 className="text-lg font-semibold">Confidence</h3>
          </div>
          <p className="text-sm text-voxy-muted leading-relaxed">
            {feedback.confidence}
          </p>
        </motion.div>
      </div>

      {/* ===== STRENGTHS & WEAKNESSES ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl border border-voxy-border bg-gradient-to-br from-voxy-primary/10 to-transparent backdrop-blur-lg shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <ThumbsUp className="text-green-400" size={20} />
            <h3 className="text-lg font-semibold">Strengths</h3>
          </div>
          <ul className="space-y-2 text-sm text-voxy-muted">
            {feedback.strengths.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-voxy-primary mt-0.5">•</span> {point}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-2xl border border-voxy-border bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-lg shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <ThumbsDown className="text-red-400" size={20} />
            <h3 className="text-lg font-semibold">Weaknesses</h3>
          </div>
          <ul className="space-y-2 text-sm text-voxy-muted">
            {feedback.weaknesses.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span> {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ===== SUMMARY ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="text-voxy-primary" size={20} />
          <h3 className="text-lg font-semibold">Summary</h3>
        </div>
        <p className="text-sm text-voxy-muted leading-relaxed">
          {feedback.summary}
        </p>
      </motion.div>
    </motion.div>
  );
}
