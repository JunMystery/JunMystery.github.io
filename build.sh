#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "========================================"
echo "Building Portfolio Site (HTML + JS)"
echo "========================================"

# 1. Build index.html from src/html/
bash "$ROOT/src/html/build.sh"

# 2. Build src/bundle.js from src/bundle/
bash "$ROOT/src/bundle/build.sh"

echo ""
echo "Site build complete. 100% offline-ready."
