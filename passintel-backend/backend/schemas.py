"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class PasswordRequest(BaseModel):
    password: str = Field(..., min_length=1, description="Password to analyze")


class AnalysisResponse(BaseModel):
    strength: str
    score: int
    entropy: float
    breached: bool
    reasons: List[str]
    suggested_password: str


class HistoryRecord(BaseModel):
    id: int
    strength: str
    score: int
    entropy: float
    breached: bool
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    records: List[HistoryRecord]
    total: int
    page: int
    page_size: int
