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
}

// Slide Viewer Types
export interface SlideData {
  id: string;
  pageNumber: number;
  pdfUrl: string;
  title: string;
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
