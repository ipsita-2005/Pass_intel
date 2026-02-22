"""
ML model loader — loads model.pkl at startup and provides predict() helper.
Falls back to a rule-based classifier if model is not yet trained.
"""

import os
import pickle
import numpy as np
from typing import Tuple

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model.pkl")
_model = None


def load_model():
    """Load model from disk (called once at app startup)."""
    global _model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
        print("✅ ML model loaded from model.pkl")
    else:
        print("⚠️  model.pkl not found — using rule-based fallback. Run train_model.py to train.")


def predict_strength(features: dict) -> Tuple[str, int]:
    """
    Predict password strength label and integer score (0-100).
    Returns: ("Weak" | "Medium" | "Strong", score)
    """
    feat_vector = np.array([[
        features["length"],
        features["uppercase"],
        features["lowercase"],
        features["digits"],
        features["special"],
        features["entropy"],
    ]])

    if _model is not None:
        label = _model.predict(feat_vector)[0]
        proba = _model.predict_proba(feat_vector)[0]
        classes = list(_model.classes_)
        # Map class probabilities to a 0-100 score
        weights = {"Weak": 0, "Medium": 50, "Strong": 100}
        score = int(sum(proba[i] * weights.get(cls, 50) for i, cls in enumerate(classes)))
    else:
        # Rule-based fallback
        label, score = _rule_based(features)

    return label, score


def _rule_based(features: dict) -> Tuple[str, int]:
    """Simple rule-based fallback when no model is available."""
    score = 0
    score += min(features["length"] * 4, 30)
    score += min(features["uppercase"] * 3, 10)
    score += min(features["lowercase"] * 2, 10)
    score += min(features["digits"] * 3, 15)
    score += min(features["special"] * 5, 20)
    score += min(int(features["entropy"] / 2), 15)
    score = min(score, 100)

    if score < 40:
        label = "Weak"
    elif score < 70:
        label = "Medium"
    else:
        label = "Strong"

    return label, score
