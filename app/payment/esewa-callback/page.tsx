// app/payment/esewa-callback/page.tsx
"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEsewaPayment } from "@/lib/esewa";

function EsewaCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setStatus("error");
      setErrorMsg("No payment data received.");
      return;
    }
    async function verify() {
      const result = await verifyEsewaPayment(data!);
      if (result.success && result.order) {
        router.push(`/order-success?orderId=${result.order._id}`);
      } else {
        setStatus("error");
        setErrorMsg(result.message || "Payment verification failed.");
      }
    }
    verify();
  }, [searchParams, router]);
  return (
    <div className="min-h-screen bg-[#F4F6F2] flex items-center justify-center px-6 text-center">
      {status === "verifying" ? (
        <p className="text-[#6B7B76] text-sm">Verifying your payment, please wait...</p>
      ) : (
        <div>
          <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
          <button
            onClick={() => router.push("/cart")}
            className="text-[#4A6B5A] text-sm font-medium hover:underline"
          >
            Back to cart
          </button>
        </div>
      )}
    </div>
  );
}

export default function EsewaCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F2]" />}>
      <EsewaCallbackContent />
    </Suspense>
  );
}