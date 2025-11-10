"use client";

import FeedbackReportCard from "@/app/components/FeedbackReportCard/FeedbackReportCard";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { motion } from "framer-motion";

export default function ReportsSection() {
  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-10"
      >
        {/* ===== HEADER ===== */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-voxy-text">
            Interview Reports
          </h2>
          <p className="text-voxy-muted text-sm">
            Review your past AI interview reports and performance summaries.
          </p>
        </div>

        {/* ===== REPORTS LIST ===== */}
        <div className="bg-voxy-surface/70 border border-voxy-border rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <FeedbackReportCard />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
