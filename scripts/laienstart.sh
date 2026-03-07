#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPENDENCY_MAP_FILE="data/laienstart-dependency-map.json"
AUTOFIX_FILE="data/laienstart-autofix-defaults.json"
REQUIRED_FILES_FILE="data/laienstart-required-files.json"
SERVER_PORT="${LAIENSTART_PORT:-8080}"
ACTIVE_SERVER_PORT="$SERVER_PORT"
DRY_RUN=0

msg() { printf '%s\n' "$1"; }
warn() { printf 'WARNUNG: %s\n' "$1"; }
fail() { printf 'FEHLER: %s\n' "$1"; exit 1; }
step() { printf '\n== %s ==\n' "$1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

show_choice_dialog() {
  local title="$1"
  local text="$2"
  local first_label="$3"
  local second_label="$4"

  if command_exists zenity; then
    if zenity --question --title "$title" --text "$text" --ok-label "$first_label" --cancel-label "$second_label"; then
      printf 'first\n'
    else
      printf 'second\n'
    fi
    return 0
  fi

  if command_exists whiptail; then
    if whiptail --title "$title" --yes-button "$first_label" --no-button "$second_label" --yesno "$text" 12 72; then
      printf 'first\n'
    else
      printf 'second\n'
    fi
    return 0
  fi

  return 1
}

show_permission_error_actions() {
  local dialog_text="Der Projektordner ist nicht schreibbar. Bitte wählen Sie eine klare Aktion."
  local selected=''

  if selected="$(show_choice_dialog 'Start gestoppt: Schreibrecht fehlt' "$dialog_text" 'Hilfe zeigen' 'Abbrechen')"; then
    if [[ "$selected" == 'first' ]]; then
      msg "Aktion: Hilfe zeigen"
      msg "1) Öffnen Sie ein Terminal im Projektordner."
      msg "2) Prüfen Sie Rechte mit: ls -ld ."
      msg "3) Bei Bedarf Rechte setzen mit: chmod u+w ."
      msg "4) Starten Sie danach erneut: ./start.sh"
      return
    fi
    warn "Start wurde bewusst abgebrochen. Keine Änderung am Projekt vorgenommen."
    exit 1
  fi

  warn "Projektordner ist nicht schreibbar."
  msg "Klare Handlungsmöglichkeiten:"
  msg "- Hilfe: Rechte prüfen (ls -ld .) und Schreibrecht setzen (chmod u+w .)"
  msg "- Danach erneut starten: ./start.sh"
  msg "- Oder Start jetzt bewusst abbrechen"
  exit 1
}

check_project_writable() {
  local probe_file=".laienstart-writecheck.$$"
  if ( : > "$probe_file" ) 2>/dev/null; then
    rm -f "$probe_file"
    msg "OK: Projektordner ist schreibbar."
    return 0
  fi

  show_permission_error_actions
}

is_port_free() {
  local port="$1"
  if command_exists python3; then
    python3 - "$port" <<'PY'
import socket
import sys

port = int(sys.argv[1])
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    sock.bind(('127.0.0.1', port))
except OSError:
    raise SystemExit(1)
finally:
    sock.close()
PY
    return $?
  fi

  if command_exists ss && ss -ltn "( sport = :$port )" | tail -n +2 | grep -q .; then
    return 1
  fi

  return 0
}

resolve_server_port() {
  local preferred="$1"
  local fallback="$preferred"
  local rounds=0

  while [[ "$rounds" -lt 25 ]]; do
    if is_port_free "$fallback" >/dev/null 2>&1; then
      if [[ "$fallback" != "$preferred" ]]; then
        msg "Port ${preferred} ist belegt. Nutze stattdessen Port ${fallback}."
      fi
      ACTIVE_SERVER_PORT="$fallback"
      return 0
    fi
    fallback=$((fallback + 1))
    rounds=$((rounds + 1))
  done

  warn "Kein freier Port im Bereich ${preferred} bis $((preferred + 24)) gefunden."
  return 1
}

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
  msg "Self-Repair: $file wurde als Standard-Datei erzeugt."
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

validate_json_file() {
  local file_path="$1"
  if command_exists node; then
    node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));' "$file_path" >/dev/null
    return $?
  fi

  python3 - "$file_path" <<'PY'
import json
import sys

with open(sys.argv[1], 'r', encoding='utf-8') as handle:
    json.load(handle)
PY
}

repair_required_runtime_file() {
  local raw_path="$1"
  local clean_path="${raw_path#./}"

  case "$clean_path" in
    index.html)
      ensure_required_file "$clean_path" '<!doctype html><html lang="de"><meta charset="utf-8"><title>ProvoWare</title><body><h1>ProvoWare</h1><p>Bitte später Projektdatei index.html ergänzen.</p></body></html>'
      ;;
    css/app.css)
      ensure_required_file "$clean_path" 'body { font-family: system-ui, sans-serif; margin: 1rem; }'
      ;;
    js/app.js)
      ensure_required_file "$clean_path" 'console.log("ProvoWare Start: Platzhalter aktiv.");'
      ;;
    data/app-config.json)
      ensure_required_file "$clean_path" '{"theme":"default","language":"de"}'
      ;;
    data/module-registry.json)
      ensure_required_file "$clean_path" '{"modules":[]}'
      ;;
    *)
      warn "Kein Auto-Repair für unbekannte Pflichtdatei: $clean_path"
      ;;
  esac
}

