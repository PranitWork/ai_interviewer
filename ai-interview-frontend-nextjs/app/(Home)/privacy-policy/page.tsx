"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-[var(--color-voxy-bg)] text-[var(--color-voxy-text)] animate-fadeIn">
      <Header/>
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-3 text-[var(--color-voxy-primary)]">
          Privacy Policy
        </h1>
        <p className="text-[var(--color-voxy-muted)]">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed">

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            1. Introduction
          </h2>
          <p>
            At <strong>SwarAI</strong> (“we”, “our”, or “the Platform”), we are committed to protecting your 
            privacy. This Privacy Policy explains how we collect, use, and safeguard your personal data when you 
            access or use our platform (swarai.vercel.app).
          </p>
          <p className="mt-3">
            By using the Service, you agree to the practices described in this Privacy Policy.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold mt-4">a. Personal Information</h3>
          <p className="text-[var(--color-voxy-muted)]">
            When you sign up or interact with the platform, we may collect:
          </p>
          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)]">
            <li>Name</li>
            <li>Email address</li>
            <li>Profile information</li>
            <li>Billing or subscription details (if applicable)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">b. Usage Data</h3>
          <p className="text-[var(--color-voxy-muted)]">
            We automatically collect information like:
          </p>
          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)]">
            <li>IP address</li>
            <li>Device and browser type</li>
            <li>Pages visited</li>
            <li>Time spent on the site</li>
            <li>Interactions with AI tools</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">c. AI Interaction Data</h3>
          <p className="text-[var(--color-voxy-muted)]">
            When using features like speech-to-text, text-to-speech, or AI chat:
          </p>
          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)]">
            <li>Input text or audio you provide</li>
            <li>Generated outputs</li>
            <li>Processing logs for improvement</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6">d. Cookies & Tracking</h3>
          <p className="text-[var(--color-voxy-muted)]">
            We use cookies, analytics tools, and similar technologies for:
          </p>
          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)]">
            <li>User authentication</li>
            <li>Saving preferences</li>
            <li>Improving site performance</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            3. How We Use Your Information
          </h2>
          <p>We use your information to:</p>

          <ul className="list-disc ml-6 mt-3 text-[var(--color-voxy-muted)] space-y-1">
            <li>Provide and improve the SwarAI platform</li>
            <li>Authenticate and manage your account</li>
            <li>Generate AI responses or outputs</li>
            <li>Detect misuse, secure the platform, and prevent fraud</li>
            <li>Communicate updates and important notifications</li>
            <li>Analyze trends and site performance</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            4. How We Handle AI-Generated Data
          </h2>
          <p>
            AI features such as speech recognition, text generation, or voice synthesis may temporarily process 
            your input data. We do <strong>not</strong> sell AI input/output data.  
          </p>
          <p className="mt-3">
            AI processing is done through secure third-party models (such as OpenAI or similar providers),  
            and may follow their respective privacy guidelines.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            5. Sharing of Information
          </h2>
          <p>We may share your information with:</p>

          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)] space-y-1">
            <li><strong>Service providers</strong> (hosting, analytics, AI model providers)</li>
            <li><strong>Payment processors</strong> for premium features</li>
            <li><strong>Legal authorities</strong> if required by law</li>
          </ul>

          <p className="mt-4">
            We do <strong>not</strong> sell your personal information to third parties.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            6. Data Storage & Security
          </h2>
          <p>
            We use strong encryption, access controls, and secure cloud infrastructure to protect your data.  
            However, no system is 100% secure, and you acknowledge this inherent risk.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            7. Your Rights
          </h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc ml-6 mt-2 text-[var(--color-voxy-muted)] space-y-1">
            <li>Access your data</li>
            <li>Request deletion of your account</li>
            <li>Update incorrect information</li>
            <li>Download a copy of your data</li>
            <li>Opt out of analytics cookies</li>
          </ul>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            8. Third-Party Links
          </h2>
          <p>
            SwarAI may contain links to external websites.  
            We are not responsible for the privacy practices of third-party platforms.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            9. Children's Privacy
          </h2>
          <p>
            SwarAI is not intended for children under the age of 13.  
            We do not knowingly collect personal data from minors.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time.  
            Continued use of the Service after updates implies acceptance.
          </p>
        </section>

        {/* SECTION */}
        <section className="bg-[var(--color-voxy-surface)] p-8 rounded-xl border border-[var(--color-voxy-border)] shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-voxy-highlight)] mb-4">
            11. Contact Us
          </h2>
          <p>
            For any privacy-related questions, feel free to reach us at:
            <br />
            <a href="mailto:support@swarai.vercel.app"
               className="text-[var(--color-voxy-primary)] underline">
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
