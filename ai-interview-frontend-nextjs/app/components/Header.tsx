"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MotionLink = motion(Link);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

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
            Voxy<span className="text-voxy-primary">AI</span>
          </Link>
        </motion.h1>

        {/* Desktop Navigation */}
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

        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <MotionLink
            href="/auth/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-lg font-medium text-white transition bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md"
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

            <MotionLink
              href="/auth/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(false)}
              className="block text-center px-5 py-2.5 rounded-lg font-medium text-white transition bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md"
            >
              Get Started
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
