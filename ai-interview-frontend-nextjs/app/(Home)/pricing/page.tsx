"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      subtitle: "Perfect for individuals exploring AI interviews.",
      features: [
        "Up to 5 interviews/month",
        "Basic AI feedback",
        "Limited analytics",
        "Email support",
      ],
      button: "Get Started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$29",
      subtitle: "Ideal for recruiters and growing teams.",
      features: [
        "Unlimited interviews",
        "Advanced analytics",
        "Custom feedback templates",
        "Priority support",
      ],
      button: "Upgrade to Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      subtitle: "For large organizations that need scalability.",
      features: [
        "Unlimited everything",
        "Dedicated AI model tuning",
        "Admin dashboard",
        "Dedicated success manager",
      ],
      button: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text py-24 px-6">
      <Header/>
      {/* 🧠 Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Pricing <span className="text-voxy-primary">Plans</span>
        </h1>
        <p className="text-voxy-muted text-lg max-w-2xl mx-auto">
          Choose a plan that fits your hiring needs. Scale effortlessly with
          intelligent AI insights.
        </p>
      </motion.div>

      {/* 💳 Plans */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className={`relative p-8 rounded-2xl border shadow-lg transition-transform hover:scale-105 ${
              plan.highlight
                ? "bg-voxy-primary border-voxy-secondary shadow-voxy-primary/30"
                : "bg-voxy-surface/50 border-voxy-border hover:border-voxy-primary hover:shadow-voxy-primary/20"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-voxy-accent text-white font-semibold text-sm px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-4 h-4" /> Most Popular
              </div>
            )}

            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <p
              className={`mb-6 ${
                plan.highlight ? "text-voxy-text/90" : "text-voxy-muted"
              }`}
            >
              {plan.subtitle}
            </p>
            <p className="text-5xl font-extrabold mb-6">{plan.price}</p>

            <ul className="space-y-3 text-left">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle
                    className={`w-5 h-5 ${
                      plan.highlight ? "text-white" : "text-voxy-primary"
                    }`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full mt-10 py-3 rounded-lg font-semibold transition shadow-md ${
                plan.highlight
                  ? "bg-white text-voxy-primary hover:bg-gray-100"
                  : "bg-voxy-primary hover:bg-voxy-secondary text-white"
              }`}
            >
              {plan.button}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* ⚙️ FAQ Section */}
      <section className="max-w-4xl mx-auto mt-32">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Frequently Asked <span className="text-voxy-primary">Questions</span>
        </motion.h2>

        <div className="space-y-6">
          {[
            {
              q: "Can I change my plan later?",
              a: "Absolutely! You can upgrade or downgrade your plan anytime from your account dashboard.",
            },
            {
              q: "Is there a free trial?",
              a: "Yes, every user starts with a free plan that includes limited interviews per month.",
            },
            {
              q: "Do you offer enterprise support?",
              a: "Yes. Our enterprise plan includes a dedicated account manager, team onboarding, and custom AI tuning.",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-voxy-surface/50 border border-voxy-border rounded-xl p-6 hover:border-voxy-primary transition shadow-sm hover:shadow-voxy-primary/20"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
              <p className="text-voxy-muted">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💫 CTA */}
      <section className="mt-32 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-voxy-primary to-voxy-secondary py-16 rounded-2xl max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Power Your Interviews?
          </h2>
          <p className="text-voxy-highlight mb-8 text-lg">
            Start your free plan today and experience the future of interview
            intelligence.
          </p>
          <button className="px-8 py-4 bg-white text-voxy-primary font-semibold rounded-xl hover:bg-gray-100 transition">
            Get Started for Free
          </button>
        </motion.div>
      </section>
      <Footer/>
    </main>
  );
}
