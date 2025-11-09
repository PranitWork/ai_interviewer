"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Briefcase, Pencil, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { asyncgetUser } from "@/app/Store/actions/userActions"; 
import { AppDispatch } from "@/app/Store/Store"; 

export default function ProfileSection() {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); 
  const [profile, setProfile] = useState({

    role: "MERN Full Stack Developer",
   
  });

  const randomSeed = useMemo(() => Math.random().toString(36).substring(2, 10), []);
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/png?seed=${randomSeed}`;

  const userProfile = useSelector((state: any) => state.userReducer.userProfile);
  console.log("user details",userProfile);

  useEffect(() => {
    if (!userProfile) dispatch(asyncgetUser()); // ✅ Prevent unnecessary re-fetch
  }, [dispatch, userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    // TODO: connect with backend API (PUT /api/user/profile)
    console.log("Profile updated:", profile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
            <Pencil size={16} /> Edit Details
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-voxy-primary to-voxy-secondary shadow-md hover:opacity-90 transition flex items-center gap-2"
            >
              <Save size={16} /> Save Changes
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
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 rounded-full border-2 border-voxy-primary shadow-md overflow-hidden">
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-semibold">{userProfile.name}</h3>
            <p className="text-voxy-muted">{profile.role}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {/* Name */}
          <div>
            <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
              <User size={14} /> Full Name
            </label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={userProfile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-white focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none"
              />
            ) : (
              <p className="text-white">{userProfile.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
              <Mail size={14} /> Email
            </label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={userProfile.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-white focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none"
              />
            ) : (
              <p className="text-white">{userProfile.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-voxy-muted mb-2 block flex items-center gap-1">
              <Briefcase size={14} /> Role / Position
            </label>
            {editMode ? (
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-voxy-surface border border-voxy-border text-white focus:ring-2 focus:ring-voxy-primary/70 focus:outline-none"
              />
            ) : (
              <p className="text-white">{profile.role}</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
