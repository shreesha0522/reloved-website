// lib/seller.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SellerProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  subcategory?: string;
  stock: number;
  status: "active" | "pending" | "rejected";
  createdAt: string;
}

export interface SellerOrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface SellerOrder {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: SellerOrderItem[];
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getMyProducts(): Promise<SellerProduct[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/products/seller/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.products : [];
  } catch {
    return [];
  }
}

export async function createProduct(payload: {
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description: string;
  stock?: number;
}): Promise<{ success: boolean; product?: SellerProduct; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function getSellerOrders(): Promise<SellerOrder[]> {
  const token = getToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/seller/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.orders : [];
  } catch {
    return [];
  }
}