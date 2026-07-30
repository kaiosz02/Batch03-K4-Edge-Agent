from fastapi import APIRouter
from models.quiz_model import QuizRequest, QuizResponse
from services.gemini_service import generate_adaptive_quiz
from services.hotspot_service import get_hotspots_by_slide

router = APIRouter(prefix="", tags=["Quiz & Hotspot"])

@router.post("/quiz/generate", response_model=QuizResponse)
def generate_quiz_endpoint(request: QuizRequest):
    return generate_adaptive_quiz(request)

@router.get("/hotspot/{slide_id}")
def get_hotspot_endpoint(slide_id: str):
    return get_hotspots_by_slide(slide_id)
