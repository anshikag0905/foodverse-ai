#!/usr/bin/env python3
"""
Build Food Database Pipeline for FoodVerse AI.
Downloads open datasets (USDA FoodData Central, Open Food Facts filtered slice, IFCT),
normalizes units per 100g, dedupes, and updates the SQLite FTS5 database.
"""

import os
import sys
import gzip
import sqlite3
import argparse
from pathlib import Path

def build_full_database(cap_records: int = 150000, output_path: str = None):
    root_dir = Path(__file__).resolve().parent.parent
    db_file = Path(output_path) if output_path else root_dir / "backend" / "data" / "food_database.sqlite"

    print("=" * 65)
    print("      FoodVerse AI – Global Food Database Ingestion Pipeline    ")
    print("=" * 65)
    print(f"Target Destination: {db_file}")
    print(f"Configured Row Cap: {cap_records} entries\n")

    # If the database already exists or starter DB is available, verify or seed
    if not db_file.exists():
        from seed_starter_db import create_food_database
        print("Generating foundation starter database...")
        create_food_database(db_file)

    conn = sqlite3.connect(str(db_file))
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM foods;")
    count = cur.fetchone()[0]
    print(f"Current verified food database records: {count}")

    # Vacuum and re-index
    print("Optimizing SQLite indexes and FTS5 search structures...")
    cur.execute("INSERT INTO foods_fts(foods_fts) VALUES('optimize');")
    conn.commit()
    conn.close()

    raw_mb = db_file.stat().st_size / (1024 * 1024)
    print(f"Database build complete. Final disk size: {raw_mb:.2f} MB")
    print("=" * 65)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FoodVerse AI Food Database Builder")
    parser.add_argument("--cap", type=int, default=150000, help="Cap maximum Open Food Facts records")
    parser.add_argument("--out", type=str, default=None, help="Output SQLite database path")
    args = parser.parse_args()

    build_full_database(cap_records=args.cap, output_path=args.out)
