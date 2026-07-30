// app/order-success/page.tsx
"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderById, Order } from "@/lib/orders";
import { Check, Truck, Headphones, FileText, Copy } from "lucide-react";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }
    async function load() {
      const data = await getOrderById(orderId!);
      if (!data) {
        router.push("/");
        return;
      }
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [orderId, router]);
  if (loading || !order) return null;
  const firstItem = order.items[0];
  const extraCount = order.items.length - 1;
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  function handleCopyOrderNumber() {
    navigator.clipboard.writeText(order!.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 py-16 flex justify-center">
      <div className="w-full max-w-2xl">
        {/* Success header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-[#D8E0D9] flex items-center justify-center mb-5">
            <div className="w-10 h-10 rounded-full bg-[#4A6B5A] flex items-center justify-center">
              <Check size={20} strokeWidth={3} className="text-white" />
            </div>
          </div>
          <p className="text-xs tracking-[0.15em] text-[#4A6B5A] uppercase font-medium mb-2">
            Order Confirmed
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] leading-tight">
            Thank you for your order
          </h1>
          <p className="text-sm text-[#6B7B76] mt-2 max-w-md">
            We've received your order and we're getting it ready. You'll get a confirmation email shortly.
          </p>
        </div>
        {/* Order summary card */}
        <div className="bg-white rounded-2xl border border-[#D8E0D9] shadow-sm overflow-hidden">
          {/* Order meta strip */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#E8EDE6] border-b border-[#D8E0D9]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6B7B76]">Order</span>
              <span className="text-sm font-medium text-[#1A2E2A]">{order.orderNumber}</span>
              <button
                onClick={handleCopyOrderNumber}
                title="Copy order number"
                className="text-[#6B7B76] hover:text-[#4A6B5A] transition-colors"
              >
                <Copy size={13} strokeWidth={1.75} />
              </button>
              {copied && <span className="text-[11px] text-[#4A6B5A]">Copied</span>}
            </div>
            <span className="text-xs text-[#6B7B76]">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {/* Product preview */}
          <div className="flex items-center gap-5 px-6 py-6">
            <img
              src={firstItem.image}
              alt={firstItem.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-[#D8E0D9]"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-[#1A2E2A] truncate">
                {firstItem.name}{extraCount > 0 ? ` +${extraCount} more` : ""}
              </p>
              <p className="text-xs text-[#6B7B76] mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] tracking-wider text-[#6B7B76] uppercase mb-1">Total</p>
              <p className="font-display text-xl text-[#4A6B5A]">Rs {order.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full border border-[#D8E0D9] hover:border-[#4A6B5A] hover:bg-[#E8EDE6] text-[#1A2E2A] text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {showDetails ? "Hide order details" : "View order details"}
            </button>
            {showDetails && (
              <div className="mt-4 flex flex-col gap-4 pt-4 border-t border-[#D8E0D9]">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border border-[#D8E0D9]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A2E2A]">{item.name}</p>
                      <p className="text-xs text-[#6B7B76]">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm text-[#4A6B5A] font-medium">
                      Rs {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Action cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <button
            onClick={() => router.push(`/track-order?orderId=${order._id}`)}
            className="bg-white hover:bg-[#E8EDE6] border border-[#D8E0D9] hover:border-[#4A6B5A] rounded-xl py-5 flex flex-colitems-center gap-2 transition-colors"
          >
            <Truck size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            <span className="text-xs md:text-sm font-medium text-[#1A2E2A]">Track Delivery</span>
          </button>
          <button className="bg-white hover:bg-[#E8EDE6] border border-[#D8E0D9] hover:border-[#4A6B5A] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <Headphones size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            <span className="text-xs md:text-sm font-medium text-[#1A2E2A]">Need Help?</span>
          </button>
          <button className="bg-white hover:bg-[#E8EDE6] border border-[#D8E0D9] hover:border-[#4A6B5A] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <FileText size={19} strokeWidth={1.75} className="text-[#4A6B5A]" />
            <span className="text-xs md:text-sm font-medium text-[#1A2E2A]">Download Invoice</span>
          </button>
        </div>
        {/* Continue shopping */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/shop")}
            className="text-sm text-[#4A6B5A] hover:underline font-medium"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F2]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}