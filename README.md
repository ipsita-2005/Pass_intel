# 🛡️ PassIntel — AI Password Intelligence System

A full-stack cybersecurity application that uses machine learning to analyze password strength, detect breaches, calculate entropy, and suggest stronger alternatives.

**Stack:** Python · FastAPI · Scikit-learn · SQLAlchemy · React · TypeScript · Tailwind CSS

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 ML Classifier | RandomForest trained on 12,000+ passwords — 99%+ accuracy |
| 🔐 Entropy Scoring | Shannon entropy calculation per password |
| 🚨 Breach Detection | Checks against known-breached password dataset |
| 📊 Risk Score | 0–100 score with animated meter |
| 💡 Suggestions | AI-generated strong password recommendation |
| 🕘 History | Paginated + sortable analysis history dashboard |
| 🗄️ Secure Storage | bcrypt-hashed — plaintext passwords never stored |
| 📱 Responsive | Mobile, tablet, and desktop layouts |

---

## 📁 Project Structure

```
password-intelligence/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models.py            # ORM models
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── train_model.py       # ML training script
│   ├── model.pkl            # Trained model (generated)
│   ├── routes/
│   │   └── analyze.py       # /analyze and /history endpoints
│   ├── utils/
│   │   ├── password_utils.py  # Entropy, breach check, suggestions
│   │   └── ml_model.py        # Model loader + predictor
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.tsx              # Main analyzer page
    │   ├── main.tsx             # Router + entry
    │   ├── index.css            # Global styles + Tailwind
    │   ├── components/
    │   │   ├── Layout.tsx       # Nav + footer wrapper
    │   │   ├── ResultCard.tsx   # Analysis result display
    │   │   └── StrengthMeter.tsx
    │   ├── pages/
    │   │   └── HistoryPage.tsx  # Analysis history table
    │   └── services/
    │       └── api.ts           # Axios API client
    ├── tailwind.config.js
    ├── vite.config.ts
    └── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL (optional — SQLite used by default for development)

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — SQLite works out of the box; add MySQL URL for production

# Train the ML model (required on first run)
python train_model.py
# → Outputs: model.pkl  (99%+ accuracy)

# Start the API server
uvicorn main:app --reload
# → API running at http://localhost:8000
# → Docs at   http://localhost:8000/docs
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# → App running at http://localhost:5173
```

---

## 🗄️ Database

**Development (default):** SQLite — auto-created as `password_intelligence.db`, no config needed.

**Production (MySQL):**
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/password_intelligence
```

Schema is auto-created via SQLAlchemy on first startup.

### Table: `password_analysis`

| Column | Type | Notes |
|---|---|---|
| id | INT PK | Auto-increment |
| password_hash | VARCHAR(255) | bcrypt hashed |
| strength | VARCHAR(20) | Weak / Medium / Strong |
| score | INT | 0–100 |
| entropy | FLOAT | Shannon entropy (bits) |
| breached | BOOLEAN | Found in breach list |
| created_at | TIMESTAMP | Auto-set |

---

## 🤖 ML Model

The RandomForest classifier is trained on 12,000 synthetic + real passwords across 3 classes.

**Features used:**
- Password length
- Uppercase letter count
- Lowercase letter count
- Digit count
- Special character count
- Entropy (bits)

**Retrain:**
```bash
cd backend
python train_model.py
```

---

## 📡 API Reference

### `POST /analyze`
```json
// Request
{ "password": "MyP@ssw0rd!" }

// Response
{
  "strength": "Strong",
  "score": 84,
  "entropy": 65.5,
  "breached": false,
  "reasons": ["✓ Good length", "✓ Contains uppercase letters", "✓ Contains special characters"],
  "suggested_password": "K#9mR!vZq@2Lx3Yw"
}
```

### `GET /history?page=1&page_size=10&sort_by=date`
Returns paginated analysis records (no plaintext passwords).

---

## 🔒 Security

- Passwords are **never stored in plaintext** — bcrypt hashed before persistence
- CORS is configured for localhost dev; update `allow_origins` in `main.py` for production
- All credentials loaded via `.env` environment variables

---

## 🏗️ Production Deployment

**Backend:** Deploy to Railway, Render, or any VPS with `uvicorn main:app --host 0.0.0.0 --port 8000`

**Frontend:** Run `npm run build` → deploy `dist/` to Vercel, Netlify, or Cloudflare Pages

Update `allow_origins` in `main.py` and the `proxy` in `vite.config.ts` (or set `VITE_API_URL` env var) for production URLs.

---

## 📋 Resume Bullets

> "Built a full-stack AI password security platform using FastAPI, React/TypeScript, and Scikit-learn RandomForest (99%+ accuracy), featuring real-time breach detection, Shannon entropy analysis, bcrypt-secure persistence to MySQL/SQLite, and a responsive cybersecurity-themed dashboard."
