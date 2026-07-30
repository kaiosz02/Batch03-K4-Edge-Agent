"use client";

import Link from "next/link";

export default function Navbar() {
  const notImplemented = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Tính năng đang phát triển!");
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-[var(--spacing-margin-desktop)] bg-surface/30 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(47,217,244,0.1)]">
      <Link href="/" className="font-display-lg text-display-lg-mobile tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
        Chương trình AI Master
      </Link>
      <div className="hidden md:flex gap-stack-lg items-center">
        <a onClick={notImplemented} className="font-body-md text-body-md text-tertiary font-bold border-b-2 border-tertiary pb-1 cursor-pointer">
          Bài học
        </a>
        <a onClick={notImplemented} className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
          Tài liệu
        </a>
        <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="/dashboard">
          Tiến độ
        </Link>
        <a onClick={notImplemented} className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
          Chứng chỉ
        </a>
      </div>
      <div className="flex items-center gap-stack-md">
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
