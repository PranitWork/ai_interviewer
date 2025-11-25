"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export default function PaymentPending() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="h-screen w-full flex flex-col items-center justify-center px-6"
        style={{ background: "var(--color-voxy-bg)", color: "var(--color-voxy-text)" }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-10 max-w-lg w-full border shadow-xl text-center"
          style={{
            background: "var(--color-voxy-surface)",
            borderColor: "var(--color-voxy-border)",
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-5"
            style={{
              background: "rgba(124, 58, 237, 0.15)", // VOXY violet soft
              color: "var(--color-voxy-secondary)",
            }}
          >
            <Clock size={48} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--color-voxy-text)" }}>
            Payment Pending
          </h1>

          {/* Subtitle */}
          <p className="mb-6" style={{ color: "var(--color-voxy-muted)" }}>
            We're processing your payment.  
            If it fails, you will receive a refund within <b>2–3 business days.</b>
          </p>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-lg text-lg font-semibold transition shadow-md"
            style={{
              background: "var(--color-voxy-primary)",
              color: "white",
            }}
          >
            Go to Dashboard
          </motion.button>
        </motion.div>

        {/* Footer text */}
        <p className="text-sm mt-6" style={{ color: "var(--color-voxy-muted)" }}>
          Thank you for choosing <span className="font-semibold">Swar AI</span>
        </p>
      </div>
    </ProtectedRoute>
  );
}
