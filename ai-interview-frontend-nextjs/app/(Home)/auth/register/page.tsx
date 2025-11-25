"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { asyncSendOtp, asyncVerifyRegister, asyncGoogleLogin } from "@/app/Store/actions/authActions";
import { AppDispatch } from "@/app/Store/Store";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, KeyRound, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "@/app/Store/hook";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
const dispatch = useAppDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(true);


  // 🔹 Step 1: Send OTP
  const handleSendOtp = async (data: any) => {
    setLoading(true);
    const res: any = await dispatch(asyncSendOtp({ email: data.email }));
    setLoading(false);

    if (res.success) {
      toast.success("OTP sent to your email!");
      setOtpSent(true);
      setUserData(data); // store temporarily until OTP verified
    } else {
      toast.error(res.message);
    }
  };

  // 🔹 Step 2: Verify OTP and Register
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");

    setLoading(true);
    const payload = { ...userData, otp };
    const res: any = await dispatch(asyncVerifyRegister(payload));
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  // 🔹 Handle Google Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) return toast.error("Google login failed!");
    const res: any = await dispatch(asyncGoogleLogin(credential));
    if (res.success) {
      toast.success(res.message);
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-voxy-surface/80 border border-voxy-border rounded-2xl shadow-2xl p-8 backdrop-blur-xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-2"
          >
            Create Your <span className="text-voxy-primary">Swar AI</span> Account
          </motion.h1>
          <p className="text-center text-voxy-muted mb-8">
            Join and start experiencing AI-driven interviews.
          </p>

          {!otpSent ? (
            // Step 1: User Details
            <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-voxy-muted">
                  Full Name
                </label>
                <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
                  <User className="w-5 h-5 text-voxy-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent p-3 outline-none text-voxy-text"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: { value: 3, message: "Name must be at least 3 characters" },
                      maxLength: { value: 50, message: "Name is too long" },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="text-voxy-accent text-xs mt-1">{errors.name.message as string}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-voxy-muted">
                  Email Address
                </label>
                <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
                  <Mail className="w-5 h-5 text-voxy-muted mr-2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent p-3 outline-none text-voxy-text"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-voxy-accent text-xs mt-1">{errors.email.message as string}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1 text-voxy-muted">
                  Password
                </label>
                <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition relative">
                  <Lock className="w-5 h-5 text-voxy-muted mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent p-3 outline-none text-voxy-text"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{8,}$/,
                        message:
                          "Password must include uppercase, lowercase, number, and special character",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-voxy-muted hover:text-voxy-primary transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-voxy-accent text-xs mt-1">
                    {errors.password.message as string}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-voxy-border text-voxy-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text hover:opacity-90"
                }`}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
          ) : (
            // Step 2: OTP Verification
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-voxy-muted">
                  Enter OTP
                </label>
                <div className="flex items-center bg-voxy-bg border border-voxy-border rounded-lg px-3 focus-within:border-voxy-primary transition">
                  <KeyRound className="w-5 h-5 text-voxy-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-transparent p-3 outline-none text-voxy-text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                whileHover={!loading ? { scale: 1.03 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
                onClick={handleVerifyOtp}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-voxy-border text-voxy-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-voxy-primary to-voxy-secondary text-voxy-text hover:opacity-90"
                }`}
              >
                {loading ? "Verifying..." : "Verify & Register"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          )}

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-voxy-border" />
            <span className="px-3 text-voxy-muted text-sm">or</span>
            <div className="flex-1 h-px bg-voxy-border" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed!")} />
          </div>

          <p className="text-center text-voxy-muted text-sm mt-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-voxy-primary hover:text-voxy-secondary font-medium transition">
              Log in
            </Link>
          </p>
        </motion.div>
        {showPopup && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-voxy-surface w-full max-w-md p-6 rounded-2xl shadow-xl text-center animate-fadeIn">
      
      <h2 className="text-xl font-semibold mb-2 text-voxy-text">
        Important Notice
      </h2>

      <p className="text-gray-700 dark:text-voxy-muted mb-3">
        <b>SwarAI</b> is currently running in a <b>Beta Version</b>.
      </p>

      <p className="text-gray-700 dark:text-voxy-muted mb-3">
        Since it's hosted on a <b>free server</b>, email-based signup/login is not supported.
      </p>

      <p className="text-gray-700 dark:text-voxy-muted mb-6">
        Please use <b>Google Sign-In</b> to create your account.
      </p>

      <button
        onClick={() => setShowPopup(false)}
        className="bg-gradient-to-r from-voxy-primary to-voxy-secondary text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Continue
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Thank you for the support 🙏
      </p>
    </div>
  </div>
)}

      </main>
      <Footer />
    </>
  );
}
