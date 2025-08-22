#!/usr/bin/env python3
"""
Script: migrate_crown_tokens.py
Purpose: Perform high-confidence automated replacements of legacy `crown-*` tokens to new Himalayan Spice semantic tokens.
Caveats: Operates on source files under repository root (excluding .git, node_modules, .next). Creates a .bak copy for changed files.
"""
import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IGNORED_DIRS = {".git", "node_modules", ".next", "coverage", "dist"}
EXTENSIONS = {".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".mdx"}

# Ordered replacements (more specific first)
REPLACEMENTS = [
    (r"crown-gold-dark", "accent-600"),
    (r"crown-gold", "accent-500"),
    (r"crown-slate-dark", "stout-800"),
    (r"crown-slate", "stout-700"),
    (r"crown-cream", "brand-50"),
    (r"crown-red-dark", "crimson-800"),
    (r"crown-red", "crimson-600"),
    # generic crown- prefix to neutral mapping fallback (rare): crown-dark -> stout-700
    (r"crown-dark", "stout-700"),
]

def should_skip(path: Path):
    for part in path.parts:
        if part in IGNORED_DIRS:
            return True
    return False

def process_file(path: Path):
    text = path.read_text(encoding='utf-8')
    orig = text
    total_replacements = 0
    for pattern, repl in REPLACEMENTS:
        # replace occurrences, including variants like "text-crown-gold", "bg-crown-gold/20", "hover:text-crown-gold"
        new_text, n = re.subn(pattern, repl, text)
        if n > 0:
            text = new_text
            total_replacements += n
    if total_replacements > 0 and text != orig:
        bak = path.with_suffix(path.suffix + '.bak')
        bak.write_text(orig, encoding='utf-8')
        path.write_text(text, encoding='utf-8')
    return total_replacements


def main():
    print(f"Scanning repository: {ROOT}")
    files_changed = 0
    replacements = 0
    for p in ROOT.rglob('*'):
        if p.is_dir():
            continue
        if should_skip(p):
            continue
        if p.suffix.lower() not in EXTENSIONS:
            continue
        try:
            n = process_file(p)
        except Exception as e:
            print(f"Failed to process {p}: {e}")
            continue
        if n > 0:
            print(f"Updated {p} — {n} replacements")
            files_changed += 1
            replacements += n
    print(f"Done. Files changed: {files_changed}. Total replacements: {replacements}.")

if __name__ == '__main__':
    main()
