"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Brain, Users, Sparkles } from "lucide-react";
import { useMemo } from "react";

// ✅ Lazy load Header & Footer to reduce bundle size
const Header = dynamic(() => import("@/app/components/Header"));
const Footer = dynamic(() => import("@/app/components/Footer"));

// ✅ Shared motion variant for fade-up animations
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function About() {
  // ✅ Memoize cards to avoid remount on every render
  const cards = useMemo(
    () => [
      {
        icon: <Brain className="text-voxy-primary w-14 h-14 mb-4" />,
        title: "AI Research First",
        desc: "Built with cutting-edge language models trained to evaluate and enhance human communication.",
      },
      {
        icon: <Users className="text-voxy-primary w-14 h-14 mb-4" />,
        title: "Human-Centric",
        desc: "Focused on empowering candidates, not replacing them — empathy meets intelligence.",
      },
      {
        icon: <Sparkles className="text-voxy-primary w-14 h-14 mb-4" />,
        title: "Innovation Driven",
        desc: "We continuously improve our models and UX to ensure the most natural interview experience.",
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-6 font-sans overflow-hidden">
      <Header />

      {/* === HERO SECTION === */}
      <section className="pt-32 text-center max-w-4xl mx-auto">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-extrabold mb-6 text-voxy-text"
        >
          About <span className="text-voxy-primary">Voxy AI</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="text-voxy-muted text-lg md:text-xl leading-relaxed max-w-3xl mx-auto"
        >
          Voxy AI is designed to revolutionize the interview experience by
          leveraging advanced artificial intelligence. We empower recruiters and
          candidates with intelligent insights, real-time scoring, and AI-driven
          communication analysis.
        </motion.p>
      </section>

      {/* === FEATURE CARDS === */}
      <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={i * 0.2}
            className="bg-voxy-surface/60 border border-voxy-border rounded-2xl p-10 
                       hover:border-voxy-primary transition-all shadow-lg 
                       hover:shadow-voxy-primary/20 text-center backdrop-blur-lg"
          >
            {card.icon}
            <h3 className="text-xl font-bold mb-2 text-voxy-text">{card.title}</h3>
            <p className="text-voxy-muted">{card.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* === CTA SECTION === */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mt-24 mb-20"
      >
        <a
          href="/contact"
          aria-label="Work with Voxy AI"
          className="inline-block px-8 py-4 rounded-xl font-semibold 
                     bg-gradient-to-r from-voxy-primary to-voxy-secondary 
                     text-voxy-text shadow-md hover:opacity-90 
                     hover:shadow-voxy-primary/30 transition-all duration-200"
        >
          Work With Us
        </a>
      </motion.section>

      <Footer />
    </main>
  );
}
