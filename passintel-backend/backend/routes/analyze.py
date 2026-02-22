"""
routes/analyze.py
─────────────────
POST /analyze  – analyze a password
GET  /history  – paginated history of past analyses
"""

import hashlib
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import PasswordAnalysis
from schemas import PasswordRequest, AnalysisResponse, HistoryResponse, HistoryRecord
from utils.password_utils import (
    calculate_entropy,
    extract_features,
    is_breached,
    get_weakness_reasons,
    generate_strong_password,
)
from utils.ml_model import predict_strength

router = APIRouter()


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_password(request: PasswordRequest, db: Session = Depends(get_db)):
    """Analyze a password and persist results to the database."""
    pwd = request.password

    # Feature extraction
    features = extract_features(pwd)
    entropy = features["entropy"]
    breached = is_breached(pwd)
    reasons = get_weakness_reasons(pwd)

    # ML prediction
    strength, score = predict_strength(features)

    # Penalize breached passwords
    if breached:
        score = min(score, 10)
        strength = "Weak"

    # Persist to DB (never store plaintext)
    hashed = hashlib.sha256(pwd.encode()).hexdigest()
    record = PasswordAnalysis(
        password_hash=hashed,
        strength=strength,
        score=score,
        entropy=round(entropy, 4),
        breached=breached,
    )
    db.add(record)
    db.commit()

    return AnalysisResponse(
        strength=strength,
        score=score,
        entropy=round(entropy, 4),
        breached=breached,
        reasons=reasons,
        suggested_password=generate_strong_password(),
    )


@router.get("/history", response_model=HistoryResponse)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("date", pattern="^(date|strength|score)$"),
    db: Session = Depends(get_db),
):
    """Return paginated analysis history (no plaintext passwords exposed)."""
    query = db.query(PasswordAnalysis)

    # Sorting
    if sort_by == "date":
        query = query.order_by(PasswordAnalysis.created_at.desc())
    elif sort_by == "strength":
        query = query.order_by(PasswordAnalysis.strength)
    elif sort_by == "score":
        query = query.order_by(PasswordAnalysis.score.desc())

    total = query.count()
    records = query.offset((page - 1) * page_size).limit(page_size).all()

    return HistoryResponse(
        records=[HistoryRecord.model_validate(r) for r in records],
        total=total,
        page=page,
        page_size=page_size,
    )
