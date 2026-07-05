// lib/auth.ts
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false; // SSR safety
  return localStorage.getItem("isLoggedIn") === "true";
}

export function logout() {
  localStorage.removeItem("isLoggedIn");
}