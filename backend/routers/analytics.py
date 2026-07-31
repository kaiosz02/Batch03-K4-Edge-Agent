from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from services.analytics_service import build_heatmap

router = APIRouter(prefix="/analytics", tags=["Analytics"])


class HighlightData(BaseModel):
    id: str
    text_segment: str
    highlight_count: int
    difficulty_score: float
    wrong_answer_count: int = 0
    page_num: Optional[int] = None
    slide_id: str
    is_demo: bool = False


class HeatmapResponse(BaseModel):
    document_id: str
    total_students: int
    total_answers: int
    total_wrong: int
    highlights: List[HighlightData]


@router.get("/heatmap", response_model=HeatmapResponse)
def get_heatmap(document_id: str = "all"):
    """Build the instructor heatmap from real highlight and quiz telemetry."""
    return HeatmapResponse(**build_heatmap(document_id))
