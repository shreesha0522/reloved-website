// app/cart/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { CartItem, getCart, removeFromCart, updateQty, getCartTotal } from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const cart = await getCart();
    setItems(cart);
    const cartTotal = await getCartTotal();
    setTotal(cartTotal);
    setLoading(false);
  }

  async function handleUpdateQty(id: string, qty: number) {
  if (qty < 1) return;
  const result = await updateQty(id, qty);
  if (!result.success) {
    alert(result.message || "Could not update quantity.");
  }
  await refresh();
}

  async function handleRemove(id: string) {
    await removeFromCart(id);
    await refresh();
  }

  function handleCheckout() {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-4 md:px-10 py-8 md:py-12">
        <p className="text-[#6B7B76] text-sm">Loading your cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-4 md:px-10 py-8 md:py-12">
        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-8">Your Cart</h1>
        <p className="text-[#6B7B76] text-sm">Your cart is empty.</p>
        <button
          onClick={() => router.push("/shop")}
          className="mt-4 text-[#4A6B5A] text-sm font-medium hover:underline"
        >
          Continue shopping →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-4 md:px-10 py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-6 md:mb-8">Your Cart</h1>

      <div className="flex flex-col gap-4 max-w-2xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 sm:hidden">
                <p className="font-display text-base text-[#1A2E2A]">{item.name}</p>
                <p className="text-sm mt-1">
                  <span className="text-[#4A6B5A] font-medium">Rs {item.price}</span>
                  {item.originalPrice && (
                    <span className="text-[#6B7B76] line-through ml-2">Rs {item.originalPrice}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex-1 hidden sm:block">
              <p className="font-display text-base text-[#1A2E2A]">{item.name}</p>
              <p className="text-sm mt-1">
                <span className="text-[#4A6B5A] font-medium">Rs {item.price}</span>
                {item.originalPrice && (
                  <span className="text-[#6B7B76] line-through ml-2">Rs {item.originalPrice}</span>
                )}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                  className="w-7 h-7 border border-[#D8E0D9] rounded text-sm flex-shrink-0"
                >
                  -
                </button>
                <span className="text-sm w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                  className="w-7 h-7 border border-[#D8E0D9] rounded text-sm flex-shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {/* Mobile-only quantity controls + remove, shown below the image/name row */}
            <div className="flex items-center justify-between sm:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                  className="w-7 h-7 border border-[#D8E0D9] rounded text-sm"
                >
                  -
                </button>
                <span className="text-sm w-6 text-center">{item.qty}</span>
                <button
                  onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                  className="w-7 h-7 border border-[#D8E0D9] rounded text-sm"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-xs text-[#6B7B76] hover:text-[#4A6B5A]"
              >
                Remove
              </button>
            </div>

            <button
              onClick={() => handleRemove(item.id)}
              className="hidden sm:block text-xs text-[#6B7B76] hover:text-[#4A6B5A]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mt-6 bg-white/60 rounded-xl p-6 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <span className="font-display text-lg text-[#1A2E2A]">
          Total: <span className="text-[#4A6B5A]">Rs {total}</span>
        </span>
        <button
          onClick={handleCheckout}
          className="w-full sm:w-auto bg-[#4A6B5A] hover:bg-[#3a5548] text-white font-medium py-3 px-8 rounded-lg transition-colors text-sm tracking-wide"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}