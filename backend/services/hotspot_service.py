import os
import json
import threading
from typing import Optional

HOTSPOT_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "hotspots.json")
_lock = threading.Lock()


def load_all_hotspots() -> list[dict]:
    """Return persisted hotspot data in a predictable shape."""
    if not os.path.exists(HOTSPOT_FILE):
        return []
    try:
        with open(HOTSPOT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def get_hotspots_by_slide(slide_id: str):
    for item in load_all_hotspots():
        if item.get("slide_id") == slide_id:
            return item
    return {"slide_id": slide_id, "hotspots": []}


def record_highlight(slide_id: str, text: str, page_num: Optional[int] = None) -> None:
    """Increment hotspot count for highlighted text (text_highlight from /track)."""
    if not slide_id or not text or not text.strip():
        return

    snippet = text.strip()[:200]
    with _lock:
        data = []
        if os.path.exists(HOTSPOT_FILE):
            try:
                with open(HOTSPOT_FILE, "r", encoding="utf-8") as f:
                    loaded = json.load(f)
                    if isinstance(loaded, list):
                        data = loaded
            except (json.JSONDecodeError, OSError):
                data = []

        slide_entry = None
        for item in data:
            if item.get("slide_id") == slide_id:
                slide_entry = item
                break

        if slide_entry is None:
            slide_entry = {"slide_id": slide_id, "hotspots": []}
            data.append(slide_entry)

        hotspots = slide_entry.setdefault("hotspots", [])
        matched = None
        for h in hotspots:
            existing = (h.get("text") or "").strip()
            if existing == snippet or existing in snippet or snippet in existing:
                matched = h
                break

        if matched:
            matched["highlight_count"] = int(matched.get("highlight_count") or 0) + 1
            if page_num is not None:
                matched["page_num"] = page_num
        else:
            hotspots.append(
                {
                    "rank": len(hotspots) + 1,
                    "text": snippet,
                    "highlight_count": 1,
                    "page_num": page_num,
                    "label": "Vung nong (1 luot thac mac)",
                }
            )

        hotspots.sort(key=lambda h: int(h.get("highlight_count") or 0), reverse=True)
        for i, h in enumerate(hotspots, start=1):
            count = int(h.get("highlight_count") or 0)
            h["rank"] = i
            h["label"] = f"Vung nong #{i} ({count} luot thac mac)"

        os.makedirs(os.path.dirname(HOTSPOT_FILE), exist_ok=True)
        with open(HOTSPOT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
