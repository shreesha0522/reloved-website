// app/track-order/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderById, Order } from "@/lib/orders";

const stepOrder = ["confirmed", "packed", "ready", "transit", "out", "delivered"];

const stepMeta: Record<string, { title: string; description: string }> = {
  confirmed:  { title: "Seller to Packed",   description: "Order confirmed and processed" },
  packed:     { title: "Packed",             description: "Item has been securely packed at the warehouse" },
  ready:      { title: "Ready To Ship",      description: "Handed over to our delivery partner" },
  transit:    { title: "In Transit",         description: "Moving through our distribution centers" },
  out:        { title: "Out For Delivery",   description: "Your courier is heading to your neighborhood" },
  delivered:  { title: "Delivered",          description: "Package delivered" },
};

// Maps whatever your order.status values are to a step key.
// Adjust the left-hand strings below to match the real status values from your backend.
function statusToStepKey(status: string): string {
  switch (status) {
    case "confirmed":
      return "confirmed";
    case "packed":
      return "packed";
    case "ready_to_ship":
      return "ready";
    case "in_transit":
      return "transit";
    case "out_for_delivery":
      return "out";
    case "delivered":
      return "delivered";
    default:
      return "confirmed";
  }
}

function buildTrackingSteps(status: string) {
  const currentIndex = stepOrder.indexOf(statusToStepKey(status));
  return stepOrder.map((key, index) => ({
    key,
    ...stepMeta[key],
    done: index <= currentIndex,
    highlight: index === currentIndex,
  }));
}

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
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


const trackingSteps = buildTrackingSteps(order.orderStatus);
const firstItem = order.items[0];
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-10 py-12">
      <h1 className="font-display text-4xl text-[#2B2420] mb-2">Track Order</h1>
      <p className="text-sm text-[#8A7F76] mb-10">
        Order #{order.orderNumber} • Placed on {orderDate}
      </p>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl">

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Current status card */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#f5e2d8] flex items-center justify-center text-lg">
                  📦
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8C4A3A] font-medium">
                    Current Status
                  </p>
                 <p className="font-display text-xl text-[#2B2420]">
  {trackingSteps.find((s) => s.highlight)?.title || "Processing"}
</p>
                </div>
              </div>
              <span className="bg-[#F0E9E2] text-xs text-[#6b5c52] px-3 py-2 rounded-lg text-right">
                Expected Delivery<br />
                <span className="font-medium text-[#2B2420]">15 May – 16 May</span>
              </span>
            </div>

            <div className="h-px bg-[#E7DDD4] mb-6" />

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-[#2B2420] font-medium mb-1.5">
                  📍 Delivery Address
                </p>
                <p className="text-[#6b5c52]">{order.shippingAddress?.name}</p>
                <p className="text-[#6b5c52]">{order.shippingAddress?.address}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[#2B2420] font-medium mb-1.5">
                  🚚 Shipping Method
                </p>
                <p className="text-[#6b5c52]">
                  {order.deliveryOption === "standard" ? "NP-DEX: Standard Delivery" : "Local Pickup"}
                </p>
              </div>
            </div>
          </div>

          {/* Journey timeline */}
          <div className="bg-white/60 rounded-xl p-6">
            <h2 className="font-display text-xl text-[#2B2420] mb-6">Journey of Your Parcel</h2>

            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[#E7DDD4]" />

              <div className="flex flex-col gap-7">
                {[...trackingSteps].reverse().map((step) => (
                  <div key={step.key} className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                        step.done
                          ? "bg-[#8C4A3A] border-[#8C4A3A]"
                          : "bg-white border-[#E7DDD4]"
                      }`}
                    />
                    {step.highlight ? (
                      <div className="bg-[#F0E9E2] rounded-lg p-4">
                        <p className="text-sm font-medium text-[#8C4A3A] mb-1">{step.title}</p>
                        <p className="text-sm text-[#2B2420] mb-1">{step.description}</p>
                        <p className="text-xs text-[#8A7F76]">Today, 10:45 AM</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm font-medium ${step.done ? "text-[#2B2420]" : "text-[#8A7F76]"}`}>
                          {step.title}
                        </p>
                        <p className={`text-sm ${step.done ? "text-[#6b5c52]" : "text-[#8A7F76]"}`}>
                          {step.description}
                        </p>
                        {step.key === "confirmed" && (
                          <p className="text-xs text-[#8A7F76] mt-1">{orderDate}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column — Order Summary */}
        <div className="w-full md:w-80 bg-white/60 rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl text-[#2B2420] mb-5">Order Summary</h2>

          <div className="flex gap-3 items-center mb-5">
            <img
              src={firstItem.image}
              alt={firstItem.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-[#2B2420]">{firstItem.name}</p>
              <p className="text-xs text-[#8A7F76]">Qty: {firstItem.qty}</p>
              <p className="text-sm text-[#8C4A3A] font-medium">Rs {firstItem.price}</p>
            </div>
          </div>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#2B2420]">Subtotal</span>
            <span className="text-[#2B2420]">Rs {order.itemTotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#2B2420]">Shipping</span>
            <span className="text-[#2B2420]">Rs {order.deliveryFee}</span>
          </div>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <div className="flex justify-between text-base font-medium mb-5">
            <span className="text-[#2B2420]">Total</span>
            <span className="text-[#8C4A3A]">Rs {order.total}</span>
          </div>

          <button className="w-full bg-[#8C4A3A] hover:bg-[#7a3f31] text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}