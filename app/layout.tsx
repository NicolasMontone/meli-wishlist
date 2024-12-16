import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/tailwind-indicator";

import { Analytics } from "@vercel/analytics/react";
import { EmojiBackground } from "@/components/emoji-background";
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
      <body
        className={`${montserrat.variable} antialiased relative bg-gradient-to-r from-rose-300 to-rose-500`}
        style={{
          background: "linear-gradient(135deg, #A9C9FF 0%, #FFBBEC 100%)",
        }}
      >
        <EmojiBackground />
        <div className="z-10">{children}</div>

        <Toaster />
        <TailwindIndicator />
        <Analytics />
      </body>
    </html>
  );
}
