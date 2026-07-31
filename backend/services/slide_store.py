from typing import Dict, Optional

# =====================================================================
# SLIDE STORE — In-memory storage cho các slide đã được upload
# Key: slide_id (string)
# Value: dict chứa metadata và nội dung từng trang
# =====================================================================
_slide_store: Dict[str, dict] = {}


def store_slide(slide_id: str, title: str, pages: list[dict]):
    """
    Lưu thông tin slide vào memory sau khi parse PDF.
    pages = [{ "page_num": 1, "text": "..." }, ...]
    """
    _slide_store[slide_id] = {
        "slide_id": slide_id,
        "title": title,
        "total_pages": len(pages),
        "pages": {str(p["page_num"]): p["text"] for p in pages}
    }


def get_slide(slide_id: str) -> Optional[dict]:
    """Lấy thông tin slide theo ID. Trả về None nếu chưa upload."""
    return _slide_store.get(slide_id)


def get_slide_page_text(slide_id: str, page_num: int) -> Optional[str]:
    """Lấy nội dung text của 1 trang cụ thể trong slide."""
    slide = _slide_store.get(slide_id)
    if not slide:
        return None
    return slide["pages"].get(str(page_num))


def get_slide_context_summary(slide_id: str, page_num: int) -> str:
    """
    Trả về chuỗi mô tả bối cảnh tổng quát để nhét vào Prompt AI.
    Format: "Slide: <title> | Trang <N>/<Total>\n<Nội dung trang>"
    Backend tự gọi hàm này, FE không cần làm gì thêm.
    """
    slide = _slide_store.get(slide_id)
    if not slide:
        return ""

    page_text = slide["pages"].get(str(page_num), "")
    summary = (
        f"Slide: {slide['title']} | "
        f"Trang {page_num}/{slide['total_pages']}\n"
        f"Nội dung trang hiện tại:\n{page_text[:500]}"  # Giới hạn 500 ký tự để không tốn token
    )
    return summary


def list_slides() -> list:
    """Trả về danh sách tất cả slide đã upload."""
    return [
        {"slide_id": s["slide_id"], "title": s["title"], "total_pages": s["total_pages"]}
        for s in _slide_store.values()
    ]
