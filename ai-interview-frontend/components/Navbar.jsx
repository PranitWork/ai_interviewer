"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text"
        >
          AI Interview
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <NavLink href="/">Home</NavLink>
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hi, {user.name || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition font-semibold"
              >
                Logout
              </button>
              <img
                src="/avatar.png"
                alt="User"
                className="w-9 h-9 rounded-full border border-gray-200 shadow-sm"
              />
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-sm px-6 py-4 space-y-3"
          >
            <NavLink href="/">Home</NavLink>
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>

            {user ? (
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="text-red-500 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block text-indigo-600 font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ----------- Helper Component -----------
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative group transition text-gray-700 hover:text-indigo-600"
    >
      {children}
      <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-indigo-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  );
}
