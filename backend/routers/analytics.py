from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/analytics", tags=["Analytics"])

class HighlightData(BaseModel):
    id: str
    text_segment: str
    highlight_count: int
    difficulty_score: float  # 0.0 to 1.0 (Dựa trên tỷ lệ trả lời sai)

class HeatmapResponse(BaseModel):
    document_id: str
    total_students: int
    highlights: List[HighlightData]

@router.get("/heatmap", response_model=HeatmapResponse)
def get_mock_heatmap(document_id: str = "doc_001"):
    # Giả lập dữ liệu: 100 học sinh tương tác với tài liệu
    return HeatmapResponse(
        document_id=document_id,
        total_students=100,
        highlights=[
            HighlightData(
                id="seg_1",
                text_segment="RAG (Retrieval-Augmented Generation) là kỹ thuật kết hợp giữa LLM và Retriever.",
                highlight_count=4,
                difficulty_score=0.1
            ),
            HighlightData(
                id="seg_2",
                text_segment="Vector DB lưu trữ bản ghi dưới dạng vector nhúng, cho phép tìm kiếm độ tương đồng rất nhanh.",
                highlight_count=50,
                difficulty_score=0.75
            ),
            HighlightData(
                id="seg_3",
                text_segment="Tokenization là quá trình cắt nhỏ văn bản thành các subword.",
                highlight_count=15,
                difficulty_score=0.3
            ),
            HighlightData(
                id="seg_4",
                text_segment="Nếu set temperature = 1.0 thì mô hình dễ bị ảo giác do tính ngẫu nhiên cao.",
                highlight_count=82,
                difficulty_score=0.95
            )
        ]
    )
