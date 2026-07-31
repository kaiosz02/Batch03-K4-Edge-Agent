from typing import Dict

# In-memory session store: session_id -> pet state
sessions: Dict[str, dict] = {}

def get_default_pet_state():
    return {
        "current_exp": 20,
        "streak_days": 3,
        "last_streak_claim_date": None, # For MVP, we can leave this simple
        "streak_bonus_claimed": False,
        "history": [] # Store quiz history: [{"question": str, "is_correct": bool}]
    }

def get_session(session_id: str) -> dict:
    if session_id not in sessions:
        sessions[session_id] = get_default_pet_state()
    return sessions[session_id]
