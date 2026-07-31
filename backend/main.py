from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.quiz import router as quiz_router
from routers.pet import router as pet_router
from routers.analytics import router as analytics_router
from routers.slide import router as slide_router
import uvicorn

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
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
