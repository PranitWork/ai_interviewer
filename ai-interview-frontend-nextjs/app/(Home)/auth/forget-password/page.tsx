"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { AppDispatch } from "@/app/Store/Store";
import { asyncForgotPassword } from "@/app/Store/actions/authActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/Store/hook";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const router = useRouter();

  const forgetEmail = async (data: any) => {
    const res = await dispatch(asyncForgotPassword(data.email));
    if (res.success) {
      toast.success(res.message || "Password reset link sent!");
      router.push(`${res.resetUrl}`);
    } else {
      toast.error(res.message || "Failed to send reset link.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-voxy-surface/80 backdrop-blur-xl border border-voxy-border rounded-2xl shadow-2xl p-8"
      >
        {/* === Logo / Title === */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">
            Voxy<span className="text-voxy-primary">AI</span>
          </Link>
          <p className="text-voxy-muted mt-2 text-sm">
            Forgot your password? Don’t worry — we’ll help you reset it.
          </p>
        </div>

        {/* === Form === */}
        <form onSubmit={handleSubmit(forgetEmail)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-voxy-text/80"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-voxy-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent border border-voxy-border text-voxy-text placeholder-voxy-muted focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none transition-all"
              />
              {errors.email && (
                <p className="text-sm text-voxy-accent mt-1">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 shadow-md transition-all"
          >
            Send Reset Link
          </motion.button>
        </form>

        {/* === Back to Login === */}
        <div className="text-center mt-6">
          <p className="text-sm text-voxy-muted">
            Remember your password?{" "}
            <Link
              href="/auth/login"
              className="text-voxy-primary hover:text-voxy-secondary font-medium transition"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
