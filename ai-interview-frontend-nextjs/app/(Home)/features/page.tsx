"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Brain, UserCheck, Mic, BarChart3, Sparkles, Zap } from "lucide-react";
import { useMemo } from "react";

// ✅ Lazy-load layout components for performance
const Header = dynamic(() => import("@/app/components/Header"));
const Footer = dynamic(() => import("@/app/components/Footer"));

// ✅ Shared fade-up animation variant
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function Features() {
  // ✅ Memoized feature list
  const features = useMemo(
    () => [
      {
        icon: Brain,
        title: "AI Interview Assistant",
        desc: "Conduct structured, realistic interviews with an intelligent AI that evaluates every answer in real time.",
      },
      {
        icon: UserCheck,
        title: "Candidate Scoring",
        desc: "Automatically assess communication, confidence, and technical accuracy to generate fair and consistent ratings.",
      },
      {
        icon: Mic,
        title: "Voice & Tone Analysis",
        desc: "Leverage voice AI to analyze tone, pacing, clarity, and emotional expression in candidate speech.",
      },
      {
        icon: BarChart3,
        title: "Dashboard Insights",
        desc: "Get data-driven analytics on performance trends, question-wise breakdowns, and comparative benchmarking.",
      },
      {
        icon: Sparkles,
        title: "Smart Suggestions",
        desc: "Receive AI-powered improvement tips and model answers customized to candidate skill levels.",
      },
      {
        icon: Zap,
        title: "Instant Interview Summaries",
        desc: "Generate professional summaries and feedback reports instantly after each interview session.",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      {/* === HEADER === */}
      <Header />

      {/* === MAIN CONTENT === */}
      <main className="flex-1 container mx-auto px-6 py-24">
        {/* Title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Powerful AI-Driven{" "}
            <span className="text-voxy-primary">Interview Features</span>
          </h1>
          <p className="mt-4 text-voxy-muted text-lg max-w-2xl mx-auto">
            Empower your interview process with AI-enhanced analysis, real-time insights,
            and automated performance intelligence.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <section
          aria-label="AI Interview Features"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i * 0.15}
              className="group p-8 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg 
                         hover:shadow-voxy-primary/25 hover:border-voxy-primary/80 transition-all duration-300 
                         transform-gpu hover:-translate-y-1"
            >
              <div className="mb-6 text-voxy-primary group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-10 h-10" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-voxy-muted leading-relaxed">{f.desc}</p>
            </motion.article>
          ))}
        </section>
      </main>

      {/* === CTA SECTION === */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center py-24 px-6"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-voxy-primary to-voxy-secondary p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to Experience AI Interviews?
          </h2>
          <p className="text-voxy-highlight mb-6 text-lg">
            Try SwarAI and revolutionize your candidate evaluations today.
          </p>
          <a
            href="/auth/register"
            className="inline-block bg-white text-voxy-primary font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all"
          >
            Get Started for Free
          </a>
        </div>
      </motion.section>

      {/* === FOOTER === */}
      <Footer />
    </div>
  );
}
