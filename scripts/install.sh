#!/usr/bin/env bash
set -euo pipefail

PILEAR_RAW="https://raw.githubusercontent.com/ajaypremshankar/pilear/main"

load_pilear_common() {
  local here=""
  if [[ -n "${BASH_SOURCE[0]:-}" && "${BASH_SOURCE[0]}" != "bash" && -f "$(dirname "${BASH_SOURCE[0]}")/_pilear-common.sh" ]]; then
    here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    # shellcheck source=scripts/_pilear-common.sh
    source "${here}/_pilear-common.sh"
    return 0
  fi

  local tmp
  tmp="$(mktemp)"
  curl -fsSL "${PILEAR_RAW}/scripts/_pilear-common.sh" -o "${tmp}"
  # shellcheck source=/dev/null
  source "${tmp}"
  rm -f "${tmp}"
}

load_pilear_common

ensure_writable_install_dir
ensure_pi
ensure_python3

if pilear_configured_locally; then
  echo "Updating pilear in ${INSTALL_DIR} ..."
  pi update "${PILEAR_PACKAGE}"
  merge_settings
  cat <<EOF

✓ pilear updated in ${INSTALL_DIR}
  Config: .pi/settings.json
  Restart pi if it is already running to pick up harness changes.
  Re-run this script anytime to pull the latest harness.
EOF
else
  echo "Installing pilear (project-local) in ${INSTALL_DIR} ..."
  pi install -l "${PILEAR_PACKAGE}"
  merge_settings
  cat <<EOF

✓ pilear enabled in ${INSTALL_DIR}
  Config: .pi/settings.json
  Learning root: this folder (run pi here)
  Try: pi → /teach RAG evaluation
  Re-run this script anytime to update the harness.
EOF
fi
