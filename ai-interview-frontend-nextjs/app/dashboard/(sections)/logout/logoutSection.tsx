"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Mail, Clock, Shield, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asyncLogoutUser } from "@/app/Store/actions/authActions";

export default function LogoutSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const user = {
    name: "Pranit Daphale",
    email: "pranit@example.com",
    lastLogin: "Nov 6, 2025 - 10:42 AM",
    plan: "Pro",
  };

  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
    dispatch(asyncLogoutUser());
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      setShowConfirm(false);
      router.push("/auth/login"); // redirect to login
    }, 1500);
  };

   
    
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-10 max-w-2xl mx-auto text-center"
    >
      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Logout</h2>
        <p className="text-voxy-muted text-sm">
          You are currently logged in. Review your session details or securely log out.
        </p>
      </div>

      {/* ===== USER CARD ===== */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-8 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg text-left space-y-6"
      >
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-voxy-primary shadow-md"
          />
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-voxy-muted text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-voxy-muted">
            <Clock size={16} />
            <span>Last Login:</span>
            <span className="text-white font-medium">{user.lastLogin}</span>
          </div>

          <div className="flex items-center gap-2 text-voxy-muted">
            <Shield size={16} />
            <span>Active Plan:</span>
            <span className="text-voxy-primary font-medium">{user.plan}</span>
          </div>
        </div>
      </motion.div>

      {/* ===== LOGOUT BUTTON ===== */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowConfirm(true)}
        className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-md hover:opacity-90 transition flex items-center gap-2 mx-auto"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-voxy-surface/90 border border-voxy-border rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <LogOut className="text-red-400 mx-auto mb-3" size={40} />
              <h3 className="text-2xl font-bold mb-2">Confirm Logout</h3>
              <p className="text-voxy-muted mb-6 text-sm">
                Are you sure you want to log out from your SwarAI account?
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition flex items-center gap-2"
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
                  className="px-6 py-3 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-white transition flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
