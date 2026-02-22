#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_FILES=("${PROJECT_ROOT}/start.sh" "${PROJECT_ROOT}/system/start_core.sh" "${PROJECT_ROOT}/system/start_gui.sh")
CONTRAST_CHECK="${PROJECT_ROOT}/tools/check_theme_contrast.py"
FOCUS_CHECK="${PROJECT_ROOT}/tools/focus_order_check.py"

print_step() {
  local icon="$1"
  local text="$2"
  printf '%s %s\n' "$icon" "$text"
}

for target_file in "${TARGET_FILES[@]}"; do
  if [[ ! -f "$target_file" ]]; then
    print_step "❌" "Qualitätsprüfung abgebrochen: Datei fehlt (${target_file#${PROJECT_ROOT}/})."
    print_step "➡️" "Nächster Schritt: Repository vollständig laden und erneut starten."
    exit 1
  fi
done

if [[ ! -f "$CONTRAST_CHECK" ]]; then
  print_step "❌" "Qualitätsprüfung abgebrochen: Kontrast-Checker fehlt."
  print_step "➡️" "Nächster Schritt: Datei tools/check_theme_contrast.py wiederherstellen."
  exit 1
fi

print_step "✅" "Qualitätsprüfung gestartet."

if [[ ! -f "$FOCUS_CHECK" ]]; then
  print_step "❌" "Qualitätsprüfung abgebrochen: Fokus-Checker fehlt."
  print_step "➡️" "Nächster Schritt: Datei tools/focus_order_check.py wiederherstellen."
  exit 1
fi

if command -v shfmt >/dev/null 2>&1; then
  shfmt -w "${TARGET_FILES[@]}"
  print_step "✅" "Formatierung erfolgreich (shfmt)."
else
  print_step "⚠️" "shfmt nicht gefunden. Formatierung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

if command -v shellcheck >/dev/null 2>&1; then
  shellcheck -x "${TARGET_FILES[@]}"
  print_step "✅" "Codequalität erfolgreich (shellcheck ohne Fehler)."
else
  print_step "⚠️" "shellcheck nicht gefunden. Lint-Prüfung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

if command -v python3 >/dev/null 2>&1; then
  python3 "$CONTRAST_CHECK"
  print_step "✅" "WCAG-Kontrastprüfung erfolgreich."
  python3 "$FOCUS_CHECK"
  print_step "✅" "Fokus-Reihenfolge-Prüfung erfolgreich."
else
  print_step "❌" "python3 fehlt. Kontrastprüfung konnte nicht gestartet werden."
  print_step "➡️" "Nächster Schritt: python3 installieren und Prüfung erneut starten."
  exit 1
fi

print_step "✅" "Repo-Quality abgeschlossen."
