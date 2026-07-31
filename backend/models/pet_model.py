from pydantic import BaseModel
from typing import Optional

class PetStatus(BaseModel):
    level: int
    level_name: str
    current_exp: int
    max_exp: int
    emotion: str
    streak_days: int
    message: Optional[str] = None
