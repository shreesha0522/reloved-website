// The JWT lives in an httpOnly cookie now, so client-side JS can never read
// it directly (that's the point — it protects against XSS token theft).
// To check "am I logged in / who am I", we ask the server instead.

export type CurrentUser = {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "user" | "seller";
  mfaEnabled: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as CurrentUser;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // even if the request fails, the cookie will simply expire on its own
  }
}