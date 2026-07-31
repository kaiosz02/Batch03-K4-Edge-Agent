"""Aggregate hotspot + quiz_answer telemetry into instructor heatmap."""
from __future__ import annotations

from typing import Any, Optional

from services.hotspot_service import load_all_hotspots
from services.telemetry_service import load_events


def _snippets_match(a: str, b: str) -> bool:
    a = (a or "").strip().lower()
    b = (b or "").strip().lower()
    if not a or not b:
        return False
    return a == b or a in b or b in a


def build_heatmap(document_id: str = "doc_001") -> dict[str, Any]:
    """
    Build Knowledge Heatmap from:
    - hotspots.json (highlight_count per snippet / slide)
    - telemetry quiz_answer events (wrong_answer_count → difficulty_score)
    """
    events = load_events()
    hotspots_data = load_all_hotspots()

    # Unique students across all telemetry
    sessions = {
        e.get("session_id")
        for e in events
        if e.get("session_id")
    }
    total_students = len(sessions) or 0

    # Aggregate wrong answers by (slide_id, snippet) and by (slide_id, page_num)
    wrong_by_snippet: dict[tuple[str, str], dict[str, int]] = {}
    wrong_by_page: dict[tuple[str, Optional[int]], dict[str, int]] = {}
    answer_total = 0
    wrong_total = 0

    for e in events:
        if e.get("event") != "quiz_answer":
            continue
        payload = e.get("payload") or {}
        answer_total += 1
        is_correct = bool(payload.get("is_correct"))
        if payload.get("wrong_answer") or not is_correct:
            wrong_total += 1
            slide_id = str(payload.get("slide_id") or "unknown")
            snippet = str(payload.get("text_snippet") or "")[:200]
            page_num = payload.get("page_num")
            try:
                page_key: Optional[int] = int(page_num) if page_num is not None else None
            except (TypeError, ValueError):
                page_key = None

            if snippet:
                key = (slide_id, snippet)
                bucket = wrong_by_snippet.setdefault(key, {"wrong": 0, "total": 0, "page_num": page_key})
                bucket["wrong"] += 1
                bucket["total"] += 1
            page_bucket = wrong_by_page.setdefault(
                (slide_id, page_key), {"wrong": 0, "total": 0}
            )
            page_bucket["wrong"] += 1
            page_bucket["total"] += 1
        else:
            slide_id = str(payload.get("slide_id") or "unknown")
            snippet = str(payload.get("text_snippet") or "")[:200]
            page_num = payload.get("page_num")
            try:
                page_key = int(page_num) if page_num is not None else None
            except (TypeError, ValueError):
                page_key = None
            if snippet:
                key = (slide_id, snippet)
                bucket = wrong_by_snippet.setdefault(key, {"wrong": 0, "total": 0, "page_num": page_key})
                bucket["total"] += 1
            page_bucket = wrong_by_page.setdefault(
                (slide_id, page_key), {"wrong": 0, "total": 0}
            )
            page_bucket["total"] += 1

    highlights: list[dict[str, Any]] = []
    seg_idx = 0

    for slide_entry in hotspots_data:
        slide_id = str(slide_entry.get("slide_id") or "unknown")
        # Optional filter: if document_id looks like a slide id, only that slide
        if document_id and document_id not in ("doc_001", "all") and slide_id != document_id:
            continue

        for h in slide_entry.get("hotspots") or []:
            text = str(h.get("text") or "").strip()
            if not text:
                continue
            highlight_count = int(h.get("highlight_count") or 0)
            page_num = h.get("page_num")
            try:
                page_num_int: Optional[int] = int(page_num) if page_num is not None else None
            except (TypeError, ValueError):
                page_num_int = None

            wrong = 0
            total_ans = 0
            # Match by snippet text
            for (sid, snip), stats in wrong_by_snippet.items():
                if sid == slide_id and _snippets_match(text, snip):
                    wrong += stats["wrong"]
                    total_ans += stats["total"]
            # Fallback: page-level wrong rate if no snippet match
            if total_ans == 0 and page_num_int is not None:
                page_stats = wrong_by_page.get((slide_id, page_num_int))
                if page_stats:
                    wrong = page_stats["wrong"]
                    total_ans = page_stats["total"]

            difficulty_score = (wrong / total_ans) if total_ans > 0 else 0.0
            # Boost difficulty slightly when many highlights but few answers yet
            if total_ans == 0 and highlight_count > 0:
                difficulty_score = min(0.4, highlight_count / 20.0)

            seg_idx += 1
            highlights.append(
                {
                    "id": f"seg_{seg_idx}",
                    "text_segment": text,
                    "highlight_count": highlight_count,
                    "difficulty_score": round(float(difficulty_score), 3),
                    "wrong_answer_count": wrong,
                    "page_num": page_num_int,
                    "slide_id": slide_id,
                }
            )

    # Include quiz-only segments that never appeared as highlights
    for (slide_id, snip), stats in wrong_by_snippet.items():
        if document_id and document_id not in ("doc_001", "all") and slide_id != document_id:
            continue
        if not snip:
            continue
        already = any(
            h["slide_id"] == slide_id and _snippets_match(h["text_segment"], snip)
            for h in highlights
        )
        if already:
            continue
        total_ans = stats["total"] or 1
        difficulty_score = stats["wrong"] / total_ans
        seg_idx += 1
        highlights.append(
            {
                "id": f"seg_{seg_idx}",
                "text_segment": snip,
                "highlight_count": 0,
                "difficulty_score": round(float(difficulty_score), 3),
                "wrong_answer_count": stats["wrong"],
                "page_num": stats.get("page_num"),
                "slide_id": slide_id,
            }
        )

    highlights.sort(
        key=lambda h: (h["difficulty_score"], h["highlight_count"]),
        reverse=True,
    )

    return {
        "document_id": document_id,
        "total_students": total_students,
        "total_answers": answer_total,
        "total_wrong": wrong_total,
        "highlights": highlights,
    }
