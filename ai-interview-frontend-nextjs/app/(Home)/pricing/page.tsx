"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";
import { useMemo } from "react";
import { toast } from "react-toastify";

// ✅ Lazy-load layout components
const Header = dynamic(() => import("@/app/components/Header"));
const Footer = dynamic(() => import("@/app/components/Footer"));

// ✅ Shared motion variant
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function Pricing() {
  // ✅ Plans (memoized for performance)
  const plans = useMemo(
    () => [
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
        price: "$29/mo",
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
    ],
    []
  );

  // ✅ FAQs (memoized)
  const faqs = useMemo(
    () => [
      {
        q: "Can I change my plan later?",
        a: "Absolutely! You can upgrade or downgrade anytime from your dashboard.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes, the free plan lets you experience core features before upgrading.",
      },
      {
        q: "Do you offer enterprise support?",
        a: "Yes! Enterprise clients get dedicated onboarding, AI customization, and 24/7 support.",
      },
    ],
    []
  );

  // ⚙️ Razorpay integration ready (demo)
  const handlePayment = async (plan: string) => {
    if (plan === "Pro") {
      toast.info("Redirecting to Razorpay checkout… (Demo)");
      // TODO: integrate Razorpay/Stripe API here
    } else if (plan === "Enterprise") {
      toast.info("Our sales team will contact you shortly!");
    } else {
      toast.success("You're on the Free plan — start using SwarAI now!");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header />

      {/* === HEADING === */}
      <section className="text-center py-28 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Pricing <span className="text-voxy-primary">Plans</span>
          </h1>
          <p className="text-voxy-muted text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your AI interview experience.
            Scale effortlessly with intelligent insights.
          </p>
        </motion.div>
      </section>

      {/* === PRICING CARDS === */}
      <section
        aria-label="Pricing Plans"
        className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6"
      >
        {plans.map((plan, i) => (
          <motion.article
            key={plan.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={i * 0.2}
            className={`relative p-8 rounded-2xl border shadow-lg transition-all transform-gpu hover:scale-105 ${
              plan.highlight
                ? "bg-gradient-to-b from-voxy-primary to-voxy-secondary border-voxy-primary text-white shadow-voxy-primary/40"
                : "bg-voxy-surface/60 border-voxy-border hover:border-voxy-primary hover:shadow-voxy-primary/20"
            }`}
          >
            {/* Highlight Badge */}
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-semibold text-xs px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-4 h-4" />
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
            <p
              className={`mb-6 ${
                plan.highlight ? "text-white/90" : "text-voxy-muted"
              }`}
            >
              {plan.subtitle}
            </p>
            <p className="text-5xl font-extrabold mb-6">{plan.price}</p>

            {/* Features */}
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

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePayment(plan.name)}
              aria-label={`Select ${plan.name} plan`}
              className={`w-full mt-10 py-3 rounded-lg font-semibold transition shadow-md ${
                plan.highlight
                  ? "bg-white text-voxy-primary hover:bg-gray-100"
                  : "bg-voxy-primary hover:bg-voxy-secondary text-white"
              }`}
            >
              {plan.button}
            </motion.button>
          </motion.article>
        ))}
      </section>

      {/* === FAQ SECTION === */}
      <section className="max-w-4xl mx-auto mt-32 px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Frequently Asked <span className="text-voxy-primary">Questions</span>
        </motion.h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.15}
              className="bg-voxy-surface/50 border border-voxy-border rounded-xl p-6 hover:border-voxy-primary transition-all shadow-sm hover:shadow-voxy-primary/20"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
              <p className="text-voxy-muted leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="mt-32 text-center px-6 mb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-voxy-primary to-voxy-secondary py-16 rounded-2xl max-w-5xl mx-auto shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Power Your Interviews?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Start your free plan today and experience AI-powered interview intelligence.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handlePayment("Free")}
            className="px-8 py-4 bg-white text-voxy-primary font-semibold rounded-xl hover:bg-gray-100 transition-all"
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
