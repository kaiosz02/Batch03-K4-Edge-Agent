from pydantic import BaseModel
from typing import List, Optional

class QuizHistoryItem(BaseModel):
    question: str
    is_correct: bool

class QuizRequest(BaseModel):
    context_text: str
    slide_id: Optional[str] = "d1_slide_4"
    current_level: Optional[int] = 1
    session_id: Optional[str] = "demo-user"

class QuizInternalResponse(BaseModel):
    status: str = "success"
    question: str = ""
    options: List[str] = []
    correct_answer: str = ""
    explanation: str = ""
    difficulty_level: int = 1
    exp_reward: int = 0
    message: str = ""

class QuizGenerateResponse(BaseModel):
    quiz_id: str
    question: str
    options: List[str]
    difficulty_level: int

class QuizSubmitRequest(BaseModel):
    selected_answer: str
    session_id: Optional[str] = "demo-user"

class QuizSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    exp_added: int
    pet_status: dict  # Will hold the PetStatus response
