"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text py-24 px-6">
     <Header/>
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-center mb-8"
      >
        Contact <span className="text-voxy-primary">Us</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto text-center text-voxy-muted text-lg"
      >
        Have questions about Voxy AI? We're here to help. Reach out anytime.
      </motion.p>

      {/* Form + Info */}
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mt-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-voxy-surface/60 border border-voxy-border rounded-xl p-8 shadow-lg hover:shadow-voxy-primary/20 transition"
        >
          <form className="space-y-4">
            <input
              className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
              placeholder="Your Name"
            />
            <input
              type="email"
              className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
              placeholder="Your Email"
            />
            <textarea
              rows={5}
              className="w-full p-3 bg-voxy-bg border border-voxy-border rounded-lg text-voxy-text placeholder-voxy-muted focus:border-voxy-primary outline-none transition"
              placeholder="Message"
            ></textarea>
            <button className="w-full py-3 bg-voxy-primary hover:bg-voxy-secondary rounded-lg font-semibold text-white transition shadow-md hover:shadow-voxy-primary/20">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {[
            { icon: <Mail />, text: "support@voxyai.com" },
            { icon: <Phone />, text: "+1 (555) 123-4567" },
            { icon: <MapPin />, text: "New Sangvi Krishna Chowk, Pune" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-voxy-muted hover:text-voxy-text transition"
            >
              <div className="p-4 bg-voxy-surface rounded-lg border border-voxy-border hover:border-voxy-primary transition">
                {item.icon}
              </div>
              <span className="text-lg">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
      <Footer/>
    </main>
  );
}
