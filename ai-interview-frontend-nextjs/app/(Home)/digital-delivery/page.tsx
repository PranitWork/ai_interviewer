"use client";

export default function DigitalDeliveryPolicy() {
  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-[var(--color-voxy-bg)] text-[var(--color-voxy-text)] animate-fadeIn">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3 text-[var(--color-voxy-primary)]">
          Digital Delivery Policy
        </h1>
        <p className="text-[var(--color-voxy-muted)]">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed">

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            1. Overview
          </h2>
          <p>
            <strong>SwarAI</strong> is a fully digital AI SaaS platform that provides services such as
            speech-to-text, text-to-speech, AI automation, and productivity tools.  
            Since all products and features are delivered digitally, no physical shipping is involved.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            2. Instant Digital Access
          </h2>
          <p>
            Upon successful payment or subscription activation:
          </p>

          <ul className="list-disc ml-6 mt-3 text-[var(--color-voxy-muted)] space-y-1">
            <li>All features are delivered instantly through the website dashboard.</li>
            <li>No waiting time or physical delivery is required.</li>
            <li>Access to AI tools is available immediately after login.</li>
          </ul>

          <p className="mt-4">
            Users are responsible for ensuring correct email address and login credentials for uninterrupted access.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            3. Delivery Confirmation
          </h2>
          <p>
            Because SwarAI delivers digital services, the service is considered “delivered” when:
          </p>

          <ul className="list-disc ml-6 mt-3 text-[var(--color-voxy-muted)] space-y-1">
            <li>You gain access to your dashboard or purchased tools.</li>
            <li>You receive an email confirmation of your login or subscription.</li>
            <li>Your usage quota or subscription limits become active.</li>
          </ul>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            4. No Physical Items or Shipping
          </h2>
          <p>
            SwarAI does <strong>not</strong> sell or deliver any physical goods.  
            Therefore:
          </p>
          <ul className="list-disc ml-6 mt-3 text-[var(--color-voxy-muted)] space-y-1">
            <li>No shipping charges</li>
            <li>No delivery timelines</li>
            <li>No courier tracking or logistics</li>
          </ul>
          <p className="mt-4">
            All services remain accessible exclusively through your online account.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            5. Service Availability
          </h2>
          <p>
            SwarAI’s digital services are available globally unless restricted by platform policies or local regulations.
            Users are responsible for ensuring internet connectivity and device compatibility.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-xl">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            6. Customer Support
          </h2>
          <p>
            If you experience any issues accessing your digital services or features, you may contact:
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
    </div>
  );
}
