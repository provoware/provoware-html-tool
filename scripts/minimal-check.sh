#!/usr/bin/env bash
set -euo pipefail

print_status_and_exit() {
  local code="$1"
  if [[ "$code" -eq 0 ]]; then
    echo "Release-Check: Bestanden"
  else
    echo "Release-Check: Nicht bestanden"
  fi
  exit "$code"
}

trap 'print_status_and_exit "$?"' EXIT

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/2] JS-Syntax prüfen (Kernpfade)"
find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --experimental-default-type=module --check

echo "[2/2] Direkten Service-Schnelltest prüfen"
node --experimental-default-type=module --test tests/services/import-export-consistency.test.js
