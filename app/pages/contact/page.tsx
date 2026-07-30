import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/pages"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7B76] hover:text-[#4A6B5A] mb-8 transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={1.75} />
          Back to Pages
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">Contact Us</h1>
        <p className="text-sm text-[#6B7B76] mb-10">
          Have a question about an order, a listing, or anything else? Reach out any way that's convenient.
        </p>

        <div className="flex flex-col gap-3">
          
          <a
            href="mailto:support@reloved.com"
            className="flex items-center gap-4 bg-white hover:bg-[#E8EDE6] rounded-xl px-5 py-4 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-[#E8EDE6] flex items-center justify-center flex-shrink-0">
              <Mail size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A2E2A]">Email us</p>
              <p className="text-xs text-[#6B7B76]">support@reloved.com</p>
            </div>
          </a>

          
          <a
            href="tel:+9779800000000"
            className="flex items-center gap-4 bg-white hover:bg-[#E8EDE6] rounded-xl px-5 py-4 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-[#E8EDE6] flex items-center justify-center flex-shrink-0">
              <Phone size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A2E2A]">Call us</p>
              <p className="text-xs text-[#6B7B76]">+977 980-0000000</p>
            </div>
          </a>

          
          <a
            href="https://wa.me/9779800000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white hover:bg-[#E8EDE6] rounded-xl px-5 py-4 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-[#E8EDE6] flex items-center justify-center flex-shrink-0">
              <MessageCircle size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A2E2A]">WhatsApp</p>
              <p className="text-xs text-[#6B7B76]">Chat with our support team</p>
            </div>
          </a>
        </div>

        <p className="text-xs text-[#6B7B76] mt-8 text-center">
          We typically respond within 24 hours.
        </p>
      </div>
    </div>
  );
}