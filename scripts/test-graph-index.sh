#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
node --experimental-strip-types --test tests/graph-index-core.test.ts
echo "PASS: graph-index-core tests"
