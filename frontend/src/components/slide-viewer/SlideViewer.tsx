"use client";

import { useSlideViewer } from "@/features/slide-viewer/useSlideViewer";
import { track } from "@/features/telemetry/useTelemetry";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

const PdfSlidePage = dynamic(
  () => import("@/components/slide-viewer/PdfSlidePage"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-80 items-center justify-center text-sm text-slate-500">
        Đang khởi tạo trình đọc PDF…
      </div>
    ),
  }
);

export interface SlideSelection {
  text: string;
  slideId: string;
  pageNum: number;
  selectionId: string;
}

interface SlideViewerProps {
  /** Callback để TutorPanel biết slide_id và page_num hiện tại khi bôi đen */
  onSlideContextChange?: (slideId: string, pageNum: number) => void;
  onTextSelected?: (selection: SlideSelection) => void;
}

export default function SlideViewer({
  onSlideContextChange,
  onTextSelected,
}: SlideViewerProps) {
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

  const viewStartedAt = useRef<number>(0);
  const lastViewRef = useRef<{ slideId: string; pageNum: number } | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef("");
  const [pdfWidth, setPdfWidth] = useState(720);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;

    const updateWidth = () => {
      setPdfWidth(Math.max(320, Math.min(container.clientWidth - 32, 960)));
    };
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, [currentSlide?.slide_id]);

  const captureSelection = useCallback(() => {
    const container = pdfContainerRef.current;
    const selection = window.getSelection();
    if (!container || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) return;

    const text = selection.toString().replace(/\s+/g, " ").trim();
    if (!currentSlide || text.length < 10) return;

    const signature = `${currentSlide.slide_id}:${currentPageNumber}:${text}`;
    if (signature === lastSelectionRef.current) return;
    lastSelectionRef.current = signature;

    onTextSelected?.({
      text,
      slideId: currentSlide.slide_id,
      pageNum: currentPageNumber,
      selectionId: `${Date.now()}-${text.length}`,
    });
  }, [currentPageNumber, currentSlide, onTextSelected]);

  // Notify context change whenever slide or page changes
  useEffect(() => {
    if (currentSlide) {
      onSlideContextChange?.(currentSlide.slide_id, currentPageNumber);
      lastSelectionRef.current = "";
    }
  }, [currentSlide, currentPageNumber, onSlideContextChange]);

  // slide_view: flush previous dwell, start new timer
  useEffect(() => {
    if (!currentSlide) return;

    const prev = lastViewRef.current;
    if (prev) {
      const dwellMs = Date.now() - viewStartedAt.current;
      if (dwellMs >= 500) {
        track("slide_view", {
          slide_id: prev.slideId,
          page_num: prev.pageNum,
          dwell_ms: dwellMs,
        });
      }
    }

    lastViewRef.current = {
      slideId: currentSlide.slide_id,
      pageNum: currentPageNumber,
    };
    viewStartedAt.current = Date.now();
  }, [currentSlide, currentPageNumber]);

  // Flush dwell on unmount / page hide
  useEffect(() => {
    const flush = () => {
      const prev = lastViewRef.current;
      if (!prev) return;
      const dwellMs = Date.now() - viewStartedAt.current;
      if (dwellMs < 500) return;
      track("slide_view", {
        slide_id: prev.slideId,
        page_num: prev.pageNum,
        dwell_ms: dwellMs,
      });
      // Reset so we don't double-count if both hide + unmount fire
      viewStartedAt.current = Date.now();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, []);

  const handleNextPage = () => {
    setPdfError(null);
    nextPage();
  };

  const handlePrevPage = () => {
    setPdfError(null);
    prevPage();
  };

  const handleChangeSlide = (slideId: string) => {
    setPdfError(null);
    changeSlide(slideId);
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
            onChange={(e) => handleChangeSlide(e.target.value)}
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
        <div
          ref={pdfContainerRef}
          className="absolute inset-0 z-0 overflow-auto bg-white p-4 custom-scrollbar"
          onMouseUp={() => window.setTimeout(captureSelection, 0)}
          onTouchEnd={() => window.setTimeout(captureSelection, 0)}
        >
          {pdfError ? (
            <div className="flex h-full items-center justify-center px-6 text-center text-red-500">
              Không tải được PDF: {pdfError}
            </div>
          ) : (
            <PdfSlidePage
              key={`${currentSlide.slide_id}-${currentPageNumber}`}
              url={currentSlide.pdf_url}
              pageNumber={currentPageNumber}
              width={pdfWidth}
              onLoadError={setPdfError}
            />
          )}
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
