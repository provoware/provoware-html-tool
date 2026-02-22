#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_FILE="${PROJECT_ROOT}/start.sh"

print_step() {
  local icon="$1"
  local text="$2"
  printf '%s %s\n' "$icon" "$text"
}

if [[ ! -f "$TARGET_FILE" ]]; then
  print_step "❌" "Qualitätsprüfung abgebrochen: Datei start.sh fehlt."
  print_step "➡️" "Nächster Schritt: Repository vollständig laden und erneut starten."
  exit 1
fi

print_step "✅" "Qualitätsprüfung gestartet."

if command -v shfmt >/dev/null 2>&1; then
  shfmt -w "$TARGET_FILE"
  print_step "✅" "Formatierung erfolgreich (shfmt)."
else
  print_step "⚠️" "shfmt nicht gefunden. Formatierung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

if command -v shellcheck >/dev/null 2>&1; then
  shellcheck "$TARGET_FILE"
  print_step "✅" "Codequalität erfolgreich (shellcheck ohne Fehler)."
else
  print_step "⚠️" "shellcheck nicht gefunden. Lint-Prüfung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

print_step "✅" "Repo-Quality abgeschlossen."
