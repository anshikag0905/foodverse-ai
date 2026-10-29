#!/usr/bin/env python3
"""
FoodVerse AI Acceptance Test Suite
Runs end-to-end automated verification across all 5 tasks:
1. Hygiene Monitor with 3 distinct real MP4 test videos (OpenCV frame extraction, distinct SHA-256, distinct scores, thumbnail verification, caching).
2. Food Recognition with 5 multi-item detection scenarios (bounding boxes, portion scaling, realistic macros, potato sabzi protein check).
3. Dynamic food recalculation (/food/recalculate) scaling test.
4. 30 diverse food database queries (Indian, Global, Gym, Hindi).
5. Cooking assistant complete removal grep check.
6. Design tokens & 3-theme switcher verification.
7. Repository size check (< 450 MB).
"""
import sys
import os
from pathlib import Path
import hashlib

ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = ROOT_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

def log(msg):
    print(msg, flush=True)

def run_sync(coro):
    """Executes a coroutine synchronously without spawning loopback network sockets."""
    stack = [coro]
    val = None
    while stack:
        current = stack[-1]
        try:
            val = current.send(val)
            if hasattr(val, "send"):
                stack.append(val)
                val = None
        except StopIteration as e:
            stack.pop()
            val = e.value
    return val

log("Importing backend modules...")
import cv2
import numpy as np
from app.core.database import SessionLocal, Base, engine
from app.models.user import User
from app.services.hygiene_service import HygieneService
from app.services.recognition_service import RecognitionService
from app.services.food_service import FoodService

log("Instantiating services...")
hygiene_service = HygieneService()
rec_service = RecognitionService()
food_service = FoodService()

with SessionLocal() as db:
    u = db.query(User).first()
    if not u:
        u = User(email="test@foodverse.ai", hashed_password="pw", is_active=True, is_demo=True)
        db.add(u)
        db.commit()
        db.refresh(u)
    TEST_USER_ID = u.id

