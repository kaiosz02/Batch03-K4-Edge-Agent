from fastapi import APIRouter, HTTPException
from models.quiz_model import QuizRequest, QuizGenerateResponse, QuizSubmitRequest, QuizSubmitResponse
from services.gemini_service import generate_adaptive_quiz
from services.hotspot_service import get_hotspots_by_slide
import uuid
from routers.pet import award_exp

router = APIRouter(prefix="", tags=["Quiz & Hotspot"])

# In-memory active quizzes store
active_quizzes = {}

@router.post("/quiz/generate", response_model=QuizGenerateResponse)
def generate_quiz_endpoint(request: QuizRequest):
    internal_res = generate_adaptive_quiz(request)
    
    if internal_res.status == "rejected":
        raise HTTPException(status_code=400, detail=internal_res.message or "Nội dung không hợp lệ.")
    
    quiz_id = str(uuid.uuid4())
    
    # Store internal details securely
    active_quizzes[quiz_id] = {
        "question": internal_res.question,
        "correct_answer": internal_res.correct_answer,
        "explanation": internal_res.explanation,
        "exp_reward": internal_res.exp_reward,
        "difficulty_level": internal_res.difficulty_level
    }
    
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
