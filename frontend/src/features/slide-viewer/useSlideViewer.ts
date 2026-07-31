import { useState, useCallback, useEffect } from 'react';
import { BackendSlide } from '@/lib/types';
import { getSlideList } from '@/lib/api';

export function useSlideViewer() {
  const [slides, setSlides] = useState<BackendSlide[]>([]);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);
  
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0-indexed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch slides on mount
  useEffect(() => {
    async function loadSlides() {
      try {
        const data = await getSlideList();
        setSlides(data.slides);
        if (data.slides.length > 0) {
          setCurrentSlideId(data.slides[0].slide_id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi tải danh sách slide');
      } finally {
        setIsLoading(false);
      }
    }
    loadSlides();
  }, []);

  const currentSlide = slides.find(s => s.slide_id === currentSlideId) || null;
  const totalPages = currentSlide?.total_pages ?? 0;

  const changeSlide = useCallback((slideId: string) => {
    setCurrentSlideId(slideId);
    setCurrentPageIndex(0); // Reset page on slide change
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // currentPageNumber là 1-indexed (để gửi cho backend và hiển thị #page= trong iframe)
  const currentPageNumber = currentPageIndex + 1;

  return {
    slides,
    currentSlide,
    changeSlide,
    currentPageIndex,
    currentPageNumber,
    totalPages,
    isFirstPage: currentPageIndex === 0,
    isLastPage: currentPageIndex === totalPages - 1,
    isLoading,
    error,
    nextPage,
    prevPage,
  };
}