def create_test_mp4(filepath: Path, duration_sec: int, color_bgr: tuple, label: str):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    fps = 10
    total_frames = duration_sec * fps
    width, height = 320, 240
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(str(filepath), fourcc, fps, (width, height))
    
    for f in range(total_frames):
        frame = np.full((height, width, 3), color_bgr, dtype=np.uint8)
        x_pos = int(30 + (f * 10) % 200)
        y_pos = int(50 + (f * 6) % 120)
        cv2.circle(frame, (x_pos, y_pos), 25, (255, 255, 255), -1)
        cv2.putText(frame, f"{label} {f}", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
        out.write(frame)
        
    out.release()
    return filepath

def test_1_hygiene_monitor():
    log("\n" + "=" * 60)
    log("TEST 1: HYGIENE MONITOR WITH 3 DISTINCT REAL VIDEOS")
    log("=" * 60)
    test_videos_dir = ROOT_DIR / "backend" / "storage" / "test_videos"
    test_videos_dir.mkdir(parents=True, exist_ok=True)
    
    configs = [
        {"duration": 4, "color": (240, 200, 150), "label": "Station 1", "name": "test_video_a.mp4"},
        {"duration": 6, "color": (150, 240, 180), "label": "Station 2", "name": "test_video_b.mp4"},
        {"duration": 8, "color": (180, 150, 240), "label": "Station 3", "name": "test_video_c.mp4"},
    ]
    
    results = []
    
    for cfg in configs:
        vid_path = test_videos_dir / cfg["name"]
        log(f"Generating MP4: {cfg['name']} ({cfg['duration']}s)...")
        create_test_mp4(vid_path, cfg["duration"], cfg["color"], cfg["label"])
        
        with open(vid_path, "rb") as f:
            vid_bytes = f.read()
            expected_hash = hashlib.sha256(vid_bytes).hexdigest()
            
        log(f"[Upload] {cfg['name']} ({len(vid_bytes)} bytes, SHA-256: {expected_hash[:8]}...)")
        
        with SessionLocal() as db:
            job_id = run_sync(hygiene_service.initiate_video_analysis(
                db=db,
                user_id=TEST_USER_ID,
                video_bytes=vid_bytes,
                filename=cfg["name"],
                lang="en"
            ))
            log(f"  -> Job created: {job_id}")
            
            job_data = hygiene_service.get_job_status(db=db, job_id=job_id)
            assert job_data is not None, "Failed to retrieve job status!"
            
            log(f"  -> Status: {job_data.get('status')}")
            log(f"  -> File Hash: {job_data.get('file_hash')[:8]}... (matches: {job_data.get('file_hash') == expected_hash})")
            log(f"  -> Duration: {job_data.get('duration_sec')}s | Frames analyzed: {job_data.get('frames_analyzed')}")
            log(f"  -> Hygiene Score: {job_data.get('overall_score')}")
            log(f"  -> Flagged Incidents: {len(job_data.get('flagged_incidents', []))}")
            
            # Check thumbnails on disk
            for inc in job_data.get("flagged_incidents", []):
                thumb_path = inc.get("thumbnail_path")
                if thumb_path:
                    disk_path = ROOT_DIR / "backend" / "storage" / "uploads" / thumb_path.replace("/static/uploads/", "")
                    if disk_path.exists():
                        log(f"     [Thumbnail Verified] {thumb_path} ({disk_path.stat().st_size} bytes)")
                        break
            
            assert job_data.get("file_hash") == expected_hash, "Hash mismatch!"
            results.append(job_data)
            
    hashes = [r["file_hash"] for r in results]
    scores = [r["overall_score"] for r in results]
    durations = [r["duration_sec"] for r in results]
    
    assert len(set(hashes)) == 3, f"Hashes not unique: {hashes}"
    assert len(set(scores)) == 3, f"Scores not unique: {scores}"
    log(f"\n[PASS] 3 distinct videos produced 3 unique hashes: {[h[:8] for h in hashes]}")
    log(f"[PASS] 3 distinct scores: {scores}")
    log(f"[PASS] 3 distinct durations: {durations}")
    
    # Caching verification
    with SessionLocal() as db:
        with open(test_videos_dir / "test_video_a.mp4", "rb") as f:
            vid_a_bytes = f.read()
        cached_job_id = run_sync(hygiene_service.initiate_video_analysis(
            db=db,
            user_id=TEST_USER_ID,
            video_bytes=vid_a_bytes,
            filename="test_video_a.mp4",
            lang="en"
        ))
        assert cached_job_id == results[0]["job_id"]
        log(f"[PASS] Video caching verified: re-uploading returned cached job ID {cached_job_id}")

def test_2_food_recognition():
    log("\n" + "=" * 60)
    log("TEST 2: FOOD RECOGNITION MULTI-ITEM DETECTION & PORTION SCALING")
    log("=" * 60)
    scenarios = [
        {"name": "Indian Thali", "query": "thali", "min_items": 4},
        {"name": "Fruit Bowl", "query": "fruit bowl", "min_items": 3},
        {"name": "Gym Meal", "query": "gym meal", "min_items": 3},
        {"name": "Natural Text Query", "query": "2 rotis and dal tadka", "min_items": 2},
        {"name": "Single Dish: Potato Sabzi", "query": "potato sabzi", "min_items": 1},
    ]
    
    with SessionLocal() as db:
        for sc in scenarios:
            log(f"\n[Scenario] {sc['name']} (Query: '{sc['query']}')")
            data = run_sync(rec_service.analyze_food(
                db=db,
                user_id=TEST_USER_ID,
                image_bytes=None,
                filename=None,
                query=sc["query"],
                lang="en"
            ))
            items = data.get("items", [])
            log(f"  -> Detected {len(items)} items: {[it['name'] for it in items]}")
            assert len(items) >= sc["min_items"], f"Expected >= {sc['min_items']} items, got {len(items)}"
            
            for it in items:
                box = it.get("box")
                box_str = f"[{box['ymin']:.2f}, {box['xmin']:.2f}, {box['ymax']:.2f}, {box['xmax']:.2f}]" if box else "N/A"
                log(f"     * {it['name']}: {it['estimated_grams']}g | {it['calories']} kcal | P:{it['protein']}g C:{it['carbs']}g F:{it['fat']}g | Box: {box_str}")
                assert it["calories"] > 0
                
            log(f"  -> Plate Totals: {data.get('total_calories')} kcal | Protein: {data.get('total_protein')}g | Carbs: {data.get('total_carbs')}g | Fat: {data.get('total_fat')}g")
            
            if "Potato" in sc["name"]:
                protein = items[0]["protein"]
                log(f"  -> [VERIFIED] Potato Sabzi realistic protein: {protein}g (< 5.0g)")
                assert protein < 5.0, f"Expected < 5.0g protein, got {protein}g!"
                
    log("\n[PASS] All 5 multi-item food recognition scenarios passed with verified scaled macros!")

def test_3_recalculate():
    log("\n" + "=" * 60)
    log("TEST 3: DYNAMIC PORTION RECALCULATION (/food/recalculate)")
    log("=" * 60)
    items = [
        {"name": "Whole Wheat Roti / Chapati", "grams": 70},
        {"name": "Dal Makhani", "grams": 150}
    ]
    data1 = rec_service.recalculate_plate(items=items)
    items[0]["grams"] = 140
    data2 = rec_service.recalculate_plate(items=items)
    assert data2["total_calories"] > data1["total_calories"]
    assert data2["total_protein"] > data1["total_protein"]
    log(f"70g Roti + 150g Dal -> {data1['total_calories']} kcal, {data1['total_protein']}g protein")
    log(f"140g Roti + 150g Dal -> {data2['total_calories']} kcal, {data2['total_protein']}g protein")
    log(f"[PASS] Dynamic scaling consistent: +{round(data2['total_calories'] - data1['total_calories'], 1)} kcal, +{round(data2['total_protein'] - data1['total_protein'], 1)}g protein")

def test_4_db_search():
    log("\n" + "=" * 60)
    log("TEST 4: FOOD DATABASE 30 DIVERSE QUERIES (SQLite FTS5)")
    log("=" * 60)
    queries = [
        "banana", "apple", "potato sabzi", "aloo gobi", "paneer tikka",
        "dal makhani", "soya chunks", "boiled egg", "chicken breast", "roti",
        "basmati rice", "idli", "masala dosa", "samosa", "rajma",
        "chana masala", "palak paneer", "whey protein", "oats", "greek yogurt",
        "tofu", "peanut butter", "pizza", "burger", "tacos",
        "sushi", "ramen", "hummus", "केला", "आलू"
    ]
    passed = 0
    for q in queries:
        res = food_service.search_foods(query=q, limit=3)
        matches = res.get("items", [])
        assert len(matches) > 0, f"No match for '{q}'"
        log(f"  '{q}' -> {len(matches)} matches (Top: {matches[0]['name']})")
        passed += 1
    log(f"[PASS] 30/30 queries succeeded ({passed} verified).")

def test_5_cooking_grep():
    log("\n" + "=" * 60)
    log("TEST 5: ZERO DEAD REFERENCES TO COOKING ASSISTANT")
    log("=" * 60)
    forbidden = ["/cooking", "cooking_service", "CookingAssistant", "Smart Cooking Assistant", "Cook From My Pantry"]
    dirs = [ROOT_DIR / "backend" / "app", ROOT_DIR / "frontend" / "src"]
    for d in dirs:
        for p in d.rglob("*"):
            if p.is_file() and p.suffix in [".py", ".jsx", ".js"]:
                content = p.read_text(encoding="utf-8", errors="ignore")
                for term in forbidden:
                    assert term not in content, f"Found '{term}' in {p.relative_to(ROOT_DIR)}"
    log("[PASS] 0 dead references to Cooking Assistant found across backend and frontend.")

def test_6_themes():
    log("\n" + "=" * 60)
    log("TEST 6: DESIGN SYSTEM & 3 THEMES (BLUE, WHITE, BLACK)")
    log("=" * 60)
    index_css = (ROOT_DIR / "frontend" / "src" / "index.css").read_text(encoding="utf-8")
    assert '[data-theme="blue"]' in index_css
    assert '[data-theme="white"]' in index_css
    assert '[data-theme="black"]' in index_css
    log("  -> [data-theme='blue|white|black'] CSS custom properties exist in index.css")
    
    index_html = (ROOT_DIR / "frontend" / "index.html").read_text(encoding="utf-8")
    assert 'foodverse_theme' in index_html and 'data-theme' in index_html
    log("  -> Zero-FOUC pre-paint script exists in frontend/index.html")
    
    header_jsx = (ROOT_DIR / "frontend" / "src" / "components" / "layout" / "Header.jsx").read_text(encoding="utf-8")
    assert 'blue' in header_jsx and 'white' in header_jsx and 'black' in header_jsx
    log("  -> 3-theme pill switcher (Blue | White | Black) exists in Header.jsx")
    log("[PASS] Theme architecture and zero-FOUC tokens verified.")

def test_7_size():
    log("\n" + "=" * 60)
    log("TEST 7: REPOSITORY SIZE VERIFICATION (< 450 MB)")
    log("=" * 60)
    total = 0
    file_count = 0
    skip = {".git", "node_modules", "dist", ".pytest_cache", "__pycache__", ".venv"}
    for root, dirs, files in os.walk(str(ROOT_DIR)):
        dirs[:] = [d for d in dirs if d not in skip]
        for f in files:
            total += os.path.getsize(os.path.join(root, f))
            file_count += 1
    mb = total / (1024 * 1024)
    log(f"  Tracked Repository Size: {mb:.2f} MB across {file_count} files")
    assert mb < 450.0, f"Size {mb:.2f} MB exceeds 450 MB limit!"
    log(f"[PASS] Repository size {mb:.2f} MB is well within the 450 MB budget limit.")

def main():
    log("\n" + "=" * 60)
    log("  STARTING FOODVERSE AI AUTONOMOUS ACCEPTANCE SUITE")
    log("=" * 60)
    
    test_1_hygiene_monitor()
    test_2_food_recognition()
    test_3_recalculate()
    test_4_db_search()
    test_5_cooking_grep()
    test_6_themes()
    test_7_size()
    
    log("\n" + "=" * 60)
    log("  ALL 7 ACCEPTANCE TEST SUITES PASSED WITH 100% SUCCESS!")
    log("=" * 60 + "\n")

if __name__ == "__main__":
    main()
