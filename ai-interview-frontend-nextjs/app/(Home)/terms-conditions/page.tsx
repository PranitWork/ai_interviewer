"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-[var(--color-voxy-bg)] text-[var(--color-voxy-text)] animate-fadeIn">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3 text-[var(--color-voxy-primary)]">
          Terms of Service
        </h1>
        <p className="text-[var(--color-voxy-muted)]">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed text-[var(--color-voxy-text)]">

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            1. Introduction
          </h2>
          <p>
            Welcome to <strong>SwarAI</strong> (referred to as “we”, “our”, or “the Service”). 
            By accessing or using our platform (swarai.vercel.app), you agree to comply with and be bound by these Terms of Service. 
            If you do not agree, you must discontinue using SwarAI.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            2. Description of the Service
          </h2>
          <p>
            SwarAI is an AI-powered SaaS platform providing tools for speech-to-text, 
            text-to-speech, AI assistants, and related automation features.  
            We may update, modify, or discontinue features at any time to enhance performance or user experience.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            3. Eligibility
          </h2>
          <p>
            You must be at least 13 years old to use SwarAI. By using the platform, 
            you confirm you have the legal capacity to enter these Terms.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            4. User Accounts
          </h2>
          <p>
            To access certain features, you may be required to create an account.  
            You agree to:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-[var(--color-voxy-muted)]">
            <li>Provide accurate and complete information</li>
            <li>Maintain the confidentiality of your login credentials</li>
            <li>Be responsible for all activities under your account</li>
          </ul>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            5. Acceptable Use Policy
          </h2>
          <p>You agree not to use SwarAI for:</p>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-[var(--color-voxy-muted)]">
            <li>Illegal activities or harmful actions</li>
            <li>Generating abusive, discriminatory, or harmful content</li>
            <li>Attempting to hack, disrupt, or overload the Service</li>
            <li>Reverse engineering or tampering with the platform</li>
            <li>Automating interactions without permission</li>
          </ul>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            6. Payments & Subscriptions
          </h2>
          <p>
            Certain features of SwarAI may require payments or subscriptions.  
            By upgrading, you authorize us or our payment partners to charge your selected payment method.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            7. AI-Generated Content
          </h2>
          <p>
            SwarAI generates output using AI models.  
            You are responsible for verifying accuracy and ensuring lawful usage of AI outputs.  
            We do not guarantee correctness, factual accuracy, or compliance for generated content.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            8. Intellectual Property
          </h2>
          <p>
            All platform content, features, design, branding, and components belong to SwarAI.  
            You may not copy, distribute, or modify any part of the Service without permission.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            9. Termination
          </h2>
          <p>
            We may suspend or terminate your access if you violate these Terms or misuse the Service.  
            You may stop using the platform anytime.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            10. Limitation of Liability
          </h2>
          <p>
            SwarAI is provided on an “as-is” and “as-available” basis.  
            We are not responsible for:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-1 text-[var(--color-voxy-muted)]">
            <li>Loss of data or inaccurate AI outputs</li>
            <li>Damages caused by reliance on AI-generated content</li>
            <li>Service interruptions or technical issues</li>
          </ul>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            11. Changes to Terms
          </h2>
          <p>
            We may update these Terms at any time.  
            Continued use of the Service means you accept the revised Terms.
          </p>
        </section>

        {/* Section */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--color-voxy-highlight)]">
            12. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, contact us at:
            <br />
            <a href="mailto:support@swarai.vercel.app" className="text-[var(--color-voxy-primary)] underline">
              support@swarai.vercel.app
            </a>
          </p>
        </section>

      </div>

      {/* SPACER */}
      <div className="h-20"></div>
    </div>
  );
}
