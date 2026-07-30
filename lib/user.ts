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

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_URL}/user/me`, {
      credentials: "include",
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
  try {
    const res = await fetch(`${API_URL}/user/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}

export async function requestSeller(): Promise<{ success: boolean; message: string; data?: UserProfile }> {
  try {
    const res = await fetch(`${API_URL}/user/request-seller`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}