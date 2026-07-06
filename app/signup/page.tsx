"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [agreed, setAgreed]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: firstName + " " + lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed.");
        return;
      }

     router.push("/login?registered=true");
    } catch {
      setError("Could not connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F2] flex flex-col md:flex-row items-center justify-center px-6 md:px-16 gap-10 md:gap-16 py-10">

      {/* Left image — square */}
      <div className="hidden md:block w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden flex-shrink-0">
        <img
          src="/images/hero.png"
          alt="Handmade pottery"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form */}
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl md:text-4xl text-[#1A2E2A] mb-6 text-center">
          Create your account
        </h1>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          {/* First + Last name */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm text-[#1A2E2A] mb-1.5">First Name</label>
              <input
                type="text"
                placeholder="Shreesha"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#1A2E2A] mb-1.5">Last Name</label>
              <input
                type="text"
                placeholder="Shrestha"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Email</label>
            <input
              type="email"
              placeholder="shreesha@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#1A2E2A] mb-1.5">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-[#D8E0D9] rounded-lg px-4 py-2.5 text-sm bg-white text-[#1A2E2A] focus:outline-none focus:ring-2 focus:ring-[#4A6B5A]/30"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#4A6B5A] w-4 h-4 cursor-pointer flex-shrink-0"
            />
            <span className="text-xs text-[#4a5a55] leading-relaxed">
              I agree with the{" "}
              <button type="button" className="underline hover:text-[#4A6B5A]">Terms of Service</button>
              {" "}and{" "}
              <button type="button" className="underline hover:text-[#4A6B5A]">Privacy Policy</button>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4A6B5A] hover:bg-[#3a5548] disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-colors text-sm tracking-wide mt-1"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#D8E0D9]" />
          <span className="text-xs text-[#6B7B76]">OR Sign up with</span>
          <div className="flex-1 h-px bg-[#D8E0D9]" />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-3 mb-6">

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 border border-[#D8E0D9] bg-white hover:bg-gray-50 transition rounded-lg py-2.5 text-sm font-medium text-[#3c3c3c]">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          {/* Facebook */}
          <button className="w-full flex items-center justify-center gap-3 border border-[#D8E0D9] bg-white hover:bg-gray-50 transition rounded-lg py-2.5 text-sm font-medium text-[#3c3c3c]">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>

          {/* Apple */}
          <button className="w-full flex items-center justify-center gap-3 border border-[#D8E0D9] bg-white hover:bg-gray-50 transition rounded-lg py-2.5 text-sm font-medium text-[#3c3c3c]">
            <svg width="18" height="18" viewBox="0 0 814 1000">
              <path fill="#000000" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 137.7-316.6 272.7-316.6 69.4 0 127.4 45.8 170.1 45.8 40.8 0 106.1-48.4 183.3-48.4 29.1 0 108.2 2.6 168.7 75.3zM627.4 72.4C601.5 104.3 535 134.4 468 134.4c-7.8 0-15.6-.6-23.4-1.9 0-73.8 53.8-149.9 120.8-189.3C601.8-83.6 673.5-109 736.8-109c5.2 0 10.4.3 15.6.6 1.9 79.9-44.2 153.8-124.9 181.4-.2.5-.1.9 0 1.3-.1-.3-.1-.6-.1-.9z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Login link */}
        <p className="text-center text-xs text-[#6B7B76]">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#4A6B5A] font-semibold uppercase tracking-wide hover:underline"
          >
            LOGIN
          </button>
        </p>
      </div>
    </div>
  );
}