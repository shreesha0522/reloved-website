"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProfile, updateProfile, requestSeller, UserProfile } from "@/lib/user";
import { setupMFA, verifySetupMFA, disableMFA } from "@/lib/mfa";
import { useCurrentUser } from "@/hooks/useCurrentUser";

function AccountPageInner() {
  const router = useRouter();
  const { loading: checkingSession, isLoggedIn, user, refetch } = useCurrentUser();
  const searchParams = useSearchParams();
  const passwordExpired = searchParams.get("passwordExpired") === "true";
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

  // --- MFA (2FA) state ---
  const [mfaBusy, setMfaBusy] = useState(false);
  const [mfaMessage, setMfaMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  useEffect(() => {
    if (checkingSession) return;
    if (!isLoggedIn) {
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
  }, [checkingSession, isLoggedIn, router]);

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

  // --- MFA handlers ---
  async function handleStartMfaSetup() {
    setMfaMessage(null);
    setMfaBusy(true);
    const result = await setupMFA();
    setMfaBusy(false);

    if (result.success && result.qrCode) {
      setQrCode(result.qrCode);
      setManualKey(result.manualEntryKey || null);
    } else {
      setMfaMessage({ type: "error", text: result.message || "Could not start 2FA setup." });
    }
  }

  async function handleConfirmMfaSetup(e: React.FormEvent) {
    e.preventDefault();
    setMfaMessage(null);

    if (!setupCode.trim()) {
      setMfaMessage({ type: "error", text: "Please enter the 6-digit code." });
      return;
    }

    setMfaBusy(true);
    const result = await verifySetupMFA(setupCode.trim());
    setMfaBusy(false);

    if (result.success) {
      setMfaMessage({ type: "success", text: "Two-factor authentication is now enabled." });
      setQrCode(null);
      setManualKey(null);
      setSetupCode("");
      await refetch(); // updates mfaEnabled in the useCurrentUser hook
    } else {
      setMfaMessage({ type: "error", text: result.message || "Invalid code. Please try again." });
    }
  }

  function cancelMfaSetup() {
    setQrCode(null);
    setManualKey(null);
    setSetupCode("");
    setMfaMessage(null);
  }

  async function handleDisableMfa(e: React.FormEvent) {
    e.preventDefault();
    setMfaMessage(null);

    if (!disablePassword) {
      setMfaMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    setMfaBusy(true);
    const result = await disableMFA(disablePassword);
    setMfaBusy(false);

    if (result.success) {
      setMfaMessage({ type: "success", text: "Two-factor authentication has been disabled." });
      setShowDisableForm(false);
      setDisablePassword("");
      await refetch();
    } else {
      setMfaMessage({ type: "error", text: result.message || "Could not disable 2FA." });
    }
  }

  if (checkingSession || loading) {
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

        {passwordExpired && (
          <div
            role="alert"
            className="mb-5 px-4 py-3 rounded-lg text-sm border bg-amber-50 border-amber-200 text-amber-800"
          >
            Your password has expired. Please set a new one below to continue using your account securely.
          </div>
        )}

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

        {/* --- Two-Factor Authentication --- */}
        <div className="bg-white/60 rounded-xl p-6 mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-xl text-[#1A2E2A]">Two-Factor Authentication</h2>
            {user && (
              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                  user.mfaEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-[#E3E9E1] text-[#4a5a55]"
                }`}
              >
                {user.mfaEnabled ? "Enabled" : "Disabled"}
              </span>
            )}
          </div>

          {mfaMessage && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm border ${
                mfaMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {mfaMessage.text}
            </div>
          )}

          {/* Case 1: MFA is off, no setup in progress */}
          {!user?.mfaEnabled && !qrCode && (
            <>
              <p className="text-sm text-[#6B7B76] mb-4">
                Add an extra layer of security to your account. Once enabled, you'll need a code
                from an authenticator app (like Google Authenticator or Authy) every time you log in.
              </p>
              <button
                onClick={handleStartMfaSetup}
                disabled={mfaBusy}
                className="bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
              >
                {mfaBusy ? "Starting setup..." : "Enable Two-Factor Authentication"}
              </button>
            </>
          )}

          {/* Case 2: setup in progress — show QR code + confirmation code input */}
          {!user?.mfaEnabled && qrCode && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#6B7B76]">
                Scan this QR code with your authenticator app, then enter the 6-digit code it shows.
              </p>
              <img
                src={qrCode}
                alt="Two-factor authentication QR code"
                className="w-40 h-40 border border-[#D8E0D9] rounded-lg bg-white p-2"
              />
              {manualKey && (
                <p className="text-xs text-[#6B7B76]">
                  Can't scan? Enter this key manually:{" "}
                  <span className="font-mono text-[#1A2E2A] break-all">{manualKey}</span>
                </p>
              )}
              <form onSubmit={handleConfirmMfaSetup} className="flex flex-col gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={setupCode}
                  onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full max-w-[180px] border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-center text-lg tracking-[0.3em] bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={mfaBusy}
                    className="bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                  >
                    {mfaBusy ? "Verifying..." : "Confirm & Enable"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelMfaSetup}
                    className="px-6 border border-[#D8E0D9] text-[#1A2E2A] rounded-lg text-sm hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Case 3: MFA is on */}
          {user?.mfaEnabled && !showDisableForm && (
            <>
              <p className="text-sm text-[#6B7B76] mb-4">
                Two-factor authentication is protecting your account. You'll be asked for a code
                from your authenticator app every time you log in.
              </p>
              <button
                onClick={() => setShowDisableForm(true)}
                className="text-sm text-red-600 border border-red-200 rounded-lg px-6 py-2.5 hover:bg-red-50 transition-colors"
              >
                Disable Two-Factor Authentication
              </button>
            </>
          )}

          {user?.mfaEnabled && showDisableForm && (
            <form onSubmit={handleDisableMfa} className="flex flex-col gap-3 max-w-sm">
              <label className="block text-sm text-[#1A2E2A]">
                Enter your password to confirm disabling 2FA
              </label>
              <input
                type="password"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={mfaBusy}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
                >
                  {mfaBusy ? "Disabling..." : "Confirm Disable"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDisableForm(false); setDisablePassword(""); setMfaMessage(null); }}
                  className="px-6 border border-[#D8E0D9] text-[#1A2E2A] rounded-lg text-sm hover:bg-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

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
export default function AccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F4F6F2] px-10 py-12">
        <p className="text-[#6B7B76] text-sm">Loading your account...</p>
      </div>
    }>
      <AccountPageInner />
    </Suspense>
  );
}
