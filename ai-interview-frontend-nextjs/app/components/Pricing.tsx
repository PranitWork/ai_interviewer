"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const Pricing = ({ onSelectPlan }: PricingProps) => {
  const { plans } = useSelector((state: any) => state.planReducer);

  if (!plans || plans.length === 0) {
    return <p className="text-center text-voxy-muted mt-12">Loading plans...</p>;
  }

  // UI configuration for each plan
  const planExtras: any = {
    free: {
      displayTitle: "Free",
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
    pro: {
      displayTitle: "Pro",
      desc: "Perfect for serious job seekers who want detailed insights and unlimited practice.",
      highlight: true,
      features: [
        "200 AI interview sessions",
        "Instant feedback with scoring & suggestions",
        "Comprehensive post-interview summary report",
        "Full analytics dashboard",
        "Access to all job roles & question sets",
        "Report history with downloadable summaries",
        "Profile customization",
        "Priority email support",
      ],
    },
    advance: {
      displayTitle: "Advance",
      desc: "Professional-grade coaching and deep AI insights.",
      features: [
        "Unlimited AI interview sessions",
        "AI voice tone & confidence analysis",
        "Personalized AI feedback",
        "Improvement tracking with charts",
        "AI recommendations",
        "Premium templates",
        "Early access to beta features",
        "Priority email support",
      ],
    },
  };

  return (
    <section id="pricing" className="mt-32 px-6 max-w-6xl mx-auto text-center">
      <h1 className="text-center mb-10 text-voxy-text font-bold text-2xl md:text-3xl">Monthly Plans</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan: any, i: number) => {
          // Normalize backend names: "Free" → "free"
          const key = plan.name.toLowerCase();
          const extras = planExtras[key];

          if (!extras) {
            toast.error("No extras found for plan:", plan.name);
            return null;
          }

          const isHighlight = extras?.highlight;

          return (
            <motion.div
              key={plan._id}
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
                      background:
                        "linear-gradient(90deg, var(--color-voxy-primary), var(--color-voxy-secondary))",
                      color: "white",
                    }
                  : {
                      backgroundColor: "var(--color-voxy-surface)",
                      color: "var(--color-voxy-text)",
                    }
              }
            >
              {/* Title */}
              <h3 className="text-2xl font-semibold mb-2">
                {extras?.displayTitle}
              </h3>

              {/* Description */}
              <p
                className={
                  isHighlight
                    ? "text-white/90 mb-4"
                    : "text-voxy-muted mb-4"
                }
              >
                {extras?.desc}
              </p>

              {/* Price */}
              <p
                className={
                  isHighlight
                    ? "text-4xl font-bold mb-6 text-white"
                    : "text-4xl font-bold mb-6 text-voxy-text"
                }
              >
                ₹{plan.price}
              </p>

              {/* Features */}
              <ul className="text-left space-y-3">
                {extras?.features?.map((f: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span
                      className={
                        isHighlight
                          ? "text-white mt-1"
                          : "text-voxy-primary mt-1"
                      }
                    >
                      <CheckCircle className="w-5 h-5" />
                    </span>
                    <span
                      className={
                        isHighlight ? "text-white/95" : "text-voxy-muted"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={() => onSelectPlan(key)} // sends normalized plan name
                className="mt-8 w-full py-3 rounded-lg font-semibold transition transform hover:-translate-y-0.5"
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
                Select Plan
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;
