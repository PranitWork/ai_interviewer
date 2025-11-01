"use client";
import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ProtectedRoute from "../protected/ProtectedRoute";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startInterview = async () => {
    if (!role.trim()) return toast.error("Please enter a role before starting!");
    setLoading(true);
    try {
      const { data } = await api.post("/interview/start", { role });
      localStorage.setItem("interviewId", data._id);
      localStorage.setItem("questions", JSON.stringify(data.questions));
      localStorage.setItem("role", role);
      toast.success("Interview started!");
      router.push("/interview");
    } catch (err) {
      toast.error("Failed to start interview. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
      >
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-4">
          🚀 Start Your AI Interview
        </h1>
        <p className="text-gray-600 mb-8">
          Choose your desired role and let our AI interviewer assess your skills in real time.
        </p>

        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          placeholder="e.g. React Developer, Data Analyst..."
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-gray-800 shadow-sm outline-none transition mb-6"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startInterview}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Preparing Interview..." : "🎯 Start Interview"}
        </motion.button>

        <div className="mt-10 text-sm text-gray-500">
          <p>
            💡 Tip: Be specific! For example, try “MERN Stack Developer” or “UI/UX Designer”.
          </p>
        </div>
      </motion.div>
    </main>
    </ProtectedRoute>
  );
}
