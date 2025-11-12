"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asynccheckout } from "@/app/Store/actions/checkoutActions";
import { openRazorpayCheckout } from "@/app/lib/razorpayClient";
import Pricing from "@/app/components/Pricing";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function PricingPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const faqs = useMemo(
    () => [
        {
    q: "What is swarAI?",
    a: "swarAI is an AI-powered interview preparation platform that simulates real interview sessions using voice and text. It gives you instant feedback on your answers, communication style, and overall performance to help you improve faster.",
  },
  {
    q: "How does the AI interviewer work?",
    a: "Once you start a session, the AI asks job-specific questions and listens to your answers. After each response, it instantly evaluates your answer for clarity, correctness, and confidence, then provides constructive feedback.",
  },
  {
    q: "What’s the difference between the Free, Pro, and Advance plans?",
    a: "The Free plan lets you try up to 3 interviews per month with basic feedback. The Pro plan offers unlimited interviews, detailed feedback, and analytics. The Advance plan adds personalized coaching, voice tone analysis, and performance tracking.",
  },
  {
    q: "Can I view my previous interview reports?",
    a: "Yes! All your interview summaries and detailed reports are saved in the Report section, where you can review your past sessions and track your improvement over time.",
  },
  {
    q: "Is my voice and data safe with swarAI?",
    a: "Absolutely. swarAI securely handles all your data and recordings using encrypted storage. Your sessions are private and never shared with third parties.",
  },
    ],
    []
  );

  const handlePayment = async (plan: string) => {
    if (plan === "Free") {
      toast.success("🎉 You’re on the Free plan — start exploring now!");
      return;
    }

    if (plan === "Enterprise") {
      toast.info("💬 Our sales team will contact you shortly!");
      return;
    }

    try {
      toast.info("⚡ Creating checkout session...");
      const result = await dispatch(asynccheckout({ plan }));

      if (result.success) {
        toast.success("✅ Redirecting to Razorpay checkout...");
        await openRazorpayCheckout(plan);
      } else {
        toast.error("❌ Failed to create payment session.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Payment process failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header />

      {/* Heading */}
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
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <Pricing onSelectPlan={handlePayment} />

      {/* FAQ Section */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mt-32"
        >
          Frequently Asked <span className="text-voxy-primary">Questions</span>
        </motion.h2>
      <section className="max-w-4xl max-h-[80vh] overflow-y-auto scroll-auto mx-auto mt-10 px-6">

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

      {/* CTA Section */}
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
            Start your free plan today and experience AI-powered interview
            intelligence.
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
