"use client";

import { useSlideViewer } from "@/features/slide-viewer/useSlideViewer";

export default function SlideViewer() {
  const { currentSlide, currentIndex, totalSlides, isFirstSlide, isLastSlide, nextSlide, prevSlide } = useSlideViewer();

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <span className="text-tertiary text-label-sm uppercase tracking-widest font-bold">
            Đang học
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            {currentSlide.title}
          </h1>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full font-label-sm text-on-surface-variant">
          Trang <span className="text-tertiary font-bold">{currentSlide.pageNumber}</span>/{totalSlides}
        </div>
      </div>
      
      <div className="flex-1 glass-panel rounded-3xl relative group overflow-hidden shadow-2xl border border-white/10 min-h-0">
        <div className="absolute inset-0 z-0 bg-white">
          <iframe
            key={`${currentSlide.id}-${currentSlide.pageNumber}`}
            title={currentSlide.title}
            className="w-full h-full border-0"
            src={`${currentSlide.pdfUrl}#page=${currentSlide.pageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          />
        </div>
        
        {/* We add pointer-events-none to the overlay container so users can interact with the PDF if needed, 
            but keep buttons clickable using pointer-events-auto */}
        <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-center bg-gradient-to-t from-background/90 to-transparent pt-32 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button 
            onClick={prevSlide}
            disabled={isFirstSlide}
            className={`pointer-events-auto flex items-center gap-2 px-6 py-3 glass-panel rounded-xl text-on-surface transition-all border border-white/20 group/btn ${isFirstSlide ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95'}`}
          >
            <span className="material-symbols-outlined transition-transform group-hover/btn:-translate-x-1">
              arrow_back
            </span>
            <span className="font-label-sm">Quay lại</span>
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-tertiary neon-cyan-glow' : 'w-2 bg-white/20'}`}
              ></div>
            ))}
          </div>
          
          <button 
            onClick={nextSlide}
            disabled={isLastSlide}
            className={`pointer-events-auto flex items-center gap-2 px-8 py-3 bg-tertiary text-on-tertiary font-bold rounded-xl transition-all group/btn ${isLastSlide ? 'opacity-50 cursor-not-allowed' : 'neon-cyan-glow hover:brightness-110 active:scale-95'}`}
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
