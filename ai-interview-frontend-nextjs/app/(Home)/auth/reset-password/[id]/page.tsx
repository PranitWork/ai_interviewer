"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asyncResetPassword } from "@/app/Store/actions/authActions";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/Store/hook";

export default function ResetPasswordPage() {
  const { id } = useParams();
const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  // Prevent rendering without token
  useEffect(() => {
    if (!id) {
      toast.error("Invalid or missing reset token!");
      router.push("/auth/forget-password");
    }
  }, [id, router]);

  const resetPassword = async (data: any) => {
    const res = await dispatch(asyncResetPassword(id as string, data));
    if (res.success) {
      toast.success(res.message || "Password reset successful!");
      router.push("/auth/login");
    } else {
      toast.error(res.message || "Password reset failed.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-voxy-surface/80 backdrop-blur-xl border border-voxy-border rounded-2xl shadow-2xl shadow-voxy-primary/10 p-8"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-extrabold tracking-tight">
            Swar<span className="text-voxy-primary">AI</span>
          </Link>
          <p className="text-voxy-muted mt-2 text-sm">
            Enter your new password to secure your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(resetPassword)} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-voxy-text/80"
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-voxy-muted"
                size={18}
                aria-hidden="true"
              />
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-transparent border border-voxy-border text-voxy-text placeholder-voxy-muted focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none transition-all"
              />
              {errors.password && (
                <p className="text-voxy-accent text-xs mt-1">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-secondary hover:opacity-90 transition-all shadow-md"
          >
            Reset Password
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-voxy-muted">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-voxy-primary hover:text-voxy-secondary font-medium transition"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
