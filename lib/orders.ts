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

export async function createOrder(payload: {
  deliveryOption: "standard" | "pickup";
  shippingAddress: { name: string; phone: string; address: string };
  paymentMethod: "esewa" | "khalti" | "bank";
}): Promise<{ success: boolean; order?: Order; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function markOrderPaid(orderId: string): Promise<{ success: boolean; order?: Order }> {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data.success ? data.order : null;
  } catch {
    return null;
  }
}

export async function getMyOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      credentials: "include",
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
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: orderStatus }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}