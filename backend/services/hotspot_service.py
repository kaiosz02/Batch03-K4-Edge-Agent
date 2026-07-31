import os
import json

HOTSPOT_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "hotspots.json")

def get_hotspots_by_slide(slide_id: str):
    if not os.path.exists(HOTSPOT_FILE):
        return {"slide_id": slide_id, "hotspots": []}
    
    try:
        with open(HOTSPOT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                if item.get("slide_id") == slide_id:
                    return item
    except Exception:
        pass
        
    return {
        "slide_id": slide_id,
        "hotspots": [
            {
                "rank": 1,
                "text": "Đoạn kiến thức trọng tâm của slide.",
                "highlight_count": 85,
                "label": "🔥 Vùng nóng #1 (85 lượt thắc mắc)"
            }
        ]
    }
