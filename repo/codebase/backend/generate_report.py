#!/usr/bin/env python3
"""
Hackathon demo report — đọc backend/data/telemetry_logs.json và in thống kê.

Usage (từ thư mục backend):
    python generate_report.py

Hoặc từ root repo:
    python backend/generate_report.py
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter, defaultdict
from typing import Any

# Windows consoles often default to cp1252 — force UTF-8 when possible
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_PATH = os.path.join(SCRIPT_DIR, "data", "telemetry_logs.json")


def load_logs() -> list[dict[str, Any]]:
    if not os.path.exists(LOG_PATH):
        print(f"[!] Khong tim thay log: {LOG_PATH}")
        return []
    try:
        with open(LOG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError) as exc:
        print(f"[!] Khong doc duoc log: {exc}")
        return []


def by_event(events: list[dict[str, Any]], name: str) -> list[dict[str, Any]]:
    return [e for e in events if e.get("event") == name]


def main() -> int:
    events = load_logs()
    if not events:
        print("Chua co su kien telemetry. Hay hoc thu tren app roi chay lai.")
        return 0

    slide_views = by_event(events, "slide_view")
    highlights = by_event(events, "text_highlight")
    quiz_triggers = by_event(events, "quiz_trigger")
    ai_gens = by_event(events, "ai_generation")
    answers = by_event(events, "quiz_answer")

    print("=" * 60)
    print("V-Pet Tutor — Telemetry Report (Phase 1 MVP)")
    print("=" * 60)
    print(f"Tong su kien: {len(events)}")
    print()

    # --- Slide views ---
    print(f"[slide_view] {len(slide_views)} luot")
    dwell_by_page: dict[tuple[Any, Any], list[int]] = defaultdict(list)
    for e in slide_views:
        p = e.get("payload") or {}
        key = (p.get("slide_id"), p.get("page_num"))
        dwell = p.get("dwell_ms") or 0
        dwell_by_page[key].append(int(dwell))

    if dwell_by_page:
        ranked = sorted(
            (
                (sid, page, sum(ms), sum(ms) / len(ms), len(ms))
                for (sid, page), ms in dwell_by_page.items()
            ),
            key=lambda x: x[2],
            reverse=True,
        )
        print("   Top trang dwell lau nhat:")
        for sid, page, total, avg, n in ranked[:5]:
            print(
                f"   - {sid} p.{page}: tong {total/1000:.1f}s "
                f"(avg {avg/1000:.1f}s, {n} lan xem)"
            )
    print()

    # --- Highlights / hotspots ---
    print(f"[text_highlight] {len(highlights)} lan boi den")
    snippet_counts: Counter[str] = Counter()
    for e in highlights:
        text = ((e.get("payload") or {}).get("text") or "").strip()
        if text:
            snippet_counts[text[:80]] += 1
    if snippet_counts:
        print("   Hotspot snippets:")
        for snippet, count in snippet_counts.most_common(5):
            print(f"   - ({count}x) \"{snippet}{'...' if len(snippet) >= 80 else ''}\"")
    print()

    # --- Quiz trigger ---
    print(f"[quiz_trigger] {len(quiz_triggers)} lan bam tao quiz")
    print()

    # --- AI generation ---
    print(f"[ai_generation] {len(ai_gens)} lan goi AI")
    if ai_gens:
        ok = [e for e in ai_gens if (e.get("payload") or {}).get("status") == "ok"]
        rejected = [e for e in ai_gens if (e.get("payload") or {}).get("status") == "rejected"]
        latencies = [
            int((e.get("payload") or {}).get("latency_ms") or 0)
            for e in ai_gens
            if (e.get("payload") or {}).get("latency_ms") is not None
        ]
        avg_latency = sum(latencies) / len(latencies) if latencies else 0
        print(f"   - Thanh cong: {len(ok)} | Rejected: {len(rejected)}")
        print(f"   - Latency trung binh: {avg_latency:.0f} ms")
    print()

    # --- Quiz answers ---
    print(f"[quiz_answer] {len(answers)} lan nop bai")
    if answers:
        correct = sum(1 for e in answers if (e.get("payload") or {}).get("is_correct"))
        wrong = len(answers) - correct
        rate = (correct / len(answers)) * 100
        print(f"   - Dung: {correct} | Sai: {wrong} | Accuracy: {rate:.0f}%")
        by_diff: Counter[Any] = Counter(
            (e.get("payload") or {}).get("difficulty") for e in answers
        )
        if by_diff:
            print("   - Theo do kho:", dict(by_diff))
    print()

    # --- Demo insight ---
    print("-" * 60)
    print("Insight (demo):")
    if answers:
        rate = (
            sum(1 for e in answers if (e.get("payload") or {}).get("is_correct"))
            / len(answers)
        ) * 100
        print(
            f"   -> {rate:.0f}% hoc vien tra loi dung sau khi highlight & lam quiz."
        )
    if highlights and quiz_triggers:
        conversion = (len(quiz_triggers) / len(highlights)) * 100
        print(
            f"   -> Ti le highlight -> bam tao quiz: {conversion:.0f}% "
            f"({len(quiz_triggers)}/{len(highlights)})."
        )
    if dwell_by_page:
        hottest = max(
            dwell_by_page.items(),
            key=lambda item: sum(item[1]),
        )
        (sid, page), ms_list = hottest
        print(
            f"   -> Trang can chu y nhat: {sid} p.{page} "
            f"(dwell {sum(ms_list)/1000:.1f}s)."
        )
    if not answers and not highlights:
        print("   -> Chua du du lieu quiz/highlight — hay demo them vong hoc.")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
