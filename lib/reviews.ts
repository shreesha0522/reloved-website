const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Review {
  _id: string;
  productId: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/reviews/${productId}`);
    const data = await res.json();
    return data.success ? data.reviews : [];
  } catch {
    return [];
  }
}

export async function createReview(
  productId: string,
  payload: { rating: number; comment: string }
): Promise<{ success: boolean; review?: Review; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/reviews/${productId}`, {
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

export async function deleteReview(
  reviewId: string
): Promise<{ success: boolean; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}