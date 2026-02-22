#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_FILES=("${PROJECT_ROOT}/start.sh" "${PROJECT_ROOT}/system/start_core.sh" "${PROJECT_ROOT}/system/start_gui.sh")
CONTRAST_CHECK="${PROJECT_ROOT}/tools/check_theme_contrast.py"
FOCUS_CHECK="${PROJECT_ROOT}/tools/focus_order_check.py"
SMOKE_CHECK="${PROJECT_ROOT}/tools/smoke_test.py"

print_step() {
  local icon="$1"
  local text="$2"
  printf '%s %s\n' "$icon" "$text"
}

run_checked_command() {
  local label="$1"
  shift

  if [[ -z "$label" ]]; then
    print_step "❌" "Interner Fehler: Prüfungsname fehlt."
    print_step "➡️" "Nächster Schritt: tools/run_quality_checks.sh prüfen und erneut starten."
    return 1
  fi

  if "$@"; then
    print_step "✅" "$label erfolgreich."
    return 0
  fi

  print_step "❌" "$label fehlgeschlagen."
  print_step "➡️" "Nächster Schritt: Fehlerausgabe prüfen und danach './start.sh --repair' ausführen."
  return 1
}

for target_file in "${TARGET_FILES[@]}"; do
  if [[ ! -f "$target_file" ]]; then
    print_step "❌" "Qualitätsprüfung abgebrochen: Datei fehlt (${target_file#${PROJECT_ROOT}/})."
    print_step "➡️" "Nächster Schritt: Repository vollständig laden und erneut starten."
    exit 1
  fi
done

for required_file in "$CONTRAST_CHECK" "$FOCUS_CHECK" "$SMOKE_CHECK"; do
  if [[ ! -f "$required_file" ]]; then
    print_step "❌" "Qualitätsprüfung abgebrochen: Datei fehlt (${required_file#${PROJECT_ROOT}/})."
    print_step "➡️" "Nächster Schritt: Fehlende Datei wiederherstellen und erneut prüfen."
    exit 1
  fi
done

if ! command -v python3 >/dev/null 2>&1; then
  print_step "❌" "python3 fehlt. Qualitätsprüfung kann nicht laufen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen und danach erneut prüfen."
  exit 1
fi

print_step "✅" "Qualitätsprüfung gestartet (effizienter Standardlauf)."
run_checked_command "Syntaxprüfung (python -m compileall -q .)" python3 -m compileall -q "$PROJECT_ROOT"

if command -v shfmt >/dev/null 2>&1; then
  run_checked_command "Formatierung (shfmt)" shfmt -w "${TARGET_FILES[@]}"
else
  print_step "⚠️" "shfmt nicht gefunden. Formatierung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

if command -v shellcheck >/dev/null 2>&1; then
  run_checked_command "Codequalität (shellcheck)" shellcheck -x "${TARGET_FILES[@]}"
else
  print_step "⚠️" "shellcheck nicht gefunden. Lint-Prüfung wurde übersprungen."
  print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen."
fi

if command -v ruff >/dev/null 2>&1; then
  run_checked_command "Python-Lint (ruff check tools)" ruff check "${PROJECT_ROOT}/tools"
else
  print_step "⚠️" "ruff nicht gefunden. Python-Lint ist vorbereitet, aber optional (keine Pflichtabhängigkeit)."
  print_step "➡️" "Nächster Schritt: Optional installieren mit 'python3 -m pip install ruff' und erneut prüfen."
fi

run_checked_command "WCAG-Kontrastprüfung" python3 "$CONTRAST_CHECK"
run_checked_command "Fokus-Reihenfolge-Prüfung" python3 "$FOCUS_CHECK"
run_checked_command "Smoke-Kurzlauf (Profil quick)" env SKIP_FULL_GATES=1 python3 "$SMOKE_CHECK" --profile quick

print_step "✅" "Repo-Quality abgeschlossen. Für Vollprüfung optional: python3 tools/smoke_test.py --profile full"
