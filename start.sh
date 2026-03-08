#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "ProvoWare-Start: Startroutine wird vorbereitet..."
if [[ "${1:-}" == "--dry-run" ]]; then
  echo "Hinweis: Dry-Run aktiv. Es werden nur Prüfungen ausgeführt."
fi

bash scripts/laienstart.sh "$@"
