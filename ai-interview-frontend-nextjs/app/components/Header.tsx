"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";

const MotionLink = motion(Link);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  /** ✅ Load Theme from LocalStorage */
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (stored === "light") {
      setDarkMode(false);
      document.documentElement.classList.add("light");
    } else if (!stored && prefersDark) {
      setDarkMode(true);
    }
  }, []);

  /** ✅ Theme toggle function */
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");

      if (!newMode) document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");

      return newMode;
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-voxy-surface/80 backdrop-blur-lg border-b border-voxy-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold tracking-wide"
        >
          <Link href="/" className="text-white">
            Swar<span className="text-voxy-primary">AI</span>
          </Link>
        </motion.h1>

        {/* Desktop NAV */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <Link
                href={item.href}
                className="text-voxy-muted hover:text-voxy-primary transition font-medium"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop CTA + Theme */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-voxy-border/40 transition"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-voxy-primary" />
            )}
          </button>

          <MotionLink
            href="/auth/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md transition"
          >
            Get Started
          </MotionLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-voxy-surface border-t border-voxy-border px-6 py-4 space-y-4"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpen(false)}
              >
                <Link
                  href={item.href}
                  className="block text-voxy-muted hover:text-voxy-primary text-lg font-medium"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {/* MOBILE theme + CTA in menu */}
            <div className="flex items-center justify-between pt-4 border-t border-voxy-border">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-voxy-border/40 transition"
                aria-label="Toggle Theme"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-voxy-primary" />
                )}
              </button>

              <MotionLink
                href="/auth/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md transition"
              >
                Get Started
              </MotionLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
