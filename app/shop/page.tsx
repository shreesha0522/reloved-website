"use client";
import { addToCart } from "@/lib/cart";
import { getAllProducts, Product } from "@/lib/products";
import { useState, useEffect } from "react";
import Link from "next/link";

const shopCategories = [
  { name: "Jewelry Collection", slug: "jewelry",     img: "jewelry",     desc: "Handcrafted rings, earrings & necklaces" },
  { name: "Home Decor",         slug: "home-decor",  img: "home-decor",  desc: "Unique pieces for your living space" },
  { name: "Accessories",        slug: "accessories", img: "accessories", desc: "Bags, belts & everyday essentials" },
  { name: "Candles",            slug: "candles",     img: "candles",     desc: "Hand-poured soy & beeswax candles" },
  { name: "Crochet",            slug: "crochet",     img: "crochet",     desc: "Woven with love, worn with joy" },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-xs text-[#d6a157]">
      {"★".repeat(Math.round(count))}
      {"☆".repeat(5 - Math.round(count))}
    </span>
  );
}

export default function ShopPage() {
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.slice(0, 6));
      setLoading(false);
    }
    load();
  }, []);

async function handleAddToCart(e: React.MouseEvent, product: Product) {
  e.preventDefault();
  e.stopPropagation();
  const result = await addToCart(product._id, 1);
  if (result.success) {
    setJustAdded(product._id);
    setTimeout(() => setJustAdded(null), 1500);
  } else {
    alert(result.message || "Could not add to cart.");
  }
}

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* Hero */}
      <div className="bg-[#FAF3EC] px-4 md:px-16 py-10 md:py-14 text-center">
        <h1 className="font-display text-3xl md:text-5xl text-[#2B2420] mb-3">Our Shop</h1>
        <p className="text-sm md:text-base text-[#8A7F76] max-w-md mx-auto">
          Thoughtfully handcrafted pieces made with love and care.
        </p>
      </div>

      {/* Categories grid */}
      <div className="px-4 md:px-16 py-10">
        <h2 className="font-display text-2xl md:text-3xl text-[#2B2420] mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-14">
          {shopCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group relative rounded-xl overflow-hidden aspect-square block"
            >
              <img
                src={`/images/${cat.img}.png`}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/5" />
              <div className="absolute bottom-0 left-0 p-3 md:p-4 text-white">
                <p className="font-semibold text-sm md:text-base leading-tight">{cat.name}</p>
                <p className="text-xs text-white/80 mt-0.5 hidden md:block">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured products */}
        <h2 className="font-display text-2xl md:text-3xl text-[#2B2420] mb-6">Featured Products</h2>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 md:h-56 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <p className="text-[#8A7F76] text-sm py-10 text-center">No products yet.</p>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product.category}/${product._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 md:h-56 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://picsum.photos/seed/${product._id}/400/400`;
                  }}
                />
                <div className="p-4">
                  <h2 className="font-display text-base md:text-lg text-[#2B2420] mb-1">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-1 mb-2">
                    <Stars count={product.rating} />
                    <span className="text-[#8A7F76] text-xs">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8C4A3A] font-semibold text-sm">
                      Rs {product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      title={justAdded === product._id ? "Added to cart" : "Add to cart"}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${
                        justAdded === product._id
                          ? "bg-[#8C4A3A] border-[#8C4A3A] text-white"
                          : "bg-white border-[#E7DDD4] text-[#8C4A3A] hover:border-[#8C4A3A] hover:bg-[#F6E9E5]"
                      }`}
                    >
                      {justAdded === product._id ? (
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
        )}
      </div>
    </div>
  );
}