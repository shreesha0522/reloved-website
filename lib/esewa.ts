// lib/esewa.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function initiateEsewaPayment(orderId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/esewa/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  });
  return res.json();
}

export async function verifyEsewaPayment(data: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/esewa/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data }),
  });
  return res.json();
}