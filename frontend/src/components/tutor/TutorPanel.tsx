"use client";

import { useState } from "react";
import { useTutorChat } from "@/features/tutor/useTutorChat";
import CanvasPet, { PetType } from "@/components/gamification/CanvasPet";
import QuizCard from "@/components/tutor/QuizCard";
import { PetStatusResponse } from "@/lib/api";

interface TutorPanelProps {
  slideId?: string;
  pageNum?: number;
}

export default function TutorPanel({ slideId, pageNum }: TutorPanelProps) {
  const {
    messages,
    isTyping,
    sendMessage,
    triggerQuizFromSelection,
    handleAnswerSelect,
    messagesEndRef,
  } = useTutorChat();

  const [inputValue, setInputValue] = useState("");
  const [petType, setPetType] = useState<PetType>("spider");
  const [petStatus, setPetStatus] = useState<PetStatusResponse | null>(null);

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleGenerateQuiz = () => {
    triggerQuizFromSelection(slideId, pageNum);
  };

  const handlePetUpdate = (pet: PetStatusResponse) => {
    setPetStatus(pet);
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

      {/* EXP status bar (hiển thị khi đã có pet status từ backend) */}
      {petStatus && (
        <div className="px-6 py-2 border-b border-white/10 bg-white/3 relative z-20">
          <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
            <span>{petStatus.level_name}</span>
            <span className="text-tertiary font-bold">
              {petStatus.current_exp}/{petStatus.max_exp} EXP
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-tertiary rounded-full neon-cyan-glow transition-all duration-500"
              style={{ width: `${(petStatus.current_exp / petStatus.max_exp) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-6 py-3 border-b border-white/10 overflow-x-auto custom-scrollbar flex gap-2 whitespace-nowrap shrink-0 relative z-20">
        {/* Nút chính: Bôi đen → Tạo câu hỏi */}
        <button
          onClick={handleGenerateQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary/20 border border-tertiary/40 text-tertiary text-[12px] font-bold hover:bg-tertiary/30 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          ✨ Tạo quiz từ bôi đen
        </button>
        <button
          onClick={() => sendMessage("Hãy giải thích chi tiết slide này giúp tôi.")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[12px] font-bold hover:bg-secondary/20 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">short_text</span>
          Tóm tắt
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-h-0 relative z-20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user" ? "bg-secondary/20" : "bg-tertiary/20"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  msg.sender === "user" ? "text-secondary" : "text-tertiary"
                }`}
              >
                {msg.sender === "user" ? "person" : "smart_toy"}
              </span>
            </div>
            <div
              className={`max-w-[90%] ${
                msg.sender === "user"
                  ? "bg-secondary-container/30 rounded-2xl rounded-tr-none border border-secondary/20 neon-purple-glow p-3"
                  : "glass-panel rounded-2xl rounded-tl-none p-3"
              }`}
            >
              <p
                className={`font-body-md text-[13px] leading-relaxed ${
                  msg.sender === "user" ? "text-on-secondary-container" : "text-on-surface"
                }`}
              >
                {msg.text}
              </p>
              {/* Quiz Card nhúng trong tin nhắn AI */}
              {msg.quiz && (
                <QuizCard
                  quiz={msg.quiz}
                  onAnswerSelect={handleAnswerSelect}
                  onPetUpdate={handlePetUpdate}
                />
              )}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.citations.map((cite, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-tertiary font-bold"
                    >
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

      {/* Input */}
      <div className="p-4 border-t border-white/10 shrink-0 relative z-20">
        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="w-full bg-surface-container-lowest border border-white/10 rounded-2xl py-3 pr-12 pl-4 focus:outline-none focus:border-secondary transition-colors text-on-surface text-[14px]"
            placeholder="Nhắn tin với AI Tutor..."
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

