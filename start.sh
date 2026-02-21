#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"

print_help() {
  cat <<'TXT'
Provoware Start-Routine

Verwendung:
  ./start.sh             Normaler Start mit Checks, Formatierung und Tests
  ./start.sh --check     Nur automatische Prüfungen (ohne Start)
  ./start.sh --safe      Safe-Mode: nur Basis-Checks + klare Hilfehinweise
  ./start.sh --help      Hilfe anzeigen
TXT
}

print_step() {
  local icon="$1"
  local text="$2"
  printf '%s %s\n' "$icon" "$text" | tee -a "$LOG_FILE"
}

ensure_writable_log() {
  mkdir -p "$LOG_DIR"
  : > "$LOG_FILE"
}

validate_args() {
  if [[ $# -gt 1 ]]; then
    print_step "❌" "Zu viele Parameter. Next Step: Bitte genau eine Option verwenden, z. B. --check."
    return 1
  fi

  if [[ $# -eq 1 ]]; then
    case "$1" in
      --check) MODE="check" ;;
      --safe) MODE="safe" ;;
      --help|-h) MODE="help" ;;
      *)
        print_step "❌" "Unbekannte Option '$1'. Next Step: ./start.sh --help ausführen."
        return 1
        ;;
    esac
  fi

  print_step "✅" "Eingabeprüfung abgeschlossen (Modus: ${MODE})."
}

check_required_files() {
  local missing=0
  for file in "README.md" "todo.txt" "CHANGELOG.md" "data/version_registry.json"; do
    if [[ -f "${PROJECT_ROOT}/${file}" ]]; then
      print_step "✅" "Datei gefunden: ${file}"
    else
      print_step "❌" "Datei fehlt: ${file}. Next Step: Datei anlegen oder aus Git wiederherstellen."
      missing=1
    fi
  done

  [[ $missing -eq 0 ]] && print_step "✅" "Basis-Voraussetzungen vollständig." || return 1
}

run_formatting() {
  if command -v shfmt >/dev/null 2>&1; then
    shfmt -w "$PROJECT_ROOT/start.sh"
    print_step "✅" "Formatierung erfolgreich (shfmt)."
  else
    print_step "⚠️" "shfmt nicht installiert. Next Step: 'sudo apt install shfmt' oder 'brew install shfmt'."
  fi
}

run_quality_checks() {
  if command -v shellcheck >/dev/null 2>&1; then
    if shellcheck "$PROJECT_ROOT/start.sh"; then
      print_step "✅" "Codequalität geprüft (shellcheck ohne Fehler)."
    else
      print_step "❌" "shellcheck meldet Probleme. Next Step: Hinweise ausgeben lassen und danach erneut starten."
      return 1
    fi
  else
    print_step "⚠️" "shellcheck nicht installiert. Next Step: 'sudo apt install shellcheck' oder 'brew install shellcheck'."
  fi
}

run_tests() {
  print_step "✅" "Schnelltest: Startskript kann im Check-Modus laufen."
  if "$PROJECT_ROOT/start.sh" --check >/dev/null 2>&1; then
    print_step "✅" "Selbsttest erfolgreich (Exit-Code 0)."
  else
    print_step "❌" "Selbsttest fehlgeschlagen. Next Step: './start.sh --check' direkt ausführen und Log prüfen."
    return 1
  fi
}

run_start_mode() {
  print_step "✅" "Startmodus aktiv: Voraussetzungen, Formatierung und Checks laufen jetzt automatisch."
  check_required_files
  run_formatting
  run_quality_checks
  print_step "✅" "Start erfolgreich. Hinweis: Für sichere Diagnose kann '--safe' genutzt werden."
}

run_safe_mode() {
  print_step "⚠️" "Safe-Mode aktiv: nur Basisprüfung, keine Schreibänderungen außer Log."
  check_required_files
  print_step "✅" "Safe-Mode erfolgreich. Next Step: Bei Problemen danach './start.sh --check' ausführen."
}

main() {
  ensure_writable_log
  validate_args "$@"

  case "$MODE" in
    help)
      print_help
      ;;
    check)
      check_required_files
      run_quality_checks
      ;;
    safe)
      run_safe_mode
      ;;
    start)
      run_start_mode
      ;;
  esac

  print_step "✅" "Routine abgeschlossen. Protokoll: ${LOG_FILE}"
}

main "$@"
