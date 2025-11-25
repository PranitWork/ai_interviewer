"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "voxy_first_visit";

export default function FirstVisitPopup() {
  const [open, setOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setOpen(true);
    }
  }, []);



useEffect(() => {
  if (open && closeRef.current) {
    closeRef.current.focus();
  }
}, [open]);


  const closePopup = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
    >
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 bg-black"
        onClick={closePopup}
      />

      {/* POPUP CARD */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 max-w-md w-full bg-voxy-surface/95 border border-voxy-border rounded-2xl p-7 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {/* Icon Box */}
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-voxy-primary/15 border border-voxy-border">
            <svg
              className="h-6 w-6 text-voxy-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
          </div>

          {/* CONTENT */}
       <div className="flex-1">
  <h2 className="text-lg font-semibold text-voxy-text">
    Welcome to SwarAI 👋
  </h2>

  <p className="text-sm text-voxy-muted mt-2 leading-relaxed">
    You're accessing the <span className="text-voxy-primary font-semibold">Beta Version</span> of SwarAI.
    Some features may be limited or locked while we continue improving the platform.
  </p>

  <p className="text-sm text-voxy-muted mt-3 leading-relaxed">
    Your experience and feedback matter!  
    Please explore SwarAI and share your suggestions — it will truly help us shape the best AI experience for you.
    Thank you for your support. Enjoy! 🚀
  </p>

  {/* BUTTONS */}
  <div className="mt-5 flex gap-3">
    <a
      href="/features"
      className="px-4 py-2 rounded-md bg-voxy-primary text-white text-sm font-semibold hover:brightness-95 transition"
      onClick={closePopup}
    >
      Explore Features
    </a>

    <button
      ref={closeRef}
      onClick={closePopup}
      className="px-3 py-2 rounded-md border border-voxy-border text-voxy-muted text-sm hover:text-voxy-text transition"
    >
      Close
    </button>
  </div>
</div>


          {/* CLOSE ICON */}
          <button
            onClick={closePopup}
            className="p-2 text-voxy-muted hover:text-voxy-text transition"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
