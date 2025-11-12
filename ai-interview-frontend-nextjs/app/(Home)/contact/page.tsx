"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AppDispatch } from "@/app/Store/Store";
import { asyncContact } from "@/app/Store/actions/contactActions";

const Header = dynamic(() => import("@/app/components/Header"));
const Footer = dynamic(() => import("@/app/components/Footer"));

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const dispatch = useDispatch<AppDispatch>();
  const [sent, setSent] = useState(false);

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const contactInfo = useMemo(
    () => [
      { icon: <Mail size={22} />, text: "hello.swarai@gmail.com" },
      { icon: <MapPin size={22} />, text: "New Sangvi, Krishna Chowk, Pune,maharashtra, india" },
    ],
    []
  );

  // ✅ Submit Handler

const onSubmit = async (data: ContactFormValues) => {
  try {
    const actionResult = await dispatch(asyncContact(data));
    // Redux Thunk usually returns its result inside 'payload'
    const result = (actionResult as any)?.payload || actionResult;

    if (result?.success) {
      console.log("Contact form result:", result);
      toast.success(result.message || "✅ Message sent successfully!");
      setSent(true);
      reset();
      setTimeout(() => setSent(false), 4000);
    } else {
      toast.error(result?.message || "❌ Failed to send message.");
    }
  } catch (err) {
    console.error("Contact form error:", err);
    toast.error("⚠️ Something went wrong. Please try again later.");
  }
};


  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header />

      {/* === TITLE === */}
      <section className="text-center pt-32 px-6">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Contact <span className="text-voxy-primary">Us</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="max-w-2xl mx-auto text-voxy-muted text-lg leading-relaxed"
        >
          Have questions about{" "}
          <span className="text-voxy-primary font-medium">SwarAI</span>?  
          We’re here to help you — our team responds quickly.
        </motion.p>
      </section>

      {/* === CONTENT GRID === */}
      <section className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mt-20 px-6 pb-24">
        {/* --- CONTACT FORM --- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-voxy-surface/60 border border-voxy-border rounded-2xl p-8 shadow-lg hover:shadow-voxy-primary/20 transition-all backdrop-blur-md"
        >
          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-voxy-muted mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name too short" },
                  })}
                  className={`w-full p-3 bg-voxy-bg border ${
                    errors.name ? "border-red-500" : "border-voxy-border"
                  } rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition`}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-voxy-muted mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full p-3 bg-voxy-bg border ${
                    errors.email ? "border-red-500" : "border-voxy-border"
                  } rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-voxy-muted mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message too short" },
                  })}
                  className={`w-full p-3 bg-voxy-bg border ${
                    errors.message ? "border-red-500" : "border-voxy-border"
                  } rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition`}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-voxy-primary to-voxy-secondary rounded-lg font-semibold text-voxy-text hover:opacity-90 transition shadow-md hover:shadow-voxy-primary/30 disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center flex flex-col items-center justify-center h-full py-10"
            >
              <CheckCircle2
                size={56}
                className="text-voxy-primary mb-4 animate-bounce"
              />
              <h3 className="text-2xl font-semibold mb-2">
                Message Sent Successfully!
              </h3>
              <p className="text-voxy-muted max-w-sm mx-auto">
                Thank you for reaching out. Our team will get back to you soon.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* --- CONTACT INFO --- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          className="space-y-8 flex flex-col justify-center"
        >
          {contactInfo.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-4 text-voxy-muted hover:text-voxy-text transition"
            >
              <div className="p-4 bg-voxy-surface border border-voxy-border rounded-lg hover:border-voxy-primary transition flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-lg">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
