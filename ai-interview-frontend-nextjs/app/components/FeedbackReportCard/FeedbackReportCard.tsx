"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/Store";
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
  interview?: string | { _id: string };
  user?: string;
  role?: string;
  report?: FeedbackReport;
  createdAt?: string;
}

export default function FeedbackReportCard() {
  const dispatch = useDispatch<AppDispatch>();
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
    <div className="space-y-10">
      {/* ===== REPORTS GRID ===== */}
      {loading ? (
        <div className="text-center text-voxy-muted">Loading feedbacks...</div>
      ) : allFeedbacks && allFeedbacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(allFeedbacks as FeedbackItem[]).map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              onClick={() => setSelectedReport(item)}
              className="cursor-pointer p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg hover:border-voxy-primary/60 transition group"
            >
              {/* === HEADER === */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-voxy-primary capitalize truncate">
                  {item?.role || "Unknown Role"}
                </h3>
                <div className="flex items-center gap-2 text-voxy-muted text-sm">
                  <Calendar size={16} />
                  {item?.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              {/* === TECHNICAL SCORE === */}
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={18} className="text-voxy-primary" />
                <p className="text-sm">
                  <span className="font-semibold">
                    {item.report?.technicalScore ?? 0}/10
                  </span>{" "}
                  Technical Score
                </p>
              </div>

              {/* === SUMMARY PREVIEW === */}
              <p className="text-sm text-voxy-muted leading-relaxed line-clamp-3">
                {item.report?.summary || "No summary available."}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center text-voxy-muted">
          No feedback reports found.
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            key="feedback-modal"
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative w-full max-w-3xl bg-gradient-to-br from-[#0f0f15]/95 to-[#171726]/90 border border-voxy-border/40 rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)]"
            >
              {/* === BACKDROP GLOW === */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-voxy-primary/10 via-transparent to-transparent blur-2xl" />

              {/* === CLOSE BUTTON === */}
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-voxy-muted hover:text-white z-20 transition"
                aria-label="Close feedback details"
              >
                <X size={22} />
              </motion.button>

              {/* === HEADER === */}
              <div className="relative text-center px-8 pt-10 pb-6 border-b border-voxy-border/30">
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-voxy-primary via-blue-400 to-purple-400 capitalize"
                >
                  {selectedReport?.role || "Unknown Role"}
                </motion.h3>
                <p className="flex items-center justify-center gap-2 text-xs text-voxy-muted mt-2">
                  <Calendar size={14} />{" "}
                  {selectedReport?.createdAt
                    ? new Date(selectedReport.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {/* === CONTENT === */}
              <div className="relative px-8 py-8 overflow-y-auto max-h-[75vh] space-y-8">
                {/* === TECHNICAL SCORE === */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center"
                >
                  <div className="relative w-32 h-32 flex items-center justify-center">
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
                        initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                        animate={{
                          strokeDashoffset:
                            2 *
                            Math.PI *
                            54 *
                            (1 -
                              (selectedReport.report?.technicalScore ?? 0) / 10),
                        }}
                        transition={{ duration: 1 }}
                      />
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6B8EFF" />
                          <stop offset="100%" stopColor="#9B6BFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">
                        {selectedReport.report?.technicalScore ?? 0}/10
                      </p>
                      <p className="text-xs text-voxy-muted">Technical Score</p>
                    </div>
                  </div>
                </motion.div>

                {/* === COMMUNICATION & CONFIDENCE === */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
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
                      whileHover={{ y: -3, scale: 1.02 }}
                      className="p-5 rounded-2xl bg-voxy-surface/80 border border-voxy-border hover:border-voxy-primary/40 shadow-md transition"
                    >
                      <h4 className="font-semibold text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-voxy-muted">
                        {item.value || "N/A"}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* === STRENGTHS & WEAKNESSES === */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {/* STRENGTHS */}
                  <FeedbackList
                    icon={<ThumbsUp className="text-green-400" size={20} />}
                    title="Strengths"
                    items={selectedReport.report?.strengths}
                    color="green"
                  />

                  {/* WEAKNESSES */}
                  <FeedbackList
                    icon={<ThumbsDown className="text-red-400" size={20} />}
                    title="Weaknesses"
                    items={selectedReport.report?.weaknesses}
                    color="red"
                  />
                </motion.div>

                {/* === SUMMARY === */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-voxy-surface/80 to-voxy-surface/60 border border-voxy-border shadow-inner"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-voxy-primary" size={20} />
                    <h4 className="font-semibold text-white">AI Summary</h4>
                  </div>
                  <p className="text-sm text-voxy-muted leading-relaxed">
                    {selectedReport.report?.summary || "No summary available."}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* === STRENGTH/WEAKNESS SUBCOMPONENT === */
function FeedbackList({
  icon,
  title,
  items,
  color,
}: {
  icon: JSX.Element;
  title: string;
  items?: string[];
  color: "green" | "red";
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-voxy-primary/10 to-transparent blur opacity-0 group-hover:opacity-100 transition" />
      <div className="relative p-5 rounded-2xl bg-voxy-surface/80 border border-voxy-border">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-semibold text-white">{title}</h4>
        </div>
        {items?.length ? (
          <ul className="text-sm text-voxy-muted space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className={`text-${color}-400 mt-0.5`}
                >
                  •
                </span>{" "}
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-voxy-muted">No {title.toLowerCase()} found.</p>
        )}
      </div>
    </div>
  );
}
