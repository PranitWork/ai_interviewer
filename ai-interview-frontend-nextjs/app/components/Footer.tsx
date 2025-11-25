"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-32 border-t border-voxy-border/70 bg-voxy-surface/30 backdrop-blur-xl py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-voxy-text tracking-tight">
            Swar <span className="text-voxy-primary">AI</span> 
          </h2>
          <p className="text-voxy-muted mt-3 text-sm leading-relaxed">
            AI that works smarter, faster & better — built for the future.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-voxy-muted text-sm">
            <li><Link href="/about" className="hover:text-voxy-primary transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-voxy-primary transition">Contact Us</Link></li>
            <li><Link href="/features" className="hover:text-voxy-primary transition">Features</Link></li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Legal
          </h3>
          <ul className="space-y-2 text-voxy-muted text-sm">
            <li><Link href="/privacy-policy" className="hover:text-voxy-primary transition">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-voxy-primary transition">Terms & Conditions</Link></li>
            <li><Link href="/refund" className="hover:text-voxy-primary transition">Refund Policy</Link></li>
            <li><Link href="/digital-delivery" className="hover:text-voxy-primary transition">Digital Delivery</Link></li>
          </ul>
        </div>

        

      </div>

      {/* COPYRIGHT */}
     <motion.p
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="mt-12 text-center text-voxy-muted text-sm"
>
  © {new Date().getFullYear()} SwarAI — All Rights Reserved. 
  <br />
  Design & Developed by{" "}
  <a
    href="https://pranitwork.github.io/Portfolio/"
    target="_blank"
    className="text-voxy-primary hover:underline hover:text-white transition"
  >
    Pranit Daphale
  </a>
</motion.p>

    </footer>
  );
};

export default Footer;
