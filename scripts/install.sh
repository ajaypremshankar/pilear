#!/usr/bin/env bash
set -euo pipefail

PILEAR_PACKAGE="git:github.com/ajaypremshankar/pilear"
INSTALL_DIR="$(pwd)"
SETTINGS_FILE="${INSTALL_DIR}/.pi/settings.json"

die() {
  echo "error: $1" >&2
  exit 1
}

if [[ ! -w "${INSTALL_DIR}" ]]; then
  die "cannot write to ${INSTALL_DIR}"
fi

if ! command -v pi >/dev/null 2>&1; then
  echo "pi not found — installing from https://pi.dev/ ..."
  curl -fsSL https://pi.dev/install.sh | sh
  command -v pi >/dev/null 2>&1 || die "pi install failed — see https://pi.dev/"
fi

if ! command -v python3 >/dev/null 2>&1; then
  die "python3 is required to merge .pi/settings.json"
fi

echo "Installing pilear (project-local) in ${INSTALL_DIR} ..."
pi install -l "${PILEAR_PACKAGE}"

python3 - "${SETTINGS_FILE}" "${PILEAR_PACKAGE}" <<'PY'
import json
import sys
from pathlib import Path

settings_path = Path(sys.argv[1])
package = sys.argv[2]

data = {}
if settings_path.exists():
    try:
        data = json.loads(settings_path.read_text())
    except json.JSONDecodeError as exc:
        print(f"error: invalid JSON in {settings_path}: {exc}", file=sys.stderr)
        sys.exit(1)
    if not isinstance(data, dict):
        print(f"error: expected object in {settings_path}", file=sys.stderr)
        sys.exit(1)

packages = data.get("packages")
if packages is None:
    packages = []
elif not isinstance(packages, list):
    print(f"error: packages must be a list in {settings_path}", file=sys.stderr)
    sys.exit(1)

if package not in packages:
    packages.append(package)
data["packages"] = packages
data["enableSkillCommands"] = True

settings_path.parent.mkdir(parents=True, exist_ok=True)
settings_path.write_text(json.dumps(data, indent=2) + "\n")
PY

cat <<EOF

✓ pilear enabled in ${INSTALL_DIR}
  Config: .pi/settings.json
  Learning root: this folder (run pi here)
  Try: pi → /teach RAG evaluation
EOF
