"""Smoke test: liệt kê / gọi thử DeepSeek API với key trong .env."""
import os
from dotenv import load_dotenv
from openai import OpenAI

_ROOT_ENV = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(_ROOT_ENV)
load_dotenv()

api_key = os.getenv("DEEP_SEEK_API_KEY")
model = os.getenv("DEEP_SEEK_MODEL", "deepseek-chat")

if not api_key:
    raise SystemExit("DEEP_SEEK_API_KEY not found in .env")

client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

print(f"Testing DeepSeek model: {model}")
resp = client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": "Reply with exactly: ok"}],
    max_tokens=16,
)
print(resp.choices[0].message.content)
