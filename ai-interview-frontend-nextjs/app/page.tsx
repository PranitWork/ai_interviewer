"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Mic, Bot } from "lucide-react";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header/>
      {/* 🧠 Hero Section */}
      <section
        id="hero"
        className="flex flex-col items-center justify-center text-center px-6 mt-28 md:mt-40"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center space-x-2 mb-4"
        >
          <Sparkles className="text-voxy-primary" />
          <span className="uppercase text-sm tracking-widest text-voxy-primary">
            AI Interview Assistant
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl"
        >
          Reimagining <span className="text-voxy-primary">Interviews</span> Through
          Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-voxy-muted text-lg md:text-xl mt-6 max-w-2xl"
        >
          Voxy AI transforms interviews using real-time analytics, speech
          insights, and intelligent feedback — helping candidates and recruiters
          connect meaningfully and make smarter hiring decisions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex space-x-4"
        >
          <button className="px-6 py-3 bg-voxy-primary hover:bg-voxy-secondary rounded-lg font-semibold text-white transition">
            Try For Free
          </button>
          <button className="px-6 py-3 border border-voxy-border hover:bg-voxy-surface rounded-lg font-semibold text-voxy-text transition">
            Learn More
          </button>
        </motion.div>
      </section>

      {/* 💡 Feature Section */}
      <section
        id="features"
        className="mt-32 px-8 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {[
          {
            icon: <Brain className="w-10 h-10 text-voxy-primary mb-4" />,
            title: "AI-Driven Insights",
            desc: "Analyze interviews in real-time and generate actionable feedback using advanced language models.",
          },
          {
            icon: <Mic className="w-10 h-10 text-voxy-primary mb-4" />,
            title: "Voice Intelligence",
            desc: "Track tone, speech pace, and communication style to improve candidate confidence and engagement.",
          },
          {
            icon: <Bot className="w-10 h-10 text-voxy-primary mb-4" />,
            title: "Smart Automation",
            desc: "Automate summaries, feedback forms, and scheduling with intelligent automation tools.",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-voxy-surface/50 border border-voxy-border rounded-2xl p-8 hover:border-voxy-primary transition shadow-lg hover:shadow-voxy-primary/20"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-voxy-muted">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 🔍 About Section */}
      <section
        id="about"
        className="mt-32 px-8 max-w-5xl mx-auto text-center space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          How Voxy AI Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-voxy-muted text-lg leading-relaxed"
        >
          Upload your candidate recordings, conduct live AI-assisted interviews,
          and receive in-depth analytics and performance feedback. Voxy AI
          leverages natural language processing, sentiment tracking, and
          real-time scoring to help recruiters identify the perfect fit.
        </motion.p>
      </section>

      {/* 💰 Pricing Section */}
      <Pricing />

      {/* 🌟 CTA Section */}
      <section className="mt-32 text-center px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-16 rounded-2xl max-w-5xl mx-auto bg-gradient-to-r from-voxy-primary to-voxy-secondary"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Interviews?
          </h2>
          <p className="text-voxy-highlight mb-8 text-lg">
            Start your free trial today and experience the power of AI-driven
            interview intelligence.
          </p>
          <button className="px-8 py-4 bg-white text-voxy-primary font-semibold rounded-xl hover:bg-gray-100 transition">
            Start Free Trial
          </button>
        </motion.div>
      </section>
      <Footer/>
    </main>
  );
}
