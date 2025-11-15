"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  // Sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load theme from system/localStorage
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;

    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    if (stored === "light") {
      setDarkMode(false);
      document.documentElement.classList.add("light");
    } else if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.remove("light");
    } else {
      setDarkMode(!!prefersDark);
      if (!prefersDark) document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");
    }

    const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const systemDark = e.matches;
        setDarkMode(systemDark);
        if (!systemDark) document.documentElement.classList.add("light");
        else document.documentElement.classList.remove("light");
      }
    };

    mm?.addEventListener("change", onChange);
    return () => mm?.removeEventListener("change", onChange);
  }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      if (!newMode) document.documentElement.classList.add("light");
      else document.documentElement.classList.remove("light");
      return newMode;
    });
  }, []);

  // Close menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  // ESC key closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // ✅ Fixed cleanup function (must return void)
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-voxy-surface/90 backdrop-blur-lg border-b border-voxy-border shadow-md py-3"
          : "bg-voxy-surface/70 backdrop-blur-sm border-b border-transparent py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 transition-all duration-300">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold tracking-wide"
        >
          <Link href="/" className="text-voxy-text">
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

          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="md:hidden text-voxy-text focus:outline-none"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
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
            transition={{ duration: 0.22 }}
            className="md:hidden bg-voxy-surface border-t border-voxy-border px-6 py-4 space-y-4"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
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

            <div className="flex items-center justify-between pt-4 border-t border-voxy-border">
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

              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md transition"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
