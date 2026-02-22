"""
SQLAlchemy ORM models for the Password Intelligence database.
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base


class PasswordAnalysis(Base):
    """Stores results of each password analysis (never stores plaintext passwords)."""
    __tablename__ = "password_analysis"

    id = Column(Integer, primary_key=True, index=True)
    password_hash = Column(String(255), nullable=False)  # bcrypt hashed
    strength = Column(String(20), nullable=False)         # Weak / Medium / Strong
    score = Column(Integer, nullable=False)               # 0–100 risk/quality score
    entropy = Column(Float, nullable=False)               # Shannon entropy
    breached = Column(Boolean, default=False)             # Found in breach list?
    created_at = Column(DateTime(timezone=True), server_default=func.now())
