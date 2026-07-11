// app/order-success/page.tsx
"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderById, Order } from "@/lib/orders";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 py-16 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="bg-[#fbeae3] rounded-2xl px-8 py-12 flex flex-col items-center text-center">

          <div className="w-16 h-16 rounded-full bg-[#fbeae3] border-2 border-[#4A6B5A] flex items-center justify-center mb-6">
            <span className="text-[#4A6B5A] text-2xl">✓</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] leading-tight mb-8">
            YOUR ORDER IS<br />CONFIRMED
          </h1>

          <div className="bg-white rounded-xl p-5 w-full flex items-center gap-5 text-left">
            <img
              src={firstItem.image}
              alt={firstItem.name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] tracking-wider text-[#6B7B76] uppercase mb-1">Product</p>
                <p className="font-display text-lg text-[#4A6B5A]">
                  {firstItem.name}{extraCount > 0 ? ` +${extraCount} more` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#6B7B76] uppercase mb-1">Order Total</p>
                <p className="font-display text-lg text-[#1A2E2A]">Rs {order.total}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#6B7B76] uppercase mb-1">Order Date</p>
                <p className="text-sm text-[#1A2E2A]">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#6B7B76] uppercase mb-1">Order Number</p>
                <p className="text-sm text-[#1A2E2A]">{order.orderNumber}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-6 bg-[#4A6B5A] hover:bg-[#3a5548] text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>

          {showDetails && (
            <div className="w-full mt-6 bg-white rounded-xl p-5 text-left flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A2E2A]">{item.name}</p>
                    <p className="text-xs text-[#6B7B76]">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm text-[#4A6B5A] font-medium">Rs {item.price * item.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => router.push(`/track-order?orderId=${order._id}`)}
            className="bg-[#E3E9E1] hover:bg-[#d5ded6] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors"
          >
            <span className="text-xl">🚚</span>
            <span className="text-sm font-medium text-[#1A2E2A]">Track Delivery</span>
          </button>
          <button className="bg-[#E3E9E1] hover:bg-[#d5ded6] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <span className="text-xl">🎧</span>
            <span className="text-sm font-medium text-[#1A2E2A]">Need Help?</span>
          </button>
          <button className="bg-[#E3E9E1] hover:bg-[#d5ded6] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <span className="text-xl">📄</span>
            <span className="text-sm font-medium text-[#1A2E2A]">Download Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccessContent />
    </Suspense>
  );
}