from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.quiz import router as quiz_router
from routers.pet import router as pet_router
from routers.analytics import router as analytics_router
from routers.slide import router as slide_router
from routers.track import router as track_router
import uvicorn
import os
import sys
import glob
from fastapi.staticfiles import StaticFiles
from routers.slide import _parse_pdf_bytes
from services.slide_store import store_slide

# Windows console often uses cp1252 — force UTF-8 for startup logs
try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

app = FastAPI(title="V-Pet Tutor Backend API")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz_router)
app.include_router(pet_router)
app.include_router(analytics_router)
app.include_router(slide_router)
app.include_router(track_router)

# Mount thư mục tĩnh cho PDF
slides_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "vlearn-pack", "slides"))
if not os.path.exists(slides_dir):
    os.makedirs(slides_dir)
app.mount("/static/slides", StaticFiles(directory=slides_dir), name="slides")

@app.on_event("startup")
async def load_static_slides():
    pdf_files = glob.glob(os.path.join(slides_dir, "*.pdf"))
    print(f"🔄 Đang load {len(pdf_files)} slides từ {slides_dir}...")
    for idx, pdf_path in enumerate(pdf_files):
        filename = os.path.basename(pdf_path)
        slide_id = f"static_{idx}"
        pdf_url = f"http://localhost:8000/static/slides/{filename}"
        
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
        
        pages = _parse_pdf_bytes(pdf_bytes)
        store_slide(slide_id, filename.replace(".pdf", ""), pages, pdf_url=pdf_url)
        print(f"✅ Đã nạp slide: {filename} (ID: {slide_id}, {len(pages)} trang)")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "V-Pet Tutor Backend API",
        "endpoints": [
            "POST /slide/upload      — Upload PDF bài giảng (FE gọi 1 lần đầu)",
            "GET  /slide/{slide_id}  — Lấy nội dung slide theo trang",
            "POST /quiz/generate     — Sinh câu hỏi (cần slide_id + context_text)",
            "POST /quiz/{id}/submit  — Nộp đáp án",
            "GET  /pet/status        — Trạng thái thú cưng",
            "GET  /analytics/heatmap — Dashboard giảng viên",
            "GET  /hotspot/{slide_id}— Vùng nóng của slide",
            "POST /track             — Ghi sự kiện telemetry (MVP)",
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
