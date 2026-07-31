from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from services.hotspot_service import record_highlight
from services.telemetry_service import log_event

router = APIRouter(tags=["Telemetry"])


class TrackRequest(BaseModel):
    event: str
    session_id: Optional[str] = None
    payload: dict[str, Any] = Field(default_factory=dict)
    timestamp: Optional[str] = None


class TrackResponse(BaseModel):
    ok: bool = True


@router.post("/track", response_model=TrackResponse)
def track_event(request: TrackRequest):
    log_event(
        event=request.event,
        payload=request.payload,
        session_id=request.session_id,
        timestamp=request.timestamp or datetime.now(timezone.utc).isoformat(),
    )

    # Doc flow: text_highlight → Hotspot DB
    if request.event == "text_highlight":
        payload = request.payload or {}
        slide_id = payload.get("slide_id")
        text = payload.get("text")
        page_num = payload.get("page_num")
        if isinstance(slide_id, str) and isinstance(text, str):
            record_highlight(
                slide_id=slide_id,
                text=text,
                page_num=page_num if isinstance(page_num, int) else None,
            )

    return TrackResponse(ok=True)
