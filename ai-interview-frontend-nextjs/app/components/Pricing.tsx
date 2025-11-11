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
      desc: "Perfect for individuals exploring AI interviews.",
      features: [
        "Up to 5 interviews/month",
        "Basic AI feedback",
        "Email support",
      ],
    },
    {
      title: "Pro",
      price: "$29",
      desc: "Ideal for recruiters and growing teams.",
      features: [
        "Unlimited interviews",
        "Advanced analytics",
        "Custom feedback templates",
        "Priority support",
      ],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "For organizations that need scalability.",
      features: [
        "Unlimited everything",
        "Dedicated AI model tuning",
        "Team dashboards",
        "Dedicated support manager",
      ],
    },
  ];

  return (
    <section id="pricing" className="mt-32 px-8 max-w-6xl mx-auto text-center">
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className={`rounded-2xl border p-8 ${
              plan.highlight
                ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-800/40"
                : "bg-gray-900/40 border-gray-800"
            }`}
          >
            <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
            <p className="text-gray-300 mb-4">{plan.desc}</p>
            <p className="text-4xl font-bold mb-6">{plan.price}</p>
            <ul className="text-left space-y-3">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelectPlan(plan.title)}
              className={`mt-8 w-full py-3 rounded-lg font-semibold ${
                plan.highlight
                  ? "bg-white text-blue-700 hover:bg-gray-100"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {plan.title === "Enterprise" ? "Contact Us" : "Get Started"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
