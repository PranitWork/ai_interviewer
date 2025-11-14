"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {  useMemo } from "react";

import Pricing from "@/app/components/Pricing";
import { useRouter } from "next/navigation";


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
const router = useRouter();
const handleSelectPlan = async (plan: string) => {
  router.push(`/checkout?plan=${plan}`);
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
      <Pricing onSelectPlan={handleSelectPlan} />

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
            onClick={() => handleSelectPlan("Free")}
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
