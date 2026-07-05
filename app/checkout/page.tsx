// app/checkout/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { CartItem, getCart, getCartTotal } from "@/lib/cart";
import { createOrder } from "@/lib/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemTotal, setItemTotal] = useState<number>(0);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "pickup">("standard");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/checkout");
      return;
    }

    (async () => {
      const cart = await getCart();
      if (cart.length === 0) {
        router.push("/cart");
        return;
      }

      setItems(cart);
      const total = await getCartTotal();
      setItemTotal(total);
      setChecking(false);
    })();
  }, [router]);

  if (checking) return null; // or a loading spinner

  const deliveryFee = deliveryOption === "standard" ? 180 : 0;
  const total = itemTotal + deliveryFee;
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  async function handleProceedToPay() {
    setPlacing(true);

    const result = await createOrder({
      deliveryOption,
      shippingAddress: {
        name: "Shreesha Shrestha",
        phone: "9847*****",
        address: "Dillibazar, pipolbot",
      },
      paymentMethod: "esewa", // default; user picks the real method on the payment page
    });

    if (result.success && result.order) {
      router.push(`/payment?orderId=${result.order._id}`);
    } else {
      alert(result.message || "Could not create order. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-10 py-12">
      <h1 className="font-display text-4xl text-[#8C4A3A] mb-10">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl">

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Shipping Address */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-xl text-[#2B2420]">Shipping Address</h2>
              <button className="text-sm text-[#8C4A3A]">Edit</button>
            </div>
            <p className="text-sm text-[#2B2420]">
              Shreesha Shrestha <span className="ml-2 text-xs bg-[#E7DDD4] px-2 py-0.5 rounded">HOME</span>
            </p>
            <p className="text-sm text-[#2B2420] mt-1">9847*****</p>
            <p className="text-sm text-[#2B2420] mt-1">Dillibazar, pipolbot</p>
          </div>

          {/* Delivery or Pickup */}
          <div className="bg-white/60 rounded-xl p-6">
            <h2 className="font-display text-xl text-[#2B2420] mb-4">Delivery or Pickup</h2>

            <label
              className={`flex justify-between items-center rounded-lg px-4 py-3 mb-3 cursor-pointer border ${
                deliveryOption === "standard" ? "border-[#8C4A3A] bg-[#f5e9e2]" : "border-[#E7DDD4]"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "standard"}
                  onChange={() => setDeliveryOption("standard")}
                  className="accent-[#8C4A3A]"
                />
                <div>
                  <p className={`text-sm font-medium ${deliveryOption === "standard" ? "text-[#8C4A3A]" : "text-[#2B2420]"}`}>
                    Standard Delivery
                  </p>
                  <p className="text-xs text-[#8A7F76]">Get it by 17–18 May</p>
                </div>
              </div>
              <span className="text-sm text-[#2B2420]">Rs 180</span>
            </label>

            <label
              className={`flex justify-between items-center rounded-lg px-4 py-3 cursor-pointer border ${
                deliveryOption === "pickup" ? "border-[#8C4A3A] bg-[#f5e9e2]" : "border-[#E7DDD4]"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                  className="accent-[#8C4A3A]"
                />
                <div>
                  <p className={`text-sm font-medium ${deliveryOption === "pickup" ? "text-[#8C4A3A]" : "text-[#2B2420]"}`}>
                    Local Pickup
                  </p>
                  <p className="text-xs text-[#8A7F76]">Available at Kathmandu Boutique</p>
                </div>
              </div>
              <span className="text-sm text-[#2B2420]">Free</span>
            </label>
          </div>

          {/* Package — lists all items from the real cart */}
          <div className="bg-white/60 rounded-xl p-6">
            <p className="text-sm text-[#2B2420] mb-4">📦 Package 1 of 1 ({totalItemCount} item{totalItemCount !== 1 ? "s" : ""})</p>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-display text-base text-[#2B2420]">{item.name}</p>
                    <p className="text-sm mt-1">
                      <span className="text-[#8C4A3A] font-medium">Rs {item.price}</span>
                      {item.originalPrice && (
                        <span className="text-[#8A7F76] line-through ml-2">Rs {item.originalPrice}</span>
                      )}
                    </p>
                    <p className="text-xs text-[#8A7F76] mt-1">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice and Contact Info */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-xl text-[#2B2420]">Invoice and Contact Info</h2>
              <button className="text-sm text-[#8C4A3A]">Edit</button>
            </div>
            <p className="text-sm text-[#2B2420]">✉️ shreesha.shrestha@example.com</p>
          </div>
        </div>

        {/* Right column — Order Detail */}
        <div className="w-full md:w-96 bg-white/60 rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl text-[#2B2420] mb-4">Order Detail</h2>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#2B2420]">Item Total ({totalItemCount} items)</span>
            <span className="text-[#2B2420]">Rs {itemTotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#2B2420]">Delivery fee</span>
            <span className="text-[#2B2420]">{deliveryFee === 0 ? "Free" : `Rs ${deliveryFee}`}</span>
          </div>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <div className="flex justify-between text-base font-medium mb-5">
            <span className="text-[#2B2420]">Total</span>
            <span className="text-[#8C4A3A]">Rs {total}</span>
          </div>

          <button
            onClick={handleProceedToPay}
            disabled={placing}
            className="w-full bg-[#8C4A3A] hover:bg-[#7a3f31] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide mb-3"
          >
            {placing ? "Placing order..." : "Proceed to Pay"}
          </button>

          <p className="text-center text-xs text-[#8A7F76] mb-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="h-px bg-[#E7DDD4] my-3" />

          <p className="text-xs text-[#8A7F76] flex items-center gap-2 mb-2">
            🛡️ Secure Payment Gateway
          </p>
          <p className="text-xs text-[#8A7F76] flex items-center gap-2">
            🚚 Tracked Shipping Worldwide
          </p>
        </div>
      </div>
    </div>
  );
}