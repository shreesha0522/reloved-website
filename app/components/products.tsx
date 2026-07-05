"use client";
import { useState, useEffect } from "react";
import { getAllProducts, Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import Link from "next/link";

const filters = ["All", "New Arrivals", "Best Seller", "Top Rated"];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-xs text-[#d6a157]">
      {"★".repeat(Math.round(count))}
      {"☆".repeat(5 - Math.round(count))}
    </span>
  );
}

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

 async function handleAddToCart(e: React.MouseEvent, productId: string) {
  e.preventDefault();
  e.stopPropagation();
  const result = await addToCart(productId, 1);
  if (!result.success) {
    alert(result.message || "Could not add to cart.");
  }
}

  return (
    <section className="bg-[#F6E9E5] px-6 md:px-16 py-16 text-center">
      <h2 className="font-display text-3xl mb-6">Our Trendy Products</h2>

      {/* Filter buttons */}
      <div className="inline-flex flex-wrap justify-center gap-3 mb-10">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-sm rounded-full px-5 py-2.5 border transition-colors ${
              activeFilter === filter
                ? "bg-[#8C4A3A] text-white border-[#8C4A3A]"
                : "bg-white text-[#2B2420] border-[#E7DDD4]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-xl p-3.5 animate-pulse">
              <div className="w-full h-[200px] bg-gray-200 rounded-lg mb-3.5" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* No products */}
      {!loading && products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[#8A7F76] text-lg mb-2">No products yet.</p>
          <p className="text-[#8A7F76] text-sm">Products added by sellers will appear here.</p>
        </div>
      )}

      {/* Products grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/shop/${product.category}/${product._id}`}
              className="bg-white rounded-xl p-3.5 hover:-translate-y-1 hover:shadow-md transition-all block"
            >
              <div className="relative rounded-lg overflow-hidden mb-3.5 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[200px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/product/300/300";
                  }}
                />
              </div>
              <h4 className="text-[15px] mb-1.5 text-[#2B2420] font-medium">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 mb-2">
                <Stars count={product.rating} />
                <span className="text-xs text-[#8A7F76]">({product.reviews})</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[#8C4A3A] font-semibold text-[15px]">
                  Rs {product.price.toLocaleString()}
                </div>
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  className="w-8 h-8 rounded-full border border-[#E7DDD4] flex items-center justify-center text-[#8C4A3A] hover:bg-[#8C4A3A] hover:text-white transition-colors"
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
            </Link>
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <button className="mt-12 border border-[#8C4A3A] text-[#8C4A3A] hover:bg-[#8C4A3A] hover:text-white transition-colors text-sm px-8 py-3 rounded-lg">
          Load More
        </button>
      )}
    </section>
  );
}