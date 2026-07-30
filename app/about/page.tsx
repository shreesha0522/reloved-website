// app/about/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Tag, Users, Leaf } from "lucide-react";
import { getAllProducts } from "@/lib/products";

const values = [
  {
    icon: ShieldCheck,
    title: "Reviewed & Approved",
    description: "Every listing is checked before it goes live, so you always know what you're buying.",
  },
  {
    icon: Tag,
    title: "Clear Condition Ratings",
    description: "Like New, Good, or Fair — no surprises, no guesswork.",
  },
  {
    icon: Users,
    title: "A Community That Cares",
    description: "Our sellers list items they've genuinely loved and want to see used again.",
  },
  {
    icon: Leaf,
    title: "Better for the Planet",
    description: "Every purchase here is one less item in a landfill, and one more with a story.",
  },
];

export default function AboutPage() {
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [sellerCount, setSellerCount] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const products = await getAllProducts();

      setItemCount(products.length);

      const uniqueSellers = new Set(products.map((p) => p.sellerId));
      setSellerCount(uniqueSellers.size);

      const rated = products.filter((p) => p.reviews > 0);
      if (rated.length > 0) {
        const avg = rated.reduce((sum, p) => sum + p.rating, 0) / rated.length;
        setAvgRating(Math.round(avg * 10) / 10);
      }
    }
    loadStats();
  }, []);

  const stats = [
    { value: itemCount !== null ? `${itemCount}+` : "—", label: "Items rehomed" },
    { value: sellerCount !== null ? `${sellerCount}+` : "—", label: "Trusted sellers" },
    { value: "5", label: "Categories" },
    { value: avgRating !== null ? `${avgRating}★` : "New", label: "Average rating" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F2]">

      {/* Hero */}
      <section className="px-4 md:px-16 py-14 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-wider text-[#6B7B76] border border-[#D8E0D9] rounded-full px-4 py-1.5 mb-5">
              Our Story
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-[#1A2E2A] leading-tight mb-6">
              The best things don't need to be new
            </h1>
            <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed mb-4">
              They just need to find the right home. Every item in our shop has already
              lived a life — a jacket that kept someone warm, a chair that held countless
              conversations, a book that was read late into the night. We believe those
              stories are worth continuing.
            </p>
            <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed">
              ReLoved is a community marketplace for pre-loved clothing, furniture, books,
              accessories, and home goods — built for sellers who care where their things
              end up, and buyers who want something with character.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden">
            <img
              src="/images/collection1.png"
              alt="A curated selection of pre-loved items"
              className="w-full h-[280px] md:h-[380px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 md:px-16 pb-14 md:pb-20">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl px-6 md:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl text-[#4A6B5A] mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-[#6B7B76]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 md:px-16 pb-14 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl text-[#1A2E2A] mb-4">
            Why secondhand matters
          </h2>
          <p className="text-sm md:text-base text-[#4A5A55] leading-relaxed">
            Buying secondhand isn't just about saving money — it's about giving good
            things a second story instead of letting them go to waste. We built ReLoved
            to make that easy, trustworthy, and something you'd actually want to do again.
          </p>
        </div>
      </section>

      {/* Values grid */}
      <section className="px-4 md:px-16 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-[#1A2E2A] mb-8 text-center">
            Why shop with ReLoved
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-xl p-6 flex gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E8EDE6] flex items-center justify-center flex-shrink-0">
                    <Icon size={20} strokeWidth={1.75} className="text-[#4A6B5A]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-[#1A2E2A] mb-1">{v.title}</h3>
                    <p className="text-sm text-[#4A5A55] leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-16 pb-20 md:pb-28 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-[#1A2E2A] mb-4">
          Ready to find something with a story?
        </h2>
        <Link
          href="/shop"
          className="inline-block bg-[#4A6B5A] hover:bg-[#3A5548] text-white text-sm px-8 py-3.5 rounded-lg transition-colors"
        >
          Browse the Shop
        </Link>
      </section>
    </div>
  );
}