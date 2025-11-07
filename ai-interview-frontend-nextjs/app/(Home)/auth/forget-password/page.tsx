"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset link sent to:", email);
    // 🔹 You’ll integrate your backend API here later
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-surface via-black to-voxy-surface text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-voxy-surface/70 backdrop-blur-xl border border-voxy-border rounded-2xl shadow-xl p-8"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold">
            Voxy<span className="text-voxy-primary">AI</span>
          </Link>
          <p className="text-voxy-muted mt-2 text-sm">
            Forgot your password? Don’t worry — we’ll help you reset it.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-voxy-muted" size={18} />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent border border-voxy-border text-white placeholder-voxy-muted focus:ring-2 focus:ring-voxy-primary focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 transition shadow-md"
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-voxy-muted">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-voxy-primary hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
