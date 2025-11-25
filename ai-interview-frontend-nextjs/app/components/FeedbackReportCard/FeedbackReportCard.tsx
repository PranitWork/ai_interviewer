"use client";

import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import {  RootState } from "@/app/Store/Store";
import { asyncGetAllFeedbacks } from "@/app/Store/actions/feedbackAction";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Gauge,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import { useAppDispatch } from "@/app/Store/hook";

/* ---------------- TYPES ---------------- */
interface FeedbackReport {
  technicalScore?: number;
  communication?: string;
  confidence?: string;
  strengths?: string[];
  weaknesses?: string[];
  summary?: string;
}

interface FeedbackItem {
  _id: string;
  role?: string;
  report?: FeedbackReport;
  createdAt?: string;
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function FeedbackReportCard() {
  const dispatch = useAppDispatch();
  const { allFeedbacks } = useSelector(
    (state: RootState) => state.feedbackReducer
  );

  const [selectedReport, setSelectedReport] = useState<FeedbackItem | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      await dispatch(asyncGetAllFeedbacks());
      setLoading(false);
    };
    fetchFeedbacks();
  }, [dispatch]);

  return (
    <div className="space-y-10 max-h-[100vh] overflow-auto scroll-auto">
      {/* ===== GRID ===== */}
      {loading ? (
        <div className="text-center text-gray-400">Loading feedbacks...</div>
      ) : allFeedbacks && allFeedbacks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {(allFeedbacks as FeedbackItem[]).map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
              onClick={() => setSelectedReport(item)}
              className="group cursor-pointer p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#14141e]/90 to-[#0b0b12]/90 backdrop-blur-xl shadow-lg hover:shadow-[0_0_25px_-8px_rgba(80,120,255,0.4)] hover:border-blue-500/30 transition-all duration-300"
            >
              {/* === HEADER === */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition">
                  {item?.role || "Unknown Role"}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar size={16} />
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              {/* === TECHNICAL SCORE === */}
              <div className="flex items-center gap-2 mb-3">
                <Gauge size={18} className="text-blue-400" />
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">
                    {item.report?.technicalScore ?? 0}/10
                  </span>{" "}
                  Technical
                </p>
              </div>

              {/* === SUMMARY PREVIEW === */}
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                {item.report?.summary || "No summary available."}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No feedback reports found.
        </div>
      )}

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            key="feedback-modal"
            className="fixed inset-0 z-[999] md:mt-25 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-[#10101a]/95 to-[#191926]/95 border border-white/10 rounded-3xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* === CLOSE === */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </motion.button>

              {/* === HEADER === */}
              <div className="text-center px-8 pt-10 pb-6 border-b border-white/10">
                <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 capitalize">
                  {selectedReport?.role || "Unknown Role"}
                </h3>
                <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
                  <Calendar size={14} />
                  {selectedReport?.createdAt
                    ? new Date(selectedReport.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* === SCROLLABLE CONTENT === */}
              <div className="max-h-[70vh] overflow-y-auto px-8 py-8 space-y-8 scrollbar-thin scrollbar-thumb-blue-500/40 scrollbar-track-transparent">
                {/* TECH SCORE */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="relative w-32 h-32 flex items-center justify-center"
                  >
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="url(#grad)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          54 *
                          (1 - (selectedReport.report?.technicalScore ?? 0) / 10)
                        }
                        transition={{ duration: 1 }}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6B8EFF" />
                          <stop offset="100%" stopColor="#A26BFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">
                        {selectedReport.report?.technicalScore ?? 0}/10
                      </p>
                      <p className="text-xs text-gray-400">Technical Score</p>
                    </div>
                  </motion.div>
                </div>

                {/* COMMUNICATION & CONFIDENCE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      title: "Communication",
                      value: selectedReport.report?.communication,
                    },
                    {
                      title: "Confidence",
                      value: selectedReport.report?.confidence,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -2 }}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all"
                    >
                      <h4 className="font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {item.value || "N/A"}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* STRENGTHS / WEAKNESSES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FeedbackList
                    icon={<ThumbsUp className="text-green-400" size={20} />}
                    title="Strengths"
                    items={selectedReport.report?.strengths}
                    color="green"
                  />
                  <FeedbackList
                    icon={<ThumbsDown className="text-red-400" size={20} />}
                    title="Weaknesses"
                    items={selectedReport.report?.weaknesses}
                    color="red"
                  />
                </div>

                {/* SUMMARY */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-inner hover:border-blue-400/20 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-blue-400" size={20} />
                    <h4 className="font-semibold text-white">AI Summary</h4>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedReport.report?.summary || "No summary available."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- SUBCOMPONENT ---------------- */
function FeedbackList({
  icon,
  title,
  items,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  items?: string[];
  color: "green" | "red";
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent blur opacity-0 group-hover:opacity-100 transition-all" />
      <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-semibold text-white">{title}</h4>
        </div>
        {items?.length ? (
          <ul className="text-sm text-gray-300 space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`text-${color}-400 mt-0.5`}>•</span> {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">
            No {title.toLowerCase()} found.
          </p>
        )}
      </div>
    </div>
  );
}
