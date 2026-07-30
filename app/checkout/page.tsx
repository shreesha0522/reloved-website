// app/checkout/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CartItem, getCart, getCartTotal } from "@/lib/cart";
import { createOrder } from "@/lib/orders";
import { getProfile, UserProfile } from "@/lib/user";
import { Package, ShieldCheck, Truck } from "lucide-react";

function getDeliveryEstimate() {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 5);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });

  if (startMonth === endMonth) {
    return `${startDay}–${endDay} ${endMonth}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { loading: checkingSession, isLoggedIn } = useCurrentUser();
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemTotal, setItemTotal] = useState<number>(0);
  const [deliveryOption, setDeliveryOption] = useState<"standard" | "pickup">("standard");
  const [placing, setPlacing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (checkingSession) return;
    if (!isLoggedIn) {
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

      const userProfile = await getProfile();
      setProfile(userProfile);

      setChecking(false);
    })();
  }, [checkingSession, isLoggedIn, router]);

  if (checking) return null; // or a loading spinner

  const deliveryFee = deliveryOption === "standard" ? 180 : 0;
  const total = itemTotal + deliveryFee;
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0);

  const hasAddress = !!(profile?.address?.street && profile?.address?.city);

  async function handleProceedToPay() {
    if (!hasAddress) {
      router.push("/account");
      return;
    }

    setPlacing(true);

    const result = await createOrder({
      deliveryOption,
      shippingAddress: {
        name: profile!.username,
        phone: profile!.address!.phone,
        address: `${profile!.address!.street}, ${profile!.address!.city}`,
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
    <div className="min-h-screen bg-[#F4F6F2] px-10 py-12">
      <h1 className="font-display text-4xl text-[#4A6B5A] mb-10">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl">

        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Shipping Address */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-xl text-[#1A2E2A]">Shipping Address</h2>
              <button
                onClick={() => router.push("/account")}
                aria-label="Edit shipping address"
                className="text-sm text-[#4A6B5A]"
              >
                Edit
              </button>
            </div>
            {hasAddress ? (
              <>
                <p className="text-sm text-[#1A2E2A]">
                  {profile!.username} <span className="ml-2 text-xs bg-[#D8E0D9] px-2 py-0.5 rounded">HOME</span>
                </p>
                <p className="text-sm text-[#1A2E2A] mt-1">{profile!.address!.phone}</p>
                <p className="text-sm text-[#1A2E2A] mt-1">
                  {profile!.address!.street}, {profile!.address!.city}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#6B7B76]">
                No delivery address on file yet.{" "}
                <button onClick={() => router.push("/account")} className="text-[#4A6B5A] underline">
                  Add one now
                </button>{" "}
                before placing your order.
              </p>
            )}
          </div>

          {/* Delivery or Pickup */}
          <div className="bg-white/60 rounded-xl p-6">
            <fieldset>
            <legend className="font-display text-xl text-[#1A2E2A] mb-4">Delivery or Pickup</legend>

            <label
              className={`flex justify-between items-center rounded-lg px-4 py-3 mb-3 cursor-pointer border ${
                deliveryOption === "standard" ? "border-[#4A6B5A] bg-[#f5e9e2]" : "border-[#D8E0D9]"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "standard"}
                  onChange={() => setDeliveryOption("standard")}
                  className="accent-[#4A6B5A]"
                />
                <div>
                  <p className={`text-sm font-medium ${deliveryOption === "standard" ? "text-[#4A6B5A]" : "text-[#1A2E2A]"}`}>
                    Standard Delivery
                  </p>
                  <p className="text-xs text-[#6B7B76]">Get it by {getDeliveryEstimate()}</p>
                </div>
              </div>
              <span className="text-sm text-[#1A2E2A]">Rs 180</span>
            </label>

            <label
              className={`flex justify-between items-center rounded-lg px-4 py-3 cursor-pointer border ${
                deliveryOption === "pickup" ? "border-[#4A6B5A] bg-[#f5e9e2]" : "border-[#D8E0D9]"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                  className="accent-[#4A6B5A]"
                />
                <div>
                  <p className={`text-sm font-medium ${deliveryOption === "pickup" ? "text-[#4A6B5A]" : "text-[#1A2E2A]"}`}>
                    Local Pickup
                  </p>
                  <p className="text-xs text-[#6B7B76]">Available at Kathmandu Boutique</p>
                </div>
              </div>
              <span className="text-sm text-[#1A2E2A]">Free</span>
            </label>
            </fieldset>
          </div>

          {/* Package — lists all items from the real cart */}
          <div className="bg-white/60 rounded-xl p-6">
            <p className="text-sm text-[#1A2E2A] mb-4 flex items-center gap-2">
              <Package size={16} strokeWidth={1.75} className="text-[#4A6B5A]" />
              Package 1 of 1 ({totalItemCount} item{totalItemCount !== 1 ? "s" : ""})
            </p>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-display text-base text-[#1A2E2A]">{item.name}</p>
                    <p className="text-sm mt-1">
                      <span className="text-[#4A6B5A] font-medium">Rs {item.price}</span>
                      {item.originalPrice && (
                        <span className="text-[#6B7B76] line-through ml-2">Rs {item.originalPrice}</span>
                      )}
                    </p>
                    <p className="text-xs text-[#6B7B76] mt-1">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice and Contact Info */}
          <div className="bg-white/60 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-display text-xl text-[#1A2E2A]">Invoice and Contact Info</h2>
              <button
                onClick={() => router.push("/account")}
                aria-label="Edit contact info"
                className="text-sm text-[#4A6B5A]"
              >
                Edit
              </button>
            </div>
            <p className="text-sm text-[#1A2E2A]">✉️ {profile?.email}</p>
          </div>
        </div>

        {/* Right column — Order Detail */}
        <div className="w-full md:w-96 bg-white/60 rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl text-[#1A2E2A] mb-4">Order Detail</h2>

          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#1A2E2A]">Item Total ({totalItemCount} items)</span>
            <span className="text-[#1A2E2A]">Rs {itemTotal}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span className="text-[#1A2E2A]">Delivery fee</span>
            <span className="text-[#1A2E2A]">{deliveryFee === 0 ? "Free" : `Rs ${deliveryFee}`}</span>
          </div>

          <div className="h-px bg-[#D8E0D9] my-3" />

          <div className="flex justify-between text-base font-medium mb-5" aria-live="polite">
            <span className="text-[#1A2E2A]">Total</span>
            <span className="text-[#4A6B5A]">Rs {total}</span>
          </div>

          <button
            onClick={handleProceedToPay}
            disabled={placing}
            className="w-full bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide mb-3"
          >
            {placing ? "Placing order..." : hasAddress ? "Proceed to Pay" : "Add delivery address"}
          </button>

          <p className="text-center text-xs text-[#6B7B76] mb-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="h-px bg-[#D8E0D9] my-3" />

          <p className="text-xs text-[#6B7B76] flex items-center gap-2 mb-2">
            <ShieldCheck size={15} strokeWidth={1.75} className="text-[#4A6B5A]" />
            Secure Payment Gateway
          </p>
          <p className="text-xs text-[#6B7B76] flex items-center gap-2">
            <Truck size={15} strokeWidth={1.75} className="text-[#4A6B5A]" />
            Tracked Shipping Worldwide
          </p>
        </div>
      </div>
    </div>
  );
}