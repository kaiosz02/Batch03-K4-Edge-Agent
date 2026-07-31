"use client";

import { useEffect, useState } from "react";

interface FrameAnimationOptions {
  frameCount: number;
  fps: number;
  playing?: boolean;
}

export function useFrameAnimation({
  frameCount,
  fps,
  playing = true,
}: FrameAnimationOptions): number {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
  }, [frameCount, fps, playing]);

  useEffect(() => {
    if (!playing || frameCount <= 1) return;

    const interval = setInterval(() => {
      setFrame((previous) => (previous + 1) % frameCount);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [frameCount, fps, playing]);

  return frame;
}
