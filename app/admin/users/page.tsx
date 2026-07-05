// app/admin/users/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
  AdminUser,
  SellerRequestUser,
} from "@/lib/admin";

const ROLE_OPTIONS = ["user", "seller", "admin"];

export default function AdminUsersPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tab, setTab] = useState<"all" | "requests">("all");
  const [sellerRequests, setSellerRequests] = useState<SellerRequestUser[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      router.push("/account");
      return;
    }
    setIsAdmin(true);
    setChecking(false);
  }, [router]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const data = await getAllUsers({
      search,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
      page,
    });
    if (data.success) {
      setUsers(data.users);
      setTotalPages(data.totalPages || 1);
    }
    setLoading(false);
  }, [search, roleFilter, statusFilter, page]);

  const loadSellerRequests = useCallback(async () => {
    setLoadingRequests(true);
    const data = await getSellerRequests();
    if (data.success) {
      setSellerRequests(data.users);
    }
    setLoadingRequests(false);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadSellerRequests();
    }
  }, [isAdmin, loadUsers, loadSellerRequests]);

  async function handleStatusToggle(user: AdminUser) {
    setUpdatingId(user._id);
    const result = await updateUserStatus(user._id, !user.isActive);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: !user.isActive } : u))
      );
    } else {
      alert(result.message || "Failed to update status");
    }
    setUpdatingId(null);
  }

  async function handleRoleChange(userId: string, role: string) {
    setUpdatingId(userId);
    const result = await updateUserRole(userId, role);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: role as AdminUser["role"] } : u))
      );
    } else {
      alert(result.message || "Failed to update role");
    }
    setUpdatingId(null);
  }

  async function handleDelete(userId: string) {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setUpdatingId(userId);
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } else {
      alert(result.message || "Failed to delete user");
    }
    setUpdatingId(null);
  }

  async function handleApproveSellerRequest(userId: string) {
    setUpdatingId(userId);
    const result = await approveSellerRequest(userId);
    if (result.success) {
      setSellerRequests((prev) => prev.filter((u) => u._id !== userId));
      loadUsers();
    } else {
      alert(result.message || "Failed to approve request");
    }
    setUpdatingId(null);
  }

  async function handleRejectSellerRequest(userId: string) {
    setUpdatingId(userId);
    const result = await rejectSellerRequest(userId);
    if (result.success) {
      setSellerRequests((prev) => prev.filter((u) => u._id !== userId));
    } else {
      alert(result.message || "Failed to reject request");
    }
    setUpdatingId(null);
  }

  if (checking || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-6 md:px-16 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl md:text-4xl text-[#2B2420]">User Management</h1>
      </div>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("all")}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            tab === "all"
              ? "bg-[#8C4A3A] text-white border-[#8C4A3A]"
              : "bg-white text-[#2B2420] border-[#E7DDD4]"
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setTab("requests")}
          className={`text-sm px-4 py-2 rounded-full border transition-colors ${
            tab === "requests"
              ? "bg-[#8C4A3A] text-white border-[#8C4A3A]"
              : "bg-white text-[#2B2420] border-[#E7DDD4]"
          }`}
        >
          Seller Requests ({sellerRequests.length})
        </button>
      </div>

      {tab === "all" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="text-sm px-4 py-2.5 rounded-full border border-[#E7DDD4] bg-white text-[#2B2420] w-64 focus:outline-none"
            />
            <select
              value={roleFilter}
              onChange={(e) => {
                setPage(1);
                setRoleFilter(e.target.value);
              }}
              className="text-sm px-4 py-2.5 rounded-full border border-[#E7DDD4] bg-white text-[#2B2420]"
            >
              <option value="">All roles</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="text-sm px-4 py-2.5 rounded-full border border-[#E7DDD4] bg-white text-[#2B2420]"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {loading ? (
            <p className="text-sm text-[#8A7F76]">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-[#8A7F76]">No users found.</p>
          ) : (
            <div className="flex flex-col gap-4 max-w-4xl">
              {users.map((user) => (
                <div
  key={user._id}
  className="bg-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
>
  <div className="flex-1">
    <p className="text-sm font-medium text-[#2B2420]">{user.username}</p>
    <p className="text-xs text-[#8A7F76]">{user.email}</p>
    <p className="text-xs text-[#8A7F76] mt-1">
      Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </p>
  </div>

  <div className="flex flex-wrap items-center gap-2">
    <select
      value={user.role}
      disabled={updatingId === user._id}
      onChange={(e) => handleRoleChange(user._id, e.target.value)}
      className="text-xs bg-[#F0E9E2] text-[#6b5c52] px-2.5 py-1.5 rounded-full capitalize border-none disabled:opacity-50"
    >
      {ROLE_OPTIONS.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>

    <button
      onClick={() => handleStatusToggle(user)}
      disabled={updatingId === user._id}
      className={`text-xs px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 whitespace-nowrap ${
        user.isActive === false
          ? "bg-[#F0E9E2] text-[#6b5c52] hover:bg-[#e8ddd2]"
          : "bg-[#8C4A3A] text-white hover:bg-[#7a3f31]"
      }`}
    >
      {user.isActive === false ? "Activate" : "Deactivate"}
    </button>

    <button
      onClick={() => handleDelete(user._id)}
      disabled={updatingId === user._id}
      className="text-xs text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      Delete
    </button>
  </div>
</div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm px-4 py-2 rounded-full border border-[#E7DDD4] bg-white text-[#2B2420] disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-[#8A7F76]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm px-4 py-2 rounded-full border border-[#E7DDD4] bg-white text-[#2B2420] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {tab === "requests" && (
        loadingRequests ? (
          <p className="text-sm text-[#8A7F76]">Loading...</p>
        ) : sellerRequests.length === 0 ? (
          <p className="text-sm text-[#8A7F76]">No pending seller requests.</p>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl">
            {sellerRequests.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#2B2420]">{user.username}</p>
                  <p className="text-xs text-[#8A7F76]">{user.email}</p>
                  <p className="text-xs text-[#8A7F76] mt-1">
                    Requested {new Date(user.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleApproveSellerRequest(user._id)}
                  disabled={updatingId === user._id}
                  className="text-xs bg-[#8C4A3A] text-white px-4 py-2 rounded-full hover:bg-[#7a3f31] transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectSellerRequest(user._id)}
                  disabled={updatingId === user._id}
                  className="text-xs text-red-600 border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}