"use client";

import { useEffect, useState } from "react";
import { easeOut, motion } from "framer-motion";
import {
  Mic,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Settings,
} from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function SettingsSection() {
  const [micAccess, setMicAccess] = useState<"granted" | "denied" | "prompt">("prompt");
  const [darkMode, setDarkMode] = useState(true);

  // Load theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.remove("light");
    } else {
      setDarkMode(false);
      document.documentElement.classList.add("light");
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  // Handle mic permission
  const handleMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setMicAccess("granted");
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch {
      setMicAccess("denied");
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="space-y-10 max-w-3xl mx-auto"
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3">
          <Settings size={26} className="text-voxy-primary" />
          <div>
            <h2 className="text-3xl font-bold mb-1 text-voxy-text">Settings</h2>
            <p className="text-voxy-muted text-sm">
              Manage your device permissions and app preferences.
            </p>
          </div>
        </div>

        {/* ===== MICROPHONE ACCESS ===== */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <Mic size={22} className="text-voxy-primary" />
            <h3 className="text-lg font-semibold text-voxy-text">
              Microphone Access
            </h3>
          </div>
          <p className="text-sm text-voxy-muted leading-relaxed">
            Allow SwarAI to access your microphone for conducting AI voice
            interviews and real-time responses.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMicAccess}
            className={`px-5 py-2.5 rounded-lg font-semibold shadow-md transition flex items-center gap-2 ${
              micAccess === "granted"
                ? "bg-voxy-highlight/20 text-voxy-highlight border border-voxy-highlight/40 cursor-default"
                : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text hover:opacity-90"
            }`}
          >
            {micAccess === "granted" ? (
              <>
                <CheckCircle2 size={18} /> Microphone Access Granted
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> Grant Microphone Access
              </>
            )}
          </motion.button>

          {micAccess === "denied" && (
            <p className="text-sm text-voxy-accent mt-1">
              Access denied. Please enable microphone permission in your browser
              settings.
            </p>
          )}
        </motion.div>

        {/* ===== THEME SETTINGS ===== */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={22} className="text-voxy-primary" />
              ) : (
                <Sun size={22} className="text-voxy-highlight" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-voxy-text">Theme</h3>
                <p className="text-sm text-voxy-muted">
                  Choose between light and dark modes for your dashboard.
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-voxy-border text-voxy-muted hover:text-voxy-text hover:bg-voxy-border/40 transition"
            >
              {darkMode ? (
                <>
                  <Sun size={18} className="text-voxy-highlight" /> Light Mode
                </>
              ) : (
                <>
                  <Moon size={18} className="text-voxy-primary" /> Dark Mode
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
}
