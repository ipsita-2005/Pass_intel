"""
train_model.py
─────────────────────────────────────────────────────────────
Train a RandomForest classifier on a synthetic password dataset.
Saves the trained model to model.pkl.

Run from the backend/ directory:
    python train_model.py
"""

import math
import pickle
import random
import string
import numpy as np
import pandas as pd
from collections import Counter
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


# ── helpers ────────────────────────────────────────────────────────────────────

def calc_entropy(pwd: str) -> float:
    if not pwd:
        return 0.0
    size = 0
    if any(c.islower() for c in pwd): size += 26
    if any(c.isupper() for c in pwd): size += 26
    if any(c.isdigit() for c in pwd): size += 10
    if any(c in string.punctuation for c in pwd): size += 32
    size = max(size, 2)
    return math.log2(size) * len(pwd)


def features(pwd: str) -> dict:
    return {
        "length": len(pwd),
        "uppercase": sum(1 for c in pwd if c.isupper()),
        "lowercase": sum(1 for c in pwd if c.islower()),
        "digits": sum(1 for c in pwd if c.isdigit()),
        "special": sum(1 for c in pwd if c in string.punctuation),
        "entropy": calc_entropy(pwd),
    }


# ── password generators ─────────────────────────────────────────────────────

rng = random.SystemRandom()

WEAK_POOL = (
    ["123456", "password", "qwerty", "abc123", "111111", "letmein",
     "iloveyou", "admin", "welcome", "monkey", "dragon", "pass"] * 200
    + ["".join(rng.choice(string.ascii_lowercase) for _ in range(rng.randint(3, 7)))
       for _ in range(1000)]
    + ["".join(rng.choice(string.digits) for _ in range(rng.randint(4, 6)))
       for _ in range(500)]
)


def gen_medium() -> str:
    """Mix of letters + digits, moderate length."""
    length = rng.randint(8, 11)
    chars = string.ascii_letters + string.digits
    return "".join(rng.choice(chars) for _ in range(length))


def gen_strong() -> str:
    """Long password with all character classes."""
    length = rng.randint(12, 20)
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
    while True:
        pwd = "".join(rng.choice(alphabet) for _ in range(length))
        if (any(c.isupper() for c in pwd) and any(c.islower() for c in pwd)
                and any(c.isdigit() for c in pwd) and any(c in string.punctuation for c in pwd)):
            return pwd


# ── build dataset ───────────────────────────────────────────────────────────

N = 4000  # per class → ~12 000 total

records = []

# Weak
for pwd in rng.sample(WEAK_POOL, min(N, len(WEAK_POOL))):
    f = features(pwd)
    f["label"] = "Weak"
    records.append(f)
for _ in range(N - len(records)):
    pwd = rng.choice(WEAK_POOL)
    f = features(pwd)
    f["label"] = "Weak"
    records.append(f)

# Medium
for _ in range(N):
    f = features(gen_medium())
    f["label"] = "Medium"
    records.append(f)

# Strong
for _ in range(N):
    f = features(gen_strong())
    f["label"] = "Strong"
    records.append(f)


df = pd.DataFrame(records)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

FEATURE_COLS = ["length", "uppercase", "lowercase", "digits", "special", "entropy"]
X = df[FEATURE_COLS].values
y = df["label"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── train ───────────────────────────────────────────────────────────────────

clf = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Accuracy: {acc * 100:.2f}%\n")
print(classification_report(y_test, y_pred))

# ── save ────────────────────────────────────────────────────────────────────

with open("model.pkl", "wb") as f:
    pickle.dump(clf, f)

print("💾 model.pkl saved successfully.")
