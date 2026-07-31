import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import { MOCK_CHAT_HISTORY } from '@/constants/mock-data';

export function useTutorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const newAiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: `Đây là câu trả lời tự động cho: "${text}". Khi tích hợp backend, câu trả lời này sẽ được sinh ra từ AI.`,
        citations: ['Slide ' + (Math.floor(Math.random() * 5) + 1)],
        has_evidence: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const triggerQuickAction = useCallback((actionType: string) => {
    let text = "";
    switch (actionType) {
      case "explain": text = "Hãy giải thích chi tiết slide này giúp tôi."; break;
      case "summarize": text = "Hãy tóm tắt nội dung slide này."; break;
      case "review": text = "Tổng kết những gì tôi đã học."; break;
      case "quiz": text = "Tạo cho tôi một câu hỏi ôn tập."; break;
      default: text = "Hỗ trợ tôi."; break;
    }
    sendMessage(text);
  }, [sendMessage]);

  return {
    messages,
    isTyping,
    sendMessage,
    triggerQuickAction,
    messagesEndRef
  };
}
