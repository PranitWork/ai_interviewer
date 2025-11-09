"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Star, Target, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface FeedbackItem {
  question: string;
  answer: string;
  comment: string;
  score?: number;
}

interface FeedbackReportModalProps {
  open: boolean;
  onClose: () => void;
  feedbackData?: {
    feedbacks?: FeedbackItem[];
    overallScore?: number;
    strengths?: string[];
    improvements?: string[];
  };
}

export default function FeedbackReportModal({
  open,
  onClose,
  feedbackData,
}: FeedbackReportModalProps) {
  if (!open) return null;

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById("feedback-report-pdf");
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Interview_Feedback_Report.pdf");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          id="feedback-report-pdf"
          className="bg-voxy-surface/95 border border-voxy-border rounded-2xl shadow-2xl p-8 max-w-3xl w-full text-white relative overflow-hidden"
        >
          {/* ===== HEADER ===== */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-voxy-primary" size={28} />
              <h2 className="text-2xl font-bold">Interview Feedback Report</h2>
            </div>
            <button
              onClick={onClose}
              className="text-voxy-muted hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* ===== SCORE SUMMARY ===== */}
          {feedbackData?.overallScore !== undefined && (
            <div className="bg-gradient-to-r from-voxy-primary/20 to-voxy-secondary/20 border border-voxy-border rounded-xl p-4 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <Star className="text-yellow-400" size={20} />
                Overall Score:
              </div>
              <div className="text-2xl font-bold text-voxy-primary">
                {feedbackData.overallScore} / 10
              </div>
            </div>
          )}

          {/* ===== FEEDBACK LIST ===== */}
          <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
            {feedbackData?.feedbacks?.map((fb, idx) => (
              <div
                key={idx}
                className="border border-voxy-border rounded-xl p-4 bg-voxy-surface/80 backdrop-blur-sm shadow-sm"
              >
                <p className="font-semibold text-white mb-2">
                  Q{idx + 1}: {fb.question}
                </p>
                <p className="italic text-gray-300 mb-2 text-sm">
                  Your Answer: {fb.answer}
                </p>
                <p className="text-green-400 font-medium text-sm">
                  Feedback: {fb.comment}
                </p>
                {fb.score !== undefined && (
                  <p className="text-yellow-400 text-xs mt-2">
                    Score: {fb.score}/10
                  </p>
                )}
              </div>
            ))}

            {!feedbackData?.feedbacks?.length && (
              <p className="text-center text-voxy-muted italic py-8">
                No feedback available.
              </p>
            )}
          </div>

          {/* ===== STRENGTHS / IMPROVEMENTS ===== */}
          {(feedbackData?.strengths?.length ?? 0) > 0 ||
          (feedbackData?.improvements?.length ?? 0) > 0 ? (
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {Array.isArray(feedbackData?.strengths) &&
                feedbackData.strengths.length > 0 && (
                  <div className="p-4 rounded-xl border border-voxy-border bg-voxy-surface/60">
                    <h4 className="font-semibold text-voxy-primary mb-2 flex items-center gap-2">
                      <Target size={18} /> Strengths
                    </h4>
                    <ul className="text-sm text-voxy-muted list-disc list-inside space-y-1">
                      {feedbackData.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {Array.isArray(feedbackData?.improvements) &&
                feedbackData.improvements.length > 0 && (
                  <div className="p-4 rounded-xl border border-voxy-border bg-voxy-surface/60">
                    <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <Target size={18} /> Improvements
                    </h4>
                    <ul className="text-sm text-voxy-muted list-disc list-inside space-y-1">
                      {feedbackData.improvements.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ) : null}

          {/* ===== ACTIONS ===== */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-voxy-primary to-voxy-secondary font-semibold hover:opacity-90 transition"
            >
              <Download size={18} /> Download PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-voxy-border font-semibold text-voxy-muted hover:text-white transition"
            >
              Close Report
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
