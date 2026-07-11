// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/app/components/ConditionalHeader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ReLoved",
  description: "Thoughtfully designed, expertly crafted artisanal products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-sans bg-[#E8EDE6] text-[#1A2E2A]`}>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}