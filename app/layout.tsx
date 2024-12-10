import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Obsequi.ar - Lista de deseos",
  description: "Compartí tu lista de deseos con tus amigos y familiares",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
        <Toaster />
        <TailwindIndicator />
        <Analytics />
      </body>
    </html>
  );
}
