// lib/wishlist.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  try {
    const res = await fetch(`${API_URL}/wishlist`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.success ? data.wishlist : [];
  } catch {
    return [];
  }
}

export async function toggleWishlist(item: WishlistItem): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/wishlist/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item),
    });
    if (res.status === 401) {
      alert("Please log in to use the wishlist.");
      return false;
    }
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