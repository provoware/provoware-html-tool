#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] Voraussetzungen prüfen"
command -v node >/dev/null || {
  echo "Node.js fehlt. Bitte installieren und erneut versuchen."
  exit 1
}

if [ ! -d node_modules ]; then
  echo "[2/5] Abhängigkeiten installieren"
  npm install
else
  echo "[2/5] Abhängigkeiten bereits vorhanden"
fi

echo "[3/5] Code formatieren"
npm run format

echo "[4/5] Tests ausführen"
npm test

echo "[5/5] Fertig: geprüft und gelöst"
echo "Nächster Schritt: Hilfe-Panel in templates/help-panel.html öffnen."
