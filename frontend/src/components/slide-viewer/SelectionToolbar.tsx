"use client";

interface SelectionToolbarProps {
  x: number;
  y: number;
  onAskAI: () => void;
  onCreateQuiz: () => void;
}

/** Floating toolbar (fixed to viewport) khi bôi đen text trên slide */
export default function SelectionToolbar({
  x,
  y,
  onAskAI,
  onCreateQuiz,
}: SelectionToolbarProps) {
  return (
    <div
      className="fixed z-[60] flex items-center gap-1.5 rounded-2xl border border-white/20 bg-surface-container-high/95 px-2 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, calc(-100% - 12px))",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={onAskAI}
        className="flex items-center gap-1.5 rounded-xl bg-secondary/20 border border-secondary/40 px-3 py-1.5 text-[12px] font-bold text-secondary hover:bg-secondary/30 active:scale-95 transition-all whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-[16px]">chat</span>
        Hỏi AI
      </button>
      <button
        type="button"
        onClick={onCreateQuiz}
        className="flex items-center gap-1.5 rounded-xl bg-tertiary/20 border border-tertiary/40 px-3 py-1.5 text-[12px] font-bold text-tertiary hover:bg-tertiary/30 active:scale-95 transition-all whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-[16px]">quiz</span>
        Tạo Quiz
      </button>
    </div>
  );
}
