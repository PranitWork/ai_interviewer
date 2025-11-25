"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-[var(--color-voxy-bg)] text-[var(--color-voxy-text)] animate-fadeIn">
      <Header/>
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3 text-[var(--color-voxy-primary)]">
          Cancellation & Refund Policy
        </h1>
        <p className="text-[var(--color-voxy-muted)]">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed">

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            1. Overview
          </h2>
          <p>
            At <strong>SwarAI</strong>, we aim to provide high-quality AI services including speech-to-text, text-to-speech,
            AI assistants, and automated productivity tools. This Cancellation & Refund Policy outlines what users can
            expect when making payments or subscription purchases on our platform.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            2. No Refund Policy
          </h2>
          <p>
            All purchases made on <strong>SwarAI</strong>, including subscriptions, credits, or feature unlocks,
            are <strong>non-refundable</strong>.  
          </p>

          <p className="mt-4">
            This includes (but is not limited to):
          </p>

          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)] space-y-1">
            <li>Monthly or yearly subscription fees</li>
            <li>Credits or usage-based purchases</li>
            <li>One-time feature unlock payments</li>
            <li>Any service purchased by mistake</li>
            <li>Partial usage of features or time remaining on a plan</li>
          </ul>

          <p className="mt-4">
            By completing a purchase on SwarAI, you acknowledge and agree that <strong>no refunds will be issued</strong> under any circumstances.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            3. Subscription Cancellation
          </h2>
          <p>
            You may cancel your subscription at any time. However:
          </p>

          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)] space-y-1">
            <li>Your subscription will remain active until the end of the current billing period.</li>
            <li>No refunds will be issued for unused time or unused quota.</li>
            <li>Cancellation prevents future auto-renewal only.</li>
          </ul>

          <p className="mt-4">
            After cancellation, you will retain access to paid features until your billing cycle expires.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            4. Issues with Third-Party Payments
          </h2>
          <p>
            Payments processed through third-party platforms (such as Razorpay, Stripe, or others) fall under their
            respective policies.  
          </p>
          <p className="mt-3">
            However, because SwarAI follows a <strong>No Refund Policy</strong>, third-party payment disputes 
            will not result in refunds from our side.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            5. Misuse or Policy Violation
          </h2>
          <p>
            If your account is suspended or terminated due to violating our Terms of Service, no refund will be issued
            for remaining time, credits, or payments already made.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            6. Contact Us
          </h2>
          <p>
            For questions about cancellations or billing, contact us at:
            <br />
            <a
              href="mailto:support@swarai.vercel.app"
              className="text-[var(--color-voxy-primary)] underline"
            >
              support@swarai.vercel.app
            </a>
          </p>
        </section>

      </div>

      <div className="h-20"></div>
      <Footer/>
    </div>
  );
}
