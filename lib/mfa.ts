// lib/mfa.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function setupMFA(): Promise<{
  success: boolean;
  qrCode?: string;
  manualEntryKey?: string;
  message?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/mfa/setup`, {
      method: "POST",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function verifySetupMFA(
  code: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/mfa/verify-setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function verifyLoginMFA(
  code: string
): Promise<{ success: boolean; message?: string; data?: any }> {
  try {
    const res = await fetch(`${API_URL}/mfa/verify-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function disableMFA(
  currentPassword: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/mfa/disable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}