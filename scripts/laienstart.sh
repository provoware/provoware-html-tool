#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPENDENCY_MAP_FILE="data/laienstart-dependency-map.json"
AUTOFIX_FILE="data/laienstart-autofix-defaults.json"
REQUIRED_FILES_FILE="data/laienstart-required-files.json"
SERVER_PORT="${LAIENSTART_PORT:-8080}"
DRY_RUN=0

msg() { printf '%s\n' "$1"; }
warn() { printf 'WARNUNG: %s\n' "$1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run)
        DRY_RUN=1
        ;;
      *)
        warn "Unbekanntes Argument wird ignoriert: $1"
        ;;
    esac
    shift
  done
}

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

load_required_dependencies() {
  if [[ ! -f "$DEPENDENCY_MAP_FILE" ]]; then
    warn "Dependency-Map fehlt: $DEPENDENCY_MAP_FILE"
    return 1
  fi

  if command_exists node; then
    node -e '
      const fs = require("fs");
      const filePath = process.argv[1];
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const dependencies = Array.isArray(data.dependencies) ? data.dependencies : [];
      for (const dep of dependencies) {
        if (dep && dep.required && typeof dep.name === "string" && dep.name.trim()) {
          process.stdout.write(dep.name.trim() + "\n");
        }
      }
    ' "$DEPENDENCY_MAP_FILE"
    return $?
  fi

  if command_exists python3; then
    python3 - "$DEPENDENCY_MAP_FILE" <<'PY'
import json
import sys

file_path = sys.argv[1]
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

for dep in data.get('dependencies', []):
    if dep.get('required') and isinstance(dep.get('name'), str) and dep['name'].strip():
        print(dep['name'].strip())
PY
    return $?
  fi

  warn "Weder node noch python3 verfügbar, um Dependency-Map zu lesen."
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
  parse_args "$@"

  msg "ProvoWare Laienstart-Skript startet."
  ensure_base_configs
  ensure_runtime_files

  local dependencies=()
  if ! mapfile -t dependencies < <(load_required_dependencies); then
    warn "Dependency-Map kann nicht gelesen werden: $DEPENDENCY_MAP_FILE"
    exit 1
  fi

  if [[ "${#dependencies[@]}" -eq 0 ]]; then
    warn "Keine Pflicht-Abhängigkeiten in $DEPENDENCY_MAP_FILE gefunden."
    exit 1
  fi

  msg "Aktive Pflicht-Abhängigkeiten aus JSON: ${dependencies[*]}"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    msg "Dry-Run aktiv: Self-Repair und JSON-Lesen wurden geprüft."
    msg "Dry-Run beendet ohne Browser- oder Server-Start."
    exit 0
  fi

  local failed=0
  for dependency in "${dependencies[@]}"; do
    check_dependency "$dependency" || failed=1
  done

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
