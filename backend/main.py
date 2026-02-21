# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from orchestration.war_room import run_war_room

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class AnalyzeRequest(BaseModel):
    domain: str

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    
    async def event_stream():
        async for event in run_war_room(request.domain):
            yield f"data: {json.dumps(event)}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream"
    )