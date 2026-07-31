"use client";

import { useSlideViewer } from "@/features/slide-viewer/useSlideViewer";
import { useEffect } from "react";

interface SlideViewerProps {
  /** Callback để TutorPanel biết slide_id và page_num hiện tại khi bôi đen */
  onSlideContextChange?: (slideId: string, pageNum: number) => void;
}

export default function SlideViewer({ onSlideContextChange }: SlideViewerProps) {
  const {
    slides,
    currentSlide,
    changeSlide,
    currentPageNumber,
    currentPageIndex,
    totalPages,
    isFirstPage,
    isLastPage,
    isLoading,
    error,
    nextPage,
    prevPage,
  } = useSlideViewer();

  // Notify context change whenever slide or page changes
  useEffect(() => {
    if (currentSlide) {
      onSlideContextChange?.(currentSlide.slide_id, currentPageNumber);
    }
  }, [currentSlide, currentPageNumber, onSlideContextChange]);

  const handleNextPage = () => {
    nextPage();
  };

  const handlePrevPage = () => {
    prevPage();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden h-full items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-tertiary/30 border-t-tertiary animate-spin" />
        <p className="mt-4 text-on-surface-variant font-body-md">Đang tải bài giảng...</p>
      </div>
    );
  }

  if (error || !currentSlide) {
    return (
      <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden h-full items-center justify-center">
        <p className="text-red-400 bg-red-400/10 px-6 py-3 rounded-xl border border-red-400/20">
          ❌ {error || "Không tìm thấy bài giảng nào trong hệ thống."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col flex-1 max-w-md">
          <span className="text-tertiary text-label-sm uppercase tracking-widest font-bold mb-1">
            Đang học
          </span>
          <select
            value={currentSlide.slide_id}
            onChange={(e) => changeSlide(e.target.value)}
            className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-2 font-headline-sm text-on-surface focus:outline-none focus:border-tertiary w-full truncate cursor-pointer hover:bg-white/5 transition-colors"
          >
            {slides.map((slide) => (
              <option key={slide.slide_id} value={slide.slide_id} className="bg-surface">
                {slide.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 rounded-full font-label-sm text-on-surface-variant">
            Trang <span className="text-tertiary font-bold">{currentPageNumber}</span>/{totalPages}
          </div>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl relative group overflow-hidden shadow-2xl border border-white/10 min-h-0">
        <div className="absolute inset-0 z-0 bg-white">
          <iframe
            key={`${currentSlide.slide_id}-page-${currentPageNumber}`}
            title={currentSlide.title}
            className="w-full h-full border-0"
            src={`${currentSlide.pdf_url}#page=${currentPageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          />
        </div>

        {/* Navigation overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-background/90 to-transparent pt-32 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={handlePrevPage}
            disabled={isFirstPage}
            className={`pointer-events-auto flex items-center gap-2 px-6 py-3 glass-panel rounded-xl text-on-surface transition-all border border-white/20 group/btn ${isFirstPage ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10 active:scale-95"}`}
          >
            <span className="material-symbols-outlined transition-transform group-hover/btn:-translate-x-1">
              arrow_back
            </span>
            <span className="font-label-sm">Quay lại</span>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentPageIndex ? "w-8 bg-tertiary neon-cyan-glow" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={isLastPage}
            className={`pointer-events-auto flex items-center gap-2 px-8 py-3 bg-tertiary text-on-tertiary font-bold rounded-xl transition-all group/btn ${isLastPage ? "opacity-50 cursor-not-allowed" : "neon-cyan-glow hover:brightness-110 active:scale-95"}`}
          >
            <span className="font-label-sm">Tiếp theo</span>
            <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

