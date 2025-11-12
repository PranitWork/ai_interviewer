"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { User, Mail, Pencil, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/Store";
import {  asyncUpdateUser } from "@/app/Store/actions/userActions";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function ProfileSection() {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector(
    (state: RootState) => state.authReducer.user
  );

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const randomSeed = useMemo(
    () => Math.random().toString(36).substring(2, 10),
    []
  );
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/png?seed=${randomSeed}`;



  useEffect(() => {
    if (userProfile) setName(userProfile?.name || "");
  }, [userProfile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    const result = await dispatch(asyncUpdateUser({ name }) as any);
    if (result?.success) {
      toast.success(result.message || "✅ Name updated successfully!");
      setEditMode(false);
    } else {
      toast.error(result.message || "❌ Failed to update name");
    }
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-0"
      >
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1 text-voxy-text">
              Your Profile
            </h2>
            <p className="text-voxy-muted text-sm">
              Manage your personal details & account information.
            </p>
          </div>

          {!editMode ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(true)}
              className="px-5 py-2.5 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Pencil size={16} /> Edit Name
            </motion.button>
          ) : (
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-5 py-2.5 rounded-lg font-semibold text-voxy-text bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Save size={16} /> Save
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(false)}
                className="px-5 py-2.5 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-voxy-text transition flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <X size={16} /> Cancel
              </motion.button>
            </div>
          )}
        </div>

        {/* ===== PROFILE CARD ===== */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 sm:p-8 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-8"
        >
          {/* Avatar + Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative w-28 h-28 rounded-full border-2 border-voxy-primary shadow-md overflow-hidden shrink-0">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-voxy-text break-words">
                {name}
              </h3>
              <p className="text-voxy-muted break-all">
                {userProfile?.email}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
                <User size={14} /> Full Name
              </label>

              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-voxy-text focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none"
                />
              ) : (
                <p className="text-voxy-text break-words">{name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
                <Mail size={14} /> Email
              </label>

              <input
                type="email"
                value={userProfile?.email || ""}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-voxy-muted cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
}
