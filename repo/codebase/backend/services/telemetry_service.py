"""File-based telemetry logger for Hackathon MVP."""
from __future__ import annotations

import json
import os
import threading
from datetime import datetime, timezone
from typing import Any, Optional

TELEMETRY_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "telemetry_logs.json")
_lock = threading.Lock()


def _ensure_file() -> None:
    directory = os.path.dirname(TELEMETRY_FILE)
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    if not os.path.exists(TELEMETRY_FILE):
        with open(TELEMETRY_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


def log_event(
    event: str,
    payload: Optional[dict[str, Any]] = None,
    session_id: Optional[str] = None,
    timestamp: Optional[str] = None,
) -> dict[str, Any]:
    """Append one telemetry record to backend/data/telemetry_logs.json."""
    record = {
        "event": event,
        "session_id": session_id,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
        "payload": payload or {},
    }

    with _lock:
        _ensure_file()
        try:
            with open(TELEMETRY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if not isinstance(data, list):
                    data = []
        except (json.JSONDecodeError, OSError):
            data = []

        data.append(record)

        with open(TELEMETRY_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    return record


def load_events() -> list[dict[str, Any]]:
    """Read all telemetry events (used by generate_report.py)."""
    _ensure_file()
    try:
        with open(TELEMETRY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []
