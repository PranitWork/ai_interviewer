"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

// ✅ Lazy-load for performance
const Header = dynamic(() => import("@/app/components/Header"));
const Footer = dynamic(() => import("@/app/components/Footer"));

// ✅ Shared Motion Variants
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function Contact() {
  const [sent, setSent] = useState(false);

  // ✅ Memoized contact info
  const contactInfo = useMemo(
    () => [
      { icon: <Mail size={22} />, text: "support@SwarAI.com" },
      { icon: <Phone size={22} />, text: "+91 98765 43210" },
      { icon: <MapPin size={22} />, text: "New Sangvi, Krishna Chowk, Pune" },
    ],
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("✅ Message sent successfully!");
    setTimeout(() => setSent(false), 4000);
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-voxy-muted mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
                  placeholder="Your Name"
                />
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
                  name="email"
                  required
                  className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
                  placeholder="you@example.com"
                />
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
                  name="message"
                  rows={5}
                  required
                  className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
                  placeholder="Your message..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-voxy-primary to-voxy-secondary rounded-lg font-semibold text-voxy-text hover:opacity-90 transition shadow-md hover:shadow-voxy-primary/30"
              >
                Send Message
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
