"use client";

import { useEffect, useRef, useState } from "react";
import type { PetStatusResponse } from "@/lib/api";
import { useFrameAnimation } from "@/hooks/useFrameAnimation";
import {
  BEAR_ANIMATION_CONFIG,
  type BearAnimation,
  getBearFrameSrc,
} from "@/lib/bearAnimations";
import { PET_CHARACTERS, type PetCharacter } from "@/lib/petCharacters";

const FRAME_SIZE = 16;
const SCALE = 6;
const SPEED = 2;
const SPRITE_WALK_FRAMES = 4;

export type PetBubbleKind =
  | "confirm"
  | "thinking"
  | "success"
  | "encourage"
  | "notice"
  | "error";

export interface PetBubbleState {
  id: string;
  kind: PetBubbleKind;
  message: string;
  snippet?: string;
}

interface AnimatedPetProps {
  bubble: PetBubbleState | null;
  petStatus: PetStatusResponse | null;
  petIndex: number;
  isQuizActive?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}

const BUBBLE_ICON: Record<PetBubbleKind, string> = {
  confirm: "🐾",
  thinking: "🧠",
  success: "🎉",
  encourage: "💪",
  notice: "💬",
  error: "😿",
};

function resolveBearAnimation(
  bubble: PetBubbleState | null,
  isMoving: boolean
): BearAnimation {
  if (bubble?.kind === "error") return "die";
  if (
    bubble?.kind === "confirm" ||
    bubble?.kind === "thinking" ||
    bubble?.kind === "success"
  ) {
    return "atk";
  }
  if (isMoving && !bubble) return "walk";
  return "idle";
}

