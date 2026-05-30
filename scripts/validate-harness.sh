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

require_file "scripts/install.sh"
[[ -x "scripts/install.sh" ]] || fail "scripts/install.sh must be executable"

require_file "package.json"
require_file "HARNESS.md"
require_file "extensions/learning-root.ts"
python3 -c "import json; d=json.load(open('package.json')); assert 'pi' in d" \
  || fail "package.json missing pi manifest"

require_file "prompts/teach.md"
require_file "prompts/review.md"
require_file "prompts/design.md"
require_file "prompts/explore.md"
require_file "prompts/recall.md"
require_file "skills/deep-dive/SKILL.md"
require_file "skills/design-review/SKILL.md"
require_file "skills/mock-design/SKILL.md"
require_file "skills/code-explore/SKILL.md"
require_file "skills/recall/SKILL.md"

for skill in deep-dive design-review mock-design code-explore recall; do
  f="skills/${skill}/SKILL.md"
  require_grep "$f" "^name: ${skill}$"
  require_grep "$f" "^description:"
done

require_grep "HARNESS.md" "<learning-root>/<domain>/<subject>/"
require_grep "HARNESS.md" "Feynman"
require_grep "HARNESS.md" "recall"
require_grep "skills/deep-dive/SKILL.md" "Feynman gate"
require_grep "skills/deep-dive/SKILL.md" "reflection.md"
require_grep "skills/recall/SKILL.md" "Retrieval"
require_grep "prompts/teach.md" "deep-dive"
require_grep "prompts/review.md" "design-review"
require_grep "prompts/design.md" "mock-design"
require_grep "prompts/explore.md" "code-explore"
require_grep "prompts/recall.md" "recall"
require_grep "extensions/learning-root.ts" "PILEAR_ROOT"
require_grep "extensions/learning-root.ts" "resolve(cwd)"

pass "harness structure"
