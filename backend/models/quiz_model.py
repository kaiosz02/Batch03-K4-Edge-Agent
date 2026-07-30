from pydantic import BaseModel
from typing import List, Optional

class QuizHistoryItem(BaseModel):
    question: str
    is_correct: bool

class QuizRequest(BaseModel):
    context_text: str
    slide_id: Optional[str] = "d1_slide_4"
    current_level: Optional[int] = 1
    history: Optional[List[QuizHistoryItem]] = []

class QuizResponse(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str
    difficulty_level: int
    exp_reward: int
