"use client";

import Pricing from "@/app/components/Pricing";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { easeOut, motion } from "framer-motion";
import { Crown, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function PlanSection() {

  const user = useSelector((state:any)=> state.authReducer.user)
  console.log("checkout user",user)
const router = useRouter();
  const handleSelectPlan = async (plan: string) => {
  router.push(`/checkout?plan=${plan}`);
};


  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="space-y-10"
      >
        {/* ===== HEADER ===== */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 text-voxy-text">
            Subscription Plans
          </h2>
          <p className="text-voxy-muted text-sm">
            Manage your current plan or upgrade to unlock more features.
          </p>
        </div>

        {/* ===== CURRENT PLAN CARD ===== */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="max-w-2xl mx-auto bg-voxy-surface/80 border border-voxy-border rounded-2xl p-8 backdrop-blur-lg shadow-lg text-center"
        >
          <div className="flex flex-col items-center">
            <Crown
              size={36}
              className={`${
                user.plan === "Premium"
                  ? "text-voxy-accent"
                  : "text-voxy-primary"
              } mb-2`}
            />
            <h3 className="text-2xl font-bold text-voxy-text">
              {user.plan} Plan
            </h3>
            <p className="text-voxy-muted text-sm mt-1">
              You are currently subscribed to the{" "}
              <span className="text-voxy-primary font-medium">
                {user.plan}
              </span>{" "}
              plan.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 text-voxy-muted text-sm">
            <Clock size={16} />
            <span>Next renewal: Dec 1, 2025</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 px-6 py-3 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition"
          >
            Manage Plan
          </motion.button>
        </motion.div>

        <Pricing onSelectPlan={handleSelectPlan} />
      </motion.div>
    </ProtectedRoute>
  );
}
