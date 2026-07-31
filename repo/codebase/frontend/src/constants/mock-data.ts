import { SlideData, ChatMessage, UserProgress } from "@/lib/types";

export const MOCK_SLIDES: SlideData[] = [
  {
    id: "slide-1",
    pageNumber: 1,
    title: "Introduction to Artificial Intelligence",
    pdfUrl: "/api/slides?file=d1-slide-hackathon.pdf",
  },
  {
    id: "slide-2",
    pageNumber: 2,
    title: "Machine Learning Basics",
    pdfUrl: "/api/slides?file=d1-slide-hackathon.pdf",
  },
  {
    id: "slide-3",
    pageNumber: 3,
    title: "Neural Networks Architecture",
    pdfUrl: "/api/slides?file=d1-slide-hackathon.pdf",
  },
  {
    id: "slide-4",
    pageNumber: 4,
    title: "Deep Learning Foundations",
    pdfUrl: "/api/slides?file=d1-slide-hackathon.pdf",
  },
  {
    id: "slide-5",
    pageNumber: 5,
    title: "AI in Practice",
    pdfUrl: "/api/slides?file=d1-slide-hackathon.pdf",
  },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Chào bạn! Tôi có thể giúp gì cho bài học hôm nay?",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg-2",
    sender: "user",
    text: "Hãy giải thích về Machine Learning",
    timestamp: new Date().toISOString(),
  },
  {
    id: "msg-3",
    sender: "ai",
    text: "Machine Learning (Học máy) là một lĩnh vực của AI tập trung vào việc xây dựng các hệ thống có khả năng học hỏi từ dữ liệu để cải thiện hiệu suất mà không cần lập trình rõ ràng...",
    citations: ["Slide 2"],
    has_evidence: true,
    timestamp: new Date().toISOString(),
  }
];

export const MOCK_USER_PROGRESS: UserProgress = {
  totalExp: 2450,
  streakDays: 5,
  pet: {
    level: 3,
    name: "Cú Trí Tuệ",
    exp: 350,
    maxExp: 500,
    mood: "Đang Vui 😻",
    imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLusbuP2Ftfdah5tMYniyboUUaFVVtrEJzAEFwoOqEkHHKRx9ZIvWOWIJOCki0quRTSJsZ8vT1gW8L58SaP_VMkrnD70G2FKBo_nafph4jq2jQQJ52aw7F6pbOit2dPf4jkwax22-U-MDs_MQlSswWU5FJu0M4qWmqajMeBAQQxjmDpau5a1FTYGR1CF0LIMUuJzbfVoW9JZZXGD_YPnZc5JHOFg4shmirXZX_j6PuN8Ii2fKu8V_8MVEgeQ"
  },
  recentActivities: [
    {
      id: "act-1",
      type: "tutor",
      title: "Hỏi bài",
      expGained: 15,
      timeAgo: "2 phút trước",
      context: "Diễn đàn AI"
    },
    {
      id: "act-2",
      type: "quiz",
      title: "Làm Quiz đúng",
      expGained: 50,
      timeAgo: "1 giờ trước",
      context: "Bài tập Tuần 4"
    },
    {
      id: "act-3",
      type: "slide",
      title: "Xem slide tóm tắt",
      expGained: 10,
      timeAgo: "Hôm qua",
      context: "Chương 2: Neural Networks"
    }
  ]
};
