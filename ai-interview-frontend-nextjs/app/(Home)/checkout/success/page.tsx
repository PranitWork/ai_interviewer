"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div
        className="h-screen flex flex-col items-center justify-center px-6"
        style={{
          background: "var(--color-voxy-bg)",
          color: "var(--color-voxy-text)",
        }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-10 max-w-lg w-full text-center shadow-xl border"
          style={{
            background: "var(--color-voxy-surface)",
            borderColor: "var(--color-voxy-border)",
          }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 10 }}
            className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: "rgba(34,197,94,0.15)", // soft green glow
              color: "rgb(34,197,94)", // green-500 equivalent
            }}
          >
            <CheckCircle2 size={70} />
          </motion.div>

          {/* Title */}
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--color-voxy-text)" }}
          >
            Payment Successful 🎉
          </h1>

          {/* Message */}
          <p
            className="text-base mb-6"
            style={{ color: "var(--color-voxy-muted)" }}
          >
            Your payment has been verified. Your subscription is now active!
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

        {/* Footer */}
        <p
          className="text-sm mt-6"
          style={{ color: "var(--color-voxy-muted)" }}
        >
          Welcome to <span className="font-semibold">Swar AI</span> — Enjoy premium features!
        </p>
      </div>
    </ProtectedRoute>
  );
}
