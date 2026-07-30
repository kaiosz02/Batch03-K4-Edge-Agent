from fastapi import APIRouter
from models.pet_model import PetStatus, PetUpdateRequest, PetUpdateResponse

router = APIRouter(prefix="/pet", tags=["Pet"])

# Simple in-memory state for prototype
pet_state = {
    "current_exp": 20,
    "streak_days": 3
}

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
def get_pet_status():
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

@router.post("/update", response_model=PetUpdateResponse)
def update_pet_status(req: PetUpdateRequest):
    old_exp = pet_state["current_exp"]
    old_lvl, _, _ = calculate_level_info(old_exp)
    
    streak_bonus = 20 if pet_state["streak_days"] >= 3 else 0
    new_exp = old_exp + (req.exp_earned if req.is_correct else 2) + streak_bonus
    pet_state["current_exp"] = new_exp
    
    new_lvl, new_lvl_name, _ = calculate_level_info(new_exp)
    leveled_up = new_lvl > old_lvl
    
    if req.is_correct:
        emotion = "excited" if leveled_up else "happy"
        msg = f"Xuất sắc! Bạn nhận được +{req.exp_earned} EXP 😻"
    else:
        emotion = "hungry"
        msg = "Cố gắng lên nhé! Bạn vẫn nhận được +2 EXP khích lệ 🐣"

    if streak_bonus > 0:
        msg += f" (Thưởng chuỗi {pet_state['streak_days']} ngày: +{streak_bonus} EXP 🎁)"

    if leveled_up:
        msg += f" 🎉 THÚ CƯNG ĐÃ TIẾN HÓA THÀNH {new_lvl_name.upper()}!"

    return PetUpdateResponse(
        new_exp=new_exp,
        leveled_up=leveled_up,
        current_level=new_lvl,
        level_name=new_lvl_name,
        emotion=emotion,
        message=msg
    )
