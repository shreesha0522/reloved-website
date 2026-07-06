"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getPendingProducts,
  approveProduct,
  rejectProduct,
  AdminProduct,
} from "@/lib/admin";

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/account");
      return;
    }
    setIsAdmin(true);
    setChecking(false);
  }, [router]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getPendingProducts();
    if (data.success) setProducts(data.products);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin, loadProducts]);

  async function handleApprove(id: string) {
    setUpdatingId(id);
    const result = await approveProduct(id);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      alert(result.message || "Failed to approve product");
    }
    setUpdatingId(null);
  }

  async function handleReject(id: string) {
    setUpdatingId(id);
    const result = await rejectProduct(id, rejectReason);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setRejectingId(null);
      setRejectReason("");
    } else {
      alert(result.message || "Failed to reject product");
    }
    setUpdatingId(null);
  }

  if (checking || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-16 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A]">
          Product Approvals
        </h1>
        <span className="text-sm text-[#6B7B76]">{products.length} pending</span>
      </div>

      {loading ? (
        <p className="text-sm text-[#6B7B76]">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-[#6B7B76]">No products awaiting approval. 🎉</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-5">
                <h4 className="font-display text-lg mb-1">{product.name}</h4>
                <p className="text-xs text-[#6B7B76] mb-1 capitalize">{product.category}</p>
                <p className="text-sm text-[#4A6B5A] font-semibold mb-2">Rs {product.price}</p>
                <p className="text-xs text-[#6B7B76] mb-3">
                  Seller: {product.sellerId?.username} ({product.sellerId?.email})
                </p>
                {product.description && (
                  <p className="text-sm text-[#1A2E2A] mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                {rejectingId === product._id ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      placeholder="Reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="text-sm border border-[#D8E0D9] rounded-lg p-2 w-full resize-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(product._id)}
                        disabled={updatingId === product._id}
                        className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 disabled:opacity-50"
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setRejectReason("");
                        }}
                        className="flex-1 text-xs bg-[#E3E9E1] text-[#4a5a55] rounded-lg py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(product._id)}
                      disabled={updatingId === product._id}
                      className="flex-1 text-xs bg-[#4A6B5A] hover:bg-[#3a5548] text-white rounded-lg py-2.5 disabled:opacity-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(product._id)}
                      disabled={updatingId === product._id}
                      className="flex-1 text-xs text-red-600 border border-red-200 rounded-lg py-2.5 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}