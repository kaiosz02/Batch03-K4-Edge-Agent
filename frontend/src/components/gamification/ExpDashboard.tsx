"use client";

import Link from "next/link";
import { useGamification } from "@/features/gamification/useGamification";

export default function ExpDashboard() {
  const { progress } = useGamification();
  const { pet, totalExp, streakDays, recentActivities } = progress;

  const notImplemented = () => {
    alert("Tính năng đang phát triển!");
  };

  return (
    <div className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 mx-auto mt-24">
      {/* Header / Banner Section */}
      <div className="relative h-48 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-container via-surface-container-highest to-tertiary-container opacity-90"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #2fd9f4 0%, transparent 50%), radial-gradient(circle at 80% 70%, #d3bbff 0%, transparent 50%)' }}
          ></div>
        </div>
        {/* Confetti/Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-10 w-2 h-2 bg-tertiary rounded-full animate-ping"></div>
          <div className="absolute bottom-10 right-20 w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white rounded-full animate-bounce"></div>
        </div>
        <div className="relative z-10 text-center space-y-2">
          <span className="material-symbols-outlined text-tertiary text-5xl mb-2 filter drop-shadow-[0_0_8px_rgba(47,217,244,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>
            workspace_premium
          </span>
          <h1 className="font-display-lg text-display-lg-mobile text-white tracking-tight">Bảng Điểm Cá Nhân</h1>
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em]">Kỳ học 2024 • AI Master Elite</p>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-stack-lg space-y-stack-lg">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
          {/* EXP Card */}
          <div className="glass-panel p-stack-md rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 neon-glow-purple">
            <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Tổng EXP</span>
            <div className="text-secondary font-headline-md text-headline-md flex items-baseline gap-1">
              <span className="animate-pulse">{totalExp.toLocaleString()}</span>
              <span className="text-[12px] opacity-50">pts</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary-container to-secondary w-[75%] shadow-[0_0_8px_rgba(211,187,255,0.6)]"></div>
            </div>
          </div>
          
          {/* Level Card */}
          <div className="glass-panel p-stack-md rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300 border-tertiary/20">
            <span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Cấp Độ Thú Cưng</span>
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center animate-[floating_3s_ease-in-out_infinite]">
                <span className="material-symbols-outlined text-tertiary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] font-bold border border-white/10">LV{pet.level}</div>
            </div>
            <span className="font-body-md text-body-md text-on-surface font-semibold">{pet.name}</span>
          </div>
          
          {/* Streak Card */}
          <div className="glass-panel p-stack-md rounded-2xl flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300">
            <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">Streak Học Tập</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-headline-md text-headline-md">{streakDays} Ngày</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">liên tiếp</span>
          </div>
        </div>
        
        {/* Activity List Section */}
        <div className="space-y-stack-md">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-headline-md text-[18px] text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-[20px]">history</span>
              Hoạt động gần đây
            </h3>
            <button onClick={notImplemented} className="text-tertiary font-label-sm text-label-sm hover:underline transition-all">Xem tất cả</button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-stack-sm pr-2 custom-scrollbar">
            {recentActivities.map((act) => {
              let icon = "star";
              let colorClass = "text-white";
              let borderClass = "border-white/50";
              let bgClass = "bg-white/10";
              
              if (act.type === "tutor") {
                icon = "forum";
                colorClass = "text-tertiary";
                borderClass = "border-tertiary";
                bgClass = "bg-tertiary/10";
              } else if (act.type === "quiz") {
                icon = "quiz";
                colorClass = "text-secondary";
                borderClass = "border-secondary";
                bgClass = "bg-secondary/10";
              } else if (act.type === "slide") {
                icon = "auto_stories";
                colorClass = "text-primary";
                borderClass = "border-primary";
                bgClass = "bg-primary/10";
              }

              return (
                <div key={act.id} className={`glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors border-l-4 ${borderClass}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface font-medium">{act.title} <span className={colorClass}>+{act.expGained} EXP</span></p>
                      <p className="text-on-surface-variant text-[12px]">{act.timeAgo} • {act.context}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">chevron_right</span>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Modal Actions */}
        <div className="pt-stack-md flex gap-stack-md">
          <button onClick={notImplemented} className="flex-1 py-3 px-6 rounded-xl font-label-sm text-label-sm text-white bg-gradient-to-r from-secondary-container to-secondary hover:shadow-[0_0_20px_rgba(211,187,255,0.4)] active:scale-95 transition-all duration-300">
            Nâng cấp kỹ năng
          </button>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl glass-panel font-label-sm text-label-sm text-on-surface hover:bg-white/10 active:scale-95 transition-all duration-300">
              Đóng
            </button>
          </Link>
        </div>
      </div>
      
      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-tertiary/40 to-transparent blur-md"></div>
    </div>
  );
}
