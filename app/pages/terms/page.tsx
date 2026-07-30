import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">Terms of Service</h1>
        <p className="text-sm text-[#6B7B76] mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

        <div className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-6 text-sm text-[#4a5a55] leading-relaxed">
          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">1. Overview</h2>
            <p>ReLoved is a marketplace connecting buyers and sellers of pre-loved clothing, furniture, books, accessories, and home goods. By using our site, you agree to these terms.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">2. Accounts</h2>
            <p>You're responsible for maintaining the confidentiality of your account and password. You must provide accurate information when creating an account and registering as a seller.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">3. Listings</h2>
            <p>Sellers must accurately describe the condition, materials, and any defects of items they list. All listings are subject to review and approval before appearing publicly. Since every item is secondhand and one-of-a-kind, once sold, a listing cannot be duplicated or restocked.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">4. Orders and Payment</h2>
            <p>Orders are processed once payment is confirmed through our supported payment provider. Prices are listed in Nepalese Rupees (Rs) and include applicable taxes unless stated otherwise.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">5. Shipping and Delivery</h2>
            <p>Delivery timeframes shown at checkout are estimates. ReLoved is not responsible for delays caused by third-party couriers or circumstances outside our control.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">6. Prohibited Use</h2>
            <p>You may not use ReLoved to list counterfeit, stolen, or illegal items, or to engage in fraudulent transactions. Violating this may result in account suspension.</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-[#1A2E2A] mb-2">7. Changes to These Terms</h2>
            <p>We may update these terms from time to time. Continued use of ReLoved after changes means you accept the updated terms.</p>
          </section>

          <p className="text-xs text-[#6B7B76] pt-4 border-t border-[#D8E0D9]">
            This is a general terms template and not a substitute for legal advice. Consider having a lawyer review this before launch.
          </p>
        </div>
      </div>
    </div>
  );
}