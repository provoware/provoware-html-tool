#!/usr/bin/env bash
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/.venv"
PYTHON_BIN="${PYTHON_BIN:-python3}"

say() {
  printf '\n%s\n' "$1"
}

fail() {
  printf '\nFehler: %s\n' "$1" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "'$1' wurde nicht gefunden. Bitte installiere es und starte das Skript erneut."
}

check_linux_packages() {
  local missing=()

  if ! "$PYTHON_BIN" - <<'PY_CHECK' >/dev/null 2>&1
import importlib.util
import sys
for module in ("venv", "sqlite3"):
    if importlib.util.find_spec(module) is None:
        sys.exit(1)
sys.exit(0)
PY_CHECK
  then
    missing+=("python3-venv oder python3-full" "python3-sqlite3")
  fi

  if [ ${#missing[@]} -gt 0 ]; then
    printf '\nHinweis: Es fehlen voraussichtlich Linux-Systempakete: %s\n' "$(IFS=', '; echo "${missing[*]}")"
    printf 'Bitte installiere sie mit deinem Paketmanager und starte danach erneut.\n'
  fi
}

run_step() {
  local text="$1"
  shift
  say "$text"
  "$@" || fail "${text#*- } ist fehlgeschlagen."
}

require_command "$PYTHON_BIN"
check_linux_packages

if ! "$PYTHON_BIN" -m venv --help >/dev/null 2>&1; then
  fail "Die Python-Umgebung 'venv' fehlt. Bitte installiere das Paket dafür und starte danach erneut."
fi

if [ ! -d "$VENV_DIR" ]; then
  run_step "- Richte die geschützte Python-Umgebung ein ..." "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

VENV_PYTHON="$VENV_DIR/bin/python"
[ -x "$VENV_PYTHON" ] || fail "Die Python-Umgebung konnte nicht vorbereitet werden. Lösche '.venv' und versuche es erneut."

run_step "- Aktualisiere die Paketverwaltung ..." "$VENV_PYTHON" -m pip install --upgrade pip
run_step "- Installiere die benötigten Pakete ..." "$VENV_PYTHON" -m pip install -r "$SCRIPT_DIR/requirements.txt"

say "- Starte das Programm ..."
cd "$SCRIPT_DIR" || fail "Der Projektordner konnte nicht geöffnet werden."
exec "$VENV_PYTHON" "$SCRIPT_DIR/run.py"
