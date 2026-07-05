// app/payment/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { getOrderById, markOrderPaid, Order } from "@/lib/orders";
import { initiateEsewaPayment } from "@/lib/esewa";


type PaymentMethod = "esewa" | "khalti" | "bank";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [checking, setChecking] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("esewa");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    if (!orderId) {
      router.push("/cart");
      return;
    }

    async function load() {
      const data = await getOrderById(orderId!);
      if (!data) {
        router.push("/cart");
        return;
      }
      setOrder(data);
      setChecking(false);
    }
    load();
  }, [orderId, router]);

  if (checking || !order) return null;

  const shopDiscount = Math.round(order.itemTotal * 0.15); // 15% example discount — adjust as needed
  const shopTotal = order.itemTotal - shopDiscount;
  const totalItemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

async function handlePayment() {
  if (method !== "esewa") {
    alert("Khalti and Bank Transfer aren't connected yet — please choose eSewa for now.");
    return;
  }

  setProcessing(true);

  const result = await initiateEsewaPayment(order!._id);
  if (!result.success) {
    alert(result.message || "Could not start payment");
    setProcessing(false);
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = result.formAction;

  Object.entries(result.fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value as string;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-10 py-12">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

        {/* Left column — payment method */}
        <div className="flex-1">
          <h1 className="font-display text-4xl text-[#2B2420] mb-8">How you'll pay</h1>

          <div className="flex flex-col gap-4">

            {/* eSewa */}
            <label
              className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer border-2 transition-colors ${
                method === "esewa" ? "border-[#8C4A3A] bg-white" : "border-[#E7DDD4] bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "esewa"}
                  onChange={() => setMethod("esewa")}
                  className="accent-[#8C4A3A]"
                />
                <span className="w-8 h-8 rounded-md bg-[#5fb85a] text-white text-xs font-bold flex items-center justify-center">
                  eS
                </span>
                <span className="text-sm font-medium text-[#2B2420]">esewa</span>
              </div>
              <span className="text-[#8A7F76]">▢</span>
            </label>

            {/* Khalti */}
            <label
              className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer border-2 transition-colors ${
                method === "khalti" ? "border-[#8C4A3A] bg-white" : "border-[#E7DDD4] bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "khalti"}
                  onChange={() => setMethod("khalti")}
                  className="accent-[#8C4A3A]"
                />
                <span className="w-8 h-8 rounded-md bg-[#5d2e8c] text-white text-xs font-bold flex items-center justify-center">
                  K
                </span>
                <span className="text-sm font-medium text-[#2B2420]">Khalti</span>
              </div>
              <span className="text-[#8A7F76]">▢</span>
            </label>

            {/* Bank */}
            <label
              className={`flex items-center justify-between rounded-xl px-5 py-4 cursor-pointer border-2 transition-colors ${
                method === "bank" ? "border-[#8C4A3A] bg-white" : "border-[#E7DDD4] bg-white/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment-method"
                  checked={method === "bank"}
                  onChange={() => setMethod("bank")}
                  className="accent-[#8C4A3A]"
                />
                <span className="w-8 h-8 rounded-md bg-[#8A7F76] text-white text-sm flex items-center justify-center">
                  🏦
                </span>
                <span className="text-sm font-medium text-[#2B2420]">Bank</span>
              </div>
              <span className="text-xs text-[#8A7F76]">Direct Transfer</span>
            </label>
          </div>

          <div className="flex items-center gap-2 mt-6 text-sm text-[#8A7F76]">
            <span>🛡️</span>
            <span>Secure encrypted checkout</span>
          </div>
        </div>

        {/* Right column — Order Summary */}
        <div className="w-full md:w-96 bg-white/60 rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl text-[#2B2420] mb-5">Order Summary</h2>

          {/* Item list */}
          <div className="flex flex-col gap-4 mb-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-[#2B2420]">{item.name}</p>
                  <p className="text-sm text-[#8C4A3A]">Rs {item.price * item.qty}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#2B2420]">Items total</span>
            <span className="text-[#2B2420]">Rs {order.itemTotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#8C4A3A]">Shop discount</span>
            <span className="text-[#8C4A3A]">-Rs {shopDiscount}</span>
          </div>

          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-[#2B2420]">Shop Total</span>
            <span className="text-[#2B2420]">Rs {shopTotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#2B2420]">Delivery</span>
            <span className="text-[#2B2420]">Rs {order.deliveryFee}</span>
          </div>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <div className="flex justify-between text-base font-medium mb-5">
            <span className="text-[#2B2420]">Total ({totalItemCount} item{totalItemCount !== 1 ? "s" : ""})</span>
            <span className="text-[#8C4A3A]">Rs {order.total}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-[#8C4A3A] hover:bg-[#7a3f31] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide mb-3 flex items-center justify-center gap-2"
          >
            {processing ? "Processing..." : "Payment 🔒"}
          </button>

          <p className="text-center text-xs text-[#8A7F76]">
            By clicking payment, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}