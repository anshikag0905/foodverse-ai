# FoodVerse AI – Project Executive Summary (One-Pager)

---

## 1. Problem Statement
Modern dietary and culinary health tools suffer from fragmented user workflows and black-box recommendations:
- **Disjointed Modalities**: Consumers must use separate apps to log food, inspect expiration dates, verify kitchen hygiene, calculate fitness macros, and discover recipes.
- **Opacity & Hallucinations**: Standard AI vision models predict calories without explaining *why* (visual cues, surface texture, or data source) and often fail to flag critical dietary allergens.
- **Data & Commercial Bloat**: Traditional meal planning apps are heavy, require proprietary paid cloud subscriptions, and fail to provide offline, self-hosted, or developer-friendly zero-cost operation.

---

## 2. The Solution: FoodVerse AI
**FoodVerse AI** is an all-in-one multimodal food intelligence platform that turns vision, audio, text, and barcode inputs into verifiable, actionable health decisions.
- **Multimodal Router**: Ingests images of food, kitchen inspection videos, audio/voice queries, barcodes, and text requests into a unified FastAPI processing pipeline.
- **Explainability First**: Every prediction displays confidence ratings, visual reasoning cues, data origin tags (*"Database"* vs *"AI estimate"*), and immediate, prominent allergen alerts.
- **Offline & Zero-Cost Demo Mode**: Fully functional without external API keys using deterministic mock intelligence and local SQLite FTS5 database search.
- **Lean Footprint**: Enforced repository footprint under 450 MB while covering over 20,000 global food items and regional cuisines (Indian, Mediterranean, East Asian, Western).

---

## 3. High-Level Architecture & Tech Stack

```
[ Multimodal Client (React PWA) ]
      |  (REST API, Multipart, Speech-to-Text, Barcode Scanner)
      v
[ FastAPI Backend (Python 3.11) ]
  ├── Modular Service Layer (Food, Freshness, Hygiene, Meal, Pantry, Gym, Facts)
  ├── Background Asynchronous Task Processing (Video Frame Analysis)
  ├── Pluggable AI Interface (Gemini / OpenAI / Deterministic Mock)
  └── Data & Storage Layer (SQLite FTS5 Full-Text Index + Local Storage Provider)
```

- **Frontend**: React 18 (Vite), React Router v6, Tailwind CSS, TanStack Query, Recharts, i18next (English & Hindi), `vite-plugin-pwa`.
- **Backend**: FastAPI, Pydantic v2, SQLAlchemy, SQLite FTS5, Pillow, Pytest.
- **Compliance & Safety**: Automated allergen screening, WCAG AA accessibility, data privacy controls (export / erase).

---

## 4. Key Functional Modules
1. **Food Recognition & Nutrition**: Identifies dishes, portions, calories, macros, and calculates health scores (0-100).
2. **Freshness & Spoilage**: Inspects surface discoloration and textural decay to classify items (Fresh, Moderately Fresh, Spoiled) with storage advice.
3. **Kitchen Hygiene & Safety**: Video analysis sampling frames to verify hair-caps, gloves, cross-contamination, and station cleanliness with downloadable reports.
4. **Personalized Meal Planner**: Weekly macro-optimized planning with instant meal swapping and grocery list synchronization.
6. **Pantry & Expiry Tracker**: Inventory tracking with shelf-life prediction, expiry alerts, and food waste reduction metrics.
7. **Gym Mode**: Mifflin-St Jeor BMR/TDEE calculation, protein targets, daily macro progress rings, and high-protein food explorer.
8. **Did You Know?**: 100+ peer-reviewed and authoritative food science facts with category filtering and contextual triggers.
9. **Executive Dashboard**: Cross-cutting nutritional trends, inventory warnings, and recommendations.
10. **About Page**: Creator portfolio highlighting **Anshika Gupta** (B.Tech AIML, LNCT College).

---

## 5. Slide-Ready Highlights
- **Universal Accessibility**: Seamless English and Hindi bilingual interface with complete Light/Dark theme switching.
- **Speed & Efficiency**: Instant sub-50ms local database search with SQLite FTS5 fuzzy matching.
- **Privacy Guaranteed**: Local video retention policies with automatic disposal and complete one-click user data export/deletion.
- **Future Scope**: On-device edge WebAssembly vision models, IoT smart fridge integration, and automated recipe video synthesis.
