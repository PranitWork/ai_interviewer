"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Trash2,
  Settings,
  CheckCircle2,
} from "lucide-react";

export default function SettingsSection() {
  const [micAccess, setMicAccess] = useState<"granted" | "denied" | "prompt">("prompt");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (stream) {
        setMicAccess("granted");
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      console.error(err);
      setMicAccess("denied");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10 max-w-3xl mx-auto"
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3">
        <Settings size={26} className="text-voxy-primary" />
        <div>
          <h2 className="text-3xl font-bold mb-1">Settings</h2>
          <p className="text-voxy-muted text-sm">
            Manage your device permissions and app preferences.
          </p>
        </div>
      </div>

      {/* ===== MICROPHONE ACCESS ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4"
      >
        <div className="flex items-center gap-3">
          <Mic size={22} className="text-voxy-primary" />
          <h3 className="text-lg font-semibold">Microphone Access</h3>
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
              ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
              : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-white hover:opacity-90"
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
          <p className="text-sm text-red-400 mt-1">
            Access denied. Please enable microphone permission in your browser settings.
          </p>
        )}
      </motion.div>

      {/* ===== NOTIFICATION SETTINGS ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4"
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Bell size={22} className="text-voxy-secondary" />
            <div>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <p className="text-sm text-voxy-muted">
                Get notified when new interviews or reports are ready.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-12 h-6 bg-gray-600 peer-checked:bg-voxy-primary rounded-full transition-all">
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${
                  notifications ? "translate-x-6" : ""
                }`}
              />
            </div>
          </label>
        </div>
      </motion.div>

      {/* ===== THEME SETTINGS ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4"
      >
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Moon size={22} className="text-voxy-primary" />
            <div>
              <h3 className="text-lg font-semibold">Theme</h3>
              <p className="text-sm text-voxy-muted">
                Choose between light and dark modes for your dashboard.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-voxy-border hover:bg-voxy-border/40 transition"
          >
            {darkMode ? (
              <>
                <Sun size={18} className="text-yellow-400" /> Light Mode
              </>
            ) : (
              <>
                <Moon size={18} className="text-voxy-primary" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* ===== ACCOUNT SETTINGS ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={22} className="text-red-400" />
          <h3 className="text-lg font-semibold">Account Settings</h3>
        </div>
        <p className="text-sm text-voxy-muted leading-relaxed">
          Manage your account security and data preferences.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 rounded-lg font-semibold text-red-400 border border-red-500/50 hover:bg-red-500/10 transition flex items-center gap-2"
        >
          <Trash2 size={18} /> Delete Account
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
