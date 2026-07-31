from fastapi import APIRouter, Query
from models.pet_model import PetStatus
from services.session_store import get_session

router = APIRouter(prefix="/pet", tags=["Pet"])

LEVEL_THRESHOLDS = [
    (0, 50, 1, "Trứng 🥚"),
    (51, 150, 2, "Gà Con 🐣"),
    (151, 300, 3, "Gà Trống 🐔")
]

def calculate_level_info(exp: int):
    for min_exp, max_exp, lvl, name in LEVEL_THRESHOLDS:
        if exp <= max_exp:
            return lvl, name, max_exp
    return 3, "Gà Trống 🐔", 300

@router.get("/status", response_model=PetStatus)
def get_pet_status(session_id: str = Query("demo-user")):
    pet_state = get_session(session_id)
    exp = pet_state["current_exp"]
    lvl, lvl_name, max_exp = calculate_level_info(exp)
    return PetStatus(
        level=lvl,
        level_name=lvl_name,
        current_exp=exp,
        max_exp=max_exp,
        emotion="happy" if exp > 10 else "hungry",
        streak_days=pet_state["streak_days"]
    )

def award_exp(session_id: str, is_correct: bool, exp_earned: int, question: str) -> PetStatus:
    pet_state = get_session(session_id)
    old_exp = pet_state["current_exp"]
    old_lvl, _, _ = calculate_level_info(old_exp)
    
    # Streak bonus logic: claim only once
    streak_bonus = 0
    if pet_state["streak_days"] >= 3 and not pet_state.get("streak_bonus_claimed"):
        streak_bonus = 20
        pet_state["streak_bonus_claimed"] = True
        
    actual_exp = exp_earned
    new_exp = old_exp + actual_exp + streak_bonus
    
    max_possible_exp = LEVEL_THRESHOLDS[-1][1]
    if new_exp > max_possible_exp:
        new_exp = max_possible_exp
        
    pet_state["current_exp"] = new_exp
    
    # Record history
    pet_state["history"].append({"question": question, "is_correct": is_correct})
    
    new_lvl, new_lvl_name, max_exp = calculate_level_info(new_exp)
    leveled_up = new_lvl > old_lvl
    
    if is_correct:
        emotion = "excited" if leveled_up else "happy"
        msg = f"Xuất sắc! Bạn nhận được +{exp_earned} EXP 😻"
    else:
        emotion = "hungry"
        msg = "Cố gắng lên nhé! Bạn vẫn nhận được +2 EXP khích lệ 🐣"

    if streak_bonus > 0:
        msg += f" (Thưởng chuỗi {pet_state['streak_days']} ngày: +{streak_bonus} EXP 🎁)"

    if leveled_up:
        msg += f" 🎉 THÚ CƯNG ĐÃ TIẾN HÓA THÀNH {new_lvl_name.upper()}!"

    return PetStatus(
        level=new_lvl,
        level_name=new_lvl_name,
        current_exp=new_exp,
        max_exp=max_exp,
        emotion=emotion,
        streak_days=pet_state["streak_days"],
        message=msg
    )
