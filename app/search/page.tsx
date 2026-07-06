// app/search/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllProducts, Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function search() {
      setLoading(true);
      const all = await getAllProducts();
      const filtered = all.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }
    if (query) search();
    else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

 async function handleAddToCart(e: React.MouseEvent, productId: string) {
  e.stopPropagation();
  const result = await addToCart(productId, 1);
  if (!result.success) {
    alert(result.message || "Could not add to cart.");
  }
}

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">
        Search results for "{query}"
      </h1>
      <p className="text-sm text-[#6B7B76] mb-8">
        {loading ? "Searching..." : `${results.length} result${results.length !== 1 ? "s" : ""} found`}
      </p>

      {!loading && results.length === 0 && (
        <p className="text-sm text-[#6B7B76]">
          No products matched "{query}". Try a different search term.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {results.map((product) => (
          <div
            key={product._id}
            onClick={() => router.push(`/shop/${product.category}/${product._id}`)}
            className="bg-white rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[180px] object-cover"
            />
            <div className="p-4">
              <h4 className="font-display text-base mb-1">{product.name}</h4>
              <p className="text-xs text-[#6B7B76] mb-2 capitalize">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#4A6B5A] font-semibold text-sm">Rs {product.price}</span>
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  className="w-8 h-8 rounded-full border border-[#D8E0D9] flex items-center justify-center text-[#4A6B5A] hover:bg-[#4A6B5A] hover:text-white transition-colors"
                  title="Add to cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}