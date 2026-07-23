// lib/esewa.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function initiateEsewaPayment(orderId: string) {
  const res = await fetch(`${API_URL}/esewa/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ orderId }),
  });
  return res.json();
}

export async function verifyEsewaPayment(data: string) {
  const res = await fetch(`${API_URL}/esewa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  return res.json();
}