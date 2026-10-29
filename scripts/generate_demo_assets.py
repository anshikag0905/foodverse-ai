"""
Generate lightweight, license-free demo assets for FoodVerse AI.
Outputs:
- demo-assets/apple_fresh.jpg
- demo-assets/banana_ripe.jpg
- demo-assets/bread_moldy.jpg
- demo-assets/paneer_tikka.jpg
- demo-assets/kitchen_prep.mp4 (< 2 MB video with frames for hygiene testing)
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import cv2
import numpy as np

def create_demo_assets():
    out_dir = Path(__file__).resolve().parent.parent / "demo-assets"
    out_dir.mkdir(parents=True, exist_ok=True)

    # 1. Fresh Apple Image
    img_apple = Image.new('RGB', (640, 480), color=(245, 245, 240))
    draw = ImageDraw.Draw(img_apple)
    # Draw apple body (crisp red)
    draw.ellipse([220, 140, 420, 380], fill=(220, 38, 38), outline=(185, 28, 28), width=3)
    draw.rectangle([315, 100, 325, 150], fill=(120, 53, 15)) # stem
    draw.polygon([(325, 120), (370, 100), (350, 135)], fill=(34, 197, 94)) # leaf
    # Text badge
    draw.rectangle([20, 20, 320, 70], fill=(34, 197, 94))
    draw.text((30, 30), "DEMO: Fresh Red Apple (Honeycrisp)", fill=(255, 255, 255))
    img_apple.save(out_dir / "apple_fresh.jpg", quality=85)

    # 2. Ripe Banana Image
    img_banana = Image.new('RGB', (640, 480), color=(250, 250, 245))
    draw = ImageDraw.Draw(img_banana)
    # Draw banana arc
    draw.arc([160, 150, 480, 420], start=180, end=360, fill=(234, 179, 8), width=50)
    # Minor sugar spots (moderately fresh / ripe)
    for x, y in [(250, 200), (300, 185), (350, 190), (380, 220), (280, 210)]:
        draw.ellipse([x-4, y-4, x+4, y+4], fill=(133, 77, 14))
    draw.rectangle([20, 20, 320, 70], fill=(234, 179, 8))
    draw.text((30, 30), "DEMO: Ripe Banana (Moderately Fresh)", fill=(0, 0, 0))
    img_banana.save(out_dir / "banana_ripe.jpg", quality=85)

    # 3. Spoiled / Moldy Bread
    img_bread = Image.new('RGB', (640, 480), color=(240, 238, 230))
    draw = ImageDraw.Draw(img_bread)
    # Bread slice
    draw.rounded_rectangle([180, 150, 460, 380], radius=30, fill=(217, 179, 130), outline=(146, 95, 42), width=4)
    # Green/gray mold patches
    mold_spots = [
        (220, 200, 25), (280, 260, 35), (380, 310, 30), (340, 210, 20), (250, 330, 28)
    ]
    for mx, my, r in mold_spots:
        draw.ellipse([mx-r, my-r, mx+r, my+r], fill=(47, 95, 71))
        draw.ellipse([mx-r//2, my-r//2, mx+r//2, my+r//2], fill=(82, 135, 110))
    draw.rectangle([20, 20, 320, 70], fill=(225, 29, 72))
    draw.text((30, 30), "DEMO: Spoiled Bread (Mold Discoloration)", fill=(255, 255, 255))
    img_bread.save(out_dir / "bread_moldy.jpg", quality=85)

    # 4. Paneer Tikka Dish (Indian Cuisine)
    img_paneer = Image.new('RGB', (640, 480), color=(250, 245, 235))
    draw = ImageDraw.Draw(img_paneer)
    # Skewer line
    draw.line([(100, 260), (540, 260)], fill=(120, 113, 108), width=6)
    # Cubes of paneer and bell peppers
    items = [
        ((160, 210, 220, 310), (249, 115, 22)), # Capsicum
        ((230, 200, 310, 320), (254, 240, 138)), # Paneer cube with char marks
        ((320, 210, 370, 310), (220, 38, 38)), # Tomato / red onion
        ((380, 200, 460, 320), (254, 240, 138)), # Paneer cube
    ]
    for box, color in items:
        draw.rounded_rectangle(box, radius=8, fill=color, outline=(180, 83, 9), width=3)
        # Grill char marks
        draw.line([(box[0]+10, box[1]+25), (box[2]-10, box[1]+25)], fill=(100, 40, 10), width=2)
        draw.line([(box[0]+10, box[1]+55), (box[2]-10, box[1]+55)], fill=(100, 40, 10), width=2)
    draw.rectangle([20, 20, 340, 70], fill=(249, 115, 22))
    draw.text((30, 30), "DEMO: Grilled Paneer Tikka (250g)", fill=(255, 255, 255))
    img_paneer.save(out_dir / "paneer_tikka.jpg", quality=85)

    # 5. Kitchen Prep Video (MP4) for Restaurant Hygiene Monitoring
    # 5 seconds at 10 fps = 50 frames
    video_path = str(out_dir / "kitchen_prep.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, 10.0, (640, 360))

    for frame_idx in range(50):
        frame = np.full((360, 640, 3), (240, 240, 240), dtype=np.uint8)
        # Kitchen counter
        cv2.rectangle(frame, (0, 200), (640, 360), (180, 175, 170), -1)
        # Stainless steel prep table line
        cv2.line(frame, (0, 200), (640, 200), (120, 120, 120), 3)

        # Worker silhouette / station
        cv2.circle(frame, (320, 110), 45, (100, 120, 140), -1) # Head
        cv2.rectangle(frame, (250, 155), (390, 260), (70, 90, 110), -1) # Apron body

        # Hair-cap indicator (Blue hair net)
        cv2.ellipse(frame, (320, 90), (46, 25), 0, 180, 360, (220, 150, 50), -1)

        # Cutting board on counter
        cv2.rectangle(frame, (230, 230), (410, 320), (220, 220, 220), -1)
        cv2.rectangle(frame, (280, 250), (360, 290), (50, 160, 50), -1) # Vegetables

        # Frame counter & compliance annotations
        timestamp = frame_idx / 10.0
        cv2.putText(frame, f"Kitchen Station A - Time: 00:0{int(timestamp)}s", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (30, 30, 30), 2)
        cv2.putText(frame, "HYGIENE MONITORING ACTIVE - [HAIR-NET: PASS, GLOVES: PASS]", (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 150, 0), 2)

        if frame_idx >= 30 and frame_idx <= 40:
            # Simulated flagged incident: bare hand near raw poultry
            cv2.putText(frame, "FLAGGED 00:03s: Cross-Contamination Warning", (20, 330),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 220), 2)

        out.write(frame)

    out.release()
    print("Successfully generated all demo assets in:", out_dir)

if __name__ == "__main__":
    create_demo_assets()
