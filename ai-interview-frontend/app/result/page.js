"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../protected/ProtectedRoute";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();

  const result = {
    score: 87,
    strengths: "Strong technical explanations and structured communication.",
    weaknesses: "Needs better elaboration in real-world examples.",
    suggestions:
      "Focus on explaining your thought process clearly and practice system design questions.",
  };

  const speakText = (text) => {
    // Stop any previous speech before starting
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    speakText(
      `Here is your interview summary. Your score is ${result.score} percent. Strengths: ${result.strengths}. Weaknesses: ${result.weaknesses}. Suggestions: ${result.suggestions}`
    );

    // ✅ Cleanup when component unmounts
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const handleBackToDashboard = () => {
    // ✅ Stop speaking before navigating
    speechSynthesis.cancel();
    router.push("/dashboard");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border border-indigo-100"
        >
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-4">
            🎯 Interview Performance Summary
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Here’s how you performed in your AI interview session.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-xl text-center shadow-sm">
              <h2 className="text-lg font-semibold text-indigo-700">Overall Score</h2>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{result.score}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center shadow-sm">
              <h2 className="text-lg font-semibold text-green-700">Strengths</h2>
              <p className="text-gray-700 mt-2">{result.strengths}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center shadow-sm">
              <h2 className="text-lg font-semibold text-red-700">Weaknesses</h2>
              <p className="text-gray-700 mt-2">{result.weaknesses}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">
              💡 Suggestions for Improvement
            </h2>
            <p className="text-gray-700 leading-relaxed">{result.suggestions}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-indigo-700 transition"
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
