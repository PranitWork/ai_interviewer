"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Mail,
  Clock,
  Shield,
  Activity,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asyncLogoutUser } from "@/app/Store/actions/authActions";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function LogoutSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Grab userProfile from Redux
  const userProfile = useSelector((state: any) => state.userReducer.userProfile);

  const user = {
    name: userProfile?.name || "Unknown User",
    email: userProfile?.email || "N/A",
    plan: userProfile?.plan || "Free",
    createdAt: new Date(userProfile?.createdAt).toLocaleDateString(),
    usage: userProfile?.usage || { interviewsConducted: 0, feedbacksGenerated: 0 },
  };

  // ✅ Logout Logic (uses asyncLogoutUser)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await dispatch(asyncLogoutUser());
    if (result?.success) {
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    }
    setIsLoggingOut(false);
    setShowConfirm(false);
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-10 max-w-3xl mx-auto"
      >
        {/* ===== HEADER ===== */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-1 text-voxy-text">Your Account</h2>
          <p className="text-voxy-muted text-sm">
            Review your account details or securely log out from SwarAI.
          </p>
        </div>

        {/* ===== USER CARD ===== */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-8 rounded-2xl border border-voxy-border bg-voxy-surface/80 shadow-[0_0_40px_rgba(99,102,241,0.08)] backdrop-blur-md space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-voxy-primary/5 to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <img
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.name}`}
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-voxy-primary shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold text-voxy-text">{user.name}</h3>
              <p className="text-voxy-muted text-sm flex items-center gap-1">
                <Mail size={14} /> {user.email}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm relative z-10">
            <div className="flex items-center gap-2 text-voxy-muted">
              <Clock size={16} />
              <span>Joined:</span>
              <span className="font-medium text-voxy-text">{user.createdAt}</span>
            </div>

            <div className="flex items-center gap-2 text-voxy-muted">
              <Shield size={16} />
              <span>Plan:</span>
              <span className="font-semibold text-voxy-primary capitalize">
                {user.plan}
              </span>
            </div>
          </div>

          <div className="border-t border-voxy-border pt-4 grid sm:grid-cols-2 gap-3 text-sm text-voxy-muted relative z-10">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-voxy-primary" />
              <span>
                <strong>{user.usage.interviewsConducted}</strong> Interviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-voxy-secondary" />
              <span>
                <strong>{user.usage.feedbacksGenerated}</strong> Feedback Reports
              </span>
            </div>
          </div>
        </motion.div>

        {/* ===== LOGOUT BUTTON ===== */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowConfirm(true)}
          className="px-8 py-3 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-accent shadow-md hover:opacity-90 transition flex items-center gap-2 mx-auto"
        >
          <LogOut size={18} /> Logout
        </motion.button>

        {/* ===== CONFIRMATION MODAL ===== */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-voxy-bg/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-voxy-surface/95 border border-voxy-border rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-voxy-accent/10 to-transparent pointer-events-none" />

                <LogOut className="text-voxy-accent mx-auto mb-3" size={40} />
                <h3 className="text-2xl font-bold mb-2 text-voxy-text">Confirm Logout</h3>
                <p className="text-voxy-muted mb-6 text-sm">
                  Are you sure you want to log out of your SwarAI account?
                </p>

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-6 py-3 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-accent hover:opacity-90 transition flex items-center gap-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <CheckCircle2 className="animate-spin" size={18} /> Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut size={18} /> Confirm
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(false)}
                    disabled={isLoggingOut}
                    className="px-6 py-3 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-voxy-text hover:bg-voxy-border/40 transition flex items-center gap-2"
                  >
                    <X size={18} /> Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ProtectedRoute>
  );
}
