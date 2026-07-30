from pydantic import BaseModel

class PetStatus(BaseModel):
    level: int
    level_name: str
    current_exp: int
    max_exp: int
    emotion: str
    streak_days: int

class PetUpdateRequest(BaseModel):
    exp_earned: int
    is_correct: bool

class PetUpdateResponse(BaseModel):
    new_exp: int
    leveled_up: bool
    current_level: int
    level_name: str
    emotion: str
    message: str
