"use client";

import { motion } from "framer-motion";
import { Calendar, BarChart3, MessageSquare, Crown, Clock } from "lucide-react";

export default function AnalyticsSection() {
  // Later you'll replace this with backend data (Redux or API call)
  const stats = [
    {
      title: "Total Interviews",
      value: 34,
      icon: BarChart3,
      color: "from-voxy-primary to-voxy-secondary",
    },
    {
      title: "Total Feedbacks",
      value: 18,
      icon: MessageSquare,
      color: "from-voxy-secondary to-voxy-primary",
    },
    {
      title: "Current Plan",
      value: "PRO",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Plan Expiry",
      value: "Dec 1, 2025",
      icon: Calendar,
      color: "from-voxy-primary to-voxy-secondary",
    },
  ];

  const lastFeedback =
    "Your communication skills have improved by 20% this month — great progress!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
    
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative overflow-hidden p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg group transition"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${color} transition`}
            />
            <div
              className={`mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
            >
              <Icon size={22} />
            </div>
            <h3 className="text-base font-medium text-voxy-muted mb-1">
              {title}
            </h3>
            <p className="text-2xl font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Latest Feedback */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 mt-2 rounded-2xl border border-voxy-border bg-voxy-surface/80 backdrop-blur-lg shadow-lg transition"
      >
        <div className="flex items-start gap-3">
          <Clock className="text-voxy-primary mt-1" size={20} />
          <div>
            <h3 className="text-lg font-semibold mb-1">Last Feedback Summary</h3>
            <p className="text-sm text-voxy-muted leading-relaxed">
              {lastFeedback}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
