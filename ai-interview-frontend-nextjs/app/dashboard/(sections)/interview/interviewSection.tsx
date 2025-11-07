"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Loader2,
  Brain,
  Briefcase,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export default function InterviewSection() {
  const [started, setStarted] = useState(false);
  const [role, setRole] = useState("");
  const [details, setDetails] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userSpeech, setUserSpeech] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Mock questions
  const questions = [
    "Can you describe your experience with the MERN stack?",
    "How do you optimize React app performance?",
    "Explain the concept of middleware in Express.js.",
    "How would you secure a Node.js REST API?",
    "Tell us about a challenging project you’ve worked on and what you learned.",
  ];

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setUserSpeech("");
      setQuestionIndex((prev) => prev + 1);
    } else {
      setShowPopup(true);
    }
  };

  const handleStart = () => {
    if (!role.trim()) return;
    setStarted(true);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {!started ? (
          // ==================== SETUP SCREEN ====================
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-voxy-surface/80 backdrop-blur-xl border border-voxy-border rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">AI Voice Interview 🎤</h2>
              <p className="text-voxy-muted text-sm">
                Describe the role you’re applying for and start your simulated interview.
              </p>
            </div>

            {/* Role Input */}
            <div className="mb-5 text-left">
              <label
                htmlFor="role"
                className="block text-sm font-medium mb-2 text-voxy-muted"
              >
                Target Role / Position
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-voxy-muted"
                  size={18}
                />
                <input
                  id="role"
                  type="text"
                  placeholder="e.g. MERN Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-voxy-surface border border-voxy-border text-white placeholder-voxy-muted focus:outline-none focus:ring-2 focus:ring-voxy-primary/70 transition"
                />
              </div>
            </div>

            {/* Details */}
            <div className="mb-6 text-left">
              <label
                htmlFor="details"
                className="block text-sm font-medium mb-2 text-voxy-muted"
              >
                Job Description or Interview Focus (optional)
              </label>
              <textarea
                id="details"
                rows={4}
                placeholder="Describe specific skills or requirements..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-voxy-surface border border-voxy-border text-white placeholder-voxy-muted focus:outline-none focus:ring-2 focus:ring-voxy-primary/70 transition resize-none"
              />
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={!role.trim()}
              onClick={handleStart}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition ${
                role.trim()
                  ? "bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90"
                  : "bg-voxy-border cursor-not-allowed text-gray-500"
              }`}
            >
              Start Interview <ArrowRight className="inline ml-2" size={18} />
            </motion.button>
          </motion.div>
        ) : (
          // ==================== INTERVIEW SCREEN ====================
          <motion.div
            key="interview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center w-full max-w-3xl"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold mb-2">AI Interview Session</h2>
            <p className="text-voxy-muted mb-8 text-sm">
              Question {questionIndex + 1} of {questions.length}
            </p>

            {/* AI Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-voxy-surface/70 border border-voxy-border rounded-xl p-6 mb-10 text-left shadow-lg backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <Brain className="text-voxy-primary mt-1" size={22} />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Question:</h3>
                  <p className="text-sm text-voxy-muted leading-relaxed">
                    {questions[questionIndex]}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Microphone Animation */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-voxy-primary/30 blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-voxy-primary to-voxy-secondary flex items-center justify-center shadow-lg">
                <Mic size={36} className="text-white" />
              </div>
            </motion.div>

            {/* Live Text of User Speaking */}
            <div className="w-full max-w-2xl mb-8 text-left">
              <h3 className="text-sm font-semibold mb-2 text-voxy-muted">
                Your Response (Speech to Text)
              </h3>
              <div className="min-h-[80px] p-4 rounded-lg border border-voxy-border bg-voxy-surface/60 text-sm text-white leading-relaxed">
                {userSpeech ? (
                  <p>{userSpeech}</p>
                ) : (
                  <p className="text-voxy-muted italic">
                    Speaking... (your answer will appear here)
                  </p>
                )}
              </div>
            </div>

            {/* Next Question Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center gap-2"
            >
              Next Question <MessageSquare size={18} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== INTERVIEW COMPLETE POPUP ====== */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="bg-voxy-surface/90 border border-voxy-border rounded-2xl shadow-2xl p-10 text-center max-w-md"
            >
              <CheckCircle2 className="text-green-400 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-2">Interview Completed!</h3>
              <p className="text-voxy-muted mb-8 text-sm">
                Great job completing the interview. You can now view your feedback or return to dashboard.
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowPopup(false)}
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 transition"
                >
                  View Feedback
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setShowPopup(false);
                    setStarted(false);
                    setQuestionIndex(0);
                  }}
                  className="px-6 py-3 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-white transition"
                >
                  Go Back
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
