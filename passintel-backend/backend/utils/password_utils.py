"""
Utility functions: entropy calculation, feature extraction, breach detection,
password suggestion generation.
"""

import math
import random
import string
from collections import Counter
from typing import Dict, List, Tuple

# ─── Common breached passwords ────────────────────────────────────────────────
BREACHED_PASSWORDS = {
    "123456", "password", "123456789", "12345678", "12345", "1234567",
    "1234567890", "qwerty", "abc123", "111111", "password1", "iloveyou",
    "admin", "letmein", "monkey", "1234", "dragon", "master", "sunshine",
    "princess", "welcome", "shadow", "superman", "michael", "football",
    "baseball", "batman", "trustno1", "pass", "hello", "charlie", "donald",
    "password123", "qwerty123", "admin123", "root", "toor", "test", "guest",
    "login", "changeme", "default", "qazwsx", "123qwe", "pass123",
}


def calculate_entropy(password: str) -> float:
    """
    Calculate Shannon entropy of a password in bits.
    Higher entropy = more unpredictable = stronger password.
    """
    if not password:
        return 0.0
    freq = Counter(password)
    length = len(password)
    entropy = -sum((count / length) * math.log2(count / length) for count in freq.values())
    # Also factor in character-set size for a richer score
    charset_size = _charset_size(password)
    return round(math.log2(charset_size) * length if charset_size > 1 else entropy, 4)


def _charset_size(password: str) -> int:
    """Determine effective character-set size used in the password."""
    size = 0
    if any(c.islower() for c in password):
        size += 26
    if any(c.isupper() for c in password):
        size += 26
    if any(c.isdigit() for c in password):
        size += 10
    if any(c in string.punctuation for c in password):
        size += 32
    return max(size, 2)


def extract_features(password: str) -> Dict[str, float]:
    """Extract numeric features used by the ML model."""
    length = len(password)
    upper = sum(1 for c in password if c.isupper())
    lower = sum(1 for c in password if c.islower())
    digits = sum(1 for c in password if c.isdigit())
    special = sum(1 for c in password if c in string.punctuation)
    entropy = calculate_entropy(password)
    return {
        "length": length,
        "uppercase": upper,
        "lowercase": lower,
        "digits": digits,
        "special": special,
        "entropy": entropy,
    }


def is_breached(password: str) -> bool:
    """Check if the password appears in the known-breach dataset."""
    return password.lower() in BREACHED_PASSWORDS


def get_weakness_reasons(password: str) -> List[str]:
    """Return human-readable reasons why the password might be weak."""
    reasons = []
    if len(password) >= 12:
        reasons.append("✓ Good length (12+ characters)")
    elif len(password) >= 8:
        reasons.append("⚠ Acceptable length, but 12+ is recommended")
    else:
        reasons.append("✗ Too short — use at least 8 characters")

    if any(c.isupper() for c in password):
        reasons.append("✓ Contains uppercase letters")
    else:
        reasons.append("✗ No uppercase letters")

    if any(c.islower() for c in password):
        reasons.append("✓ Contains lowercase letters")
    else:
        reasons.append("✗ No lowercase letters")

    if any(c.isdigit() for c in password):
        reasons.append("✓ Contains digits")
    else:
        reasons.append("✗ No digits — add numbers for strength")

    if any(c in string.punctuation for c in password):
        reasons.append("✓ Contains special characters")
    else:
        reasons.append("✗ No special characters (!@#$%^&*…)")

    if is_breached(password):
        reasons.append("🚨 Password found in breach database!")
    return reasons


def generate_strong_password(length: int = 16) -> str:
    """Generate a cryptographically random strong password."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    while True:
        pwd = "".join(random.SystemRandom().choice(alphabet) for _ in range(length))
        # Ensure it meets all criteria
        if (
            any(c.isupper() for c in pwd)
            and any(c.islower() for c in pwd)
            and any(c.isdigit() for c in pwd)
            and any(c in string.punctuation for c in pwd)
        ):
            return pwd
