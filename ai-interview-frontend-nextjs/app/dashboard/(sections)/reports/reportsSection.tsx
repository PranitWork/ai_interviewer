"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Gauge,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";

// Mock feedbacks (replace with backend data later)
const mockReports = [
  {
    id: 1,
    role: "MERN Full Stack Developer",
    date: "2025-10-10",
    technicalScore: 8,
    summary:
      "Strong React and Node.js skills, clear communication, needs backend optimization improvement.",
    communication: "Excellent clarity and structured answers.",
    confidence: "Good confidence and steady tone.",
    strengths: [
      "Strong understanding of React and state management.",
      "Structured and confident responses.",
    ],
    weaknesses: [
      "Could elaborate more on backend scaling.",
      "Needs improvement in database optimization.",
    ],
  },
  {
    id: 2,
    role: "Frontend Developer",
    date: "2025-09-22",
    technicalScore: 7,
    summary:
      "Good design sense and React fundamentals. Improve on performance and testing coverage.",
    communication: "Polite and articulate but slightly hesitant.",
    confidence: "Fairly confident; room for more assertiveness.",
    strengths: [
      "Excellent UI/UX understanding.",
      "Good React component structure.",
    ],
    weaknesses: [
      "Needs stronger test writing skills.",
      "Could discuss optimization strategies in more depth.",
    ],
  },
];

export default function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  return (
    <div className="space-y-10">
      {/* ===== HEADER ===== */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Interview Reports</h2>
        <p className="text-voxy-muted text-sm">
          Review your past AI interview reports and performance summaries.
        </p>
      </div>

      {/* ===== REPORTS GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockReports.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedReport(report)}
            className="cursor-pointer p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg hover:border-voxy-primary/60 transition"
          >
            {/* Top */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{report.role}</h3>
              <div className="flex items-center gap-2 text-voxy-muted text-sm">
                <Calendar size={16} />
                {new Date(report.date).toLocaleDateString()}
              </div>
            </div>

            {/* Technical Score */}
            <div className="flex items-center gap-2 mb-2">
              <Gauge size={18} className="text-voxy-primary" />
              <p className="text-sm">
                <span className="font-semibold">{report.technicalScore}/10</span>{" "}
                Technical Score
              </p>
            </div>

            {/* Summary Preview */}
            <p className="text-sm text-voxy-muted leading-relaxed line-clamp-3">
              {report.summary}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ===== DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-voxy-surface/90 border border-voxy-border rounded-2xl shadow-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-voxy-muted hover:text-white"
              >
                <X size={22} />
              </button>

              {/* Header */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold">{selectedReport.role}</h3>
                <p className="text-voxy-muted text-sm flex items-center gap-1 mt-1">
                  <Calendar size={14} />{" "}
                  {new Date(selectedReport.date).toLocaleDateString()}
                </p>
              </div>

              {/* Technical Score */}
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="text-voxy-primary" size={20} />
                <p className="text-sm">
                  <span className="font-semibold">
                    {selectedReport.technicalScore}/10
                  </span>{" "}
                  Technical Score
                </p>
              </div>

              {/* Communication & Confidence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-voxy-surface/70 border border-voxy-border">
                  <h4 className="font-semibold mb-1">Communication</h4>
                  <p className="text-sm text-voxy-muted">
                    {selectedReport.communication}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-voxy-surface/70 border border-voxy-border">
                  <h4 className="font-semibold mb-1">Confidence</h4>
                  <p className="text-sm text-voxy-muted">
                    {selectedReport.confidence}
                  </p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="text-green-400" size={18} />
                    <h4 className="font-semibold">Strengths</h4>
                  </div>
                  <ul className="text-sm text-voxy-muted space-y-1">
                    {selectedReport.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-voxy-primary mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="text-red-400" size={18} />
                    <h4 className="font-semibold">Weaknesses</h4>
                  </div>
                  <ul className="text-sm text-voxy-muted space-y-1">
                    {selectedReport.weaknesses.map(
                      (w: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span> {w}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-voxy-surface/70 border border-voxy-border">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="text-voxy-primary" size={18} />
                  <h4 className="font-semibold">Summary</h4>
                </div>
                <p className="text-sm text-voxy-muted leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
