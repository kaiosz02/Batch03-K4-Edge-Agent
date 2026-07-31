"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const notImplemented = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Tính năng đang phát triển!");
  };

  const isActive = (path: string) => {
    return pathname === path 
      ? "text-tertiary font-bold border-b-2 border-tertiary pb-1" 
      : "text-on-surface-variant hover:text-on-surface transition-colors pb-1";
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-4 md:px-[var(--spacing-margin-desktop)] bg-surface/30 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(47,217,244,0.1)]">
      <Link href="/" className="font-display-lg text-[20px] md:text-display-lg-mobile tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary whitespace-nowrap overflow-hidden text-ellipsis mr-4">
        VLearn AI
      </Link>
      <div className="flex gap-4 md:gap-stack-lg items-center overflow-x-auto no-scrollbar mask-fade-edges">
        <Link href="/" className={`font-body-md text-sm md:text-body-md whitespace-nowrap ${isActive("/")}`}>
          Học tập
        </Link>
        <Link href="/dashboard" className={`font-body-md text-sm md:text-body-md whitespace-nowrap ${isActive("/dashboard")}`}>
          Tiến độ
        </Link>
        <Link href="/analytics" className={`font-body-md text-sm md:text-body-md whitespace-nowrap ${isActive("/analytics")}`}>
          Phân tích (GV)
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-stack-md ml-4">
        <button onClick={notImplemented} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary transition-colors active:scale-95">
          settings
        </button>
        <button onClick={notImplemented} className="material-symbols-outlined text-on-surface-variant hover:text-tertiary transition-colors active:scale-95">
          account_circle
        </button>
      </div>
    </nav>
  );
}
