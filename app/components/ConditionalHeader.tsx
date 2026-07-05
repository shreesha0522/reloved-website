// app/components/ConditionalHeader.tsx
"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/components/header";

const HIDDEN_HEADER_PATHS = ["/login", "/signup"];

export default function ConditionalHeader() {
  const pathname = usePathname();

  if (HIDDEN_HEADER_PATHS.includes(pathname)) {
    return null;
  }

  return <Header />;
}