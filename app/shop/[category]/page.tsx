"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAllProducts, Product } from "@/lib/products";
import { addToCart } from "@/lib/cart";

const categoryTitles: Record<string, string> = {
  "clothing":   "Clothing",
  "furniture":  "Furniture",
  "books":      "Books",
  "accessories":"Accessories",
  "home-goods": "Home Goods",
};
const categoryFilters: Record<string, string[]> = {
  "clothing":   ["All Items", "Tops", "Bottoms", "Dresses"],
  "furniture":  ["All Items", "Chairs", "Tables", "Storage"],
  "books":      ["All Items", "Fiction", "Non-Fiction", "Children's"],
  "accessories":["All Items", "Bags", "Scarves"],
  "home-goods": ["All Items", "Kitchenware", "Decor", "Textiles"],
};
function Stars({ count }: { count: number }) {
  return (
    <span className="text-xs text-[#b8935a]">
      {"★".repeat(Math.round(count))}
      {"☆".repeat(5 - Math.round(count))}
    </span>
  );
}
export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const [products, setProducts]       = useState<Product[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Items");
  const [justAdded, setJustAdded]     = useState<string | null>(null);
  const title   = categoryTitles[slug]  || slug;
  const filters = categoryFilters[slug] || ["All Items"];
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await getAllProducts(slug);
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [slug]);
  const filtered = activeFilter === "All Items"
    ? products
    : products.filter((p) => p.subcategory === activeFilter);

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
    <section className="bg-[#E8EDE6] min-h-screen">
      {/* Header */}
      <div className="px-4 md:px-16 py-8 md:py-12 text-center border-b border-[#D8E0D9]">
        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-2">{title}</h1>
        <p className="text-sm text-[#6B7B76]">Pre-loved pieces, ready for their next chapter.</p>
      </div>
      <div className="px-4 md:px-16 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-xs md:text-sm rounded-full px-4 py-1.5 border transition-colors ${
                  activeFilter === f
                    ? "bg-[#4A6B5A] text-white border-[#4A6B5A]"
                    : "bg-white text-[#1A2E2A] border-[#D8E0D9] hover:border-[#4A6B5A]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-xs md:text-sm text-[#6B7B76]">
            Sort by: <span className="text-[#1A2E2A] font-medium">Newest First</span>
          </div>
        </div>
        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map((n) => (
              <div key={n} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-[180px] bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* No products */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[#6B7B76] text-lg mb-2">No products found.</p>
            <p className="text-[#6B7B76] text-sm">
              {products.length === 0
                ? "No products in this category yet."
                : "No products match this filter."}
            </p>
          </div>
        )}
        {/* Products grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${slug}/${product._id}`}
                className="bg-white rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all block"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[150px] md:h-[200px] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://picsum.photos/seed/${product._id}/300/300`;
                    }}
                  />
                </div>
               <div className="p-3">
  <h4 className="text-sm md:text-base font-medium mb-1 text-[#1A2E2A] leading-tight">
    {product.name}
  </h4>
  <div className="flex items-center gap-2 mb-2 flex-wrap">
    <div className="flex items-center gap-1">
      <Stars count={product.rating} />
      <span className="text-[#6B7B76] text-xs">({product.reviews})</span>
    </div>
    {product.condition && (
      <span className="text-[10px] font-medium text-[#4A6B5A] bg-[#E8EDE6] px-2 py-0.5 rounded-full">
        {product.condition}
      </span>
    )}
  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4A6B5A] font-semibold text-sm">
                      Rs {product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      title={justAdded === product._id ? "Added to cart" : "Add to cart"}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 ${
                        justAdded === product._id
                          ? "bg-[#4A6B5A] border-[#4A6B5A] text-white"
                          : "bg-white border-[#D8E0D9] text-[#4A6B5A] hover:border-[#4A6B5A] hover:bg-[#E8EDE6]"
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
    </section>
  );
}