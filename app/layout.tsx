import type { Metadata } from "next";
import { Noto_Sans_Thai, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const thai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phasa Rak · ภาษารัก",
  description: "Learn each other's language, one little word at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(jakarta.variable, thai.variable, "font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
