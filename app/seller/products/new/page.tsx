// app/seller/products/new/page.tsx — only the two grid divs change, rest stays identical
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/products";

export default function NewProductPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [checking, setChecking] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
 const [category, setCategory] = useState("clothing");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("10");
  const [condition, setCondition] = useState("Good");
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

  if (checking) return null;
  if (!isSeller) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name || !price || !category || !image) {
      setError("Name, price, category, and image URL are required.");
      return;
    }

    setSubmitting(true);
const result = await createProduct({
  name,
  price: Number(price),
  category,
  subcategory: subcategory || undefined,
  image,
  description,
  stock: Number(stock),
  condition,
});

    if (result.success) {
      router.push("/seller/dashboard");
    } else {
      setError(result.message || "Could not create product.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-4 md:px-16 py-8 md:py-10">
      <h1 className="font-display text-2xl md:text-4xl text-[#1A2E2A] mb-6 md:mb-8">Add a new product</h1>

      <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Product name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hand-Woven Basket"
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Price (Rs)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="600"
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Category</label>
        <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
>
  <option value="clothing">Clothing</option>
  <option value="furniture">Furniture</option>
  <option value="books">Books</option>
  <option value="accessories">Accessories</option>
  <option value="home-goods">Home Goods</option>
</select>
          </div>
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Subcategory (optional)</label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="Necklaces"
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
  <label className="block text-sm text-[#1A2E2A] mb-1.5">Condition</label>
  <select
    value={condition}
    onChange={(e) => setCondition(e.target.value)}
    className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
  >
    <option value="Like New">Like New</option>
    <option value="Good">Good</option>
    <option value="Fair">Fair</option>
  </select>
</div>
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg border border-[#D8E0D9]" />
          )}
        </div>

        <div>
          <label className="block text-sm text-[#1A2E2A] mb-1.5">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide"
        >
          {submitting ? "Adding..." : "Add product"}
        </button>
      </form>
    </div>
  );
}