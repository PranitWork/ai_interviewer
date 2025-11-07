"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { Brain, Users, Sparkles } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text py-24 px-6">
      <Header/>
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8"
      >
        About <span className="text-voxy-primary">Voxy AI</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto text-center text-voxy-muted text-lg leading-relaxed"
      >
        Voxy AI is designed to revolutionize the interview experience by
        leveraging advanced artificial intelligence. We empower recruiters and
        candidates with intelligent insights, real-time scoring, and AI-driven
        communication analysis.
      </motion.p>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
        {[
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
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-voxy-surface/60 border border-voxy-border rounded-xl p-10 hover:border-voxy-primary transition shadow-lg hover:shadow-voxy-primary/20"
          >
            {card.icon}
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-voxy-muted">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="text-center mt-20"
      >
        <a
          href="/contact"
          className="px-8 py-4 bg-voxy-primary hover:bg-voxy-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-voxy-primary/20 transition"
        >
          Work With Us
        </a>
      </motion.div>
      <Footer/>
    </main>
  );
}