ensure_required_runtime_files() {
  local required_files=()
  if command_exists node; then
    mapfile -t required_files < <(node -e '
      const fs = require("fs");
      const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      for (const file of (Array.isArray(data.requiredFiles) ? data.requiredFiles : [])) {
        if (typeof file === "string" && file.trim()) process.stdout.write(file.trim() + "\n");
      }
    ' "$REQUIRED_FILES_FILE")
  else
    mapfile -t required_files < <(python3 - "$REQUIRED_FILES_FILE" <<'PY'
import json
import sys

with open(sys.argv[1], 'r', encoding='utf-8') as handle:
    data = json.load(handle)
for value in data.get('requiredFiles', []):
    if isinstance(value, str) and value.strip():
        print(value.strip())
PY
)
  fi

  local missing=0
  local path=''
  for path in "${required_files[@]}"; do
    local clean_path="${path#./}"
    if [[ ! -f "$clean_path" ]]; then
      missing=1
      repair_required_runtime_file "$path"
    fi
  done

  if [[ "$missing" -eq 0 ]]; then
    msg "OK: Alle Pflichtdateien sind vorhanden."
  fi
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
      const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      const dependencies = Array.isArray(data.dependencies) ? data.dependencies : [];
      for (const dep of dependencies) {
        if (dep && dep.required && typeof dep.name === "string" && dep.name.trim()) {
          process.stdout.write(dep.name.trim() + "\n");
        }
      }
    ' "$DEPENDENCY_MAP_FILE"
    return $?
  fi

  python3 - "$DEPENDENCY_MAP_FILE" <<'PY'
import json
import sys

with open(sys.argv[1], 'r', encoding='utf-8') as file:
    data = json.load(file)
for dep in data.get('dependencies', []):
    if dep.get('required') and isinstance(dep.get('name'), str) and dep['name'].strip():
        print(dep['name'].strip())
PY
}

run_minimal_check_if_possible() {
  if [[ -x "scripts/minimal-check.sh" ]] || [[ -f "scripts/minimal-check.sh" ]]; then
    msg "Starte Minimal-Check für direkte Startlogik."
    bash scripts/minimal-check.sh
    msg "OK: Minimal-Check erfolgreich."
  else
    warn "Minimal-Check fehlt. Überspringe diesen Schritt."
  fi
}

open_browser() {
  local url="http://127.0.0.1:${ACTIVE_SERVER_PORT}/index.html"
  if command_exists xdg-open; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command_exists open; then
    open "$url" >/dev/null 2>&1 || true
  else
    warn "Kein Browser-Öffner gefunden. Bitte URL manuell öffnen: $url"
  fi
}

wait_for_server_ready() {
  local url="http://127.0.0.1:${ACTIVE_SERVER_PORT}/index.html"
  local attempt=0

  while [[ "$attempt" -lt 12 ]]; do
    if python3 - "$url" <<'PY' >/dev/null 2>&1
import sys
import urllib.request

url = sys.argv[1]
with urllib.request.urlopen(url, timeout=1.2) as response:
    if response.status >= 400:
        raise SystemExit(1)
PY
    then
      msg "OK: Erfolgsvalidierung bestanden. Oberfläche antwortet auf ${url}."
      return 0
    fi
    sleep 0.5
    attempt=$((attempt + 1))
  done

  return 1
}

start_server() {
  local server_pid=''
  msg "Starte lokalen Server auf Port ${ACTIVE_SERVER_PORT}."

  python3 -m http.server "$ACTIVE_SERVER_PORT" >/tmp/provoware-start-server.log 2>&1 &
  server_pid=$!

  if ! wait_for_server_ready; then
    kill "$server_pid" >/dev/null 2>&1 || true
    warn "Server-Log (letzte Zeilen):"
    tail -n 8 /tmp/provoware-start-server.log || true
    fail "Erfolgsvalidierung fehlgeschlagen. Server antwortet nicht stabil."
  fi

  open_browser
  msg "Start erfolgreich. Zum Beenden: STRG+C"
  wait "$server_pid"
}

main() {
  parse_args "$@"

  step "ProvoWare Startroutine"
  msg "Start läuft. Bitte kurze Hinweise beachten."

  step "Vorvalidierung"
  check_project_writable
  ensure_base_configs
  ensure_runtime_files

  validate_json_file "$AUTOFIX_FILE" || fail "JSON ungültig: $AUTOFIX_FILE"
  validate_json_file "$DEPENDENCY_MAP_FILE" || fail "JSON ungültig: $DEPENDENCY_MAP_FILE"
  validate_json_file "$REQUIRED_FILES_FILE" || fail "JSON ungültig: $REQUIRED_FILES_FILE"

  ensure_required_runtime_files

  local dependencies=()
  if ! mapfile -t dependencies < <(load_required_dependencies); then
    fail "Dependency-Map kann nicht gelesen werden: $DEPENDENCY_MAP_FILE"
  fi

  if [[ "${#dependencies[@]}" -eq 0 ]]; then
    fail "Keine Pflicht-Abhängigkeiten in $DEPENDENCY_MAP_FILE gefunden."
  fi

  msg "Aktive Pflicht-Abhängigkeiten: ${dependencies[*]}"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    msg "Dry-Run aktiv: Vorvalidierung + Self-Repair erfolgreich geprüft."
    msg "Dry-Run beendet ohne Browser- oder Server-Start."
    exit 0
  fi

  step "Abhängigkeiten"
  local failed=0
  local dependency=''
  for dependency in "${dependencies[@]}"; do
    check_dependency "$dependency" || failed=1
  done

  if [[ "$failed" -ne 0 ]]; then
    fail "Nicht alle Abhängigkeiten sind automatisch lösbar. Bitte Hinweise in $DEPENDENCY_MAP_FILE prüfen."
  fi

  step "Start und Erfolgsvalidierung"
  resolve_server_port "$SERVER_PORT" || fail "Kein freier Port gefunden."
  run_minimal_check_if_possible
  start_server
}

main "$@"
