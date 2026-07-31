import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage, QuizState } from "@/lib/types";
import { generateQuiz, PetStatusResponse, submitAnswer } from "@/lib/api";
import {
  getTelemetrySessionId,
  track,
} from "@/features/telemetry/useTelemetry";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "ai",
    text: "👋 Quiz và phần giải thích sẽ xuất hiện tại đây. Hãy bôi đen kiến thức trên slide để Pet gợi ý thử thách.",
    timestamp: new Date().toISOString(),
  },
];

export interface QuizGenerationResult {
  ok: boolean;
  error?: string;
}

export interface TutorChatHook {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => void;
  startQuizFromSelection: (
    selectedText: string,
    slideId: string,
    pageNum: number
  ) => Promise<QuizGenerationResult>;
  handleAnswerSelect: (
    quizId: string,
    answer: "A" | "B" | "C" | "D",
    onPetUpdate?: (pet: PetStatusResponse) => void
  ) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function useTutorChat(): TutorChatHook {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<ChatMessage[]>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const updateMessages = useCallback(
    (updater: (previous: ChatMessage[]) => ChatMessage[]) => {
      setMessages((previous) => {
        const next = updater(previous);
        messagesRef.current = next;
        return next;
      });
    },
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date().toISOString(),
      };
      updateMessages((previous) => [...previous, userMsg]);
      setIsTyping(true);

      window.setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sender: "ai",
          text: `💡 Bạn hỏi: "${text}" — Chat tự do chưa nằm trong lát cắt MVP. Hãy bôi đen kiến thức trên slide để Pet tạo quiz có căn cứ nhé.`,
          timestamp: new Date().toISOString(),
        };
        updateMessages((previous) => [...previous, aiMsg]);
        setIsTyping(false);
      }, 500);
    },
    [updateMessages]
  );

  /**
   * Chỉ được gọi sau khi người học đã đồng ý trong bubble của Pet.
   * Tutor chịu trách nhiệm hiển thị task/quiz, không hiển thị lời thoại Pet.
   */
  const startQuizFromSelection = useCallback(
    async (
      selectedText: string,
      slideId: string,
      pageNum: number
    ): Promise<QuizGenerationResult> => {
      const contextText = selectedText.replace(/\s+/g, " ").trim();
      if (contextText.length < 10) {
        return {
          ok: false,
          error: "Đoạn được chọn cần dài ít nhất 10 ký tự.",
        };
      }

      setIsTyping(true);
      track("quiz_trigger", {
        slide_id: slideId,
        page_num: pageNum,
        text_len: contextText.length,
        started: true,
      });

      try {
        const quiz = await generateQuiz({
          context_text: contextText,
          slide_id: slideId,
          page_num: pageNum,
          session_id: getTelemetrySessionId(),
        });
        const quizState: QuizState = {
          quiz_id: quiz.quiz_id,
          question: quiz.question,
          options: quiz.options,
          difficulty_level: quiz.difficulty_level,
          phase: "pending",
        };
        updateMessages((previous) => [
          ...previous,
          {
            id: `msg-quiz-${Date.now()}`,
            sender: "ai",
            text: "✨ Thử thách mới của bạn:",
            timestamp: new Date().toISOString(),
            quiz: quizState,
          },
        ]);
        return { ok: true };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi tạo câu hỏi.";
        updateMessages((previous) => [
          ...previous,
          {
            id: `msg-err-${Date.now()}`,
            sender: "ai",
            text: `❌ ${message}`,
            timestamp: new Date().toISOString(),
          },
        ]);
        return { ok: false, error: message };
      } finally {
        setIsTyping(false);
      }
    },
    [updateMessages]
  );

  const handleAnswerSelect = useCallback(
    async (
      quizId: string,
      answer: "A" | "B" | "C" | "D",
      onPetUpdate?: (pet: PetStatusResponse) => void
    ) => {
      const quizMessage = messagesRef.current.find(
        (message) => message.quiz?.quiz_id === quizId
      );
      if (!quizMessage?.quiz || quizMessage.quiz.phase !== "pending") return;

      updateMessages((previous) =>
        previous.map((message) =>
          message.quiz?.quiz_id === quizId
            ? {
                ...message,
                quiz: {
                  ...message.quiz,
                  selected_answer: answer,
                  phase: "submitting",
                },
              }
            : message
        )
      );

      try {
        const result = await submitAnswer(
          quizId,
          answer,
          getTelemetrySessionId()
        );
        updateMessages((previous) =>
          previous.map((message) =>
            message.quiz?.quiz_id === quizId
              ? {
                  ...message,
                  quiz: {
                    ...message.quiz,
                    selected_answer: answer,
                    is_correct: result.is_correct,
                    correct_answer: result.correct_answer,
                    explanation: result.explanation,
                    exp_added: result.exp_added,
                    phase: "answered",
                  },
                }
              : message
          )
        );
        onPetUpdate?.(result.pet_status);
      } catch (error) {
        updateMessages((previous) =>
          previous.map((message) =>
            message.quiz?.quiz_id === quizId
              ? {
                  ...message,
                  quiz: {
                    ...message.quiz,
                    selected_answer: undefined,
                    phase: "pending",
                  },
                }
              : message
          )
        );
        const message =
          error instanceof Error ? error.message : "Không thể nộp đáp án.";
        updateMessages((previous) => [
          ...previous,
          {
            id: `msg-submit-error-${Date.now()}`,
            sender: "ai",
            text: `❌ ${message}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
    [updateMessages]
  );

  return {
    messages,
    isTyping,
    sendMessage,
    startQuizFromSelection,
    handleAnswerSelect,
    messagesEndRef,
  };
}
