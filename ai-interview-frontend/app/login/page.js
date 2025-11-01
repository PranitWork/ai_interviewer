"use client";
import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-10 w-[90%] max-w-md border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Log in to continue your AI interview journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 p-3 rounded-lg outline-none transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-100 p-3 rounded-lg outline-none transition-all"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create One
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
