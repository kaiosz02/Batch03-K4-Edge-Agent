"use client";

import { useState } from "react";
import { useTutorChat } from "@/features/tutor/useTutorChat";
import CanvasPet, { PetType } from "@/components/gamification/CanvasPet";

export default function TutorPanel() {
  const { messages, isTyping, sendMessage, triggerQuickAction, messagesEndRef } = useTutorChat();
  const [inputValue, setInputValue] = useState("");
  const [petType, setPetType] = useState<PetType>('spider');

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  const notImplemented = () => {
    alert("Tính năng đính kèm tệp đang phát triển!");
  };

  return (
    <aside className="w-full md:w-80 lg:w-96 glass-panel border-l border-white/10 flex flex-col h-full bg-surface-container-low/30 relative z-20">
      {/* Background Interactive Canvas Pet */}
      <CanvasPet isTyping={isTyping} petType={petType} />

      <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-20">
        <div className="flex flex-col">
          <h2 className="font-headline-md text-[18px] text-on-surface">VLearn AI Tutor</h2>
          <div className="font-label-sm text-[11px] text-tertiary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Đang trực tuyến
          </div>
        </div>
        <select 
          value={petType} 
          onChange={(e) => setPetType(e.target.value as PetType)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-on-surface-variant focus:outline-none focus:border-tertiary"
        >
          <option value="spider">Nhện</option>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
          <option value="dino">Khủng Long</option>
          <option value="chicken">Gà</option>
        </select>
      </div>
      
      <div className="px-6 py-3 border-b border-white/10 overflow-x-auto custom-scrollbar flex gap-2 whitespace-nowrap shrink-0">
        <button onClick={() => triggerQuickAction("explain")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[12px] font-bold hover:bg-tertiary/20 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">description</span>
          Giải thích slide
        </button>
        <button onClick={() => triggerQuickAction("summarize")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[12px] font-bold hover:bg-secondary/20 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">short_text</span>
          Tóm tắt
        </button>
        <button onClick={() => triggerQuickAction("review")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-on-surface text-[12px] font-bold hover:bg-white/10 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
          Tổng kết
        </button>
        <button onClick={() => triggerQuickAction("quiz")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container/20 border border-secondary-container/30 text-on-secondary-container text-[12px] font-bold hover:bg-secondary-container/30 transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[16px]">quiz</span>
          Tạo câu hỏi ôn tập
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-secondary/20' : 'bg-tertiary/20'}`}>
              <span className={`material-symbols-outlined text-[18px] ${msg.sender === 'user' ? 'text-secondary' : 'text-tertiary'}`}>
                {msg.sender === 'user' ? 'person' : 'smart_toy'}
              </span>
            </div>
            <div className={`p-3 max-w-[85%] ${
              msg.sender === 'user' 
                ? 'bg-secondary-container/30 rounded-2xl rounded-tr-none border border-secondary/20 neon-purple-glow' 
                : 'glass-panel rounded-2xl rounded-tl-none'
            }`}>
              <p className={`font-body-md text-[14px] leading-relaxed ${msg.sender === 'user' ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                {msg.text}
              </p>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.citations.map((cite, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-tertiary font-bold">
                      Trích dẫn: {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-tertiary/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
            </div>
            <div className="glass-panel p-3 rounded-2xl rounded-tl-none max-w-[85%] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="relative">
          <button onClick={notImplemented} className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant hover:text-tertiary transition-colors text-[20px] active:scale-95">
            attach_file
          </button>
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl py-3 pr-12 focus:outline-none focus:border-secondary transition-colors text-on-surface pl-10" 
            placeholder="Hỏi gia sư..." 
            type="text" 
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary hover:text-on-secondary-container transition-colors disabled:opacity-50 disabled:hover:text-secondary active:scale-95"
          >
            send
          </button>
        </div>
      </div>
    </aside>
  );
}
