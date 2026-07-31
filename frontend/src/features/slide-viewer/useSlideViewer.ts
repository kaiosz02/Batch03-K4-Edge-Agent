import { useState, useCallback } from 'react';
import { MOCK_SLIDES } from '@/constants/mock-data';

export function useSlideViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, MOCK_SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    currentSlide: MOCK_SLIDES[currentIndex],
    currentIndex,
    totalSlides: MOCK_SLIDES.length,
    isFirstSlide: currentIndex === 0,
    isLastSlide: currentIndex === MOCK_SLIDES.length - 1,
    nextSlide,
    prevSlide,
  };
}
