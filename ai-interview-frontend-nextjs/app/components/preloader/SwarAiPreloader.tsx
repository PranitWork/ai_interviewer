"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  const textLetters = "SwarAI".split("");

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--color-voxy-bg)]">
      {/* Fade-in Text Animation */}
      <div className="flex space-x-1 text-4xl font-bold tracking-[0.18em] uppercase">
        {textLetters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            style={{
              background: `linear-gradient(
              90deg,
              var(--color-voxy-primary),
              var(--color-voxy-secondary)
            )`,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
            className="drop-shadow-sm"
          >
            {char}
          </motion.span>
        ))}
      </div>

      {/* Line loader */}
      <div
        className="w-[120px] h-[3px] mt-6 rounded-full overflow-hidden"
        style={{ background: "var(--color-voxy-border)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(
              90deg,
              var(--color-voxy-primary),
              var(--color-voxy-secondary)
            )`,
          }}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle Pulse dot */}
      <motion.div
        className="mt-4 w-2 h-2 rounded-full"
        style={{ background: "var(--color-voxy-accent)" }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
    </div>
  );
}
