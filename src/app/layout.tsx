import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "망할연",
  description: "그대가 생각하는 그와 무조건 잘되기만하진 않을테니까",
  openGraph: {
    title: "망할연",
    description: "그대가 생각하는 그와 무조건 잘되기만하진 않을테니까",
    siteName: "망할연",
    url: "https://malhalyeon.vercel.app",
    images: [
      {
        url: "/images/sumnail.png",
        width: 1200,
        height: 630,
        alt: "망할연 - 데이터로 직면하는 나의 연애 현실",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "망할연",
    description: "그대가 생각하는 그와 무조건 잘되기만하진 않을테니까",
    images: ["/images/sumnail.png"],
  },
  verification: {
    google: "WxC9XCYGgpyXBf4Kql2ngi0NF4LtBHme31-ndCBkPcE",
  },
  
};

import AuthProvider from "@/_components/AuthProvider";
import EmotionRegistry from "@/_components/EmotionRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Analytics />
        <EmotionRegistry>
          <AuthProvider>{children}</AuthProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
