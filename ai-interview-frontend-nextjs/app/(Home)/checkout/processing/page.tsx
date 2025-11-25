"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/Store/hook";
import { asyncstatus } from "@/app/Store/actions/checkoutActions";
import { motion } from "framer-motion";

export default function ProcessingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state: any) => state.userCheckoutReducer);

  useEffect(() => {
    const interval = setInterval(async () => {
      await dispatch(asyncstatus());

      if (!status) return;

      if (status.status === "active") {
        router.push("/checkout/success");
      } else if (status.status === "pending") {
        router.push("/checkout/pending");
      } else if (status.status === "failed") {
        router.push("/checkout/failed");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, router, dispatch]);

  return (
    <div
      className="h-screen w-full flex items-center justify-center px-6"
      style={{ background: "var(--color-voxy-bg)", color: "var(--color-voxy-text)" }}
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl p-10 max-w-md w-full text-center shadow-xl border"
        style={{
          background: "var(--color-voxy-surface)",
          borderColor: "var(--color-voxy-border)",
        }}
      >
        {/* Loader Animation */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full animate-spin"
            style={{
              border: "4px solid rgba(99, 102, 241, 0.3)",
              borderTopColor: "var(--color-voxy-primary)",
            }}
          ></div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-voxy-text)" }}>
          Processing Payment…
        </h1>

        {/* Message */}
        <p className="text-base" style={{ color: "var(--color-voxy-muted)" }}>
          Please wait while we verify your transaction with our payment gateway.
        </p>

        {/* Subtle Pulsing Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <span
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ background: "var(--color-voxy-primary)" }}
          ></span>
          <span
            className="w-3 h-3 rounded-full animate-pulse delay-150"
            style={{ background: "var(--color-voxy-secondary)" }}
          ></span>
          <span
            className="w-3 h-3 rounded-full animate-pulse delay-300"
            style={{ background: "var(--color-voxy-accent)" }}
          ></span>
        </div>
      </motion.div>
    </div>
  );
}
