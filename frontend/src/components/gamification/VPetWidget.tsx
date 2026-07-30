"use client";

import { useState } from "react";
import Image from "next/image";
import { useGamification } from "@/features/gamification/useGamification";

export default function VPetWidget() {
  const { progress, feedPet, playWithPet, gainExp } = useGamification();
  const { pet } = progress;
  const expPercentage = Math.min((pet.exp / pet.maxExp) * 100, 100);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full glass-card border border-white/20 flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(47,217,244,0.3)] animate-bounce overflow-hidden"
      >
        <Image src={pet.imageUrl} alt="Pet" width={64} height={64} className="object-cover scale-150 mt-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[floating_3s_ease-in-out_infinite]">
      <div className="glass-card rounded-3xl p-stack-md flex flex-col items-center gap-stack-md transition-all duration-500 hover:shadow-[0_0_40px_rgba(47,217,244,0.15)] w-64 relative">
        {/* Top Status Bar */}
        <div className="w-full flex justify-between items-center px-stack-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Tâm trạng: {pet.mood}
          </span>
          <button onClick={() => setIsExpanded(false)} className="text-on-surface-variant hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        {/* Pet Display Area */}
        <div className="relative w-40 h-40 group cursor-pointer" onClick={() => gainExp(2, "Tương tác nhanh")}>
          {/* WebGL Background Aura */}
          <div className="absolute inset-0 rounded-full overflow-hidden animate-[pulse-aura_3s_ease-in-out_infinite]"></div>
          
          {/* Inner Circular Clipping for Pet */}
          <div className="absolute inset-2 rounded-full overflow-hidden bg-surface-container-lowest/40 backdrop-blur-sm border border-white/5 flex items-center justify-center">
            <Image 
              alt="Virtual AI Companion Owl" 
              className={`object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 ${
                pet.mood.includes("Cực Kì") ? 'animate-pet-happy' : 'animate-pet-idle'
              }`}
              src={pet.imageUrl}
              width={128}
              height={128}
            />
          </div>
          
          {/* Interactive Particles Overlay (Micro-interaction) */}
          <div className="absolute -inset-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-tertiary rounded-full animate-ping"></div>
            <div className="absolute bottom-4 right-4 w-1 h-1 bg-secondary rounded-full animate-ping delay-75"></div>
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-primary rounded-full animate-ping delay-150"></div>
          </div>
        </div>
        
        {/* Stats & Progress */}
        <div className="w-full space-y-stack-sm">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-tertiary">LVL {pet.level}</span>
              <span className="font-display-lg-mobile text-[14px] text-on-surface leading-tight tracking-wide">{pet.name}</span>
            </div>
            <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">EXP: {pet.exp}/{pet.maxExp}</span>
          </div>
          
          {/* Sleek Progress Bar */}
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden relative">
            <div className="h-full exp-gradient rounded-full transition-all duration-500 ease-out" style={{ width: `${expPercentage}%` }}></div>
            {/* Fiber Optic Shine Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        {/* Footer Quick Actions */}
        <div className="w-full grid grid-cols-3 gap-2 pt-stack-xs">
          <button onClick={feedPet} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px] text-tertiary">restaurant</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Cho ăn</span>
          </button>
          <button onClick={playWithPet} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px] text-secondary">sports_esports</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Chơi</span>
          </button>
          <button onClick={() => gainExp(15, "Học tập")} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px] text-primary">auto_fix_high</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Học tập</span>
          </button>
        </div>
      </div>
    </div>
  );
}
