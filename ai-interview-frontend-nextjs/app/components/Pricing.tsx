"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const Pricing = ({ onSelectPlan }: PricingProps) => {
  const plans = [
    {
      title: "Free",
      price: "$0",
      desc: "Start your AI interview journey with swarAI.",
      features: [
        "Up to 3 AI interviews/month",
        "Instant feedback after each answer",
        "Basic overall interview summary",
        "Limited role & question categories",
        "Basic dashboard analytics",
        "Light/Dark mode toggle",
      ],
    },
    {
      title: "Pro",
      price: "$9",
      desc: "Perfect for serious job seekers who want detailed insights and unlimited practice.",
      features: [
        "Unlimited AI interview sessions",
        "Instant feedback with scoring & suggestions",
        "Comprehensive post-interview summary report",
        "Full analytics dashboard (feedback count, last session, trends)",
        "Access to all job roles & question sets",
        "Report history with downloadable summaries",
        "Profile customization (name update)",
        "Priority email support",
      ],
      highlight: true,
    },
    {
      title: "Advance",
      price: "$19",
      desc: "For users who want professional-grade coaching and in-depth AI insights.",
      features: [
        "All Pro features included",
        "AI voice tone, confidence & communication analysis",
        "Personalized feedback powered by advanced AI evaluator",
        "Interview improvement tracking with visual analytics",
        "AI-driven recommendations for next practice session",
        "Access to exclusive templates & premium roles",
        "Early access to beta features",
        "Priority email support",
      ],
    },
  ];

  return (
    <section id="pricing" className="mt-32 px-6 max-w-6xl mx-auto text-center">
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => {
          const isHighlight = !!plan.highlight;
          // Gradient for highlighted card (uses CSS variables)
          const highlightBg = `linear-gradient(90deg, var(--color-voxy-primary), var(--color-voxy-secondary))`;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className={`rounded-2xl border p-8 transition-shadow duration-200 ${
                isHighlight
                  ? "border-transparent shadow-2xl"
                  : "bg-voxy-surface border-voxy-border"
              }`}
              style={
                isHighlight
                  ? {
                      background: highlightBg,
                      color: "white",
                    }
                  : {
                      backgroundColor: "var(--color-voxy-surface)",
                      color: "var(--color-voxy-text)",
                    }
              }
            >
              <h3
                className={`text-2xl font-semibold mb-2 ${
                  isHighlight ? "text-white" : "text-voxy-text"
                }`}
              >
                {plan.title}
              </h3>
              <p
                className={`mb-4 ${
                  isHighlight ? "text-white/90" : "text-voxy-muted"
                }`}
              >
                {plan.desc}
              </p>
              <p
                className={`text-4xl font-bold mb-6 ${
                  isHighlight ? "text-white" : "text-voxy-text"
                }`}
              >
                {plan.price}
              </p>

              <ul className="text-left space-y-3">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span
                      className={`mt-1 ${
                        isHighlight ? "text-white" : "text-voxy-primary"
                      }`}
                    >
                      <CheckCircle
                        className="w-5 h-5"
                        // color set through parent span
                      />
                    </span>
                    <span
                      className={`leading-relaxed ${
                        isHighlight ? "text-white/95" : "text-voxy-muted"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan(plan.title)}
                className={`mt-8 w-full py-3 rounded-lg font-semibold transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                style={
                  isHighlight
                    ? {
                        background: "white",
                        color: "var(--color-voxy-primary)",
                      }
                    : {
                        background: "var(--color-voxy-primary)",
                        color: "white",
                      }
                }
              >
                {plan.title === "Enterprise" ? "Contact Us" : "Get Started"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
