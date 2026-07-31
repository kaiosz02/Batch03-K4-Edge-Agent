// ============================================================
// api.ts — Tất cả hàm gọi Backend API được tập trung tại đây
// Backend URL: http://localhost:8000
// Xem thêm: FRONTEND_INTEGRATION.md
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types khớp với Backend response ──────────────────────────

export interface SlideUploadResponse {
  slide_id: string;
  title: string;
  total_pages: number;
  message: string;
}

export interface PetStatusResponse {
  level: number;
  level_name: string;
  current_exp: number;
  max_exp: number;
  emotion: "happy" | "excited" | "hungry";
  streak_days: number;
  message: string | null;
}

export interface GenerateQuizResponse {
  quiz_id: string;
  question: string;
  options: string[]; // ["A. ...", "B. ...", "C. ...", "D. ..."]
  difficulty_level: number;
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  exp_added: number;
  pet_status: PetStatusResponse;
}

export interface HeatmapResponse {
  document_id: string;
  total_students: number;
  total_answers: number;
  total_wrong: number;
  highlights: Array<{
    id: string;
    text_segment: string;
    highlight_count: number;
    difficulty_score: number;
    wrong_answer_count: number;
    page_num: number | null;
    slide_id: string;
    is_demo: boolean;
  }>;
}

export interface GenerateQuizPayload {
  context_text: string;
  slide_id?: string;
  page_num?: number;
  session_id: string;
  current_level?: number;
}

// ─── API Functions ─────────────────────────────────────────────

/**
 * Bước 1: Upload PDF bài giảng
 * POST /slide/upload
 */
export async function uploadSlide(
  file: File,
  title?: string
): Promise<SlideUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);

  // ⚠️ KHÔNG set Content-Type header — browser tự set multipart/form-data boundary
  const res = await fetch(`${BASE_URL}/slide/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Upload thất bại: ${res.status}`);
  }
  return res.json();
}

/**
 * Lấy danh sách PDF tĩnh từ server
 * GET /slide/list
 */
import { BackendSlide } from "./types";
export async function getSlideList(): Promise<{ slides: BackendSlide[] }> {
  const res = await fetch(`${BASE_URL}/slide/list`);
  if (!res.ok) {
    throw new Error(`Không tải được danh sách slide: ${res.status}`);
  }
  return res.json();
}

/**
 * Load trạng thái thú cưng hiện tại
 * GET /pet/status?session_id={sessionId}
 */
export async function loadPetStatus(
  sessionId: string
): Promise<PetStatusResponse> {
  const res = await fetch(
    `${BASE_URL}/pet/status?session_id=${encodeURIComponent(sessionId)}`
  );
  if (!res.ok) throw new Error(`Không tải được pet status: ${res.status}`);
  return res.json();
}

/**
 * Bước 2: Sinh câu hỏi khi học sinh bôi đen chữ
 * POST /quiz/generate
 * Ném lỗi với message từ backend nếu AI từ chối (400)
 */
export async function generateQuiz(
  payload: GenerateQuizPayload
): Promise<GenerateQuizResponse> {
  const res = await fetch(`${BASE_URL}/quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.detail || "AI từ chối tạo câu hỏi — hãy bôi đen đoạn văn khác."
    );
  }
  return res.json();
}

/**
 * Bước 3: Nộp đáp án
 * POST /quiz/{quizId}/submit
 */
export async function submitAnswer(
  quizId: string,
  selectedAnswer: "A" | "B" | "C" | "D",
  sessionId: string
): Promise<SubmitAnswerResponse> {
  const res = await fetch(`${BASE_URL}/quiz/${quizId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      selected_answer: selectedAnswer,
      session_id: sessionId,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Nộp bài thất bại: ${res.status}`);
  }
  return res.json();
}

/**
 * Instructor: Xem heatmap vùng khó của slide
 * GET /analytics/heatmap?document_id={docId}
 */
export async function loadHeatmap(
  documentId = "doc_001"
): Promise<HeatmapResponse> {
  const res = await fetch(
    `${BASE_URL}/analytics/heatmap?document_id=${encodeURIComponent(documentId)}`
  );
  if (!res.ok) throw new Error(`Không tải được heatmap: ${res.status}`);
  return res.json();
}

export interface TrackEventPayload {
  event: string;
  session_id?: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
}

/**
 * Fire-and-forget telemetry event
 * POST /track — fetch + keepalive so events survive page unload and pass CORS.
 */
export function trackEvent(payload: TrackEventPayload): void {
  fetch(`${BASE_URL}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: payload.event,
      session_id: payload.session_id,
      timestamp: payload.timestamp || new Date().toISOString(),
      payload: payload.payload || {},
    }),
    keepalive: true,
  }).catch(() => {
    // Không block UX nếu track lỗi
  });
}
