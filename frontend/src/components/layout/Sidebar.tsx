"use client";

export default function Sidebar() {
  const notImplemented = () => {
    alert("Tính năng đang phát triển!");
  };

  return (
    <aside className="hidden lg:flex flex-col p-stack-md gap-stack-sm z-40 bg-surface-container/20 backdrop-blur-2xl border-r border-white/10 w-64 h-full">
      <div className="flex items-center gap-stack-sm mb-stack-lg">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary to-secondary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-tertiary-fixed">smart_toy</span>
        </div>
        <div>
          <div className="font-headline-md text-[18px] text-on-surface leading-tight">Gia sư AI</div>
          <div className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Đang trực tuyến
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-stack-xs flex-1">
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-3 text-tertiary bg-tertiary/10 rounded-xl shadow-[inset_0_0_10px_rgba(47,217,244,0.2)] transition-transform hover:translate-x-1 active:scale-95">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="font-label-sm text-label-sm">Trợ lý AI</span>
        </button>
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 rounded-xl transition-transform hover:translate-x-1 active:scale-95">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-label-sm text-label-sm">Lộ trình</span>
        </button>
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 rounded-xl transition-transform hover:translate-x-1 active:scale-95">
          <span className="material-symbols-outlined">edit_note</span>
          <span className="font-label-sm text-label-sm">Ghi chú</span>
        </button>
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 rounded-xl transition-transform hover:translate-x-1 active:scale-95">
          <span className="material-symbols-outlined">folder_open</span>
          <span className="font-label-sm text-label-sm">Thư viện</span>
        </button>
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 rounded-xl transition-transform hover:translate-x-1 active:scale-95">
          <span className="material-symbols-outlined">groups</span>
          <span className="font-label-sm text-label-sm">Cộng đồng</span>
        </button>
      </nav>
      <div className="mt-auto pt-stack-md border-t border-white/5 flex flex-col gap-2">
        <button onClick={notImplemented} className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-all active:scale-95">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
          <span className="text-label-sm">Hỗ trợ</span>
        </button>
        <button onClick={notImplemented} className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary-container to-secondary text-on-primary font-bold text-label-sm shadow-lg hover:shadow-secondary/20 transition-all active:scale-95">
          Nâng cấp Premium
        </button>
      </div>
    </aside>
  );
}
