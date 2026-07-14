const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description?: string;
  stock: number;
  size?: string;
  condition?: "Like New" | "Good" | "Fair";
  rating: number;
  reviews: number;
  sellerId: string;
  createdAt: string;
  status?: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getAllProducts(category?: string, search?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const query = params.toString();
    const url = query ? `${API_URL}/products?${query}` : `${API_URL}/products`;
    const res = await fetch(url);
    const data = await res.json();
    return data.success ? data.products : [];
  } catch {
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`);
    const data = await res.json();
    return data.success ? data.product : null;
  } catch {
    return null;
  }
}

export async function getMyProducts(): Promise<Product[]> {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/products/seller/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.success ? data.products : [];
  } catch {
    return [];
  }
}

export async function createProduct(payload: {
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description?: string;
  stock?: number;
  size?: string;
  condition?: string;
}): Promise<{ success: boolean; product?: Product; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/products`, {
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

export async function updateProduct(
  id: string,
  payload: {
    name: string;
    price: number;
    category: string;
    subcategory?: string;
    image: string;
    description?: string;
    stock?: number;
    size?: string;
    condition?: string;
  }
): Promise<{ success: boolean; product?: Product; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
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

export async function deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
  const token = getToken();
  if (!token) return { success: false, message: "Not logged in" };
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}