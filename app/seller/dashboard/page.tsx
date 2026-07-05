// app/seller/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyProducts, deleteProduct, Product } from "@/lib/products";
import { getSellerOrders, SellerOrder } from "@/lib/seller";
import { updateOrderStatus } from "@/lib/orders";

const STATUS_OPTIONS = [
  "confirmed",
  "packed",
  "ready_to_ship",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export default function SellerDashboardPage() {
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "seller") {
      router.push("/account");
      return;
    }
    setIsSeller(true);
    setChecking(false);
    loadProducts();
    loadOrders();
  }, [router]);
  async function loadProducts() {
    const data = await getMyProducts();
    setProducts(data);
    setLoadingProducts(false);
  }
  async function loadOrders() {
    const data = await getSellerOrders();
    setOrders(data);
    setLoadingOrders(false);
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    loadProducts();
  }
  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } else {
      alert(result.message || "Failed to update order status");
    }
    setUpdatingId(null);
  }
  if (checking || !isSeller) return null;
  return (
    <div className="min-h-screen bg-[#FAF8F5] px-6 md:px-16 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl md:text-4xl text-[#2B2420]">Seller Dashboard</h1>
        <Link
          href="/seller/products/new"
          className="bg-[#8C4A3A] hover:bg-[#7a3f31] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          + Add product
        </Link>
      </div>
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("products")}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            tab === "products"
              ? "bg-[#8C4A3A] text-white border-[#8C4A3A]"
              : "bg-white text-[#2B2420] border-[#E7DDD4]"
          }`}
        >
          Your Products ({products.length})
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            tab === "orders"
              ? "bg-[#8C4A3A] text-white border-[#8C4A3A]"
              : "bg-white text-[#2B2420] border-[#E7DDD4]"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>
      {tab === "products" && (
        loadingProducts ? (
          <p className="text-sm text-[#8A7F76]">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[#8A7F76]">You haven't added any products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
             <div key={product._id} className="bg-white rounded-xl overflow-hidden">
  <div className="relative">
    <img src={product.image} alt={product.name} className="w-full h-[180px] object-cover" />
    <span
      className={`absolute top-2 right-2 text-[10px] font-medium px-2.5 py-1 rounded-full capitalize ${
        product.status === "approved"
          ? "bg-green-100 text-green-700"
          : product.status === "rejected"
          ? "bg-red-100 text-red-600"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {product.status || "pending"}
    </span>
  </div>
  <div className="p-4">
    <h4 className="font-display text-base mb-1">{product.name}</h4>
    <p className="text-xs text-[#8A7F76] mb-2 capitalize">{product.category}</p>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[#8C4A3A] font-semibold text-sm">Rs {product.price}</span>
      <span className="text-xs text-[#8A7F76]">Stock: {product.stock}</span>
    </div>
    {product.status === "rejected" && product.rejectionReason && (
      <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-[11px] text-red-600">
          <span className="font-medium">Rejected:</span> {product.rejectionReason}
        </p>
      </div>
    )}
               <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/seller/products/edit/${product._id}`)}
                      className="flex-1 text-xs text-[#8C4A3A] border border-[#E7DDD4] rounded-lg py-2 hover:bg-[#F6E9E5] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 text-xs text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {tab === "orders" && (
        loadingOrders ? (
          <p className="text-sm text-[#8A7F76]">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[#8A7F76]">No orders yet for your products.</p>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-[#2B2420]">Order #{order.orderNumber}</p>
                  <select
                    value={order.orderStatus}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="text-xs bg-[#F0E9E2] text-[#6b5c52] px-2.5 py-1.5 rounded-full capitalize border-none disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-t border-[#F0E9E2]">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm text-[#2B2420]">{item.name}</p>
                      <p className="text-xs text-[#8A7F76]">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm text-[#8C4A3A] font-medium">Rs {item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}