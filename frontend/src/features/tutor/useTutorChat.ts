import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, QuizState } from '@/lib/types';
import { generateQuiz, submitAnswer, PetStatusResponse } from '@/lib/api';
import { getTelemetrySessionId, track } from '@/features/telemetry/useTelemetry';

function getSessionId(): string {
  return getTelemetrySessionId();
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: '👋 Chào bạn! Hãy **bôi đen** bất kỳ đoạn văn nào trong slide rồi nhấn nút ✨ để tôi tạo câu hỏi ôn tập cho bạn nhé!',
    timestamp: new Date().toISOString(),
  },
];

export interface TutorChatHook {
  messages: ChatMessage[];
  isTyping: boolean;
  sessionId: string;
  sendMessage: (text: string) => void;
  triggerQuizFromSelection: (slideId?: string, pageNum?: number) => Promise<void>;
  handleAnswerSelect: (quizId: string, answer: 'A' | 'B' | 'C' | 'D', onPetUpdate?: (pet: PetStatusResponse) => void) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function useTutorChat(): TutorChatHook {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Gửi tin nhắn chat thông thường (chưa nối AI chat — sẽ làm sau nếu cần)
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    // Placeholder — sẽ nối real chat AI API ở iteration sau
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `💡 Bạn hỏi: "${text}" — Tính năng chat tự do đang phát triển! Hiện tại hãy thử **bôi đen** đoạn văn trong slide để tôi tạo câu hỏi trắc nghiệm nhé.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  }, []);

  /**
   * Khi học sinh bôi đen text trong slide → gọi POST /quiz/generate
   * Backend trả về quiz → nhúng vào tin nhắn AI trong chat
   */
  const triggerQuizFromSelection = useCallback(async (slideId?: string, pageNum?: number) => {
    const selectedText = window.getSelection()?.toString().trim();
    if (!selectedText || selectedText.length < 10) {
      const warnMsg: ChatMessage = {
        id: `msg-warn-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Hãy bôi đen đoạn văn dài hơn (ít nhất 10 ký tự) để tôi có thể tạo câu hỏi nhé!',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, warnMsg]);
      return;
    }

    track('text_highlight', {
      slide_id: slideId,
      page_num: pageNum,
      text: selectedText.slice(0, 500),
    });
    track('quiz_trigger', {
      slide_id: slideId,
      page_num: pageNum,
      text_len: selectedText.length,
      started: true,
    });

    // Hiển thị tin nhắn của user (đoạn bôi đen)
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: `📌 Tạo câu hỏi từ đoạn: "${selectedText.slice(0, 80)}${selectedText.length > 80 ? '...' : ''}"`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const quiz = await generateQuiz({
        context_text: selectedText,
        slide_id: slideId,
        page_num: pageNum,
        session_id: getSessionId(),
      });

      // Nhúng quiz vào tin nhắn AI
      const quizState: QuizState = {
        quiz_id: quiz.quiz_id,
        question: quiz.question,
        options: quiz.options,
        difficulty_level: quiz.difficulty_level,
        phase: 'pending',
      };

      const aiMsg: ChatMessage = {
        id: `msg-quiz-${Date.now()}`,
        sender: 'ai',
        text: '✨ Đây là câu hỏi dành cho bạn:',
        timestamp: new Date().toISOString(),
        quiz: quizState,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo câu hỏi.';
      const errMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: `❌ ${errText}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  /**
   * Khi học sinh chọn đáp án trong Quiz Card → gọi POST /quiz/{id}/submit
   * Nhận kết quả đúng/sai + EXP mới → cập nhật quiz trong messages + pet state
   */
  const handleAnswerSelect = useCallback(async (
    quizId: string,
    answer: 'A' | 'B' | 'C' | 'D',
    onPetUpdate?: (pet: PetStatusResponse) => void
  ) => {
    try {
      const result = await submitAnswer(quizId, answer, getSessionId());

      // Cập nhật quiz message với kết quả
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.quiz?.quiz_id === quizId) {
            return {
              ...msg,
              quiz: {
                ...msg.quiz,
                selected_answer: answer,
                is_correct: result.is_correct,
                correct_answer: result.correct_answer,
                explanation: result.explanation,
                exp_added: result.exp_added,
                phase: 'answered' as const,
              },
            };
          }
          return msg;
        })
      );

      // Thêm tin nhắn feedback
      const feedbackMsg: ChatMessage = {
        id: `msg-feedback-${Date.now()}`,
        sender: 'ai',
        text: result.is_correct
          ? `🎉 Chính xác! ${result.pet_status.message || `Bạn nhận được +${result.exp_added} EXP!`}`
          : `💪 Chưa đúng rồi! Đáp án là **${result.correct_answer}**. ${result.explanation}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, feedbackMsg]);

      // Callback cập nhật pet state cho component cha
      if (onPetUpdate) {
        onPetUpdate(result.pet_status);
      }
    } catch (err) {
      const errText = err instanceof Error ? err.message : 'Không thể nộp đáp án.';
      const errMsg: ChatMessage = {
        id: `msg-sub-err-${Date.now()}`,
        sender: 'ai',
        text: `❌ ${errText}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  }, []);

  return {
    messages,
    isTyping,
    sessionId: getSessionId(),
    sendMessage,
    triggerQuizFromSelection,
    handleAnswerSelect,
    messagesEndRef,
  };
}

