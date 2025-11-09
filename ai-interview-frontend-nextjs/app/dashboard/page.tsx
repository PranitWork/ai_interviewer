"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  MessageSquare,
  FileText,
  ClipboardList,
  Crown,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import AnalyticsSection from "./(sections)/analytics/analyticsSection"; // ✅ import section
import InterviewSection from "./(sections)/interview/interviewSection";
import FeedbackSection from "./(sections)/feedbacks/feedbackSection";
import ReportsSection from "./(sections)/reports/reportsSection";
import PlanSection from "./(sections)/plans/planSection";
import ProfileSection from "./(sections)/profile/profileSection";
import SettingsSection from "./(sections)/settings/settingsSection";
import LogoutSection from "./(sections)/logout/logoutSection";

// Define sections with optional components
const navItems = [
  { name: "Analytics", icon: BarChart3, component: <AnalyticsSection /> },
  { name: "Interview", icon: MessageSquare, component: <InterviewSection/> },
  { name: "Feedbacks", icon: FileText, component: <FeedbackSection/> },
  { name: "Reports", icon: ClipboardList, component: <ReportsSection/> },
  { name: "Plan", icon: Crown, component: <PlanSection/> },
  { name: "Profile", icon: User, component: <ProfileSection/> },
  { name: "Settings", icon: Settings, component: <SettingsSection/> },
  { name: "Logout", icon: LogOut, component: <LogoutSection/> },
];

export default function Dashboard() {
  const [active, setActive] = useState("Analytics");
  const [isOpen, setIsOpen] = useState(false);

  const activeItem = navItems.find((item) => item.name === active);
  const randomSeed = useMemo(() => Math.random().toString(36).substring(2, 9), []);
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/png?seed=${randomSeed}`;
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-black via-voxy-surface to-black text-white overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={clsx(
          "fixed md:static top-0 left-0 z-40 h-full w-64 flex flex-col bg-voxy-surface/90 backdrop-blur-xl border-r border-voxy-border shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="text-center py-8 border-b border-voxy-border">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Swar<span className="text-voxy-primary">AI</span>
          </h1>
          <p className="text-xs text-voxy-muted mt-1">Intelligent Insights</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map(({ name, icon: Icon }) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActive(name);
                setIsOpen(false);
              }}
              className={clsx(
                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active === name
                  ? "bg-gradient-to-r from-voxy-primary/80 to-voxy-secondary/80 text-white shadow-md"
                  : "text-voxy-muted hover:text-white hover:bg-voxy-border/30"
              )}
            >
              <Icon size={18} />
              <span>{name}</span>
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="text-center py-5 border-t border-voxy-border text-xs text-voxy-muted">
          © 2025 SwarAI. All rights reserved.
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 flex flex-col h-screen md:ml-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 border-b border-voxy-border bg-voxy-surface/70 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-voxy-border/30 hover:bg-voxy-border/50 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <h2 className="text-xl font-semibold">{active}</h2>
              <p className="text-voxy-muted text-sm">
                Manage your {active.toLowerCase()} here.
              </p>
            </div>
          </div>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 bg-voxy-surface/60 border border-voxy-border px-4 py-2 rounded-full shadow-inner cursor-pointer hover:bg-voxy-border/40 transition"
          >
            <img
              src={avatarUrl}
              alt="User"
              className="w-8 h-8 rounded-full border border-voxy-primary"
            />
            <span className="text-sm hidden sm:block">Pranit Daphale</span>
          </motion.div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              {activeItem?.component || (
                <div className="text-center text-voxy-muted py-20">
                  Section under development...
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-10"
        />
      )}
    </div>
  );
}
