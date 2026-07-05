// app/account/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { getMyOrders, Order } from "@/lib/orders";

const statusLabels: Record<string, string> = {
  confirmed: "Confirmed",
  packed: "Packed",
  ready_to_ship: "Ready to Ship",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/account/orders");
      return;
    }

    async function load() {
      const data = await getMyOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-10 py-12">
        <p className="text-[#8A7F76] text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] px-10 py-12">
        <h1 className="font-display text-4xl text-[#2B2420] mb-8">My Orders</h1>
        <p className="text-[#8A7F76] text-sm">You haven't placed any orders yet.</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 text-[#8C4A3A] text-sm font-medium hover:underline"
        >
          Start shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-6 md:px-10 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-[#2B2420] mb-8">My Orders</h1>

        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const extraCount = order.items.length - 1;

            return (
              <button
                key={order._id}
                onClick={() => router.push(`/track-order?orderId=${order._id}`)}
                className="bg-white rounded-xl p-5 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
              >
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-display text-base text-[#2B2420]">
                      {firstItem.name}{extraCount > 0 ? ` +${extraCount} more` : ""}
                    </p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-green-50 text-green-700"
                          : order.paymentStatus === "failed"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus === "paid"
                        ? "Paid"
                        : order.paymentStatus === "failed"
                        ? "Payment Failed"
                        : "Payment Pending"}
                    </span>
                  </div>

                  <p className="text-xs text-[#8A7F76] mb-1">
                    Order #{order.orderNumber} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[#8C4A3A] font-medium">Rs {order.total}</span>
                    <span className="text-xs text-[#6b5c52] bg-[#F0E9E2] px-2.5 py-1 rounded-full">
                      {statusLabels[order.orderStatus] || order.orderStatus}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}