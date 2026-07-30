"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does condition rating work?",
    a: "Every item is listed as Like New, Good, or Fair. Like New means barely used with no visible wear. Good means gently used with minor signs of wear. Fair means noticeably used but still fully functional. Sellers set this rating honestly so you know exactly what to expect.",
  },
  {
    q: "Since everything is secondhand, is each item unique?",
    a: "Yes — every listing on ReLoved is a one-of-a-kind piece. Once an item sells, it's gone, so if something catches your eye, it's worth acting on.",
  },
  {
    q: "How do I pay for my order?",
    a: "We currently support payment via eSewa. You'll be redirected to eSewa's secure checkout to complete your payment after placing an order.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery typically takes 3–5 days from when your order is placed. You can also choose Local Pickup if you're near our partner location.",
  },
  {
    q: "Can I track my order?",
    a: "Yes — once your order is placed, you can track its status anytime from your account under My Orders, or via the tracking link sent in your confirmation email.",
  },
  {
    q: "How do I become a seller?",
    a: "Go to My Account and submit a request to become a seller. Our team reviews each request, and you'll be notified by email once it's approved.",
  },
  {
    q: "What happens after I submit a product listing?",
    a: "Every listing is reviewed by our team before it goes live, to make sure descriptions and photos meet our quality standards. You'll get an email once it's approved or if changes are needed.",
  },
  {
    q: "What if I'm not happy with an item I received?",
    a: "Reach out to our support team within a few days of delivery and we'll help sort it out. Since every item is secondhand and one-of-a-kind, please review photos and condition ratings carefully before purchasing.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-[#6B7B76] mb-10">
          Everything you need to know about shopping and selling on ReLoved.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm md:text-base font-medium text-[#1A2E2A] pr-4">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.75}
                    className={`text-[#6B7B76] flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-[#4a5a55] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}