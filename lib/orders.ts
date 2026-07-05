// lib/orders.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}
export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  total: number;
  deliveryOption: "standard" | "pickup";
  shippingAddress: { name: string; phone: string; address: string };
  paymentMethod: "esewa" | "khalti" | "bank";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: string;
  orderNumber: string;
  createdAt: string;
}
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
export async function createOrder(payload: {
  deliveryOption: "standard" | "pickup";
  shippingAddress: { name: string; phone: string; address: string };
  paymentMethod: "esewa" | "khalti" | "bank";
}): Promise<{ success: boolean; order?: Order; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/orders`, {
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
export async function markOrderPaid(orderId: string): Promise<{ success: boolean; order?: Order }> {
  const token = getToken();
  if (!token) return { success: false };
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}
export async function getOrderById(orderId: string): Promise<Order | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.order : null;
  } catch {
    return null;
  }
}
export async function getMyOrders(): Promise<Order[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.orders : [];
  } catch {
    return [];
  }
}
export async function updateOrderStatus(
  orderId: string,
  orderStatus: string
): Promise<{ success: boolean; order?: Order; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: orderStatus }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}