"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/Store/Store";
import { asynccheckout } from "@/app/Store/actions/checkoutActions";
import { openRazorpayCheckout } from "@/app/lib/razorpayClient";
import Pricing from "@/app/components/Pricing";

const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/app/components/Footer"), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  }),
};

export default function PricingPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const faqs = useMemo(
    () => [
      {
        q: "Can I change my plan later?",
        a: "Absolutely! You can upgrade or downgrade anytime from your dashboard.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes, the free plan lets you experience core features before upgrading.",
      },
      {
        q: "Do you offer enterprise support?",
        a: "Yes! Enterprise clients get dedicated onboarding, AI customization, and 24/7 support.",
      },
    ],
    []
  );

  const handlePayment = async (plan: string) => {
    if (plan === "Free") {
      toast.success("🎉 You’re on the Free plan — start exploring now!");
      return;
    }

    if (plan === "Enterprise") {
      toast.info("💬 Our sales team will contact you shortly!");
      return;
    }

    try {
      toast.info("⚡ Creating checkout session...");
      const result = await dispatch(asynccheckout({ plan }));

      if (result.success) {
        toast.success("✅ Redirecting to Razorpay checkout...");
        await openRazorpayCheckout(plan);
      } else {
        toast.error("❌ Failed to create payment session.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Payment process failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-voxy-bg via-voxy-surface to-voxy-bg text-voxy-text font-sans overflow-hidden">
      <Header />

      {/* Heading */}
      <section className="text-center py-28 px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Pricing <span className="text-voxy-primary">Plans</span>
          </h1>
          <p className="text-voxy-muted text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your AI interview experience.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <Pricing onSelectPlan={handlePayment} />

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto mt-32 px-6">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-10"
        >
          Frequently Asked <span className="text-voxy-primary">Questions</span>
        </motion.h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.15}
              className="bg-voxy-surface/50 border border-voxy-border rounded-xl p-6 hover:border-voxy-primary transition-all shadow-sm hover:shadow-voxy-primary/20"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.q}</h3>
              <p className="text-voxy-muted leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 text-center px-6 mb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-r from-voxy-primary to-voxy-secondary py-16 rounded-2xl max-w-5xl mx-auto shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Power Your Interviews?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Start your free plan today and experience AI-powered interview
            intelligence.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handlePayment("Free")}
            className="px-8 py-4 bg-white text-voxy-primary font-semibold rounded-xl hover:bg-gray-100 transition-all"
          >
            Get Started for Free
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
