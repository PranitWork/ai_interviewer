"use client";

import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { User, Mail, Pencil, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/Store";
import { asyncgetUser, asyncUpdateUser } from "@/app/Store/actions/userActions";
import { toast } from "react-toastify";

export default function ProfileSection() {
  const dispatch = useDispatch<AppDispatch>();
  const userProfile = useSelector((state: any) => state.userReducer.userProfile);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  const randomSeed = useMemo(() => Math.random().toString(36).substring(2, 10), []);
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/png?seed=${randomSeed}`;

  // Fetch user data
  useEffect(() => {
    dispatch(asyncgetUser());
  }, [dispatch]);

  // Sync Redux data to local state
  useEffect(() => {
    if (userProfile) {
      setName(userProfile?.name || "");
    }
  }, [userProfile]);

  // Handle name change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Save only name
  const handleSave = async () => {
    const result = await dispatch(asyncUpdateUser({ name }) as any);
    console.log(result)
   if (result?.success) {
    toast.success(result.message || "✅ Name updated successfully!");
    setEditMode(false);
  } else {
    toast.error(result.message || "❌ Failed to update name");
  }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 max-w-3xl mx-auto"
    >
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-1">Your Profile</h2>
          <p className="text-voxy-muted text-sm">
            Manage your personal details and account information.
          </p>
        </div>

        {!editMode ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditMode(true)}
            className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center gap-2"
          >
            <Pencil size={16} /> Edit Name
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center gap-2"
            >
              <Save size={16} /> Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditMode(false)}
              className="px-5 py-2.5 rounded-lg font-semibold text-voxy-muted border border-voxy-border hover:text-white transition flex items-center gap-2"
            >
              <X size={16} /> Cancel
            </motion.button>
          </div>
        )}
      </div>

      {/* ===== PROFILE CARD ===== */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-8 rounded-2xl border border-voxy-border bg-voxy-surface/70 backdrop-blur-lg shadow-lg space-y-8"
      >
        {/* Avatar + Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 rounded-full border-2 border-voxy-primary shadow-md overflow-hidden">
            <img src={avatarUrl} alt="Profile Avatar" className="w-full h-full object-cover" />
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{name}</h3>
            <p className="text-voxy-muted">{userProfile.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
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
                className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-white focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none"
              />
            ) : (
              <p className="text-white">{name}</p>
            )}
          </div>

          {/* Email (read-only, not sent to backend) */}
          <div>
            <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={userProfile.email || ""}
              readOnly
              className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-gray-400 cursor-not-allowed opacity-70"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
