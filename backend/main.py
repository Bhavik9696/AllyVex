import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from orchestration.war_room import run_war_room
from utils.doc_generator import generate_client_info
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import EmailStr

load_dotenv()

# Outputs directory where DOCX and PDF files are saved by document_generator
OUTPUTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")
os.makedirs(OUTPUTS_DIR, exist_ok=True)

app = FastAPI(title="ALLYVEX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateProfileRequest(BaseModel):
    url: str

class AnalyzeRequest(BaseModel):
    domain: str
    client_info: str

@app.get("/")
def health_check():
    return {"status": "ALLYVEX is live"}

@app.post("/api/generate-client-profile")
async def generate_client_profile(request: GenerateProfileRequest):
    """
    Step 1 — Frontend sends client company URL.
    Backend scrapes it and generates a structured profile document.
    Frontend stores the returned clientProfile and sends it
    back when calling /api/analyze.
    """
    url = request.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")

    try:
        document = generate_client_info(url)
        return {
            "status": "success",
            "url": url,
            "clientProfile": document
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate profile: {str(e)}"
        )

@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    """
    Step 2 — Frontend sends target domain + client profile.
    Runs the full War Room pipeline and streams events back.
    """
    domain = request.domain.strip().lower()
    domain = domain.replace("https://", "").replace("http://", "").rstrip("/")
    client_info = request.client_info.strip()

    if not domain:
        raise HTTPException(status_code=400, detail="Domain is required")
    if not client_info:
        raise HTTPException(status_code=400, detail="Client profile is required")

    async def event_stream():
        async for event in run_war_room(domain, client_info):
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


@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """
    Download a generated DOCX or PDF file from the outputs directory.
    The filename is returned in the COMPLETE event under result.documents.
    """
    # Sanitize — prevent path traversal
    safe_name = os.path.basename(filename)
    filepath = os.path.join(OUTPUTS_DIR, safe_name)

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=f"File '{safe_name}' not found in outputs.")

    if safe_name.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif safe_name.endswith(".pdf"):
        media_type = "application/pdf"
    else:
        media_type = "application/octet-stream"

    return FileResponse(
        path=filepath,
        media_type=media_type,
        filename=safe_name
    )


# ========================
# MONGODB SETUP (ADDED)
# ========================

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)
db = client["allyvex"]
users_collection = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



# ========================
# AUTH MODELS (ADDED)
# ========================

class RegisterRequest(BaseModel):
    company: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ========================
# PASSWORD HELPERS (ADDED)
# ========================

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)




# ========================
# REGISTER API (ADDED)
# ========================

@app.post("/api/register")
async def register(request: RegisterRequest):
    existing_user = await users_collection.find_one({"email": request.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(request.password)

    await users_collection.insert_one({
        "company": request.company,
        "email": request.email,
        "password": hashed_pw
    })

    return {"message": "User registered successfully"}



# ========================
# LOGIN API (ADDED)
# ========================

@app.post("/api/login")
async def login(request: LoginRequest):
    user = await users_collection.find_one({"email": request.email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "email": user["email"],
        "company": user["company"]
    }





