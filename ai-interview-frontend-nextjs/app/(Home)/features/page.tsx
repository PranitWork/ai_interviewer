"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Brain,
  UserCheck,
  Mic,
  BarChart3,
  Sparkles,
  Zap,
  LucideIcon,
} from "lucide-react";
import { useMemo, Suspense } from "react";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: "easeOut",
    },
  }),
};

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export default function Features() {
  const features: FeatureItem[] = useMemo(
    () => [
      {
        icon: Brain,
        title: "AI Interview Assistant",
        desc: "Conduct structured, realistic interviews with AI that evaluates responses in real time.",
      },
      {
        icon: UserCheck,
        title: "Candidate Scoring",
        desc: "Get automated assessments on communication, confidence, and technical ability.",
      },
      {
        icon: Mic,
        title: "Voice & Tone Analysis",
        desc: "Analyze pace, tone, clarity, and emotional patterns during candidate speech.",
      },
      {
        icon: BarChart3,
        title: "Dashboard Insights",
        desc: "Explore breakdowns, analytics, skill trends, and comparative benchmarking.",
      },
      {
        icon: Sparkles,
        title: "Smart Suggestions",
        desc: "Receive auto-generated feedback and learning recommendations tailored to the candidate.",
      },
      {
        icon: Zap,
        title: "Instant Interview Summaries",
        desc: "Generate professional summaries and PDF reports instantly post-interview.",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text overflow-hidden">
      {/* === HEADER === */}
      <Suspense fallback={<div className="h-16" />}>
        <Header />
      </Suspense>

      {/* === MAIN === */}
      <main className="flex-1 container mx-auto px-6 py-20 md:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <h1 className="text-[2.4rem] md:text-5xl font-extrabold leading-tight">
            Powerful AI-Driven{" "}
            <span className="text-voxy-primary">Interview Features</span>
          </h1>
          <p className="mt-4 text-voxy-muted text-lg max-w-2xl mx-auto">
            Level-up recruiting with AI insights, automated reports, voice
            analysis, and real-time intelligence.
          </p>
        </motion.div>

        {/* === FEATURES GRID === */}
        <section
          aria-label="List of AI Interview Features"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              className="group p-7 sm:p-8 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-md 
                         shadow-lg hover:shadow-voxy-primary/25 hover:border-voxy-primary/80 transition-all 
                         duration-300 transform-gpu hover:-translate-y-1"
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

      {/* === CTA === */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center py-20 px-6 bg-transparent"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-voxy-primary to-voxy-secondary p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Experience AI Interviews?
          </h2>
          <p className="text-voxy-highlight mb-6 text-lg">
            Try SwarAI and transform your hiring experience.
          </p>
          <a
            href="/auth/register"
            aria-label="Register for SwarAI"
            className="inline-block bg-white text-voxy-primary font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all"
          >
            Get Started Free
          </a>
        </div>
      </motion.section>

      {/* === FOOTER === */}
      <Suspense fallback={<div className="h-32" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
