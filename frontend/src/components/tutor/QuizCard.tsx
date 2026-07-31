"use client";

import { QuizState } from "@/lib/types";
import { PetStatusResponse } from "@/lib/api";

interface QuizCardProps {
  quiz: QuizState;
  onAnswerSelect: (
    quizId: string,
    answer: "A" | "B" | "C" | "D",
    onPetUpdate?: (pet: PetStatusResponse) => void
  ) => Promise<void>;
  onPetUpdate?: (pet: PetStatusResponse) => void;
}

const ANSWER_LABELS = ["A", "B", "C", "D"] as const;

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Dễ", color: "text-green-400" },
  2: { label: "Trung bình", color: "text-yellow-400" },
  3: { label: "Khó", color: "text-red-400" },
};

export default function QuizCard({ quiz, onAnswerSelect, onPetUpdate }: QuizCardProps) {
  const diff = DIFFICULTY_LABELS[quiz.difficulty_level] ?? { label: "?", color: "text-white" };
  const isAnswered = quiz.phase === "answered";

  const handleSelect = async (answer: "A" | "B" | "C" | "D") => {
    if (isAnswered) return;
    await onAnswerSelect(quiz.quiz_id, answer, onPetUpdate);
  };

  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-surface-container-low/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-bold text-tertiary uppercase tracking-widest">
          Câu hỏi trắc nghiệm
        </span>
        <span className={`text-[11px] font-bold ${diff.color}`}>
          {diff.label}
        </span>
      </div>

      {/* Question */}
      <div className="px-4 py-3">
        <p className="text-on-surface font-body-md text-[14px] leading-relaxed">
          {quiz.question}
        </p>
      </div>

      {/* Options */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        {quiz.options.map((opt, idx) => {
          const letter = ANSWER_LABELS[idx];
          const isSelected = quiz.selected_answer === letter;
          const isCorrectAnswer = isAnswered && quiz.correct_answer === letter;
          const isWrongSelected = isAnswered && isSelected && !quiz.is_correct;

          let buttonStyle =
            "w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all border ";

          if (!isAnswered) {
            buttonStyle +=
              "bg-white/5 border-white/10 text-on-surface hover:bg-tertiary/10 hover:border-tertiary/30 active:scale-[0.98] cursor-pointer";
          } else if (isCorrectAnswer) {
            buttonStyle += "bg-green-500/20 border-green-500/40 text-green-300";
          } else if (isWrongSelected) {
            buttonStyle += "bg-red-500/20 border-red-500/40 text-red-300";
          } else {
            buttonStyle += "bg-white/3 border-white/5 text-on-surface-variant opacity-60";
          }

          return (
            <button
              key={letter}
              disabled={isAnswered}
              onClick={() => handleSelect(letter)}
              className={buttonStyle}
            >
              <span className="font-bold mr-2">{letter}.</span>
              {opt.replace(/^[A-D]\.\s*/, "")}
              {isCorrectAnswer && (
                <span className="ml-2 text-green-400">✓</span>
              )}
              {isWrongSelected && (
                <span className="ml-2 text-red-400">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result explanation after answer */}
      {isAnswered && quiz.explanation && (
        <div className="px-4 pb-4">
          <div
            className={`text-[12px] leading-relaxed px-3 py-2 rounded-lg ${
              quiz.is_correct
                ? "bg-green-500/10 text-green-300 border border-green-500/20"
                : "bg-red-500/10 text-red-300 border border-red-500/20"
            }`}
          >
            <span className="font-bold mr-1">
              {quiz.is_correct ? "✅ Chính xác!" : "❌ Chưa đúng."}
            </span>
            {quiz.explanation}
          </div>
          {quiz.exp_added !== undefined && quiz.exp_added > 0 && (
            <p className="text-[11px] text-tertiary font-bold mt-2 text-center">
              +{quiz.exp_added} EXP nhận được 🎉
            </p>
          )}
        </div>
      )}
    </div>
  );
}
