// lib/wishlist.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.wishlist : [];
  } catch {
    return [];
  }
}

export async function toggleWishlist(item: WishlistItem): Promise<boolean> {
  const token = getToken();
  if (!token) {
    alert("Please log in to use the wishlist.");
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/wishlist/toggle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    window.dispatchEvent(new Event("wishlist-updated"));
    return data.added;
  } catch {
    return false;
  }
}

export async function isInWishlist(id: string): Promise<boolean> {
  const list = await getWishlist();
  return list.some((i) => i.id === id);
}

export async function getWishlistCount(): Promise<number> {
  const list = await getWishlist();
  return list.length;
}