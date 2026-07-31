"use client";

import { useEffect, useRef } from "react";
import { Creature, CreatureFactory } from "@/lib/pets/ProceduralPets";

export type PetType = 'spider' | 'dog' | 'cat' | 'dino' | 'chicken';

interface CanvasPetProps {
  isTyping?: boolean;
  petType?: PetType;
}

export default function CanvasPet({ isTyping = false, petType = 'spider' }: CanvasPetProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petRef = useRef<Creature | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let targetX = 0;
    let targetY = 0;
    let idleFrames = 0;

    const pickNewTarget = () => {
      const margin = 50;
      targetX = margin + Math.random() * (canvas.width - margin * 2);
      targetY = margin + Math.random() * (canvas.height - margin * 2);
      idleFrames = 0;
    };

    const spawnPet = () => {
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      switch (petType) {
        case 'spider': petRef.current = CreatureFactory.createSpider(x, y); break;
        case 'dog': petRef.current = CreatureFactory.createDog(x, y); break;
        case 'cat': petRef.current = CreatureFactory.createCat(x, y); break;
        case 'dino': petRef.current = CreatureFactory.createDino(x, y); break;
        case 'chicken': petRef.current = CreatureFactory.createChicken(x, y); break;
        default: petRef.current = CreatureFactory.createSpider(x, y);
      }
      pickNewTarget();
    };

    const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
        if (!petRef.current) spawnPet();
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    
    spawnPet();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (petRef.current) {
        const pet = petRef.current;
        
        const dx = targetX - pet.pos.x;
        const dy = targetY - pet.pos.y;
        
        if (Math.hypot(dx, dy) < 20) {
          idleFrames++;
          const maxIdle = isTyping ? 30 : 150;
          if (idleFrames > maxIdle) pickNewTarget();
        }
        
        pet.speed = isTyping ? 0.08 : 0.03;
        pet.update(targetX, targetY);
        
        // Add beautiful global glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(47, 217, 244, 0.8)';
        
        pet.draw(ctx, 'rgba(47, 217, 244, 0.9)');
        
        // Reset shadow
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isTyping, petType]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90"
    />
  );
}
