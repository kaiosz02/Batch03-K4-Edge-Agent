// AI Tutor Types
export interface TutorResponse {
  answer: string;
  citations: string[]; // e.g. ["Slide 12", "Trang 5"]
  has_evidence: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  citations?: string[];
  has_evidence?: boolean;
  timestamp: string;
  // Quiz được nhúng trong tin nhắn AI
  quiz?: QuizState;
}

// Slide Viewer Types
export interface SlideData {
  id: string;
  pageNumber: number;
  pdfUrl: string;
  title: string;
}

// Backend Slide (Static)
export interface BackendSlide {
  slide_id: string;
  title: string;
  total_pages: number;
  pdf_url: string; // URL tĩnh trỏ đến backend (VD: http://localhost:8000/static/slides/...)
}

// Quiz State — quản lý quiz đang làm trong chat
export interface QuizState {
  quiz_id: string;
  question: string;
  options: string[];
  difficulty_level: number;
  selected_answer?: "A" | "B" | "C" | "D";
  is_correct?: boolean;
  correct_answer?: string;
  explanation?: string;
  exp_added?: number;
  phase: "pending" | "submitting" | "answered";
}

// Gamification Types
export interface PetState {
  level: number;
  name: string;
  exp: number;
  maxExp: number;
  mood: string;
  imageUrl: string;
}

export interface ActivityLog {
  id: string;
  type: "tutor" | "quiz" | "slide" | "other";
  title: string;
  expGained: number;
  timeAgo: string;
  context: string;
}

export interface UserProgress {
  totalExp: number;
  streakDays: number;
  recentActivities: ActivityLog[];
  pet: PetState;
}
