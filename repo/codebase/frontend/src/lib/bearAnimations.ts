export type BearAnimation = "idle" | "walk" | "atk" | "die";

export const BEAR_ANIMATION_CONFIG: Record<
  BearAnimation,
  { frameCount: number; fps: number }
> = {
  idle: { frameCount: 16, fps: 8 },
  walk: { frameCount: 16, fps: 10 },
  atk: { frameCount: 16, fps: 12 },
  die: { frameCount: 16, fps: 8 },
};

export function getBearFrameSrc(
  animation: BearAnimation,
  frameIndex: number
): string {
  const frameNumber = String(frameIndex + 1).padStart(2, "0");
  return `/sprites/bear/${animation}/${frameNumber}.png`;
}
