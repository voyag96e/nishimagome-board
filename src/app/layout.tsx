import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const APP_NAME = "西馬込 次のホーム";
const APP_TITLE = "西馬込 次のホーム｜浅草線の次の発車ホームをすぐ確認";
const APP_DESCRIPTION =
  "都営浅草線・西馬込駅の次の発車ホームをスマホですぐ確認。1番線・2番線どちらに行けばよいかをリアルタイム表示する非公式Webアプリ。平日・土休日ダイヤを自動判別。";
const SITE_URL = "https://nishimagome-board.vercel.app";

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? SITE_URL
      : "http://localhost:3000"
  ),
  title: APP_TITLE,
  description: APP_DESCRIPTION,
  keywords: [
    "西馬込",
    "次のホーム",
    "都営浅草線",
    "西馬込駅",
    "1番線",
    "2番線",
    "発車ホーム",
    "時刻表",
    "次の電車",
  ],
  applicationName: APP_NAME,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-white min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
