#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPENDENCY_MAP_FILE="data/laienstart-dependency-map.json"
AUTOFIX_FILE="data/laienstart-autofix-defaults.json"
REQUIRED_FILES_FILE="data/laienstart-required-files.json"
SERVER_PORT="${LAIENSTART_PORT:-8080}"

msg() { printf '%s\n' "$1"; }
warn() { printf 'WARNUNG: %s\n' "$1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

try_install() {
  local cmd="$1"
  case "$cmd" in
    node)
      if command_exists apt-get; then
        warn "Node fehlt. Versuch mit apt-get (kann Root-Rechte brauchen)."
        apt-get update && apt-get install -y nodejs npm && return 0 || return 1
      elif command_exists brew; then
        warn "Node fehlt. Versuch mit brew."
        brew install node && return 0 || return 1
      fi
      ;;
    python3)
      if command_exists apt-get; then
        warn "Python3 fehlt. Versuch mit apt-get (kann Root-Rechte brauchen)."
        apt-get update && apt-get install -y python3 && return 0 || return 1
      elif command_exists brew; then
        warn "Python3 fehlt. Versuch mit brew."
        brew install python && return 0 || return 1
      fi
      ;;
  esac
  return 1
}

ensure_required_file() {
  local file="$1"
  local fallback_content="$2"
  if [[ -f "$file" ]]; then
    return
  fi

  warn "Datei fehlt: $file"
  mkdir -p "$(dirname "$file")"
  printf '%s\n' "$fallback_content" > "$file"
  msg "Self-Repair: $file wurde als Standard-Dummy erzeugt."
}

ensure_base_configs() {
  ensure_required_file "$AUTOFIX_FILE" '{
  "enabled": true,
  "repairMissingFiles": true,
  "runMinimalCheck": true,
  "autoOpenBrowser": true,
  "maxRepairRounds": 2,
  "repairDelaySeconds": 1
}'

  ensure_required_file "$DEPENDENCY_MAP_FILE" '{
  "dependencies": [
    {
      "name": "node",
      "required": true,
      "installHints": ["apt-get install -y nodejs npm", "brew install node"]
    },
    {
      "name": "python3",
      "required": true,
      "installHints": ["apt-get install -y python3", "brew install python"]
    }
  ]
}'

  ensure_required_file "$REQUIRED_FILES_FILE" '{
  "requiredFiles": [
    "./index.html",
    "./css/app.css",
    "./js/app.js",
    "./data/app-config.json",
    "./data/module-registry.json"
  ]
}'
}

ensure_runtime_files() {
  ensure_required_file "data/app-config.json" '{"theme":"default","language":"de"}'
  ensure_required_file "data/module-registry.json" '{"modules":[]}'
}

check_dependency() {
  local cmd="$1"
  if command_exists "$cmd"; then
    msg "OK: Abhängigkeit vorhanden: $cmd"
    return 0
  fi

  warn "Abhängigkeit fehlt: $cmd"
  if try_install "$cmd"; then
    msg "Self-Repair: Abhängigkeit installiert: $cmd"
    return 0
  fi

  warn "Auto-Installation für $cmd nicht möglich."
  return 1
}

run_minimal_check_if_possible() {
  if [[ -x "scripts/minimal-check.sh" ]] || [[ -f "scripts/minimal-check.sh" ]]; then
    msg "Starte Minimal-Check für direkte Startlogik."
    bash scripts/minimal-check.sh
  else
    warn "Minimal-Check fehlt. Überspringe diesen Schritt."
  fi
}

open_browser() {
  local url="http://127.0.0.1:${SERVER_PORT}/laienstart.html"
  if command_exists xdg-open; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command_exists open; then
    open "$url" >/dev/null 2>&1 || true
  else
    warn "Kein Browser-Öffner gefunden. Bitte URL manuell öffnen: $url"
  fi
}

start_server() {
  msg "Starte lokalen Server auf Port ${SERVER_PORT}."
  msg "Zum Beenden: STRG+C"
  python3 -m http.server "$SERVER_PORT"
}

main() {
  msg "ProvoWare Laienstart-Skript startet."
  ensure_base_configs
  ensure_runtime_files

  local failed=0
  check_dependency node || failed=1
  check_dependency python3 || failed=1

  if [[ "$failed" -ne 0 ]]; then
    warn "Nicht alle Abhängigkeiten sind automatisch lösbar."
    warn "Bitte Hinweise in data/laienstart-dependency-map.json prüfen."
    exit 1
  fi

  run_minimal_check_if_possible
  open_browser
  start_server
}

main "$@"
