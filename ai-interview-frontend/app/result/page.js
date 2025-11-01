"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ResultPage() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generateReport = async () => {
      try {
        const interviewId = localStorage.getItem("interviewId");
        if (!interviewId) {
          router.push("/dashboard");
          return;
        }
        const { data } = await api.post("/feedback/generate", { interviewId });
        setReport(data.report || "No report generated.");
      } catch (err) {
        console.error("Error fetching report:", err);
        setReport("⚠️ Failed to load summary. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    generateReport();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-4">
          🎓 Interview Performance Summary
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Here's a detailed breakdown of your interview performance.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-gray-500 text-lg">Generating your report...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left overflow-y-auto max-h-[60vh]"
          >
            <pre className="whitespace-pre-wrap text-gray-800 text-[15px] leading-relaxed font-medium">
              {report}
            </pre>
          </motion.div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Start New Interview
          </button>
        </div>
      </motion.div>
    </div>
  );
}
