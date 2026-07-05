// app/seller/products/edit/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/products";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isSeller, setIsSeller] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("jewelry");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("10");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "seller") {
      router.push("/account");
      return;
    }
    setIsSeller(true);
    setChecking(false);
  }, [router]);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      const product = await getProductById(productId);
      if (!product) {
        setNotFound(true);
        setLoadingProduct(false);
        return;
      }
      setName(product.name);
      setPrice(String(product.price));
      setCategory(product.category);
      setSubcategory(product.subcategory || "");
      setImage(product.image);
      setDescription(product.description || "");
      setStock(String(product.stock));
      setLoadingProduct(false);
    }
    loadProduct();
  }, [productId]);

  if (checking || loadingProduct) return null;
  if (!isSeller) return null;

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-4 md:px-16 py-8 md:py-10">
        <h1 className="font-display text-2xl md:text-4xl text-[#2B2420] mb-4">Product not found</h1>
        <button
          onClick={() => router.push("/seller/dashboard")}
          className="text-[#8C4A3A] text-sm font-medium hover:underline"
        >
          ← Back to dashboard
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price || !category || !image) {
      setError("Name, price, category, and image URL are required.");
      return;
    }

    setSubmitting(true);
    const result = await updateProduct(productId, {
      name,
      price: Number(price),
      category,
      subcategory: subcategory || undefined,
      image,
      description,
      stock: Number(stock),
    });

    if (result.success) {
      router.push("/seller/dashboard");
    } else {
      setError(result.message || "Could not update product.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 md:px-16 py-8 md:py-10">
      <h1 className="font-display text-2xl md:text-4xl text-[#2B2420] mb-6 md:mb-8">Edit product</h1>

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-[#2B2420] mb-1.5">Product name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hand-Woven Basket"
            className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#2B2420] mb-1.5">Price (Rs)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="600"
              className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-[#2B2420] mb-1.5">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#2B2420] mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
            >
              <option value="jewelry">Jewelry</option>
              <option value="home-decor">Home Decor</option>
              <option value="accessories">Accessories</option>
              <option value="candles">Candles</option>
              <option value="crochet">Crochet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#2B2420] mb-1.5">Subcategory (optional)</label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="Necklaces"
              className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#2B2420] mb-1.5">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border border-[#E7DDD4]" />
          )}
        </div>

        <div>
          <label className="block text-sm text-[#2B2420] mb-1.5">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-[#E7DDD4] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#8C4A3A] hover:bg-[#7a3f31] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/seller/dashboard")}
            className="px-6 border border-[#E7DDD4] text-[#2B2420] rounded-lg text-sm hover:bg-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}