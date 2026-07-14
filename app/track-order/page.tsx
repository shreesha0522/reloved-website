// app/track-order/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrderById, Order } from "@/lib/orders";
import { Package, MapPin, Truck, Headphones, X, Mail, Phone, MessageCircle } from "lucide-react";

const stepOrder = ["confirmed", "packed", "ready", "transit", "out", "delivered"];

const stepMeta: Record<string, { title: string; description: string }> = {
  confirmed:  { title: "Seller to Packed",   description: "Order confirmed and processed" },
  packed:     { title: "Packed",             description: "Item has been securely packed at the warehouse" },
  ready:      { title: "Ready To Ship",      description: "Handed over to our delivery partner" },
  transit:    { title: "In Transit",         description: "Moving through our distribution centers" },
  out:        { title: "Out For Delivery",   description: "Your courier is heading to your neighborhood" },
  delivered:  { title: "Delivered",          description: "Package delivered" },
};

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

function getExpectedDeliveryRange(createdAt: string): string {
  const date = new Date(createdAt);
  const minDays = 7;
  const maxDays = 14;
  const minDate = new Date(date);
  const maxDate = new Date(date);
  minDate.setDate(minDate.getDate() + minDays);
  maxDate.setDate(maxDate.getDate() + maxDays);
  
  const format = (d: Date) => d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  return `${format(minDate)} - ${format(maxDate)}`;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);

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
  const expectedDelivery = getExpectedDeliveryRange(order.createdAt);

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-10 py-12">
      <h1 className="font-display text-4xl text-[#1A2E2A] mb-2">Track Order</h1>
      <p className="text-sm text-[#6B7B76] mb-10">
        Order #{order.orderNumber} • Placed on {orderDate}
      </p>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl">

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Current status card */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#E8EDE6] flex items-center justify-center">
                  <Package size={18} strokeWidth={1.75} className="text-[#4A6B5A]" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#4A6B5A] font-medium">
                    Current Status
                  </p>
                  <p className="font-display text-xl text-[#1A2E2A]">
                    {trackingSteps.find((s) => s.highlight)?.title || "Processing"}
                  </p>
                </div>
              </div>
              <span className="bg-[#E3E9E1] text-xs text-[#4a5a55] px-3 py-2 rounded-lg text-right">
                Expected Delivery<br />
                <span className="font-medium text-[#1A2E2A]">{expectedDelivery}</span>
              </span>
            </div>

            <div className="h-px bg-[#D8E0D9] mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="flex items-center gap-1.5 text-[#1A2E2A] font-medium mb-1.5">
                  <MapPin size={15} strokeWidth={1.75} className="text-[#4A6B5A]" />
                  Delivery Address
                </p>
                <p className="text-[#4a5a55]">{order.shippingAddress?.name}</p>
                <p className="text-[#4a5a55]">{order.shippingAddress?.address}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[#1A2E2A] font-medium mb-1.5">
                  <Truck size={15} strokeWidth={1.75} className="text-[#4A6B5A]" />
                  Shipping Method
                </p>
                <p className="text-[#4a5a55]">
                  {order.deliveryOption === "standard" ? "NP-DEX: Standard Delivery" : "Local Pickup"}
                </p>
              </div>
            </div>
          </div>

          {/* Journey timeline */}
          <div className="bg-white/60 rounded-xl p-6">
            <h2 className="font-display text-xl text-[#1A2E2A] mb-6">Journey of Your Parcel</h2>

            <div className="relative pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-[#D8E0D9]" />

              <div className="flex flex-col gap-7">
                {[...trackingSteps].reverse().map((step) => (
                  <div key={step.key} className="relative">
                    <span
                      className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                        step.done
                          ? "bg-[#4A6B5A] border-[#4A6B5A]"
                          : "bg-white border-[#D8E0D9]"
                      }`}
                    />
                    {step.highlight ? (
                      <div className="bg-[#E3E9E1] rounded-lg p-4">
                        <p className="text-sm font-medium text-[#4A6B5A] mb-1">{step.title}</p>
                        <p className="text-sm text-[#1A2E2A] mb-1">{step.description}</p>
                        <p className="text-xs text-[#6B7B76]">Today, 10:45 AM</p>
                      </div>
                    ) : (
                      <div>
                        <p className={`text-sm font-medium ${step.done ? "text-[#1A2E2A]" : "text-[#6B7B76]"}`}>
                          {step.title}
                        </p>
                        <p className={`text-sm ${step.done ? "text-[#4a5a55]" : "text-[#6B7B76]"}`}>
                          {step.description}
                        </p>
                        {step.key === "confirmed" && (
                          <p className="text-xs text-[#6B7B76] mt-1">{orderDate}</p>
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
          <h2 className="font-display text-xl text-[#1A2E2A] mb-5">Order Summary</h2>

          <div className="flex gap-3 items-center mb-5">
            <img
              src={firstItem.image}
              alt={firstItem.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-[#1A2E2A]">{firstItem.name}</p>
              <p className="text-xs text-[#6B7B76]">Qty: {firstItem.qty}</p>
              <p className="text-sm text-[#4A6B5A] font-medium">Rs {firstItem.price}</p>
            </div>
          </div>

          <div className="h-px bg-[#D8E0D9] my-3" />

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#1A2E2A]">Subtotal</span>
            <span className="text-[#1A2E2A]">Rs {order.itemTotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#1A2E2A]">Shipping</span>
            <span className="text-[#1A2E2A]">Rs {order.deliveryFee}</span>
          </div>

          <div className="h-px bg-[#D8E0D9] my-3" />

          <div className="flex justify-between text-base font-medium mb-5">
            <span className="text-[#1A2E2A]">Total</span>
            <span className="text-[#4A6B5A]">Rs {order.total}</span>
          </div>

          <button
            onClick={() => setSupportOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#4A6B5A] hover:bg-[#3a5548] text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide"
          >
            <Headphones size={16} strokeWidth={1.75} />
            Contact Support
          </button>
        </div>
      </div>

      {/* Support modal */}
      {supportOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setSupportOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSupportOpen(false)}
              className="absolute top-4 right-4 text-[#6B7B76] hover:text-[#1A2E2A]"
            >
              <X size={18} strokeWidth={1.75} />
            </button>

            <h3 className="font-display text-xl text-[#1A2E2A] mb-1">Need help with your order?</h3>
            <p className="text-sm text-[#6B7B76] mb-6">
              Order #{order.orderNumber} — reach out to us any way that's convenient.
            </p>

            <div className="flex flex-col gap-3">
              
              <a
                href={`mailto:support@reloved.com?subject=Support for order ${order.orderNumber}`}
                className="flex items-center gap-3 border border-[#D8E0D9] hover:border-[#4A6B5A] hover:bg-[#E8EDE6] rounded-lg px-4 py-3 transition-colors"
              >
                <Mail size={18} strokeWidth={1.75} className="text-[#4A6B5A]" />
                <div>
                  <p className="text-sm font-medium text-[#1A2E2A]">Email us</p>
                  <p className="text-xs text-[#6B7B76]">support@reloved.com</p>
                </div>
              </a>

              
              <a
                href="tel:+9779800000000"
                className="flex items-center gap-3 border border-[#D8E0D9] hover:border-[#4A6B5A] hover:bg-[#E8EDE6] rounded-lg px-4 py-3 transition-colors"
              >
                <Phone size={18} strokeWidth={1.75} className="text-[#4A6B5A]" />
                <div>
                  <p className="text-sm font-medium text-[#1A2E2A]">Call us</p>
                  <p className="text-xs text-[#6B7B76]">+977 980-0000000</p>
                </div>
              </a>

              
              <a
                href="https://wa.me/9779800000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-[#D8E0D9] hover:border-[#4A6B5A] hover:bg-[#E8EDE6] rounded-lg px-4 py-3 transition-colors"
              >
                <MessageCircle size={18} strokeWidth={1.75} className="text-[#4A6B5A]" />
                <div>
                  <p className="text-sm font-medium text-[#1A2E2A]">WhatsApp</p>
                  <p className="text-xs text-[#6B7B76]">Chat with our support team</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}