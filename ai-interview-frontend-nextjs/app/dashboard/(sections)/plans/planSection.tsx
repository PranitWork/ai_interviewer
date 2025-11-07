"use client";

import { motion } from "framer-motion";
import { Crown, CheckCircle, Clock, Star } from "lucide-react";
import { useState } from "react";

export default function PlanSection() {
  const [currentPlan, setCurrentPlan] = useState("Pro");

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for beginners exploring AI interviews.",
      features: [
        "3 interviews / month",
        "Basic feedback summary",
        "Email support",
      ],
      gradient: "from-gray-700 to-gray-900",
    },
    {
      name: "Pro",
      price: "$19/mo",
      description: "Best for individuals preparing seriously for tech roles.",
      features: [
        "Unlimited interviews",
        "Detailed AI feedback report",
        "Priority support",
      ],
      gradient: "from-voxy-primary to-voxy-secondary",
    },
    {
      name: "Premium",
      price: "$49/mo",
      description: "For professionals seeking advanced AI interview analytics.",
      features: [
        "Unlimited interviews & feedbacks",
        "Voice & video interview simulation",
        "1-on-1 AI mentor sessions",
        "Priority + chat support",
      ],
      gradient: "from-yellow-400 to-orange-500",
    },
  ];

  const activePlan = plans.find((p) => p.name === currentPlan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10"
    >
      {/* ===== HEADER ===== */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-voxy-muted text-sm">
          Manage your current plan or upgrade to unlock more features.
        </p>
      </div>

      {/* ===== CURRENT PLAN CARD ===== */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="max-w-2xl mx-auto bg-voxy-surface/80 border border-voxy-border rounded-2xl p-8 backdrop-blur-lg shadow-lg text-center"
      >
        <div className="flex flex-col items-center">
          <Crown
            size={36}
            className={`${
              currentPlan === "Premium"
                ? "text-yellow-400"
                : "text-voxy-primary"
            } mb-2`}
          />
          <h3 className="text-2xl font-bold">{currentPlan} Plan</h3>
          <p className="text-voxy-muted text-sm mt-1">
            You are currently subscribed to the{" "}
            <span className="text-voxy-primary font-medium">{currentPlan}</span>{" "}
            plan.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-voxy-muted text-sm">
          <Clock size={16} />
          <span>Next renewal: Dec 1, 2025</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition"
        >
          Manage Plan
        </motion.button>
      </motion.div>

      {/* ===== AVAILABLE PLANS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`relative overflow-hidden rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-md shadow-lg transition ${
              plan.name === currentPlan ? "ring-2 ring-voxy-primary" : ""
            }`}
          >
            {/* Gradient Accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-10`}
            />

            <div className="relative p-8 text-center">
              {/* Header */}
              <div className="flex flex-col items-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-voxy-muted text-sm mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold mb-6">{plan.price}</p>

              {/* Features */}
              <ul className="space-y-2 text-sm text-voxy-muted mb-8 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle
                      size={16}
                      className="text-voxy-primary mt-0.5"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              {plan.name === currentPlan ? (
                <motion.button
                  disabled
                  className="w-full py-3 rounded-lg font-semibold text-gray-400 bg-voxy-border cursor-not-allowed"
                >
                  Current Plan
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCurrentPlan(plan.name)}
                  className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${plan.gradient} shadow-md hover:opacity-90 transition`}
                >
                  Upgrade to {plan.name}
                </motion.button>
              )}
            </div>

            {/* Highlight Badge */}
            {plan.name === "Premium" && (
              <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} /> Popular
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
