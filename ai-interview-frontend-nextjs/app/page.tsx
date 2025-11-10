"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Mic, Bot } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// ✅ Lazy-load heavy components for faster initial page render
const Header = dynamic(() => import("./components/Header"));
const Footer = dynamic(() => import("./components/Footer"));
const Pricing = dynamic(() => import("./components/Pricing"));

// === Motion Variants for consistency ===
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function Home() {
  const features = useMemo(
    () => [
      {
        icon: <Brain className="w-10 h-10 text-voxy-primary mb-4" />,
        title: "AI-Driven Insights",
        desc: "Analyze interviews in real time and generate actionable feedback using advanced language models.",
      },
      {
        icon: <Mic className="w-10 h-10 text-voxy-primary mb-4" />,
        title: "Voice Intelligence",
        desc: "Track tone, speech pace, and communication style to enhance candidate confidence and engagement.",
      },
      {
        icon: <Bot className="w-10 h-10 text-voxy-primary mb-4" />,
        title: "Smart Automation",
        desc: "Automate summaries, feedback forms, and scheduling with intelligent automation tools.",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header />

      {/* 🧠 HERO SECTION */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center text-center px-6 mt-28 md:mt-40"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-2 mb-4"
        >
          <Sparkles className="text-voxy-primary" />
          <span className="uppercase text-sm tracking-widest text-voxy-primary">
            AI Interview Assistant
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          Reimagining{" "}
          <span className="text-voxy-primary">Interviews</span> Through
          Intelligence
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="text-voxy-muted text-lg md:text-xl mt-6 max-w-2xl"
        >
          Voxy AI transforms interviews using real-time analytics, speech
          insights, and intelligent feedback — helping candidates and recruiters
          connect meaningfully and make smarter hiring decisions.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="mt-10 flex space-x-4"
        >
          <button className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text shadow-md hover:opacity-90 transition-all">
            Try For Free
          </button>
          <button className="px-6 py-3 border border-voxy-border hover:bg-voxy-surface/50 rounded-lg font-semibold text-voxy-text transition-all">
            Learn More
          </button>
        </motion.div>
      </section>

      {/* 💡 FEATURES SECTION */}
      <section
        id="features"
        className="mt-32 px-8 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={i * 0.2}
            className="bg-voxy-surface/50 border border-voxy-border rounded-2xl p-8 hover:border-voxy-primary transition-all shadow-lg hover:shadow-voxy-primary/20"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2 text-voxy-text">
              {feature.title}
            </h3>
            <p className="text-voxy-muted">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 🔍 ABOUT SECTION */}
      <section
        id="about"
        className="mt-32 px-8 max-w-5xl mx-auto text-center space-y-6"
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6 text-voxy-text"
        >
          How Voxy AI Works
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={0.3}
          viewport={{ once: true }}
          className="text-voxy-muted text-lg leading-relaxed"
        >
          Upload your candidate recordings, conduct live AI-assisted interviews,
          and receive in-depth analytics and performance feedback. Voxy AI uses
          natural language processing, sentiment tracking, and real-time scoring
          to help recruiters identify the perfect fit.
        </motion.p>
      </section>

      {/* 💰 PRICING SECTION */}
      <Pricing />

      {/* 🌟 CTA SECTION */}
      <section className="mt-32 text-center px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 rounded-2xl max-w-5xl mx-auto bg-gradient-to-r from-voxy-primary to-voxy-secondary"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-voxy-text">
            Ready to Transform Your Interviews?
          </h2>
          <p className="text-voxy-text/80 mb-8 text-lg">
            Start your free trial today and experience the power of AI-driven
            interview intelligence.
          </p>
          <button className="px-8 py-4 rounded-xl font-semibold bg-voxy-surface text-voxy-primary hover:bg-voxy-border transition-all shadow-md">
            Start Free Trial
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
