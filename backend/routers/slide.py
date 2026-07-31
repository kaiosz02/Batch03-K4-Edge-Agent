import io
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from typing import Optional

log = logging.getLogger("slide_router")

# ==============================================================================
# FRONTEND INTEGRATION GUIDE — slide.py (Slide Upload Router)
# ==============================================================================
# API Base URL: http://localhost:8000
#
# [UPLOAD SLIDE — POST /slide/upload]
#   Gọi API này 1 lần duy nhất khi học sinh chọn file PDF để học.
#   Dùng multipart/form-data:
#     - file     : File PDF (input type="file")
#     - title    : Tên bài giảng (string, tùy chọn)
#   Response:
#     - slide_id : (string) LƯU LẠI! Dùng cho mọi request tiếp theo.
#     - title    : Tên slide
#     - total_pages: Tổng số trang PDF
#
#   Ví dụ fetch (TypeScript):
#     const formData = new FormData()
#     formData.append('file', pdfFile)
#     formData.append('title', 'Chương 3 - Vector DB')
#     const res = await fetch('/slide/upload', { method: 'POST', body: formData })
#     const { slide_id } = await res.json()
#     // Lưu slide_id vào state, dùng cho các bước sau
#
# [GET SLIDE INFO — GET /slide/{slide_id}]
#   Lấy thông tin slide + nội dung từng trang.
#   Dùng để render nội dung text bên cạnh PDF viewer.
#
# [LIST SLIDES — GET /slide/list]
#   Liệt kê tất cả slide đã upload trong phiên hiện tại.
# ==============================================================================

try:
    import pypdf
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False
    log.warning("⚠️  pypdf chưa được cài. Chạy: pip install pypdf")
    log.warning("    Backend sẽ dùng mock slide data cho đến khi cài xong.")

from services.slide_store import store_slide, get_slide, list_slides

router = APIRouter(prefix="/slide", tags=["Slide Management"])


def _parse_pdf_bytes(pdf_bytes: bytes) -> list[dict]:
    """Parse PDF từ bytes → list các trang {page_num, text}."""
    if not PYPDF_AVAILABLE:
        # Mock fallback nếu chưa cài pypdf
        return [
            {"page_num": 1, "text": "[MOCK] Nội dung trang 1: RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp LLM và Retriever."},
            {"page_num": 2, "text": "[MOCK] Nội dung trang 2: Vector Database lưu trữ bản ghi dưới dạng vector nhúng."},
            {"page_num": 3, "text": "[MOCK] Nội dung trang 3: Fine-tuning là quá trình tinh chỉnh lại tham số mô hình."},
        ]

    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        pages.append({"page_num": i + 1, "text": text.strip()})
    return pages


@router.post("/upload")
async def upload_slide(
    file: UploadFile = File(..., description="File PDF bài giảng"),
    title: Optional[str] = Form(default=None, description="Tên bài giảng (tùy chọn)")
):
    """
    Upload file PDF bài giảng. Backend sẽ parse và lưu vào memory.
    Trả về slide_id để dùng cho các API tiếp theo.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Chỉ hỗ trợ file .pdf")

    pdf_bytes = await file.read()
    if len(pdf_bytes) == 0:
        raise HTTPException(status_code=400, detail="File PDF rỗng.")

    slide_id = str(uuid.uuid4())[:8]  # Short ID dễ debug: VD "a3f9b1c2"
    slide_title = title or file.filename.replace(".pdf", "")
    pages = _parse_pdf_bytes(pdf_bytes)
    store_slide(slide_id, slide_title, pages)

    log.info(f"✅ [slide/upload] slide_id={slide_id} | title='{slide_title}' | pages={len(pages)}")
    log.info(f"   FE lưu slide_id='{slide_id}' và dùng cho POST /quiz/generate")

    return {
        "slide_id": slide_id,
        "title": slide_title,
        "total_pages": len(pages),
        "message": f"Upload thành công. Dùng slide_id='{slide_id}' cho quiz generation."
    }


@router.get("/list")
def list_all_slides():
    """Liệt kê tất cả slide đã upload trong phiên hiện tại."""
    return {"slides": list_slides()}


@router.get("/{slide_id}")
def get_slide_info(slide_id: str, page_num: Optional[int] = None):
    """Lấy thông tin slide. Nếu truyền page_num thì trả thêm nội dung trang đó."""
    slide = get_slide(slide_id)
    if not slide:
        raise HTTPException(
            status_code=404,
            detail=f"slide_id='{slide_id}' chưa được upload. Gọi POST /slide/upload trước."
        )

    result = {
        "slide_id": slide["slide_id"],
        "title": slide["title"],
        "total_pages": slide["total_pages"],
    }

    if page_num is not None:
        page_text = slide["pages"].get(str(page_num), "")
        result["page_num"] = page_num
        result["page_text"] = page_text

    return result