export default function AnimatedPet({
  bubble,
  petStatus,
  petIndex,
  isQuizActive = false,
  onAccept,
  onDecline,
  onClose,
}: AnimatedPetProps) {
  const [position, setPosition] = useState({ x: 40, y: 40 });
  const [direction, setDirection] = useState(2);
  const [isMoving, setIsMoving] = useState(false);
  const [spriteFrame, setSpriteFrame] = useState(0);

  const currentPet: PetCharacter =
    PET_CHARACTERS[petIndex] ?? PET_CHARACTERS[0];
  const isAnimatedBear = currentPet.renderType === "animated-bear";

  const requestRef = useRef<number | null>(null);
  const interactionActiveRef = useRef(false);
  const quizActiveRef = useRef(isQuizActive);

  const canShowBubble = Boolean(bubble);
  const effectiveBubble = bubble;

  const currentAnimation = resolveBearAnimation(
    effectiveBubble,
    isQuizActive && !bubble ? false : isMoving
  );
  const { frameCount, fps } = BEAR_ANIMATION_CONFIG[currentAnimation];
  const bearFrame = useFrameAnimation({
    frameCount,
    fps,
    playing: isAnimatedBear,
  });
  const bearFrameSrc = getBearFrameSrc(currentAnimation, bearFrame);
  const facingLeft = direction === 3;
  const spriteBgX = -(spriteFrame * FRAME_SIZE);
  const spriteBgY = -(direction * FRAME_SIZE);

  useEffect(() => {
    interactionActiveRef.current = bubble !== null;
  }, [bubble]);

  useEffect(() => {
    quizActiveRef.current = isQuizActive;
    if (isQuizActive) {
      setIsMoving(false);
    }
  }, [isQuizActive]);

  useEffect(() => {
    if (isAnimatedBear) return;

    const interval = setInterval(() => {
      setSpriteFrame((previous) => {
        if (!isMoving || bubble || isQuizActive) return 0;
        return (previous + 1) % SPRITE_WALK_FRAMES;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [bubble, isAnimatedBear, isMoving, isQuizActive]);

  useEffect(() => {
    let targetX = 40;
    let targetY = 40;
    let idleTimeout: NodeJS.Timeout;

    const pickNewTarget = () => {
      if (interactionActiveRef.current || quizActiveRef.current) return;
      targetX = Math.floor(Math.random() * 300) + 20;
      targetY = Math.floor(Math.random() * 200) + 20;
      setIsMoving(true);
    };

    const updatePosition = () => {
      if (!interactionActiveRef.current && !quizActiveRef.current) {
        setPosition((previous) => {
          const dx = targetX - previous.x;
          const dy = targetY - previous.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < SPEED) {
            setIsMoving(false);
            clearTimeout(idleTimeout);
            idleTimeout = setTimeout(
              pickNewTarget,
              Math.random() * 3000 + 2000
            );
            return { x: targetX, y: targetY };
          }

          if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? 2 : 3);
          } else {
            setDirection(dy > 0 ? 1 : 0);
          }

          return {
            x: previous.x + (dx / distance) * SPEED,
            y: previous.y + (dy / distance) * SPEED,
          };
        });
      }
      requestRef.current = requestAnimationFrame(updatePosition);
    };

    idleTimeout = setTimeout(pickNewTarget, 2000);
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      clearTimeout(idleTimeout);
    };
  }, []);

  const expPercentage = petStatus
    ? Math.min((petStatus.current_exp / petStatus.max_exp) * 100, 100)
    : 0;
  const isResult =
    bubble?.kind === "success" || bubble?.kind === "encourage";

  const showBubble = canShowBubble;

  return (
    <div
      className={`group fixed flex flex-col justify-end transition-all duration-500 ${
        isQuizActive
          ? "bottom-6 left-4 z-30 items-start lg:left-[320px]"
          : "z-50 items-center"
      }`}
      style={
        isQuizActive
          ? { width: FRAME_SIZE * SCALE }
          : {
              right: `${showBubble ? Math.max(position.x, 120) : position.x}px`,
              bottom: `${position.y}px`,
              width: FRAME_SIZE * SCALE,
            }
      }
    >
      <div
        className={`absolute bottom-full mb-5 w-72 max-w-[calc(100vw-2rem)] rounded-2xl rounded-br-none border p-4 text-left text-xs text-white shadow-2xl backdrop-blur-md transition-all duration-200 ${
          showBubble
            ? "pointer-events-auto translate-y-0 border-tertiary/30 bg-surface/95 opacity-100"
            : "pointer-events-none translate-y-2 border-white/20 bg-surface/90 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        } ${isQuizActive && !bubble ? "!pointer-events-none !opacity-0" : ""}`}
      >
        {showBubble ? (
          <>
            <div className="flex items-start gap-2">
              <span className="text-xl leading-none">
                {BUBBLE_ICON[bubble.kind]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={`font-bold ${currentPet.color}`}>
                    {currentPet.name}
                  </span>
                  {bubble.kind !== "confirm" &&
                    bubble.kind !== "thinking" && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-white/50 hover:text-white"
                        aria-label="Đóng thông báo của Pet"
                      >
                        ×
                      </button>
                    )}
                </div>
                <p className="text-[13px] leading-relaxed text-white">
                  {bubble.message}
                </p>
              </div>
            </div>

            {bubble.snippet && (
              <div className="mt-3 max-h-20 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] italic leading-relaxed text-white/70">
                “{bubble.snippet}”
              </div>
            )}

            {bubble.kind === "confirm" && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onAccept}
                  className="rounded-xl border border-tertiary/40 bg-tertiary/20 px-3 py-2 font-bold text-tertiary transition-colors hover:bg-tertiary/30 active:scale-95"
                >
                  OK, làm task 🎯
                </button>
                <button
                  type="button"
                  onClick={onDecline}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70 transition-colors hover:bg-white/10 active:scale-95"
                >
                  Để sau
                </button>
              </div>
            )}

            {bubble.kind === "thinking" && (
              <div className="mt-3 flex items-center gap-1.5 text-tertiary">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary delay-75" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-tertiary delay-150" />
                <span className="ml-1 text-[11px]">Đang chuẩn bị quiz…</span>
              </div>
            )}

            {petStatus && (
              <div
                className={`mt-3 border-t border-white/10 pt-2 ${
                  isResult ? "animate-pulse" : ""
                }`}
              >
                <div className="mb-1 flex justify-between text-[10px] text-white/60">
                  <span>{petStatus.level_name}</span>
                  <span className="font-bold text-tertiary">
                    {petStatus.current_exp}/{petStatus.max_exp} EXP
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-tertiary transition-all duration-700"
                    style={{ width: `${expPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            Hi! Mình là{" "}
            <span className={`${currentPet.color} font-bold`}>
              {currentPet.name}
            </span>
            .<br />
            Bôi đen slide để gọi mình nhé!
            {petStatus && (
              <div className="mt-2 border-t border-white/10 pt-2 text-[10px] text-tertiary">
                {petStatus.current_exp}/{petStatus.max_exp} EXP
              </div>
            )}
          </>
        )}
      </div>

      <div
        style={{ width: FRAME_SIZE * SCALE, height: FRAME_SIZE * SCALE }}
        className="relative flex items-end justify-center"
      >
        {isAnimatedBear ? (
          <img
            src={bearFrameSrc}
            alt={currentPet.name}
            width={FRAME_SIZE}
            height={FRAME_SIZE}
            draggable={false}
            className={`z-10 transition-all ${
              showBubble
                ? "cursor-default"
                : "cursor-pointer hover:-translate-y-2 hover:brightness-125 active:scale-95"
            }`}
            style={{
              transform: `scale(${SCALE})${facingLeft ? " scaleX(-1)" : ""}`,
              transformOrigin: "bottom center",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <div
            className={`z-10 transition-all ${
              showBubble
                ? "cursor-default"
                : "cursor-pointer hover:-translate-y-2 hover:brightness-125 active:scale-95"
            }`}
            style={{
              width: FRAME_SIZE,
              height: FRAME_SIZE,
              backgroundImage: `url('/sprites/${currentPet.spriteFile}')`,
              backgroundPosition: `${spriteBgX}px ${spriteBgY}px`,
              backgroundRepeat: "no-repeat",
              transform: `scale(${SCALE})${facingLeft ? " scaleX(-1)" : ""}`,
              transformOrigin: "bottom center",
              imageRendering: "pixelated",
            }}
            role="img"
            aria-label={currentPet.name}
          />
        )}
        <div
          className={`absolute bottom-0 h-3 w-10 rounded-full blur-md transition-colors duration-500 ${currentPet.glow}`}
        />
      </div>
    </div>
  );
}
