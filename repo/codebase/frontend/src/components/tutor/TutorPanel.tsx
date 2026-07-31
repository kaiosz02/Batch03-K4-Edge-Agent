"use client";

import { useState } from "react";
import type { TutorChatHook } from "@/features/tutor/useTutorChat";
import QuizCard from "@/components/tutor/QuizCard";
import type { PetStatusResponse } from "@/lib/api";
import type { PetCharacter } from "@/lib/petCharacters";

interface TutorPanelProps {
  chat: TutorChatHook;
  onPetUpdate: (pet: PetStatusResponse) => void;
  currentPet: PetCharacter;
  onChangePet: () => void;
  canChangePet?: boolean;
}

export default function TutorPanel({
  chat,
  onPetUpdate,
  currentPet,
  onChangePet,
  canChangePet = true,
}: TutorPanelProps) {
  const {
    messages,
    isTyping,
    sendMessage,
    handleAnswerSelect,
    messagesEndRef,
  } = chat;

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <aside className="relative z-20 flex min-h-0 w-full max-h-full flex-1 flex-col overflow-hidden border-l border-white/10 bg-surface-container-low/30 glass-panel md:h-full md:w-80 md:flex-none lg:w-96">
      <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 p-6">
        <div className="flex flex-col">
          <h2 className="font-headline-md text-[18px] text-on-surface">V-Pet Tutor</h2>
          <div className="font-label-sm text-[11px] text-tertiary flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Đang trực tuyến · {currentPet.name}
          </div>
        </div>
        <button
          type="button"
          onClick={onChangePet}
          disabled={!canChangePet}
          title={canChangePet ? "Đổi pet" : "Không thể đổi pet lúc này"}
          aria-label="Đổi pet"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-tertiary transition-colors hover:border-tertiary/40 hover:bg-tertiary/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[20px]">pets</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-b border-white/10 overflow-x-auto custom-scrollbar flex gap-2 whitespace-nowrap shrink-0 relative z-20">
        <span className="flex items-center gap-1.5 rounded-full border border-tertiary/30 bg-tertiary/10 px-3 py-1.5 text-[12px] font-bold text-tertiary">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          Quiz do Pet gửi sẽ xuất hiện tại đây
        </span>
        <button
          onClick={() => sendMessage("Hãy giải thích chi tiết slide này giúp tôi.")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[12px] font-bold hover:bg-secondary/20 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">short_text</span>
          Tóm tắt
        </button>
      </div>

      {/* Messages */}
      <div className="relative z-20 flex min-h-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain p-6 custom-scrollbar">
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
                  onPetUpdate={onPetUpdate}
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
