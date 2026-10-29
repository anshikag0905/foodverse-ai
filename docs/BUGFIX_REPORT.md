# FoodVerse AI – Bugfix & Architecture Diagnostic Report
**Date:** October 29, 2026  
**Auditor:** FoodVerse AI Autonomous Remediation Engine  
**Target:** Production & Local Environment (Render deployment issues)

---

## 1. Executive Summary

A comprehensive investigation was conducted across the backend API services, AI providers, database layers, and frontend React components. All four reported production issues were traced to their underlying root causes rather than superficial symptoms.

| # | Reported Issue | Root Cause Category | Exact Root Cause |
|---|---|---|---|
| 1 | **Hygiene Monitor returns the SAME result for every video** | Hardcoded AI mock & missing frame pipeline | `gemini_provider.py` unconditionally delegated `analyze_kitchen_video` to `mock_provider.py`, which returned a static score of 87 and identical hardcoded incident strings regardless of video content. Furthermore, no OpenCV frame sampling pipeline existed to extract frames, compute file SHA-256 hashes, or deliver real visual evidence. |
| 2 | **Food Recognition does not work properly** | Stubbed vision API & single-item heuristic | `gemini_provider.py` did not invoke Gemini Vision even when configured; it fell back to substring filename matching in `mock_provider.py`. Files with standard camera names (e.g. `IMG_001.jpg`) failed matching and fell into generic defaults. No multi-item bounding box detection pipeline existed. |
| 3 | **The blue (sky-blue) theme does not work** | Absence of CSS variable token system & missing `data-theme` architecture | Theme state toggled inline classes in `App.jsx` instead of binding semantic CSS variables to `[data-theme="blue|white|black"]` on `<html>`. Card backgrounds, inputs, borders, and Recharts retained hardcoded Tailwind colors (`bg-white`, `dark:bg-dusk-card`), breaking visual consistency across themes. |
| 4 | **Smart Cooking Assistant does not work** | Unstable session state & dead-end dependency | The module depended on persistent session SQLite models that crashed on unseeded deployments, with incomplete prompt schemas. User has formally ordered the **complete removal** of this module across frontend, backend, routes, database, and documentation. |

---

## 2. In-Depth Diagnostic Analysis

### 2.1 Issue 1: Hygiene Monitor Invariant Video Output
- **Code Inspection:**
  - `backend/app/ai/gemini_provider.py`:
    ```python
    async def analyze_kitchen_video(self, *args, **kwargs) -> HygieneAnalysisResult:
        return await self.fallback.analyze_kitchen_video(*args, **kwargs)
    ```
    The real Gemini provider never handled video files.
  - `backend/app/ai/mock_provider.py`:
    `analyze_kitchen_video` returned a static `HygieneAnalysisResult(overall_score=87, ...)` with hardcoded timestamps (`00:03s`, `00:08s`, `00:15s`).
  - `backend/app/services/hygiene_service.py`:
    Did not compute file SHA-256, did not extract video frames, and cached jobs by arbitrary UUID rather than content hash.
- **Frontend Fallback:**
  - `frontend/src/pages/HygieneMonitor.jsx` had a client-side catch block that forced a static score of 88/89 if the API timed out.
- **Remediation Plan:**
  1. Build an OpenCV frame extraction pipeline (`cv2.VideoCapture`) sampling 1 frame per 2 seconds (max 30 frames, resized to 768px).
  2. Compute SHA-256 of the video upload.
  3. Send actual sampled frames to the Vision AI model (or provide frame-by-frame visual audit in real analyzer).
  4. Per frame, extract: gloves worn, hair coverings, uniform/apron, handwashing, raw/cooked cross-contact risk, surface cleanliness, pests/waste.
  5. Aggregate per-frame evidence into a verified report showing: filename, SHA-256 prefix, duration, frame count, thumbnail moments.
  6. If no API key is provided, clearly show: `"AI provider not configured. Add GEMINI_API_KEY (or OPENAI_API_KEY) in backend environment"`. Do NOT return fabricated fake results.

---

