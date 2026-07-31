from fastapi import APIRouter, HTTPException
from models.quiz_model import QuizRequest, QuizGenerateResponse, QuizSubmitRequest, QuizSubmitResponse
from services.deepseek_service import generate_adaptive_quiz
from services.hotspot_service import get_hotspots_by_slide
from services.telemetry_service import log_event
import time
import uuid
from routers.pet import award_exp

router = APIRouter(prefix="", tags=["Quiz & Hotspot"])

# In-memory active quizzes store
active_quizzes = {}

@router.post("/quiz/generate", response_model=QuizGenerateResponse)
def generate_quiz_endpoint(request: QuizRequest):
    started = time.perf_counter()
    internal_res = generate_adaptive_quiz(request)
    latency_ms = int((time.perf_counter() - started) * 1000)

    if internal_res.status == "rejected":
        log_event(
            event="ai_generation",
            session_id=request.session_id,
            payload={
                "status": "rejected",
                "latency_ms": latency_ms,
                "slide_id": request.slide_id,
                "page_num": request.page_num,
                "message": internal_res.message,
            },
        )
        raise HTTPException(status_code=400, detail=internal_res.message or "Nội dung không hợp lệ.")

    quiz_id = str(uuid.uuid4())

    # Store internal details securely
    active_quizzes[quiz_id] = {
        "question": internal_res.question,
        "correct_answer": internal_res.correct_answer,
        "explanation": internal_res.explanation,
        "exp_reward": internal_res.exp_reward,
        "difficulty_level": internal_res.difficulty_level,
        "slide_id": request.slide_id,
        "page_num": request.page_num,
    }

    log_event(
        event="ai_generation",
        session_id=request.session_id,
        payload={
            "status": "ok",
            "latency_ms": latency_ms,
            "slide_id": request.slide_id,
            "page_num": request.page_num,
            "quiz_id": quiz_id,
            "difficulty_level": internal_res.difficulty_level,
        },
    )

    return QuizGenerateResponse(
        quiz_id=quiz_id,
        question=internal_res.question,
        options=internal_res.options,
        difficulty_level=internal_res.difficulty_level
    )

@router.post("/quiz/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz_endpoint(quiz_id: str, request: QuizSubmitRequest):
    if quiz_id not in active_quizzes:
        raise HTTPException(status_code=404, detail="Quiz không tồn tại hoặc đã được nộp.")

    quiz_data = active_quizzes[quiz_id]
    is_correct = (request.selected_answer.strip().upper() == quiz_data["correct_answer"].strip().upper() or request.selected_answer.startswith(quiz_data["correct_answer"]))

    # Calculate EXP added based on correctness
    exp_added = quiz_data["exp_reward"] if is_correct else 2

    # Award EXP via Pet router logic
    new_pet_status = award_exp(request.session_id, is_correct, exp_added, quiz_data["question"])

    log_event(
        event="quiz_answer",
        session_id=request.session_id,
        payload={
            "quiz_id": quiz_id,
            "is_correct": is_correct,
            "difficulty": quiz_data["difficulty_level"],
            "exp_added": exp_added,
            "slide_id": quiz_data.get("slide_id"),
            "page_num": quiz_data.get("page_num"),
            "selected_answer": request.selected_answer,
        },
    )

    # Prevent double submission
    del active_quizzes[quiz_id]

    return QuizSubmitResponse(
        is_correct=is_correct,
        correct_answer=quiz_data["correct_answer"],
        explanation=quiz_data["explanation"],
        exp_added=exp_added,
        pet_status=new_pet_status.model_dump()
    )

@router.get("/hotspot/{slide_id}")
def get_hotspot_endpoint(slide_id: str):
    return get_hotspots_by_slide(slide_id)
