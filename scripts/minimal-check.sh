#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/2] JS-Syntax prüfen (Kernpfade)"
find js tests -type f -name '*.js' -print0 | xargs -0 -n1 node --experimental-default-type=module --check

echo "[2/2] Direkten Service-Schnelltest prüfen"
node --experimental-default-type=module --test tests/services/import-export-consistency.test.js

echo "Minimal-Check erfolgreich abgeschlossen."
