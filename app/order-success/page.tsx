// app/order-success/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderById, Order } from "@/lib/orders";

export default function OrderSuccessPage() {
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
    <div className="min-h-screen bg-[#FAF8F5] px-6 py-16 flex justify-center">
      <div className="w-full max-w-2xl">

        <div className="bg-[#fbeae3] rounded-2xl px-8 py-12 flex flex-col items-center text-center">

          <div className="w-16 h-16 rounded-full bg-[#fbeae3] border-2 border-[#8C4A3A] flex items-center justify-center mb-6">
            <span className="text-[#8C4A3A] text-2xl">✓</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-[#2B2420] leading-tight mb-8">
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
                <p className="text-[10px] tracking-wider text-[#8A7F76] uppercase mb-1">Product</p>
                <p className="font-display text-lg text-[#8C4A3A]">
                  {firstItem.name}{extraCount > 0 ? ` +${extraCount} more` : ""}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#8A7F76] uppercase mb-1">Order Total</p>
                <p className="font-display text-lg text-[#2B2420]">Rs {order.total}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#8A7F76] uppercase mb-1">Order Date</p>
                <p className="text-sm text-[#2B2420]">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider text-[#8A7F76] uppercase mb-1">Order Number</p>
                <p className="text-sm text-[#2B2420]">{order.orderNumber}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mt-6 bg-[#8C4A3A] hover:bg-[#7a3f31] text-white text-sm font-medium px-8 py-3 rounded-full transition-colors"
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
                    <p className="text-sm font-medium text-[#2B2420]">{item.name}</p>
                    <p className="text-xs text-[#8A7F76]">Qty: {item.qty}</p>
                  </div>
                  <span className="text-sm text-[#8C4A3A] font-medium">Rs {item.price * item.qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => router.push(`/track-order?orderId=${order._id}`)}
            className="bg-[#F0E9E2] hover:bg-[#e8ddd2] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors"
          >
            <span className="text-xl">🚚</span>
            <span className="text-sm font-medium text-[#2B2420]">Track Delivery</span>
          </button>
          <button className="bg-[#F0E9E2] hover:bg-[#e8ddd2] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <span className="text-xl">🎧</span>
            <span className="text-sm font-medium text-[#2B2420]">Need Help?</span>
          </button>
          <button className="bg-[#F0E9E2] hover:bg-[#e8ddd2] rounded-xl py-5 flex flex-col items-center gap-2 transition-colors">
            <span className="text-xl">📄</span>
            <span className="text-sm font-medium text-[#2B2420]">Download Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}