"""
main.py — Password Intelligence API
────────────────────────────────────
Start with:  uvicorn main:app --reload
Docs at:     http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routes.analyze import router as analyze_router
from utils.ml_model import load_model

# ── Create DB tables ─────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Password Intelligence API",
    description="AI-powered password strength analysis with breach detection.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # add prod URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(analyze_router, prefix="", tags=["Analysis"])


# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    load_model()
    print("🚀 Password Intelligence API is running.")


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Password Intelligence API v1.0"}
