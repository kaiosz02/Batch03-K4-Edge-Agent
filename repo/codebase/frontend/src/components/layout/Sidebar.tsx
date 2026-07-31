"use client";

import { useState } from "react";

// Mock data Lộ trình học (Curriculum)
const CURRICULUM = [
  {
    id: "day1",
    title: "Day 1: AI & LLM Foundation",
    slides: [
      { id: "s1", title: "Tổng quan AI (Slide 1-10)", isCurrent: false },
      { id: "s2", title: "Kiến trúc LLM (Slide 11-25)", isCurrent: false },
    ],
  },
  {
    id: "day2",
    title: "Day 2: Prompt & RAG",
    slides: [
      { id: "s3", title: "Prompt Engineering (Slide 1-15)", isCurrent: true },
      { id: "s4", title: "RAG & Vector DB (Slide 16-30)", isCurrent: false },
    ],
  },
  {
    id: "day3",
    title: "Day 3: Product Build",
    slides: [
      { id: "s5", title: "Canvas 7 dòng (Slide 1-20)", isCurrent: false },
      { id: "s6", title: "User Validation (Slide 21-35)", isCurrent: false },
    ],
  }
];

export default function Sidebar() {
  const [openDays, setOpenDays] = useState<string[]>(["day2"]); // Mở sẵn Day 2 (vì đang học)

  const toggleDay = (dayId: string) => {
    setOpenDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  const notImplemented = () => {
    alert("Tính năng đang phát triển!");
  };

  return (
    <aside className="hidden lg:flex flex-col p-4 gap-4 z-40 bg-surface-container/20 backdrop-blur-2xl border-r border-white/10 w-[300px] h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-2 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary to-secondary flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white">menu_book</span>
        </div>
        <div>
          <div className="font-headline-md text-[18px] text-white font-bold leading-tight">Lộ trình học</div>
          <div className="font-label-sm text-[12px] text-white/60">VLearn Hackathon</div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2 flex-1">
        {CURRICULUM.map((day) => {
          const isOpen = openDays.includes(day.id);
          return (
            <div key={day.id} className="flex flex-col">
              <button 
                onClick={() => toggleDay(day.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{isOpen ? 'folder_open' : 'folder'}</span>
                  <span className="font-label-sm text-[15px] font-semibold">{day.title}</span>
                </div>
                <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              {/* Dropdown content */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[400px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-1.5 pl-11 pr-2 pb-2">
                  {day.slides.map((slide) => (
                    <button 
                      key={slide.id}
                      onClick={notImplemented}
                      className={`flex items-start text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        slide.isCurrent 
                          ? 'bg-tertiary/20 text-tertiary font-medium border border-tertiary/30 shadow-[0_0_10px_rgba(47,217,244,0.1)] relative overflow-hidden' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {slide.isCurrent && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                      )}
                      <span className={`material-symbols-outlined text-[18px] mr-2 opacity-80 ${slide.isCurrent ? 'text-tertiary' : ''}`}>
                        {slide.isCurrent ? 'play_circle' : 'description'}
                      </span>
                      <span className="mt-0.5 leading-tight">{slide.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
        <button onClick={notImplemented} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-secondary-container/50 to-secondary/30 border border-secondary/50 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(211,187,255,0.3)] transition-all active:scale-95 group">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-y-0.5 transition-transform">cloud_download</span>
          Tải Tài Liệu Nền
        </button>
      </div>
    </aside>
  );
}
