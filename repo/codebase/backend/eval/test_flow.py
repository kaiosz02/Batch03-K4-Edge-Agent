"""End-to-end smoke test for the V-Pet learning flow (mock AI mode)."""

import os
import tempfile
import unittest
import asyncio
import json

from fastapi.testclient import TestClient

from main import app, load_static_slides
from routers.quiz import active_quizzes
from services import (
    analytics_service,
    deepseek_service,
    hotspot_service,
    telemetry_service,
)
from services.session_store import sessions


class LearningFlowTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        telemetry_service.TELEMETRY_FILE = os.path.join(
            cls.temp_dir.name, "telemetry.json"
        )
        hotspot_service.HOTSPOT_FILE = os.path.join(
            cls.temp_dir.name, "hotspots.json"
        )
        analytics_service.DEMO_HEATMAP_FILE = os.path.join(
            cls.temp_dir.name, "demo_heatmap.json"
        )
        deepseek_service.api_key = None
        deepseek_service.client = None
        sessions.clear()
        active_quizzes.clear()
        asyncio.run(load_static_slides())
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        cls.temp_dir.cleanup()

    def test_highlight_quiz_exp_and_heatmap_flow(self):
        slides = self.client.get("/slide/list")
        self.assertEqual(slides.status_code, 200)
        self.assertGreater(len(slides.json()["slides"]), 0)
        slide_id = slides.json()["slides"][0]["slide_id"]

        context_text = (
            "Vector Database lưu trữ dữ liệu dưới dạng vector nhúng "
            "để tìm kiếm theo độ tương đồng."
        )
        tracked = self.client.post(
            "/track",
            json={
                "event": "text_highlight",
                "session_id": "flow-test-user",
                "payload": {
                    "slide_id": slide_id,
                    "page_num": 1,
                    "text": context_text,
                },
            },
        )
        self.assertEqual(tracked.status_code, 200)

        generated = self.client.post(
            "/quiz/generate",
            json={
                "context_text": context_text,
                "slide_id": slide_id,
                "page_num": 1,
                "session_id": "flow-test-user",
            },
        )
        self.assertEqual(generated.status_code, 200)
        quiz_id = generated.json()["quiz_id"]

        submitted = self.client.post(
            f"/quiz/{quiz_id}/submit",
            json={"selected_answer": "B", "session_id": "flow-test-user"},
        )
        self.assertEqual(submitted.status_code, 200)
        self.assertFalse(submitted.json()["is_correct"])
        self.assertEqual(submitted.json()["exp_added"], 2)

        duplicate = self.client.post(
            f"/quiz/{quiz_id}/submit",
            json={"selected_answer": "B", "session_id": "flow-test-user"},
        )
        self.assertEqual(duplicate.status_code, 404)

        second_quiz = self.client.post(
            "/quiz/generate",
            json={
                "context_text": context_text,
                "slide_id": slide_id,
                "page_num": 1,
                "session_id": "flow-test-user",
            },
        )
        correct = self.client.post(
            f"/quiz/{second_quiz.json()['quiz_id']}/submit",
            json={"selected_answer": "A", "session_id": "flow-test-user"},
        )
        self.assertEqual(correct.status_code, 200)
        self.assertTrue(correct.json()["is_correct"])
        self.assertEqual(correct.json()["exp_added"], 5)

        heatmap = self.client.get("/analytics/heatmap?document_id=all")
        self.assertEqual(heatmap.status_code, 200)
        body = heatmap.json()
        self.assertEqual(body["total_answers"], 2)
        self.assertEqual(body["total_wrong"], 1)
        self.assertEqual(body["highlights"][0]["wrong_answer_count"], 1)
        self.assertEqual(body["highlights"][0]["difficulty_score"], 0.5)

    def test_demo_heatmap_is_labeled_and_counted(self):
        demo_payload = {
            "enabled": True,
            "student_count": 10,
            "segments": [
                {
                    "slide_id": "static_0",
                    "page_num": 12,
                    "text_segment": "Đoạn dữ liệu minh họa heatmap.",
                    "highlight_count": 20,
                    "total_answers": 10,
                    "wrong_answer_count": 8,
                }
            ],
        }
        with open(
            analytics_service.DEMO_HEATMAP_FILE, "w", encoding="utf-8"
        ) as demo_file:
            json.dump(demo_payload, demo_file)

        try:
            heatmap = self.client.get("/analytics/heatmap?document_id=all")
            self.assertEqual(heatmap.status_code, 200)
            body = heatmap.json()
            demo_items = [
                item for item in body["highlights"] if item["is_demo"]
            ]
            self.assertEqual(len(demo_items), 1)
            self.assertEqual(demo_items[0]["difficulty_score"], 0.8)
            self.assertGreaterEqual(body["total_students"], 10)
            self.assertGreaterEqual(body["total_answers"], 10)
            self.assertGreaterEqual(body["total_wrong"], 8)
        finally:
            os.remove(analytics_service.DEMO_HEATMAP_FILE)

    def test_validation_rejects_invalid_contract(self):
        short_context = self.client.post(
            "/quiz/generate",
            json={"context_text": "ngắn"},
        )
        self.assertEqual(short_context.status_code, 422)

        invalid_answer = self.client.post(
            "/quiz/not-a-quiz/submit",
            json={"selected_answer": "E"},
        )
        self.assertEqual(invalid_answer.status_code, 422)


if __name__ == "__main__":
    unittest.main()
