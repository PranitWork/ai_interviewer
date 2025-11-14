"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/Store";
import { getUserAnalytics } from "@/app/Store/actions/AnalyticsActions";
import {
  Calendar,
  BarChart3,
  MessageSquare,
  Crown,
  Clock,
} from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAppDispatch } from "@/app/Store/hook";

export default function AnalyticsSection() {
  const dispatch = useAppDispatch();
  const analytics = useSelector(
    (state: RootState) => state.analyticsReducer.userAnalytics
  );
  useEffect(() => {
    dispatch(getUserAnalytics());
  }, [dispatch]);

  const stats = [
    {
      title: "Total Interviews",
      value: analytics?.totalInterviews ?? 0,
      icon: BarChart3,
      color: "from-voxy-primary to-voxy-secondary",
    },
    {
      title: "Total Feedbacks",
      value: analytics?.totalFeedbacks ?? 0,
      icon: MessageSquare,
      color: "from-voxy-secondary to-voxy-primary",
    },
    {
      title: "Current Plan",
      value: analytics?.currentPlan?.toUpperCase?.() ?? "FREE",
      icon: Crown,
      // Replaced raw yellows/oranges with accent tones for consistency
      color: "from-voxy-accent to-voxy-highlight",
    },
    {
      title: "Plan Expiry",
      value: analytics?.planExpiry
        ? new Date(analytics.planExpiry).toLocaleDateString()
        : "No expiry",
      icon: Calendar,
      color: "from-voxy-primary to-voxy-secondary",
    },
  ];

  const lastFeedbackSummary =
    analytics?.lastFeedback?.summary ??
    "No feedback available yet — complete an interview to get AI insights!";

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* === Stats Grid === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map(({ title, value, icon: Icon, color }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative overflow-hidden p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg group transition"
            >
              {/* Hover Glow Layer */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition`}
              />
              {/* Icon */}
              <div
                className={`mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${color} text-voxy-text shadow-md`}
              >
                <Icon size={22} />
              </div>
              {/* Text */}
              <h3 className="text-base font-medium text-voxy-muted mb-1">
                {title}
              </h3>
              <p className="text-2xl font-semibold text-voxy-text">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* === Last Feedback Summary === */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 mt-2 rounded-2xl border border-voxy-border bg-voxy-surface/80 backdrop-blur-lg shadow-lg transition"
        >
          <div className="flex items-start gap-3">
            <Clock className="text-voxy-primary mt-1" size={20} />
            <div>
              <h3 className="text-lg font-semibold mb-1 text-voxy-text">
                Last Feedback Summary
              </h3>
              <p className="text-sm text-voxy-muted leading-relaxed">
                {lastFeedbackSummary}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
}
