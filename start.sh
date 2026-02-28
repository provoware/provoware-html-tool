#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null; then
  echo "Node.js fehlt. Bitte installieren und erneut versuchen."
  echo "Nächster Schritt: Reparatur starten oder Protokoll öffnen."
  exit 1
fi

node tools/start_routine.js
