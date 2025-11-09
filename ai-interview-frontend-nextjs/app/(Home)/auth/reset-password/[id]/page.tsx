"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asyncResetPassword } from "@/app/Store/actions/authActions";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const {id}= useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {register, handleSubmit, formState:{errors}} = useForm();
  const router = useRouter();
  if (!id) {
    toast.error("Missing reset token!");
    return;
  }
  const resetPassword = async (data:any)=>{
    const res = await dispatch(asyncResetPassword(id as string, data));
    if(res.success){
      toast.success(res.message || "Password reset successful!");
      router.push("/auth/login");
    }else{
      toast.error(`Password reset failed: ${res.message}`);
    }
  }



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
            Swar<span className="text-voxy-primary">AI</span>
          </Link>
          <p className="text-voxy-muted mt-2 text-sm">
            Enter your new password to secure your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(resetPassword)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-voxy-muted" size={18} />
              <input
                type="password"
                id="password"
                required
                minLength={8}
                
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                placeholder="Enter new password"
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
            Reset Password
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-voxy-muted">
            Back to{" "}
            <Link
              href="/auth/login"
              className="text-voxy-primary hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
