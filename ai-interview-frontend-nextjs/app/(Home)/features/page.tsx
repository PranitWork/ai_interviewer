"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { Brain, UserCheck, Mic, BarChart3, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-10 h-10 text-voxy-primary" />,
    title: "AI Interview Assistant",
    desc: "Conduct structured interviews with an intelligent assistant that evaluates responses in real-time.",
  },
  {
    icon: <UserCheck className="w-10 h-10 text-voxy-primary" />,
    title: "Candidate Scoring",
    desc: "Automatically rate candidates using behavior, communication, and domain understanding metrics.",
  },
  {
    icon: <Mic className="w-10 h-10 text-voxy-primary" />,
    title: "Voice & Tone Analysis",
    desc: "Analyze tone, pace, clarity, and confidence using speech AI models.",
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-voxy-primary" />,
    title: "Dashboard Insights",
    desc: "Track performance, response patterns, and skill breakdowns in one place.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-voxy-primary" />,
    title: "Smart Suggestions",
    desc: "Get AI-powered recommendations for improvement and ideal answers.",
  },
  {
    icon: <Zap className="w-10 h-10 text-voxy-primary" />,
    title: "Instant Interview Summaries",
    desc: "Automatically generate professional feedback summaries for each interview.",
  },
];

export default function Features() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text py-24 px-6">
      <Header/>
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-4xl md:text-5xl font-extrabold mb-12"
      >
        Powerful AI-Driven{" "}
        <span className="text-voxy-primary">Interview Features</span>
      </motion.h1>

      {/* Feature Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="p-8 bg-voxy-surface/60 border border-voxy-border hover:border-voxy-primary rounded-2xl shadow-lg hover:shadow-voxy-primary/20 transition cursor-pointer"
          >
            <div className="mb-6">{f.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-voxy-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <Footer/>
    </main>
  );
}
