import type React from "react";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: "学習型タイピング",
  description: "タイピングしながら知識を深める学習アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${plexMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
