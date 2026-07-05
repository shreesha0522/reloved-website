// app/payment/esewa-callback/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEsewaPayment } from "@/lib/esewa";

export default function EsewaCallbackPage() {
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
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 text-center">
      {status === "verifying" ? (
        <p className="text-[#8A7F76] text-sm">Verifying your payment, please wait...</p>
      ) : (
        <div>
          <p className="text-red-600 text-sm mb-4">{errorMsg}</p>
          <button
            onClick={() => router.push("/cart")}
            className="text-[#8C4A3A] text-sm font-medium hover:underline"
          >
            Back to cart
          </button>
        </div>
      )}
    </div>
  );
}