import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/pages"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7B76] hover:text-[#4A6B5A] mb-8 transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to Pages
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#6B7B76] mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-6 text-sm text-[#4a5a55] leading-relaxed">
          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">1. Information We Collect</h2>
            <p>When you create an account, we collect your username, email address, and password. When you place an order, we collect your shipping address and phone number to fulfill delivery.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">2. How We Use Your Information</h2>
            <p>We use your information to process orders, send order confirmations and updates, manage your account, and communicate with you about your listings if you're a seller.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">3. Payment Information</h2>
            <p>Payments are processed securely through our payment provider, eSewa. We do not store your payment card or account credentials on our servers.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">4. Sharing Your Information</h2>
            <p>We do not sell your personal information. Your shipping details are shared with sellers only as needed to fulfill an order.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">5. Data Security</h2>
            <p>We take reasonable measures to protect your information, including encrypting passwords. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">6. Your Choices</h2>
            <p>You can update or delete your account information at any time from My Account. Contact us if you'd like your data removed entirely.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">7. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We'll note the date of the most recent update at the top of this page.</p>
          </section>

          <p className="text-xs text-[#6B7B76] pt-4 border-t border-[#D8E0D9]">
            This is a general privacy policy template and not a substitute for legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}