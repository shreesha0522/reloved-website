"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth";
import { getProfile, updateProfile, requestSeller, UserProfile } from "@/lib/user";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [requestingSeller, setRequestingSeller] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login?redirect=/account");
      return;
    }

    async function load() {
      const data = await getProfile();
      if (!data) {
        router.push("/login?redirect=/account");
        return;
      }
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
      setStreet(data.address?.street || "");
      setCity(data.address?.city || "");
      setPhone(data.address?.phone || "");
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setSaving(true);

    const payload: any = {
      username,
      email,
      address: { street, city, phone },
    };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const result = await updateProfile(payload);
    setSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (result.data) setProfile(result.data);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  async function handleRequestSeller() {
    setRequestingSeller(true);
    setMessage(null);
    const result = await requestSeller();
    setRequestingSeller(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      if (result.data) setProfile(result.data);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] px-10 py-12">
        <p className="text-[#6B7B76] text-sm">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] px-6 md:px-10 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-4xl text-[#1A2E2A] mb-8">My Account</h1>

        {message && (
          <div
            className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white/60 rounded-xl p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          <div className="h-px bg-[#D8E0D9] my-1" />

          <p className="text-sm text-[#6B7B76]">Delivery Address</p>

          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Dillibazar, Ward 10"
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#1A2E2A] mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Kathmandu"
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
            <div>
              <label className="block text-sm text-[#1A2E2A] mb-1.5">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9800000000"
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
          </div>

          <div className="h-px bg-[#D8E0D9] my-1" />

          <p className="text-sm text-[#6B7B76]">
            Leave the password fields blank if you don't want to change it.
          </p>

          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#1A2E2A] mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
            <div>
              <label className="block text-sm text-[#1A2E2A] mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide mt-2"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {profile && profile.role === "user" && (
          <div className="bg-white/60 rounded-xl p-6 mt-6">
            <h2 className="font-display text-xl text-[#1A2E2A] mb-2">Become a Seller</h2>

            {profile.sellerRequestStatus === "pending" ? (
              <p className="text-sm text-[#6B7B76]">
                Your request is pending review. We'll email you once it's approved.
              </p>
            ) : profile.sellerRequestStatus === "rejected" ? (
              <>
                <p className="text-sm text-[#6B7B76] mb-4">
                  Your previous request was not approved. You can submit a new request below.
                </p>
                <button
                  onClick={handleRequestSeller}
                  disabled={requestingSeller}
                  className="bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {requestingSeller ? "Submitting..." : "Request again"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-[#6B7B76] mb-4">
                  Want to sell your handmade products on our platform? Submit a request and our team will review it.
                </p>
                <button
                  onClick={handleRequestSeller}
                  disabled={requestingSeller}
                  className="bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {requestingSeller ? "Submitting..." : "Request to become a seller"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}