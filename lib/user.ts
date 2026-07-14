// lib/user.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserAddress {
  street: string;
  city: string;
  phone: string;
}

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  sellerRequestStatus?: "none" | "pending" | "approved" | "rejected";
  address?: UserAddress;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getProfile(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function updateProfile(payload: {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  address?: Partial<UserAddress>;
}): Promise<{ success: boolean; message: string; data?: UserProfile }> {
  const token = getToken();
  if (!token) {
    return { success: false, message: "Not logged in" };
  }
  try {
    const res = await fetch(`${API_URL}/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function requestSeller(): Promise<{ success: boolean; message: string; data?: UserProfile }> {
  const token = getToken();
  if (!token) {
    return { success: false, message: "Not logged in" };
  }
  try {
    const res = await fetch(`${API_URL}/user/request-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}