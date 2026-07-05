// lib/cart.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  qty: number;
  sellerId?: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getCart(): Promise<CartItem[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.cart : [];
  } catch {
    return [];
  }
}

// Now only needs the product id — backend looks up name/price/image/sellerId itself
export async function addToCart(
  productId: string,
  qty: number = 1
): Promise<{ success: boolean; message?: string }> {
  const token = getToken();
  if (!token) {
    return { success: false, message: "Please log in to add items to your cart." };
  }
  try {
    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: productId, qty }),
    });
    const data = await res.json();
    if (data.success) {
      window.dispatchEvent(new Event("cart-updated"));
      return { success: true };
    } else {
      return { success: false, message: data.message || "Could not add to cart." };
    }
  } catch (error) {
    console.error("addToCart error:", error);
    return { success: false, message: "Something went wrong." };
  }
}

export async function removeFromCart(id: string) {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${API_URL}/cart/remove/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("removeFromCart error:", error);
  }
}

export async function updateQty(
  id: string,
  qty: number
): Promise<{ success: boolean; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, qty }),
    });
    const data = await res.json();
    if (data.success) {
      window.dispatchEvent(new Event("cart-updated"));
      return { success: true };
    } else {
      return { success: false, message: data.message || "Could not update quantity." };
    }
  } catch (error) {
    console.error("updateQty error:", error);
    return { success: false, message: "Something went wrong." };
  }
}

export async function clearCart() {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${API_URL}/cart/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("clearCart error:", error);
  }
}

export async function getCartTotal(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}