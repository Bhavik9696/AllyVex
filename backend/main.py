import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from orchestration.war_room import run_war_room

load_dotenv()

app = FastAPI(title="ALLYVEX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class AnalyzeRequest(BaseModel):
    domain: str

@app.get("/")
def health_check():
    return {"status": "ALLYVEX is live"}

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    domain = request.domain.strip().lower()
    domain = domain.replace("https://", "").replace("http://", "").rstrip("/")

    if not domain:
        raise HTTPException(status_code=400, detail="Domain is required")

    async def event_stream():
        async for event in run_war_room(domain):
            yield f"data: {json.dumps(event)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )