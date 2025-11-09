"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { AppDispatch } from "@/app/Store/Store";
import { asyncLoginUser, asyncGoogleLogin } from "@/app/Store/actions/authActions";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔹 Handle Login Form Submit
  const handleLogin = async (data: any) => {
    setLoading(true);
    const response: any = await dispatch(asyncLoginUser(data));
    setLoading(false);

    if (response.success) {
      toast.success(response.message || "Login successful!");
      router.push("/dashboard");
    } else {
      toast.error(`Login failed: ${response.message}`);
    }
  };

  // 🔹 Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) return toast.error("Google login failed!");

    const res = await dispatch(asyncGoogleLogin(credential));
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
            Welcome Back to <span className="text-voxy-primary">Swar AI</span>
          </motion.h1>
          <p className="text-center text-voxy-muted mb-8">
            Log in to access your AI interview dashboard and insights.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                  {...register("email", {
                    required: "Email is required",
                    
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>
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
                      value: 2,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>
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

            {/* Login Button */}
            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              disabled={loading}
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2
                ${loading
                  ? "bg-voxy-border text-gray-400 cursor-not-allowed"
                  : "bg-voxy-primary hover:bg-voxy-secondary text-white shadow-md hover:shadow-voxy-primary/20"
                }`}
            >
              {loading ? "Logging in..." : "Log In"}
              {!loading && <LogIn className="w-4 h-4" />}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-voxy-border" />
              <span className="px-3 text-voxy-muted text-sm">or</span>
              <div className="flex-1 h-px bg-voxy-border" />
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed!")}
              />
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center text-voxy-muted text-sm mt-8">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-voxy-primary hover:text-voxy-secondary font-medium transition"
            >
              Create one
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
