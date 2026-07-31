from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.quiz import router as quiz_router
from routers.pet import router as pet_router
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

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "V-Pet Tutor Backend API",
        "endpoints": [
            "POST /quiz/generate",
            "GET /hotspot/{slide_id}",
            "GET /pet/status"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
