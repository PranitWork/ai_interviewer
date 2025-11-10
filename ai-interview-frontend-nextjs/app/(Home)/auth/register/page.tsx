"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { asyncRegisterUser, asyncGoogleLogin } from "@/app/Store/actions/authActions";
import { AppDispatch } from "@/app/Store/Store";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔹 Handle form submission
  const registerUser = async (data: any) => {
    setLoading(true);
    const response: any = await dispatch(asyncRegisterUser(data));
    setLoading(false);

    if (response.success) {
      toast.success(response.message || "Registration successful!");
      router.push("/dashboard");
    } else {
      toast.error(`Registration failed: ${response.message}`);
    }
  };

  // 🔹 Handle Google Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) return toast.error("Google login failed!");
    const res: any = await dispatch(asyncGoogleLogin(credential));
    if (res.success) {
      toast.success(res.message);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-voxy-surface/80 border border-voxy-border rounded-2xl shadow-2xl shadow-voxy-primary/10 p-8 backdrop-blur-xl"
        >
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-2"
          >
            Create Your <span className="text-voxy-primary">Swar AI</span> Account
          </motion.h1>
          <p className="text-center text-voxy-muted mb-8">
            Join and start experiencing the power of AI-driven interviews.
          </p>

          {/* Register Form */}
          <form onSubmit={handleSubmit(registerUser)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1 text-voxy-muted">
                Full Name
              </label>
              <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
                <User className="w-5 h-5 text-voxy-muted mr-2" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-transparent p-3 outline-none text-voxy-text placeholder-voxy-muted"
                  {...register("name", { required: "Full name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-voxy-accent text-xs mt-1">{errors.name.message as string}</p>
              )}
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
                  placeholder="Enter your email"
                  className="w-full bg-transparent p-3 outline-none text-voxy-text placeholder-voxy-muted"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-voxy-accent text-xs mt-1">{errors.email.message as string}</p>
              )}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-voxy-accent text-xs mt-1">{errors.password.message as string}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/auth/forget-password"
                className="text-sm text-voxy-primary hover:text-voxy-secondary transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-voxy-border text-voxy-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text shadow-md hover:opacity-90"
                }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-voxy-border" />
              <span className="px-3 text-voxy-muted text-sm">or</span>
              <div className="flex-1 h-px bg-voxy-border" />
            </div>

            {/* Google Register */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed!")}
              />
            </div>
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
      <Footer />
    </>
  );
}
