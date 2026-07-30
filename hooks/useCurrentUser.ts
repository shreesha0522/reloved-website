"use client";
import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, CurrentUser } from "@/lib/auth";

// Replaces the old pattern of reading localStorage.getItem("userRole") /
// "isLoggedIn" directly in every page. Since the token is now an httpOnly
// cookie, the only way to know who's logged in is to ask the server.
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const u = await getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
    refetch,
  };
}