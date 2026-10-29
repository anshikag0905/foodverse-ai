# FoodVerse AI – Multimodal Food Intelligence Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/Frontend-React_18_(Vite)-61DAFB.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)](https://web.dev/progressive-web-apps/)
[![Size Budget](https://img.shields.io/badge/Repo_Size-%3C500MB_Enforced-brightgreen.svg)](scripts/check_size.py)

**FoodVerse AI** is an end-to-end multimodal intelligence platform that transforms multi-sensory culinary and dietary inputs (images, kitchen videos, voice queries, text, and barcodes) into actionable nutritional insights, spoilage alerts, commercial hygiene reports, adaptive meal plans, and personalized athletic performance tracking.

Built with an emphasis on **Explainability, Allergen Safety, Global Database Coverage, and Zero-Configuration Demo Execution**.

---

## Architecture Diagram

```
                 +-------------------------------------------------------+
                 |            Multimodal User Ingestion Flow             |
                 |  [ Food Image | Barcode | Video | Audio Voice | Text ]|
                 +---------------------------+---------------------------+
                                             |
                                             v
                 +-------------------------------------------------------+
                 |            React 18 PWA Client (Vite)                 |
                 |  - Tailwind CSS (Light / Dark Themes)                 |
                 |  - Bilingual i18n (English / Hindi)                   |
                 |  - Recharts Visualizations & ZXing Barcode Engine     |
                 +---------------------------+---------------------------+
                                             | REST / Multipart API
                                             v
                 +-------------------------------------------------------+
                 |            FastAPI Application Services Layer         |
                 |  - Unified Ingestion Router (/api/v1/*)               |
                 |  - Background Task Queue for Video Frame Processing   |
                 |  - Allergen & Diet Safety Enforcement Engine          |
                 +---------------------------+---------------------------+
                                             |
                      +----------------------+----------------------+
                      |                                             |
                      v                                             v
        +-----------------------------+               +-----------------------------+
        |   Pluggable AI Provider     |               |   Data & Knowledge Store    |
        | - Real: Gemini / OpenAI     |               | - SQLite FTS5 Database      |
        | - Mock: Deterministic Demo  |               | - Filtered Open Food Facts  |
        | - Structured Prompts Layer  |               | - USDA + IFCT Composition   |
        +-----------------------------+               +-----------------------------+
```

---

## Core Feature Modules

1. **Food Recognition & Nutrition Analysis**: Real-time vision classification, calorie/macro breakdowns, health score (0-100), explainability cues ("Why this result?"), and allergen safety alerts.
2. **Food Freshness & Spoilage Detection**: Surface pattern and discoloration evaluation classifying items into *Fresh*, *Moderately Fresh*, or *Spoiled* with storage suggestions.
3. **Restaurant Kitchen Hygiene & Safety Monitoring**: Video upload analysis sampling key frames to assess hair-caps, glove usage, cross-contamination, and station cleanliness with downloadable PDF/JSON compliance reports.
4. **Smart Cooking Assistant**: Chat and voice-driven recipe generator with step-by-step guidance, ingredient substitution, interactive cooking timers, and "Cook from my Pantry" prioritization.
5. **Personalized Adaptive Meal Planner**: Dynamic weekly nutrition planning calibrated to dietary constraints, allergies, caloric targets, and macro distribution with one-click meal swapping.
6. **Pantry & Expiry Tracker**: Inventory monitoring with shelf-life estimates, expiry threshold warnings, food-waste metrics, and automated grocery list generation.
7. **Gym Mode**: Dedicated athletic hub featuring Mifflin-St Jeor BMR/TDEE calculation, training/rest day splits, macro adherence progress rings, high-protein food explorer, and evidence-based supplement summaries.
8. **Did You Know? (Food Science Facts)**: Curated repository of 100+ verified food facts categorized across nutrition, culinary science, food safety, and fitness with category filtering and contextual triggers.
9. **Executive Dashboard**: Unified cross-cutting dashboard aggregating historical metrics, pantry alerts, freshness warnings, and personalized diet guidance.
10. **About & Portfolio**: Dedicated profile honoring creator **Anshika Gupta** (B.Tech AIML, LNCT College).

---

## Tech Stack

- **Frontend**: React 18 (Vite), React Router v6, Tailwind CSS, TanStack Query / Axios, Recharts, Lucide React, i18next (English & Hindi), `vite-plugin-pwa`.
- **Backend**: FastAPI (Python 3.11), Pydantic v2, SQLAlchemy, SQLite FTS5 (fuzzy search), Pillow, Pytest.
- **AI Integration**: Pluggable `AIProvider` supporting Google Gemini / OpenAI with built-in zero-dependency deterministic Mock AI fallback.
- **DevOps**: Docker, Docker Compose, GitHub Actions CI, Repository Size Sentinel (< 450 MB).

---

## Quick Start (Local Setup)

### Prerequisites
- Python 3.11+
- Node.js 18+ (tested on Node 24)
- Git

### 1. Clone & Configure
```bash
git clone https://github.com/anshikag0905/foodverse-ai.git
cd foodverse-ai
cp .env.example .env
```

### 2. Backend Setup
```bash
# In project root:
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Backend Swagger Docs will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)*

### 3. Frontend Setup
```bash
# In a new terminal:
cd frontend
npm install
npm run dev
```
*Frontend UI will be live at: [http://localhost:5173](http://localhost:5173)*

---

## One-Command Docker Deployment

Run both backend and frontend simultaneously with Docker Compose:
```bash
docker compose up --build
```
- App UI: `http://localhost:5173`
- API & Docs: `http://localhost:8000/docs`

---

## Demo Mode (Zero API Keys Required)

By default, `DEMO_MODE=true` in `.env`.
- All AI modules utilize the deterministic Mock Provider seeded with realistic culinary models, explainability cues, and allergen triggers.
- Click **"Try a sample"** on any module to run instant multimodal evaluations using pre-bundled assets in `demo-assets/`.
- To switch to real AI providers:
  1. Open `.env`
  2. Set `DEMO_MODE=false`
  3. Set `AI_PROVIDER=gemini` (or `openai`)
  4. Supply your `GEMINI_API_KEY` or `OPENAI_API_KEY`
  5. Restart the backend service.

---

## Repository Size Verification (< 500 MB Budget)

To ensure the project stays lean and strictly adheres to the < 500 MB limit (excluding node_modules and venv):
```bash
python scripts/check_size.py
```
This utility audits all subdirectories, lists a complete size breakdown, and fails with exit code 1 if the unignored footprint exceeds 450 MB.

---

## Authors & Attribution

- **Creator & Lead Engineer**: **Anshika Gupta**
  - **Education**: B.Tech in AI & ML (AIML), LNCT College
  - **GitHub**: [@anshikag0905](https://github.com/anshikag0905)
  - **Email**: [anshikag0905@gmail.com](mailto:anshikag0905@gmail.com)
- **Data Attributions**: Open Food Facts (ODbL v1.0), USDA FoodData Central (Public Domain), IFCT 2017 (ICMR-NIN). See [ATTRIBUTION.md](ATTRIBUTION.md) for full compliance notices.

---

## Disclaimers & Safety

- **Nutritional Estimates**: Values are approximations based on average preparation models and database records; portion sizing and culinary variations will alter actual values.
- **Freshness & Spoilage**: Visual evaluation is decision-support only and cannot detect microscopic microbial toxicity or chemical pathogens.
- **Hygiene Monitoring**: Output provides operational compliance guidance and does not replace statutory municipal health inspections.
- **Fitness & Diet**: All macronutrient calculators and meal regimens are for general educational purposes. Always consult a qualified medical or dietary professional.
