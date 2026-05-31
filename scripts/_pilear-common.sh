# Shared helpers for pilear install script.
# shellcheck shell=bash

PILEAR_PACKAGE="git:github.com/ajaypremshankar/pilear"
INSTALL_DIR="$(pwd)"
SETTINGS_FILE="${INSTALL_DIR}/.pi/settings.json"

die() {
  echo "error: $1" >&2
  exit 1
}

ensure_writable_install_dir() {
  if [[ ! -w "${INSTALL_DIR}" ]]; then
    die "cannot write to ${INSTALL_DIR}"
  fi
}

ensure_pi() {
  if command -v pi >/dev/null 2>&1; then
    return 0
  fi

  echo "pi not found — installing from https://pi.dev/ ..."
  curl -fsSL https://pi.dev/install.sh | sh
  command -v pi >/dev/null 2>&1 || die "pi install failed — see https://pi.dev/"
}

ensure_python3() {
  command -v python3 >/dev/null 2>&1 || die "python3 is required to merge .pi/settings.json"
}

merge_settings() {
  ensure_python3
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
}

pilear_configured_locally() {
  [[ -f "${SETTINGS_FILE}" ]] || return 1
  python3 - "${SETTINGS_FILE}" "${PILEAR_PACKAGE}" <<'PY'
import json
import sys
from pathlib import Path

settings_path = Path(sys.argv[1])
package = sys.argv[2]

if not settings_path.exists():
    sys.exit(1)

data = json.loads(settings_path.read_text())
packages = data.get("packages", [])
sys.exit(0 if package in packages else 1)
PY
}
