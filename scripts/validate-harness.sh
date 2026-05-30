#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() { echo "FAIL: $1" >&2; exit 1; }
pass() { echo "PASS: $1"; }

require_file() {
  [[ -f "$1" ]] || fail "missing file: $1"
}

require_grep() {
  grep -q "$2" "$1" || fail "expected pattern in $1: $2"
}

require_file "AGENTS.md"
require_file ".pi/settings.json"
require_file ".pi/prompts/teach.md"
require_file ".pi/prompts/review.md"
require_file ".pi/prompts/design.md"
require_file ".pi/prompts/explore.md"
require_file ".pi/skills/deep-dive/SKILL.md"
require_file ".pi/skills/design-review/SKILL.md"
require_file ".pi/skills/mock-design/SKILL.md"
require_file ".pi/skills/code-explore/SKILL.md"

for skill in deep-dive design-review mock-design code-explore; do
  f=".pi/skills/${skill}/SKILL.md"
  require_grep "$f" "^name: ${skill}$"
  require_grep "$f" "^description:"
done

require_grep "AGENTS.md" "topics/<domain>/<subject>/"
require_grep "AGENTS.md" "principal"
require_grep ".pi/prompts/teach.md" "deep-dive"
require_grep ".pi/prompts/review.md" "design-review"
require_grep ".pi/prompts/design.md" "mock-design"
require_grep ".pi/prompts/explore.md" "code-explore"

pass "harness structure"
