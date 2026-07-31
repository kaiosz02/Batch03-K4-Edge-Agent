import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { GamificationProvider } from "@/features/gamification/useGamification";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

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
    <html lang="vi" className={`dark ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col selection:bg-tertiary selection:text-on-tertiary text-on-surface bg-background">
        <GamificationProvider>
          {children}
        </GamificationProvider>
      </body>
    </html>
  );
}
