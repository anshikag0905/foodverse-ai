#!/usr/bin/env python3
"""
Repository Size Audit Script for FoodVerse AI.
Enforces the strict < 450 MB size budget for committed and unignored repository assets.
"""

import os
import sys
from pathlib import Path

# Directories and patterns to ignore (consistent with .gitignore)
IGNORE_DIRS = {
    '.git',
    'node_modules',
    'venv',
    '.venv',
    'env',
    '__pycache__',
    '.pytest_cache',
    'dist',
    'build',
    '.idea',
    '.vscode',
    'coverage',
    'datasets',
    'htmlcov',
}

MAX_ALLOWED_MB = 450.0

def get_dir_size(path: Path) -> int:
    """Recursively calculate the total byte size of a directory excluding ignored folders."""
    total = 0
    try:
        for entry in os.scandir(path):
            if entry.name in IGNORE_DIRS or entry.name.startswith('.'):
                continue
            if entry.is_dir(follow_symlinks=False):
                total += get_dir_size(Path(entry.path))
            elif entry.is_file(follow_symlinks=False):
                total += entry.stat().st_size
    except PermissionError:
        pass
    return total

def main():
    repo_root = Path(__file__).resolve().parent.parent
    print("=" * 65)
    print("       FoodVerse AI – Repository Size Budget Enforcement       ")
    print("=" * 65)
    print(f"Auditing Root: {repo_root}")
    print(f"Size Limit:    {MAX_ALLOWED_MB:.1f} MB (Hard Cap: 500 MB)\n")

    breakdown = {}
    total_bytes = 0

    # Top-level directory analysis
    for item in sorted(repo_root.iterdir()):
        if item.name in IGNORE_DIRS or item.name == '.git':
            continue
        if item.is_dir():
            dir_size = get_dir_size(item)
            breakdown[item.name] = dir_size
            total_bytes += dir_size
        elif item.is_file():
            file_size = item.stat().st_size
            breakdown[item.name] = file_size
            total_bytes += file_size

    # Print breakdown table
    print(f"{'Folder / File':<35} | {'Size (KB)':<12} | {'Size (MB)':<10}")
    print("-" * 65)
    for name, sz in sorted(breakdown.items(), key=lambda x: x[1], reverse=True):
        sz_kb = sz / 1024.0
        sz_mb = sz / (1024.0 * 1024.0)
        print(f"{name:<35} | {sz_kb:>10.2f} KB | {sz_mb:>8.3f} MB")

    total_mb = total_bytes / (1024.0 * 1024.0)
    print("-" * 65)
    print(f"{'TOTAL AUDITED REPO SIZE':<35} | {total_bytes/1024.0:>10.2f} KB | {total_mb:>8.3f} MB")
    print("=" * 65)

    if total_mb > MAX_ALLOWED_MB:
        print(f"\n[FAIL] Repository footprint ({total_mb:.2f} MB) EXCEEDS maximum allowance of {MAX_ALLOWED_MB:.1f} MB!")
        sys.exit(1)
    else:
        print(f"\n[PASS] Repository size ({total_mb:.2f} MB) is well within the {MAX_ALLOWED_MB:.1f} MB budget.")
        sys.exit(0)

if __name__ == "__main__":
    main()
