import type { Metadata } from "next";
import "./globals.css";
import { GamificationProvider } from "@/features/gamification/useGamification";

export const metadata: Metadata = {
  title: "AI Master - Modern Learning Interface",
  description: "Gamified AI Learning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Material Symbols stylesheet is shared by every App Router page. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="flex h-full min-h-0 flex-col selection:bg-tertiary selection:text-on-tertiary text-on-surface bg-background">
        <GamificationProvider>
          {children}
        </GamificationProvider>
      </body>
    </html>
  );
}
