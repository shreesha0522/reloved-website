// app/components/hero.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const heroImages = [
  { src: "/images/collection1.png", alt: "New collection pottery and ceramics" },
  { src: "/images/collection2.png", alt: "New collection item 2" },
  { src: "/images/collection3.png", alt: "New collection item 3" },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroImages.length);
    }, 4000); // change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#E8EDE6] px-6 md:px-16 py-14 md:py-16 relative">
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-10 items-center">
        <div>
          <span className="inline-block text-[11px] uppercase tracking-wider text-[#6B7B76] border border-[#D8E0D9] rounded-full px-4 py-1.5 mb-4">
            Seasonal Arrivals
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-8">
            NEW Collection
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-[#4A6B5A] hover:bg-[#3A5548] text-white text-sm px-7 py-3.5 rounded-lg transition-colors"
          >
            Shop Now
          </Link>
        </div>

        <div className="relative w-full h-[260px] md:h-[420px] rounded-md overflow-hidden">
          {heroImages.map((img, index) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 w-full h-full object-cover rounded-md transition-opacity duration-700 ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6 md:absolute md:bottom-6 md:left-1/2 md:-translate-x-[30%]">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2 rounded-full transition-all ${
              index === active ? "w-5 bg-[#4A6B5A]" : "w-2 bg-[#4A6B5A]/25"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}