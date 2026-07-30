import Link from "next/link";
import { HelpCircle, Mail, FileText, Shield } from "lucide-react";

const pages = [
  {
    href: "/pages/faq",
    icon: HelpCircle,
    title: "FAQ",
    description: "Answers to common questions about buying, selling, and shipping.",
  },
  {
    href: "/pages/contact",
    icon: Mail,
    title: "Contact Us",
    description: "Reach out by email, phone, or WhatsApp — we're happy to help.",
  },
  {
    href: "/pages/terms",
    icon: FileText,
    title: "Terms of Service",
    description: "The rules for using ReLoved as a buyer or seller.",
  },
  {
    href: "/pages/privacy",
    icon: Shield,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your information.",
  },
];

export default function PagesHub() {
  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12 md:py-16">
      <div className="text-center mb-12 max-w-xl mx-auto">
        <h1 className="font-display text-3xl md:text-5xl text-[#1A2E2A] mb-3">Pages</h1>
        <p className="text-sm md:text-base text-[#6B7B76]">
          Helpful info, policies, and ways to reach us.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
        {pages.map((p) => {
          const Icon = p.icon;
          return (
            <Link
              key={p.href}
              href={p.href}
              className="bg-white rounded-xl p-6 flex gap-4 hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-[#E8EDE6] flex items-center justify-center flex-shrink-0">
                <Icon size={20} strokeWidth={1.75} className="text-[#4A6B5A]" />
              </div>
              <div>
                <h2 className="font-display text-lg text-[#1A2E2A] mb-1">{p.title}</h2>
                <p className="text-sm text-[#6B7B76] leading-relaxed">{p.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}