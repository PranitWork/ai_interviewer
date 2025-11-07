"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function Register() {
  return (
    <>
     <Header/>
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-6 py-20">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-voxy-surface/70 border border-voxy-border rounded-2xl shadow-lg shadow-voxy-primary/10 p-8 backdrop-blur-md"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-2"
        >
          Create Your <span className="text-voxy-primary">Voxy AI</span> Account
        </motion.h1>
        <p className="text-center text-voxy-muted mb-8">
          Join and start experiencing the power of AI-driven interviews.
        </p>

        {/* Register Form */}
        <form className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-voxy-muted">
              Full Name
            </label>
            <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
              <User className="w-5 h-5 text-voxy-muted mr-2" />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-transparent p-3 outline-none text-voxy-text placeholder-voxy-muted"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-voxy-muted">
              Email Address
            </label>
            <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
              <Mail className="w-5 h-5 text-voxy-muted mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent p-3 outline-none text-voxy-text placeholder-voxy-muted"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-voxy-muted">
              Password
            </label>
            <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
              <Lock className="w-5 h-5 text-voxy-muted mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent p-3 outline-none text-voxy-text placeholder-voxy-muted"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-voxy-primary hover:text-voxy-secondary transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Register Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-voxy-primary hover:bg-voxy-secondary text-white font-semibold rounded-lg transition shadow-md hover:shadow-voxy-primary/20 flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-voxy-border" />
            <span className="px-3 text-voxy-muted text-sm">or</span>
            <div className="flex-1 h-px bg-voxy-border" />
          </div>

          {/* Google Register */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="w-full py-3 border border-voxy-border hover:border-voxy-primary rounded-lg font-medium text-voxy-text bg-voxy-surface/60 transition flex items-center justify-center gap-3"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </motion.button>
        </form>

        {/* Already have account */}
        <p className="text-center text-voxy-muted text-sm mt-8">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-voxy-primary hover:text-voxy-secondary font-medium transition"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
      <Footer/>
    </>
  );
}
