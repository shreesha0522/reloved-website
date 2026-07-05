// app/wishlist/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WishlistItem, getWishlist, toggleWishlist } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getWishlist();
      setItems(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleRemove(e: React.MouseEvent, item: WishlistItem) {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(item);
    const updated = await getWishlist();
    setItems(updated);
  }

 async function handleAddToCart(e: React.MouseEvent, item: WishlistItem) {
  e.preventDefault();
  e.stopPropagation();
  const result = await addToCart(item.id, 1);
  if (result.success) {
    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 1500);
  } else {
    alert(result.message || "Could not add to cart.");
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-4 md:px-10 py-8 md:py-12">
        <p className="text-[#8A7F76] text-sm">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-4 md:px-10 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-4xl text-[#2B2420] mb-6 md:mb-8">Your Wishlist</h1>
        <p className="text-[#8A7F76] text-sm">You haven't added anything to your wishlist yet.</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 text-[#8C4A3A] text-sm font-medium hover:underline"
        >
          Browse products →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 md:px-10 py-8 md:py-12">
      <h1 className="font-display text-2xl md:text-4xl text-[#2B2420] mb-6 md:mb-8">Your Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/shop/${item.category}/${item.id}`}
            className="bg-white rounded-xl overflow-hidden block hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-[140px] md:h-[180px] object-cover" />
              <button
                onClick={(e) => handleRemove(e, item)}
                className="absolute top-2 md:top-3 right-2 md:right-3 bg-white/90 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-[#8C4A3A]"
                title="Remove from wishlist"
              >
                ❤️
              </button>
            </div>
<div className="p-3 md:p-4">
              <h4 className="font-display text-sm md:text-lg mb-1 md:mb-1.5 leading-tight">{item.name}</h4>
              <div className="flex items-center justify-between">
                <span className="text-[#8C4A3A] font-semibold text-sm md:text-base">Rs {item.price}</span>
                <button
                  onClick={(e) => handleAddToCart(e, item)}
                  title={justAdded === item.id ? "Added to cart" : "Add to cart"}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${
                    justAdded === item.id
                      ? "bg-[#8C4A3A] border-[#8C4A3A] text-white"
                      : "bg-white border-[#E7DDD4] text-[#8C4A3A] hover:border-[#8C4A3A] hover:bg-[#F6E9E5]"
                  }`}
                >
                  {justAdded === item.id ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}