### 2.2 Issue 2: Food Recognition & Single-Item Fallback
- **Code Inspection:**
  - `backend/app/ai/gemini_provider.py`:
    `analyze_food` unconditionally returned `await self.fallback.analyze_food(*args, **kwargs)`.
  - `backend/app/ai/mock_provider.py`:
    Only matched food if the filename or query contained specific keywords (`apple`, `banana`, `paneer`). Real user uploads named `image.webp` or camera captures defaulted to a single hardcoded meal.
  - Single-label limitation: The model schema (`FoodItemDetection`) only supported one label per scan, ignoring plates with multiple dishes (e.g. rice, dal, sabzi, roti).
- **Remediation Plan:**
  1. Rebuild as a true multi-item food detection tool: detect multiple items on a single plate, return normalized bounding boxes `[ymin, xmin, ymax, xmax]`, item names, confidence, and portion estimates in grams.
  2. Overlay bounding boxes and interactive chips over the image on the frontend canvas.
  3. Scale nutritional calculation directly from authoritative SQLite FTS5 database values using detected gram weights.
  4. Allow user manual correction (search database, adjust grams) with instant recalculation.
  5. If no API key is configured, alert the user explicitly; allow sample runs only on bundled demo assets with explicit label `"Sample report (not analyzing your upload)"`.

---

### 2.3 Issue 3: Theme Inconsistency & Broken Sky-Blue Theme
- **Code Inspection:**
  - `frontend/src/App.jsx` applied theme colors via conditional strings on the top wrapper `div`.
  - Child components throughout `frontend/src/pages/` and `frontend/src/components/` relied on `bg-white`, `dark:bg-dusk-card`, and hardcoded borders (`border-ink`), completely ignoring theme tokens.
  - No `data-theme` attribute was attached to `document.documentElement` (`<html>`).
- **Remediation Plan:**
  1. Establish CSS custom properties in `frontend/src/index.css`:
     - `--bg-gradient-start`, `--bg-gradient-end`, `--card-bg`, `--card-border`, `--text-primary`, `--text-muted`, `--accent-primary`, `--shadow-color`.
  2. Implement three themes on `html[data-theme="blue|white|black"]`:
     - `blue`: Playful sky-blue background (`#BFE6FF` to `#8FD3FF`), creamy cards (`#FFFFFF`), navy ink (`#0F1B3D`).
     - `white`: Ultra-clean crisp light theme (`#F8FAFC` to `#EDF2F7`), white cards, dark slate typography.
     - `black`: High-contrast true OLED dark theme (`#000000` to `#0B0F19`), deep slate cards (`#111827`), high-contrast text (`#F9FAFB`).
  3. Bind Tailwind config to these CSS variables.
  4. Ensure instant pre-paint execution in `index.html` to eliminate flash of unstyled content (FOUC).
  5. Provide a verification `/design` page showcasing all three themes.

---

### 2.4 Issue 4: Smart Cooking Assistant Removal
- **User Instruction:**
  Completely eliminate the Smart Cooking Assistant module from the application.
- **Affected Artifacts to Delete & Clean Up:**
  - Frontend: `frontend/src/pages/CookingAssistant.jsx`, routes in `App.jsx`, navigation links in `Sidebar.jsx`, `Header.jsx`, `MobileTabBar.jsx`, and module cards in `Dashboard.jsx`.
  - Backend: `backend/app/api/v1/cooking.py`, `backend/app/services/cooking_service.py`, `backend/app/models/cooking.py`, cooking routers in `backend/app/main.py`.
  - Database & Migrations: Remove `cooking_sessions` table and references.
  - Localization & Documentation: Remove `cooking` keys from `en.json`, `hi.json`, `README.md`, `About.jsx`, and project summaries.

---

## 3. Database Expansion & Quality Requirements
- Create `data/seed/foods_seed.csv` with **1,000+ new distinct foods** covering pan-Indian regional cuisines, global dishes (Japanese, Chinese, Mexican, Italian, American), gym nutrition, and raw staples.
- Enforce strict validation:
  - 4/4/9 macro caloric consistency check.
  - Non-negative numbers.
  - Source tagging (`USDA`, `IFCT`, `OpenFoodFacts`, `estimated`).
  - Deduplication against existing records.
- Rebuild SQLite FTS5 full-text search index and log metrics in `docs/DB_REPORT.md`.
- Enforce total project size < 500 MB (budget: 450 MB).

---
*End of Diagnostic Report. Proceeding to autonomous implementation without interruptions.*
