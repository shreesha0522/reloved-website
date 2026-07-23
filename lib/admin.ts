const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: "user" | "seller" | "admin";
  isActive?: boolean;
  createdAt: string;
}

export async function getAllUsers(params?: {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
}): Promise<{
  success: boolean;
  users: AdminUser[];
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
}> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.role) query.set("role", params.role);
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));

  try {
    const res = await fetch(`${API_URL}/admin/users?${query.toString()}`, {
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, users: [], message: "Something went wrong" };
  }
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<{ success: boolean; user?: AdminUser; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function updateUserRole(
  userId: string,
  role: string
): Promise<{ success: boolean; user?: AdminUser; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  sellerId: { _id: string; username: string; email: string };
  createdAt: string;
}

export async function getPendingProducts(): Promise<{
  success: boolean;
  products: AdminProduct[];
  message?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/admin/products/pending`, {
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, products: [], message: "Something went wrong" };
  }
}

export async function approveProduct(
  productId: string
): Promise<{ success: boolean; product?: AdminProduct; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/products/${productId}/approve`, {
      method: "PUT",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function rejectProduct(
  productId: string,
  reason: string
): Promise<{ success: boolean; product?: AdminProduct; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/products/${productId}/reject`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reason }),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export interface SellerRequestUser {
  _id: string;
  username: string;
  email: string;
  role: "user" | "seller" | "admin";
  sellerRequestStatus: "none" | "pending" | "approved" | "rejected";
  createdAt: string;
}

export async function getSellerRequests(): Promise<{
  success: boolean;
  users: SellerRequestUser[];
  message?: string;
}> {
  try {
    const res = await fetch(`${API_URL}/admin/users/seller-requests`, {
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, users: [], message: "Something went wrong" };
  }
}

export async function approveSellerRequest(
  userId: string
): Promise<{ success: boolean; user?: SellerRequestUser; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/users/seller-requests/${userId}/approve`, {
      method: "PUT",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}

export async function rejectSellerRequest(
  userId: string
): Promise<{ success: boolean; user?: SellerRequestUser; message?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/users/seller-requests/${userId}/reject`, {
      method: "PUT",
      credentials: "include",
    });
    return await res.json();
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}