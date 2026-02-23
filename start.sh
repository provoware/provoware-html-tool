#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"
DEBUG_MODE="0"
LINE_LIMIT=3400
NETWORK_CHECK_TIMEOUT=2
COMMAND_TIMEOUT=180
RETRY_MAX=2
FORCE_OFFLINE_MODE="${PROVOWARE_FORCE_OFFLINE:-0}"
OFFLINE_SIMULATION_LOGGED="0"
GUI_PORT_MIN=20000
GUI_PORT_MAX=60999
GUI_PORT_RANDOM_ATTEMPTS=25
STATUS_SUMMARY_FILE=""
DEPENDENCY_CONFIG_FILE="${PROJECT_ROOT}/config/dependency_map.json"
TEXT_CONFIG_FILE="${PROJECT_ROOT}/config/messages.json"
THEME_CONFIG_FILE="${PROJECT_ROOT}/config/themes.json"
CORE_HELPER_FILE="${PROJECT_ROOT}/system/start_core.sh"
GUI_HELPER_FILE="${PROJECT_ROOT}/system/start_gui.sh"
PROJECT_CONTEXT_FILE="${PROJECT_ROOT}/data/project_context.json"
PROJECT_SETTINGS_FILE="${PROJECT_ROOT}/config/project_settings.json"
MODULE_SOURCES_CONFIG_FILE="${PROJECT_ROOT}/config/module_sources.json"
DASHBOARD_PROJECT_PATH=""
CHECKED_ITEMS=()
MISSING_ITEMS=()
FIXED_ITEMS=()
NEXT_STEPS=()
NEXT_STEP_LIMIT="${PROVOWARE_NEXT_STEPS_LIMIT:-8}"
SHOW_ALL_NEXT_STEPS="${PROVOWARE_SHOW_ALL_NEXT_STEPS:-0}"
PRIORITY_MODE="${PROVOWARE_PRIORITY_MODE:-numbered}"
NEXT_STEPS_OVERFLOW=0
HIDDEN_NEXT_STEPS=()
DEFAULT_TEXT_JSON='{
  "help_title": "Provoware Start-Routine",
  "help_usage": "Verwendung:",
  "help_doctor": "Doctor-Modus: Zeigt konkrete Verbesserungen mit vollständigen Befehlen.",
  "help_accessibility": "Barrierefreiheit: Jeder Status hat Symbol + Text, damit Hinweise nicht nur über Farbe verstanden werden.",
  "help_keyboard": "Tastatur-Hinweis: Alle Befehle sind per Enter startbar, ohne Maus.",
  "help_icon_legend": "Symbol-Legende: ✅ Erfolg, ⚠️ Hinweis, ❌ Fehler, ➡️ Aktion, ℹ️ Zusatzinfo.",
  "help_message_source": "Textquelle: Externe Datei config/messages.json wird genutzt, sonst sichere Standardtexte.",
  "help_full_gates": "Voll-Gates: Führt die fünf Pflicht-Gates in fixer Reihenfolge aus und stoppt bei Fehlern mit klaren Next Steps.",
  "help_status_summary": "Statusbericht: Legt logs/status_summary.txt in einfacher Sprache für Screenreader an.",
  "help_show_all_next_steps": "Alle gebündelten Hinweise direkt anzeigen: ./start.sh --check --show-all-next-steps",
  "help_priority_mode": "Prioritätsmodus optional setzen: PROVOWARE_PRIORITY_MODE=numbered (Standard), p0p1 oder p0-only (nur kritische Schritte).",
  "error_retry": "Erneut versuchen: Befehl mit denselben Optionen erneut starten.",
  "error_repair": "Reparatur starten: ./start.sh --repair",
  "error_log": "Protokoll öffnen: cat {{LOG_FILE}}",
  "error_debug": "Detaillierte Analyse starten: ./start.sh --check --debug",
  "safe_help_1": "Safe-Mode Hilfe: Dieser Modus zeigt nur sichere Prüfungen und klare nächste Schritte.",
  "safe_help_2": "Wiederherstellung: Starten Sie danach ./start.sh --repair, damit fehlende Werkzeuge automatisch nachinstalliert werden.",
  "safe_help_3": "Protokoll-Nutzung: Öffnen Sie Details mit cat {{LOG_FILE}} und teilen Sie die letzte Fehlermeldung.",
  "line_limit_ok": "Zeilenlimit geprüft: alle Dateien liegen bei maximal {{LIMIT}} Zeilen.",
  "line_limit_fail": "Zeilenlimit überschritten: {{FILE}} hat {{LINES}} Zeilen (maximal {{LIMIT}}).",
  "developer_doc_hint": "Entwicklerdoku: Regeln, Startbefehle und Qualitätsablauf stehen in README.md und todo.txt.",
  "release_help": "Release-Check: Prüft automatisch Kernkriterien für eine stabile Veröffentlichung (Release).",
  "release_ready": "Release-Check bestanden: Alle Pflichtkriterien sind erfüllt.",
  "release_not_ready": "Release-Check unvollständig: Mindestens ein Pflichtkriterium fehlt noch.",
  "doctor_intro": "Doctor-Bericht: Diese Punkte verbessern Stabilität, Qualität und Barrierefreiheit.",
  "doctor_accessibility": "Barrierefreiheit verbessern: GUI-Theme testen mit GUI_THEME=high-contrast ./start.sh",
  "doctor_quality": "Codequalität verbessern: ./start.sh --format && ./start.sh --test (optional mit Ruff-Lint für Python)",
  "doctor_release": "Release-Reife prüfen: ./start.sh --release-check",
  "dashboard_intro": "Dashboard-Guide: So wird eine Oberfläche laienfreundlich, barrierefrei und klar bedienbar.",
  "dashboard_layout": "Layout-Regel: Oben Status, Mitte wichtigste Aufgaben, unten Hilfe + nächste Schritte.",
  "dashboard_accessibility": "Barrierefreiheit-Regel: Hoher Kontrast, große Klickflächen, Fokusrahmen und klare Sprache.",
  "dashboard_feedback": "Feedback-Regel: Jede Aktion zeigt sofort Ergebnis + nächsten Schritt in einfacher Sprache.",
  "help_weakness_report": "Schwachstellen-Bericht: Zeigt verbleibende Risiken mit direkten Befehlen für schnelle Verbesserungen.",
  "summary_more_hints_collapsed": "Weitere Hinweise wurden gebündelt, damit die Liste kurz bleibt.",
  "summary_more_hints_expanded": "Zusätzliche Hinweise (vollständig eingeblendet):",
  "summary_more_hints_next_step": "Nächster Schritt: Für alle zusätzlichen Hinweise cat {{STATUS_SUMMARY_FILE}} ausführen oder ./start.sh --check --show-all-next-steps nutzen.",
  "summary_more_hints_status_tip": "Hinweis: Vollständige Details stehen im Startprotokoll. Tipp: Mit ./start.sh --check --show-all-next-steps können alle Hinweise direkt angezeigt werden.",
  "summary_priority_title": "Empfohlene Reihenfolge (Priorität):",
  "summary_priority_p1_hidden": "Modus p0-only aktiv: P1-Hinweise wurden bewusst ausgeblendet.",
  "summary_priority_mode_hint": "Für alle Hinweise PROVOWARE_PRIORITY_MODE=numbered oder p0p1 verwenden."
}'
TEXT_JSON_CACHE=""
THEME_LIST_CACHE=""
: "${PLAYWRIGHT_BROWSERS_PATH:=${PROJECT_ROOT}/data/playwright-browsers}"
export PLAYWRIGHT_BROWSERS_PATH

DEFAULT_THEMES_CSV="high-contrast,light,dark"
DEFAULT_DEPENDENCY_JSON='{"shellcheck":{"apt":"shellcheck","brew":"shellcheck"},"shfmt":{"apt":"shfmt","brew":"shfmt"},"rg":{"apt":"ripgrep","brew":"ripgrep"},"curl":{"apt":"curl","brew":"curl"},"ruff":{"pip":"ruff"}}'
DEPENDENCY_JSON_CACHE=""
MODULE_SOURCES_JSON_CACHE=""
DEFAULT_MODULE_SOURCES_JSON='{"genres":{"label":"Genreverwaltung","data_source":"data/project_context.json","detail":"Lädt den aktiven Projektkontext als Basis für Genre-Daten.","next_step":"bash start.sh --dashboard-template"},"gms-archiv":{"label":"GMS-Archiv","data_source":"data/project_context.json","detail":"Nutzt den Projektpfad und lokale Verlaufsdaten für Genres, Stimmungen und Stile.","next_step":"bash start.sh --check"},"zitate":{"label":"Zitatbibliothek","data_source":"data/project_context.json","detail":"Greift auf den Projektpfad zu und hält Quellen für spätere Backend-Anbindung bereit.","next_step":"bash start.sh --check"},"songeditor":{"label":"Songeditor","data_source":"config/project_settings.json","detail":"Verwendet editierbare Projekteinstellungen als Eingabe für Song-Projekte.","next_step":"bash start.sh --test"},"dashboard":{"label":"Dashboard","data_source":"data/version_registry.json","detail":"Zeigt Versions- und Statusdaten der letzten Iteration transparent an.","next_step":"bash start.sh --ux-check-auto"},"todo":{"label":"To-Do-Liste","data_source":"todo.txt","detail":"Liest offene und erledigte Aufgaben direkt aus der Projektliste.","next_step":"bash start.sh --check"}}'

if [[ ! -f "$CORE_HELPER_FILE" ]]; then
	printf '%s\n' "❌ Kernlogik fehlt: system/start_core.sh" >&2
	printf '%s\n' "➡️ Nächster Schritt: Repository vollständig laden und erneut './start.sh --check' ausführen." >&2
	exit 1
fi

if [[ ! -f "$GUI_HELPER_FILE" ]]; then
	printf '%s\n' "❌ GUI-Helfer fehlt: system/start_gui.sh" >&2
	printf '%s\n' "➡️ Nächster Schritt: Repository vollständig laden und erneut './start.sh --check' ausführen." >&2
	exit 1
fi

# shellcheck source=system/start_core.sh
source "$CORE_HELPER_FILE"
# shellcheck source=system/start_gui.sh
source "$GUI_HELPER_FILE"

load_text_json() {
	if [[ -n "$TEXT_JSON_CACHE" ]]; then
		printf '%s' "$TEXT_JSON_CACHE"
		return 0
	fi

	local candidate_json="$DEFAULT_TEXT_JSON"
	if [[ -f "$TEXT_CONFIG_FILE" ]]; then
		if command -v python3 >/dev/null 2>&1; then
			local validation_output
			validation_output="$(python3 -c 'import json,sys
path=sys.argv[1]
defaults=json.loads(sys.argv[2])
with open(path, encoding="utf-8") as fh:
    loaded=json.load(fh)
if not isinstance(loaded, dict):
    raise SystemExit("Formatfehler: Objekt (JSON mit Schlüsseln) erwartet")
missing=[k for k in defaults if not isinstance(loaded.get(k), str) or not loaded.get(k).strip()]
if missing:
    raise SystemExit("Pflichttexte fehlen oder sind leer: " + ", ".join(missing))
print(json.dumps(loaded, ensure_ascii=False))' "$TEXT_CONFIG_FILE" "$DEFAULT_TEXT_JSON" 2>&1)" || true
			if [[ -n "$validation_output" ]] && [[ "$validation_output" == \{* ]]; then
				candidate_json="$validation_output"
				record_checked "Textkonfiguration geladen (config/messages.json)"
			else
				record_missing "Textkonfiguration ungültig"
				record_next_step "Konfigurationsdatei config/messages.json prüfen: $validation_output"
			fi
		else
			record_missing "python3 für Textkonfiguration fehlt"
			record_next_step "python3 installieren oder sichere Standardtexte nutzen"
		fi
	fi

	TEXT_JSON_CACHE="$candidate_json"
	printf '%s' "$TEXT_JSON_CACHE"
}

get_text() {
	local key="$1"
	if [[ -z "$key" || ! "$key" =~ ^[a-z0-9_]+$ ]]; then
		printf '%s' "invalid_text_key"
		return 0
	fi

	if ! command -v python3 >/dev/null 2>&1; then
		printf '%s' "$key"
		return 0
	fi

	local value
	value="$(python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get(sys.argv[1], sys.argv[1]))' "$key" <<<"$(load_text_json)" 2>/dev/null || true)"
	if [[ -z "$value" ]]; then
		printf '%s' "$key"
		return 0
	fi
	printf '%s' "$value"
}

load_theme_list_csv() {
	if [[ -n "$THEME_LIST_CACHE" ]]; then
		printf '%s' "$THEME_LIST_CACHE"
		return 0
	fi

	local fallback="$DEFAULT_THEMES_CSV"
	if [[ -f "$THEME_CONFIG_FILE" ]]; then
		if command -v python3 >/dev/null 2>&1; then
			local parsed_csv
			parsed_csv="$(python3 -c 'import json,sys,re
path=sys.argv[1]
data=json.load(open(path, encoding="utf-8"))
themes=data.get("themes", [])
valid=[]
for item in themes:
    if isinstance(item, str) and re.fullmatch(r"[a-z][a-z0-9-]{1,30}", item):
        valid.append(item)
if not valid:
    raise SystemExit(2)
print(",".join(valid))' "$THEME_CONFIG_FILE" 2>/dev/null || true)"
			if [[ -n "$parsed_csv" ]]; then
				fallback="$parsed_csv"
				record_checked "Theme-Konfiguration geladen"
			else
				record_missing "Theme-Konfiguration ungültig"
				record_next_step "Datei config/themes.json prüfen und erneut versuchen"
			fi
		else
			record_missing "python3 für Theme-Konfiguration fehlt"
			record_next_step "python3 installieren oder Standard-Themes nutzen"
		fi
	fi

	THEME_LIST_CACHE="$fallback"
	printf '%s' "$THEME_LIST_CACHE"
}

is_network_available() {
	if [[ "$FORCE_OFFLINE_MODE" == "1" ]]; then
		if [[ "$OFFLINE_SIMULATION_LOGGED" != "1" ]]; then
			print_step "⚠️" "Offline-Simulation aktiv: PROVOWARE_FORCE_OFFLINE=1 blockiert absichtlich alle Online-Prüfungen."
			record_checked "Offline-Simulation aktiv (ohne Internet-Testlauf)"
			record_next_step "Für normalen Betrieb ohne Simulation: 'unset PROVOWARE_FORCE_OFFLINE' und Befehl erneut ausführen"
			OFFLINE_SIMULATION_LOGGED="1"
		fi
		return 1
	fi

	if command -v curl >/dev/null 2>&1; then
		if curl --silent --show-error --max-time "$NETWORK_CHECK_TIMEOUT" https://example.com >/dev/null 2>&1; then
			return 0
		fi
	fi

	if command -v python3 >/dev/null 2>&1; then
		if python3 - "$NETWORK_CHECK_TIMEOUT" <<'PY' >/dev/null 2>&1; then
import socket
import sys

timeout = float(sys.argv[1])
for host in ("example.com", "pypi.org"):
    try:
        socket.setdefaulttimeout(timeout)
        socket.gethostbyname(host)
        raise SystemExit(0)
    except Exception:
        continue
raise SystemExit(1)
PY
			return 0
		fi
	fi

	return 1
}

run_with_retry() {
	local label="$1"
	shift

	if [[ -z "$label" || "$#" -eq 0 ]]; then
		print_error_with_actions "Interner Fehler: Prüfungsname oder Befehl fehlt."
		record_next_step "Startskript prüfen und './start.sh --check --debug' erneut ausführen"
		return 1
	fi

	local attempt=1
	while [[ "$attempt" -le "$RETRY_MAX" ]]; do
		print_step "ℹ️" "${label}: Versuch ${attempt}/${RETRY_MAX}."
		if timeout "$COMMAND_TIMEOUT" "$@"; then
			print_step "✅" "${label} erfolgreich."
			return 0
		fi

		if [[ "$attempt" -lt "$RETRY_MAX" ]]; then
			print_step "⚠️" "${label} fehlgeschlagen. Wiederhole automatisch."
		fi
		attempt=$((attempt + 1))
	done

	print_error_with_actions "${label} nach ${RETRY_MAX} Versuchen nicht erfolgreich."
	record_next_step "Bei instabilem Netz zuerst './start.sh --repair' und danach den Befehl erneut ausführen"
	return 1
}
is_allowed_theme() {
	local candidate="$1"
	if [[ -z "$candidate" || ! "$candidate" =~ ^[a-z][a-z0-9-]{1,30}$ ]]; then
		return 1
	fi

	local list_csv
	list_csv="$(load_theme_list_csv)"
	local item
	IFS=',' read -r -a _themes <<<"$list_csv"
	for item in "${_themes[@]}"; do
		if [[ "$candidate" == "$item" ]]; then
			return 0
		fi
	done
	return 1
}

load_module_sources_json() {
	if [[ -n "$MODULE_SOURCES_JSON_CACHE" ]]; then
		printf '%s' "$MODULE_SOURCES_JSON_CACHE"
		return 0
	fi

	local fallback_json="$DEFAULT_MODULE_SOURCES_JSON"
	if [[ -f "$MODULE_SOURCES_CONFIG_FILE" ]]; then
		if command -v python3 >/dev/null 2>&1; then
			local parsed_json
			parsed_json="$(python3 -c 'import json,re,sys
path=sys.argv[1]
raw=json.load(open(path, encoding="utf-8"))
if not isinstance(raw, dict) or not raw:
    raise SystemExit(2)
safe={}
for module_key, meta in raw.items():
    if not isinstance(module_key, str) or not re.fullmatch(r"[a-z0-9-]{2,30}", module_key):
        continue
    if not isinstance(meta, dict):
        continue
    label=meta.get("label", "")
    source=meta.get("data_source", "")
    detail=meta.get("detail", "")
    next_step=meta.get("next_step", "")
    if not all(isinstance(value, str) and value.strip() for value in [label, source, detail, next_step]):
        continue
    safe[module_key]={"label":label.strip(),"data_source":source.strip(),"detail":detail.strip(),"next_step":next_step.strip()}
if not safe:
    raise SystemExit(3)
print(json.dumps(safe, ensure_ascii=False))' "$MODULE_SOURCES_CONFIG_FILE" 2>/dev/null || true)"
			if [[ -n "$parsed_json" ]]; then
				fallback_json="$parsed_json"
				record_checked "Modul-Datenquellen geladen"
			else
				record_missing "Modul-Datenquellen ungültig"
				record_next_step "Datei config/module_sources.json prüfen und erneut starten"
			fi
		else
			record_missing "python3 für Modul-Datenquellen fehlt"
			record_next_step "python3 installieren oder Standard-Modulquellen verwenden"
		fi
	fi

	MODULE_SOURCES_JSON_CACHE="$fallback_json"
	printf '%s' "$MODULE_SOURCES_JSON_CACHE"
}

print_help() {
	cat <<TXT
$(get_text "help_title")

$(get_text "help_usage")
  Start komplett:                 ./start.sh
  Nur Prüfung (Check):            ./start.sh --check
  Nur Reparatur (Repair):         ./start.sh --repair
  Nur Formatierung (Format):      ./start.sh --format
  Nur Selbsttest (Test):          ./start.sh --test
  Autopilot (strikt):             ./start.sh --autopilot
  Schwachstellen-Bericht:         ./start.sh --weakness-report
  Screenshot-Baseline-Check:      ./start.sh --visual-baseline-check
  Pflicht-Gates 1-5:              ./start.sh --full-gates
  Offline-Paket bauen:            ./start.sh --offline-pack
  Automatischer Mini-UX-Check:    ./start.sh --ux-check-auto
  Release-Check:                  ./start.sh --release-check
  $(get_text "help_show_all_next_steps")
  $(get_text "help_priority_mode")
  Debug-Protokoll aktivieren:     ./start.sh --debug
  Hilfe anzeigen:                 ./start.sh --help

Einfache Begriffe:
  Check (Prüfung) = automatische Kontrolle
  Repair (Reparatur) = automatische Behebung
  Format = einheitliche Schreibweise im Code
  Test = kurzer Selbsttest mit Erfolg/Fehler-Ausgabe
  Autopilot = führt Check, Reparatur, Format und Test ohne Teilerfolg aus

$(get_text "help_accessibility")
$(get_text "help_icon_legend")
$(get_text "help_full_gates")
TXT
}

ensure_writable_log() {
	mkdir -p "$LOG_DIR"
	: >"$LOG_FILE"
	STATUS_SUMMARY_FILE="${LOG_DIR}/status_summary.txt"
	: >"$STATUS_SUMMARY_FILE"
	record_checked "Log-Verzeichnis"
}

validate_args() {
	if [[ $# -gt 3 ]]; then
		print_error_with_actions "Zu viele Parameter. Bitte maximal eine Modus-Option sowie optional --debug und --show-all-next-steps nutzen."
		return 1
	fi

	local mode_count=0
	local debug_count=0
	local show_all_count=0

	for arg in "$@"; do
		case "$arg" in
		--check)
			MODE="check"
			mode_count=$((mode_count + 1))
			;;
		--repair)
			MODE="repair"
			mode_count=$((mode_count + 1))
			;;
		--format)
			MODE="format"
			mode_count=$((mode_count + 1))
			;;
		--test)
			MODE="test"
			mode_count=$((mode_count + 1))
			;;
		--autopilot)
			MODE="autopilot"
			mode_count=$((mode_count + 1))
			;;
		--safe)
			MODE="safe"
			mode_count=$((mode_count + 1))
			;;
		--help | -h)
			MODE="help"
			mode_count=$((mode_count + 1))
			;;
		--release-check)
			MODE="release-check"
			mode_count=$((mode_count + 1))
			;;
		--full-gates)
			MODE="full-gates"
			mode_count=$((mode_count + 1))
			;;
		--doctor)
			MODE="doctor"
			mode_count=$((mode_count + 1))
			;;
		--dashboard-guide)
			MODE="dashboard-guide"
			mode_count=$((mode_count + 1))
			;;
		--dashboard-template)
			MODE="dashboard-template"
			mode_count=$((mode_count + 1))
			;;
		--weakness-report)
			MODE="weakness-report"
			mode_count=$((mode_count + 1))
			;;
		--visual-baseline-check)
			MODE="visual-baseline-check"
			mode_count=$((mode_count + 1))
			;;
		--ux-check-auto)
			MODE="ux-check-auto"
			mode_count=$((mode_count + 1))
			;;
		--offline-pack)
			MODE="offline-pack"
			mode_count=$((mode_count + 1))
			;;
		--debug)
			DEBUG_MODE="1"
			debug_count=$((debug_count + 1))
			;;
		--show-all-next-steps)
			SHOW_ALL_NEXT_STEPS="1"
			show_all_count=$((show_all_count + 1))
			;;
		*)
			print_error_with_actions "Unbekannte Option '$arg'."
			record_next_step "./start.sh --help ausführen"
			return 1
			;;
		esac
	done

	if [[ "$mode_count" -gt 1 ]]; then
		print_error_with_actions "Mehrere Modus-Optionen erkannt. Bitte nur einen Modus pro Start verwenden."
		record_next_step "Beispiel: './start.sh --check --debug'"
		return 1
	fi

	if [[ "$debug_count" -gt 1 ]]; then
		print_error_with_actions "Option '--debug' wurde mehrfach gesetzt. Bitte nur einmal verwenden."
		record_next_step "Befehl auf genau ein '--debug' reduzieren"
		return 1
	fi

	if [[ "$show_all_count" -gt 1 ]]; then
		print_error_with_actions "Option '--show-all-next-steps' wurde mehrfach gesetzt. Bitte nur einmal verwenden."
		record_next_step "Befehl auf genau ein '--show-all-next-steps' reduzieren"
		return 1
	fi

	print_step "✅" "Eingabeprüfung abgeschlossen (Modus: ${MODE}, Debug: ${DEBUG_MODE})."
	record_checked "Eingabeparameter"
}

print_debug_context() {
	print_step "ℹ️" "Debug-Details: Arbeitsordner=${PROJECT_ROOT}"
	print_step "ℹ️" "Debug-Details: Shell=${SHELL:-unbekannt}"
	print_step "ℹ️" "Debug-Details: Nutzer=$(id -un 2>/dev/null || printf 'unbekannt')"
	print_step "ℹ️" "Debug-Details: Betriebssystem=$(uname -s 2>/dev/null || printf 'unbekannt')"
	if [[ -w "$LOG_DIR" ]]; then
		print_step "ℹ️" "Debug-Details: Log-Verzeichnis ist beschreibbar."
	else
		print_error_with_actions "Debug-Details: Log-Verzeichnis ist nicht beschreibbar."
		record_next_step "Schreibrechte für '${LOG_DIR}' prüfen"
	fi
	record_checked "Debug-Kontext"
}

run_debug_hint() {
	if [[ "$DEBUG_MODE" == "1" ]]; then
		print_step "ℹ️" "Debug aktiv: Zusätzliche Fehlersuche-Infos werden geschrieben."
		print_debug_context
		record_checked "Debug-Hinweise"
	fi
}

try_auto_install_tool() {
	local tool_name="$1"
	if [[ ! "$tool_name" =~ ^[a-zA-Z0-9._+-]+$ ]]; then
		print_error_with_actions "Ungültiger Werkzeugname '${tool_name}'."
		record_next_step "Werkzeugnamen prüfen und erneut versuchen"
		return 1
	fi

	print_step "⚠️" "${tool_name} fehlt. Automatische Reparatur wird versucht."
	record_missing "$tool_name"
	if ! is_network_available; then
		print_step "⚠️" "Offline erkannt: Paketinstallation für ${tool_name} wird übersprungen."
		record_next_step "Netzwerk verbinden und danach './start.sh --repair' erneut ausführen"
		return 1
	fi
	local install_attempted="0"
	local manager package
	for manager in apt brew pip; do
		package="$(get_dependency_package "$tool_name" "$manager" | head -n 1 | tr -d '[:space:]')"
		if [[ -z "$package" ]]; then
			continue
		fi
		if ! command -v "${manager/apt/apt-get}" >/dev/null 2>&1 && [[ "$manager" != "pip" ]]; then
			continue
		fi
		install_attempted="1"
		if install_with_package_manager "$manager" "$package"; then
			print_step "✅" "${tool_name} wurde über ${manager} installiert (${package})."
			record_fixed "$tool_name via ${manager}"
			return 0
		fi
		print_step "⚠️" "${manager} konnte ${tool_name} (${package}) nicht installieren."
		print_step "ℹ️" "Installationsdetails: ${LOG_DIR}/install.log"
		record_next_step "Installationsprotokoll öffnen: cat ${LOG_DIR}/install.log"
		record_next_step "Bei ${manager}-Fehlern danach './start.sh --check --debug' ausführen"
	done

	if [[ "$install_attempted" == "0" ]]; then
		print_step "⚠️" "Kein unterstützter Paketmanager gefunden (apt-get/brew)."
		record_next_step "Tool manuell installieren und danach './start.sh --check' ausführen"
	fi

	print_step "⚠️" "Automatische Reparatur für ${tool_name} nicht erfolgreich."
	record_next_step "Netzwerk prüfen und '${tool_name}' manuell installieren"
	return 1
}

ensure_tool() {
	local tool_name="$1"

	if command -v "$tool_name" >/dev/null 2>&1; then
		print_step "✅" "Werkzeug verfügbar: ${tool_name}"
		record_checked "Werkzeug ${tool_name}"
		return 0
	fi

	try_auto_install_tool "$tool_name" || true
	if command -v "$tool_name" >/dev/null 2>&1; then
		print_step "✅" "Werkzeug nach Reparatur verfügbar: ${tool_name}"
		record_checked "Werkzeug ${tool_name}"
		return 0
	fi

	print_step "⚠️" "${tool_name} weiterhin nicht verfügbar."
	record_next_step "./start.sh --repair ausführen oder Tool manuell installieren"
	return 1
}

check_required_files() {
	local missing=0
	local file
	for file in "README.md" "todo.txt" "CHANGELOG.md" "data/version_registry.json" "system/start_core.sh"; do
		if [[ -f "${PROJECT_ROOT}/${file}" ]]; then
			print_step "✅" "Datei gefunden: ${file}"
			record_checked "Datei ${file}"
		else
			print_error_with_actions "Datei fehlt: ${file}."
			record_missing "$file"
			missing=1
		fi
	done

	[[ $missing -eq 0 ]]
}

check_runtime_prerequisites() {
	local missing=0
	local runtime_tool
	for runtime_tool in "bash" "python3" "curl"; do
		if command -v "$runtime_tool" >/dev/null 2>&1; then
			print_step "✅" "Voraussetzung verfügbar: ${runtime_tool}"
			record_checked "Voraussetzung ${runtime_tool}"
			continue
		fi

		if [[ "$runtime_tool" == "bash" ]]; then
			print_error_with_actions "Voraussetzung fehlt: ${runtime_tool}."
			record_missing "Voraussetzung ${runtime_tool}"
			record_next_step "System-Bash installieren und danach erneut versuchen"
			missing=1
			continue
		fi

		print_step "⚠️" "Voraussetzung fehlt: ${runtime_tool}. Starte automatische Reparatur."
		if ensure_tool "$runtime_tool"; then
			print_step "✅" "Automatische Reparatur erfolgreich: ${runtime_tool} ist jetzt verfügbar."
			record_fixed "Voraussetzung ${runtime_tool}"
		else
			print_error_with_actions "Voraussetzung fehlt weiterhin: ${runtime_tool}."
			record_missing "Voraussetzung ${runtime_tool}"
			record_next_step "Einfacher Start: './start.sh --repair' und danach './start.sh --check'"
			missing=1
		fi
	done

	if [[ "$missing" -eq 0 ]]; then
		if command -v rg >/dev/null 2>&1; then
			print_step "✅" "Optionales Suchwerkzeug verfügbar: rg (schnelle Dateisuche)."
			record_checked "Optional rg"
		else
			print_step "⚠️" "Optionales Suchwerkzeug rg fehlt. Fallback mit find ist aktiv (langsamer, aber funktionsfähig)."
			record_next_step "Optional: './start.sh --repair' für schnellere Prüfungen mit rg"
		fi

		print_step "ℹ️" "Hilfe: Voraussetzungen sind bereit. Bei neuen Fehlern zuerst './start.sh --repair' ausführen."
		record_checked "Voraussetzungen vollständig"
		return 0
	fi

	return 1
}

list_repo_files() {
	if command -v rg >/dev/null 2>&1; then
		(cd "$PROJECT_ROOT" && rg --files)
		return 0
	fi

	(cd "$PROJECT_ROOT" && find . -type f \
		-not -path './.git/*' \
		-not -path './.venv/*' \
		-not -path './node_modules/*' \
		-print | sed 's#^\./##')
}

check_line_limit() {
	local oversize_found=0
	local file
	while IFS= read -r file; do
		local lines
		lines="$(wc -l <"${PROJECT_ROOT}/${file}")"
		if [[ "$lines" -gt "$LINE_LIMIT" ]]; then
			local msg
			msg="$(get_text "line_limit_fail")"
			msg="${msg//\{\{FILE\}\}/$file}"
			msg="${msg//\{\{LINES\}\}/$lines}"
			msg="${msg//\{\{LIMIT\}\}/$LINE_LIMIT}"
			print_error_with_actions "$msg"
			record_missing "Zeilenlimit: $file"
			oversize_found=1
		fi
	done < <(list_repo_files)

	if [[ "$oversize_found" -eq 0 ]]; then
		print_step "✅" "$(replace_placeholders "$(get_text "line_limit_ok")")"
		record_checked "Zeilenlimit"
		return 0
	fi

	record_next_step "Datei auf maximal ${LINE_LIMIT} Zeilen kürzen und erneut prüfen"
	return 1
}

run_formatting() {
	if ensure_tool "shfmt"; then
		shfmt -w "$PROJECT_ROOT/start.sh"
		print_step "✅" "Formatierung erfolgreich (shfmt)."
		record_checked "Formatierung"
	else
		print_step "⚠️" "Formatierung übersprungen, da shfmt fehlt."
	fi
}

run_quality_checks() {
	if ensure_tool "shellcheck"; then
		if shellcheck -x "$PROJECT_ROOT/start.sh" "$PROJECT_ROOT/system/start_core.sh"; then
			print_step "✅" "Codequalität geprüft (shellcheck ohne Fehler)."
			record_checked "Codequalität"
		else
			print_error_with_actions "shellcheck meldet Probleme."
			record_next_step "shellcheck-Hinweise in start.sh beheben"
			return 1
		fi
	else
		print_step "⚠️" "Codequalität-Check übersprungen, da shellcheck fehlt."
	fi

	if command -v ruff >/dev/null 2>&1; then
		print_step "ℹ️" "Optionaler Python-Lint aktiv: ruff check tools"
		if ruff check "$PROJECT_ROOT/tools"; then
			print_step "✅" "Python-Lint geprüft (ruff ohne Fehler)."
			record_checked "Python-Lint"
		else
			print_error_with_actions "ruff meldet Python-Lint-Probleme."
			record_next_step "ruff-Hinweise in tools/ beheben"
			return 1
		fi
	else
		print_step "⚠️" "ruff fehlt. Python-Lint bleibt optional und wurde übersprungen."
		record_next_step "Optional: python3 -m pip install ruff und danach './start.sh --test'"
	fi
}

run_tests() {
	validate_offline_artifact_mode || return 1

	print_step "✅" "Schnelltest gestartet: Voraussetzungen + Syntax + Pflichtdateien + Zeilenlimit + Repo-Quality."
	if ! check_runtime_prerequisites || ! bash -n "$PROJECT_ROOT/start.sh" || ! check_required_files || ! check_line_limit; then
		print_error_with_actions "Selbsttest fehlgeschlagen."
		record_next_step "./start.sh --check --debug ausführen"
		return 1
	fi

	print_step "ℹ️" "Zusatztest: python3 -m compileall -q ."
	if ! python3 -m compileall -q "$PROJECT_ROOT"; then
		print_error_with_actions "Selbsttest fehlgeschlagen: Syntax-Kompilierung (compileall) meldet Fehler."
		record_next_step "Fehlermeldung lesen und danach './start.sh --test --debug' erneut ausführen"
		return 1
	fi
	record_checked "compileall"

	print_step "ℹ️" "Zusatztest: bash tools/run_quality_checks.sh (effizienter Kurzlauf)"
	if ! bash "$PROJECT_ROOT/tools/run_quality_checks.sh"; then
		print_error_with_actions "Selbsttest fehlgeschlagen: Repo-Quality meldet Fehler."
		record_next_step "Quality-Hinweise beheben und danach './start.sh --test' erneut starten"
		return 1
	fi
	record_checked "Repo-Quality"

	if [[ -s "$LOG_FILE" ]]; then
		print_step "✅" "Selbsttest erfolgreich (inklusive Repo-Quality und Syntax-Kompilierung)."
		record_checked "Testausgabe vorhanden"
	else
		print_error_with_actions "Selbsttest lieferte keine Protokollausgabe."
		record_next_step "Erneut './start.sh --test --debug' ausführen und Log prüfen"
		return 1
	fi

	record_checked "Selbsttest"
}

validate_offline_artifact_mode() {
	local mode="${OFFLINE_ARTIFACT_MODE:-strict}"
	if [[ "$mode" != "strict" && "$mode" != "warn" ]]; then
		print_error_with_actions "Ungültiger Wert für OFFLINE_ARTIFACT_MODE: '${mode}'. Erlaubt sind nur 'strict' oder 'warn'."
		record_next_step "Beispiel: OFFLINE_ARTIFACT_MODE=warn ./start.sh --test"
		return 1
	fi

	record_checked "OFFLINE_ARTIFACT_MODE=${mode}"
	return 0
}

validate_next_step_limit() {
	if [[ ! "$NEXT_STEP_LIMIT" =~ ^[0-9]+$ ]] || [[ "$NEXT_STEP_LIMIT" -lt 1 ]] || [[ "$NEXT_STEP_LIMIT" -gt 20 ]]; then
		print_error_with_actions "Ungültiger Wert für PROVOWARE_NEXT_STEPS_LIMIT: '${NEXT_STEP_LIMIT}'. Erlaubt sind nur ganze Zahlen von 1 bis 20."
		record_next_step "Beispiel: PROVOWARE_NEXT_STEPS_LIMIT=8 ./start.sh --check"
		return 1
	fi

	record_checked "PROVOWARE_NEXT_STEPS_LIMIT=${NEXT_STEP_LIMIT}"
	return 0
}

validate_show_all_next_steps() {
	if [[ "$SHOW_ALL_NEXT_STEPS" != "0" && "$SHOW_ALL_NEXT_STEPS" != "1" ]]; then
		print_error_with_actions "Ungültiger Wert für PROVOWARE_SHOW_ALL_NEXT_STEPS: '${SHOW_ALL_NEXT_STEPS}'. Erlaubt sind nur 0 oder 1."
		record_next_step "Beispiel: PROVOWARE_SHOW_ALL_NEXT_STEPS=1 ./start.sh --check"
		return 1
	fi

	record_checked "PROVOWARE_SHOW_ALL_NEXT_STEPS=${SHOW_ALL_NEXT_STEPS}"
	return 0
}

validate_priority_mode() {
	if [[ "$PRIORITY_MODE" != "numbered" && "$PRIORITY_MODE" != "p0p1" && "$PRIORITY_MODE" != "p0-only" ]]; then
		print_error_with_actions "Ungültiger Wert für PROVOWARE_PRIORITY_MODE: '${PRIORITY_MODE}'. Erlaubt sind nur 'numbered', 'p0p1' oder 'p0-only'."
		record_next_step "Beispiel: PROVOWARE_PRIORITY_MODE=p0p1 ./start.sh --check"
		return 1
	fi

	record_checked "PROVOWARE_PRIORITY_MODE=${PRIORITY_MODE}"
	return 0
}

run_autopilot_mode() {
	print_section "Autopilot" || true
	print_step "✅" "Autopilot aktiv: Check, Reparatur, Format und Test laufen strikt nacheinander."

	if ! run_check_mode; then
		print_error_with_actions "Autopilot gestoppt: Check nicht erfolgreich."
		record_next_step "./start.sh --check --debug ausführen und die Hinweise Schritt für Schritt abarbeiten"
		return 1
	fi

	if ! run_repair_mode; then
		print_error_with_actions "Autopilot gestoppt: Reparatur nicht erfolgreich."
		record_next_step "./start.sh --repair --debug ausführen und fehlende Werkzeuge prüfen"
		return 1
	fi

	if ! run_formatting; then
		print_error_with_actions "Autopilot gestoppt: Formatierung nicht erfolgreich."
		record_next_step "./start.sh --format --debug ausführen und Ausgabe prüfen"
		return 1
	fi

	if ! run_tests; then
		print_error_with_actions "Autopilot gestoppt: Tests nicht erfolgreich."
		record_next_step "./start.sh --test --debug ausführen und gemeldete Next Steps beheben"
		return 1
	fi

	print_step "✅" "Autopilot erfolgreich abgeschlossen."
	record_checked "Autopilot"
	record_next_step "Optional: ./start.sh --full-gates für den vollständigen Gate-Durchlauf starten"
	return 0
}

run_doctor_mode() {
	print_step "✅" "Doctor-Modus aktiv: Verbesserungsbericht wird erstellt."
	local failed=0

	check_runtime_prerequisites || failed=1
	check_required_files || failed=1
	check_line_limit || failed=1
	run_quality_checks || failed=1

	print_step "ℹ️" "$(get_text "doctor_intro")"
	print_step "➡️" "$(get_text "doctor_quality")"
	print_step "➡️" "$(get_text "doctor_accessibility")"
	print_step "➡️" "$(get_text "doctor_release")"
	record_checked "Doctor-Bericht"

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "Doctor-Modus: Keine kritischen Probleme gefunden."
		record_next_step "Optional: GUI mit 'GUI_THEME=dark ./start.sh' gegenprüfen"
		return 0
	fi

	print_step "⚠️" "Doctor-Modus: Verbesserungen empfohlen, siehe Schritte oben."
	record_next_step "Empfohlene Befehle nacheinander ausführen und danach erneut './start.sh --doctor' starten"
	return 1
}

run_dashboard_guide() {
	print_step "✅" "Guide-Modus aktiv: Laienfreundliches Dashboard-Design wird angezeigt."
	print_step "ℹ️" "$(get_text "dashboard_intro")"
	print_step "➡️" "$(get_text "dashboard_layout")"
	print_step "➡️" "$(get_text "dashboard_accessibility")"
	print_step "➡️" "$(get_text "dashboard_feedback")"
	record_checked "Dashboard-Guide"
	record_next_step "Guide in der echten GUI schrittweise umsetzen: zuerst Statusbereich, dann Aufgabenkarten, dann Hilfebereich"
}

run_dashboard_template_mode() {
	local template_file="${PROJECT_ROOT}/templates/dashboard_musterseite.html"
	if [[ ! -f "$template_file" ]]; then
		print_error_with_actions "Dashboard-Template fehlt: ${template_file}"
		record_missing "Dashboard-Template"
		record_next_step "Datei wiederherstellen und danach './start.sh --dashboard-template' ausführen"
		return 1
	fi

	local missing_parts=0
	local required_marker
	for required_marker in "data-theme-switcher" "id=\"error-dialog\"" "aria-live=\"polite\"" "data-action=\"retry\"" "data-action=\"repair\"" "data-action=\"log\""; do
		if ! grep -q "$required_marker" "$template_file"; then
			missing_parts=1
		fi
	done

	if [[ "$missing_parts" -ne 0 ]]; then
		print_error_with_actions "Dashboard-Template ist unvollständig: Mindestens ein Pflichtbereich fehlt."
		record_missing "Dashboard-Template-Struktur"
		record_next_step "Template prüfen und Pflichtbereiche (Theme, Dialog, Aktionsbuttons, aria-live) ergänzen"
		return 1
	fi

	local configured_themes
	configured_themes="$(load_theme_list_csv)"
	IFS=',' read -r -a _theme_items <<<"$configured_themes"
	local configured_theme
	for configured_theme in "${_theme_items[@]}"; do
		if ! grep -q "<option value=\"${configured_theme}\"" "$template_file"; then
			print_error_with_actions "Dashboard-Template enthält kein auswählbares Theme '${configured_theme}'."
			record_missing "Theme-Option ${configured_theme}"
			record_next_step "Theme-Option im Template ergänzen oder config/themes.json anpassen"
			return 1
		fi
	done

	print_step "✅" "Dashboard-Template geprüft und einsatzbereit: ${template_file}"
	print_step "ℹ️" "Nutzung: Datei im Browser öffnen und Buttons direkt testen (ohne Build-Schritt)."
	print_step "➡️" "Nächster Schritt: Bei Bedarf Text anpassen und dieselbe Datei als Projekt-Startseite nutzen."
	record_checked "Dashboard-Template"
	record_next_step "Template optional kopieren: cp templates/dashboard_musterseite.html logs/gui/index.html"
	return 0
}

prepare_playwright_offline_assets() {
	print_step "ℹ️" "Playwright-Vorbereitung: Offline-fähige Browser-Assets werden geprüft."
	mkdir -p "$PLAYWRIGHT_BROWSERS_PATH" "$PROJECT_ROOT/data/offline_wheels"
	if ! command -v python3 >/dev/null 2>&1; then
		print_step "⚠️" "python3 fehlt. Playwright-Vorbereitung wird übersprungen."
		record_next_step "'./start.sh --repair' erneut nach Python-Installation ausführen"
		return 1
	fi

	if python3 -c 'import playwright' >/dev/null 2>&1; then
		print_step "✅" "Playwright-Modul bereits verfügbar."
		record_checked "Playwright Modul"
	else
		print_step "⚠️" "Playwright-Modul fehlt. Versuche lokale Offline-Wheels zu nutzen."
		if python3 -m pip install --no-index --find-links "$PROJECT_ROOT/data/offline_wheels" playwright >/dev/null 2>&1; then
			print_step "✅" "Playwright aus lokalen Wheels installiert."
			record_fixed "Playwright Modul aus Offline-Wheels"
		elif is_network_available && python3 -m pip install playwright >/dev/null 2>&1; then
			print_step "✅" "Playwright online installiert."
			record_fixed "Playwright Modul"
			record_next_step "Optional für Offline-Betrieb: python3 -m pip download playwright -d data/offline_wheels"
		else
			print_step "⚠️" "Playwright konnte nicht installiert werden."
			record_missing "Playwright Modul"
			record_next_step "Online vorbereiten: python3 -m pip download playwright -d data/offline_wheels"
			return 1
		fi
	fi

	if find "$PLAYWRIGHT_BROWSERS_PATH" -mindepth 1 -maxdepth 2 -type d | head -n 1 >/dev/null 2>&1; then
		print_step "✅" "Playwright-Browsercache vorhanden: $PLAYWRIGHT_BROWSERS_PATH"
		record_checked "Playwright Browsercache"
		return 0
	fi

	print_step "⚠️" "Playwright-Browsercache fehlt. Installationsversuch startet."
	if python3 -m playwright install chromium >/dev/null 2>&1; then
		print_step "✅" "Chromium für Playwright installiert (${PLAYWRIGHT_BROWSERS_PATH})."
		record_fixed "Playwright Browsercache"
		record_next_step "Optional sichern: Ordner data/playwright-browsers für Offline-Systeme mitnehmen"
		return 0
	fi

	print_step "⚠️" "Playwright-Browserinstallation nicht erfolgreich (oft ohne Internet)."
	record_missing "Playwright Browsercache"
	record_next_step "Online vorbereiten: PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 -m playwright install chromium"
	record_next_step "Offline nutzen: PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 tools/browser_e2e_test.py"
	return 1
}

run_check_mode() {
	print_section "Check-Modus" || true
	print_step "✅" "Check-Modus aktiv."
	local failed=0
	check_runtime_prerequisites || failed=1
	check_required_files || failed=1
	check_line_limit || failed=1
	run_quality_checks || failed=1

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "Check-Modus erfolgreich abgeschlossen."
		record_checked "Check-Modus"
		return 0
	fi

	print_error_with_actions "Check-Modus meldet offene Probleme."
	record_missing "Check-Modus"
	record_next_step "'./start.sh --repair' ausführen und danach './start.sh --check --debug' wiederholen"
	return 1
}

run_repair_mode() {
	print_section "Repair-Modus" || true
	print_step "✅" "Repair-Modus aktiv."
	run_dependency_bootstrap || true
	prepare_playwright_offline_assets || true
	print_step "✅" "Repair-Modus abgeschlossen."
}

run_offline_pack_mode() {
	print_section "Offline-Paket" || true
	print_step "✅" "Offline-Paket-Modus aktiv. Lokale Artefakte werden vorbereitet und gebündelt."
	prepare_playwright_offline_assets || true

	local wheel_dir="$PROJECT_ROOT/data/offline_wheels"
	local browser_dir="$PLAYWRIGHT_BROWSERS_PATH"
	local package_dir="$PROJECT_ROOT/data"
	local package_file
	package_file="offline_bundle_$(date '+%Y%m%d_%H%M%S').tar.gz"
	local package_path="$package_dir/$package_file"

	mkdir -p "$wheel_dir" "$browser_dir" "$package_dir"

	if [[ ! -d "$wheel_dir" || ! -d "$browser_dir" ]]; then
		print_error_with_actions "Offline-Paket konnte nicht vorbereitet werden: Artefaktordner fehlen."
		record_missing "Offline-Paket"
		record_next_step "Erneut mit './start.sh --repair' probieren und danach './start.sh --offline-pack' ausführen"
		return 1
	fi

	if tar -czf "$package_path" -C "$PROJECT_ROOT" data/offline_wheels data/playwright-browsers; then
		if [[ -s "$package_path" ]]; then
			print_step "✅" "Offline-Paket erstellt: $package_path"
			record_fixed "Offline-Paket archiviert"
			record_checked "Offline-Bundle bereit"
			record_next_step "Offline-System: Archiv nach data/ kopieren und mit 'tar -xzf $(basename "$package_path") -C .' entpacken"
			return 0
		fi
	fi

	print_error_with_actions "Offline-Paket konnte nicht erstellt werden."
	record_missing "Offline-Paket"
	record_next_step "Dateirechte in data/ prüfen und './start.sh --offline-pack --debug' erneut ausführen"
	return 1
}

validate_project_path_input() {
	local candidate="$1"
	if [[ -z "$candidate" ]]; then
		return 1
	fi
	if [[ "$candidate" == ~* ]]; then
		candidate="${HOME}${candidate#\~}"
	fi
	if [[ "$candidate" != /* ]]; then
		return 1
	fi
	if [[ "$candidate" =~ [[:cntrl:]] ]]; then
		return 1
	fi
	return 0
}

resolve_dashboard_project_path() {
	local input_path="${PROJECT_FOLDER:-}"
	local default_path="${HOME}/Provoware-Projekte/Standardprojekt"

	if [[ -z "$input_path" ]] && [[ -t 0 ]]; then
		print_step "ℹ️" "Projekt-Routine: Bitte Projektordner wählen. Bei leerer Eingabe wird Standard genutzt."
		printf 'Projektordner [Standard: %s]: ' "$default_path"
		IFS= read -r input_path || true
	fi

	if [[ -z "$input_path" ]]; then
		input_path="$default_path"
		print_step "ℹ️" "Kein Ordner eingegeben. Standardpfad wird genutzt: ${input_path}"
	fi

	if ! validate_project_path_input "$input_path"; then
		print_step "⚠️" "Ungültiger Projektordner '${input_path}'. Nutze sicheren Standardpfad im Nutzerverzeichnis."
		input_path="$default_path"
	fi

	if [[ -d "$input_path" ]]; then
		print_step "✅" "Projektordner vorhanden: ${input_path}"
		record_checked "Projektordner erkannt"
	else
		if mkdir -p "$input_path"; then
			print_step "✅" "Projektordner wurde transparent neu erstellt: ${input_path}"
			record_fixed "Projektordner automatisch erstellt"
		else
			print_error_with_actions "Projektordner konnte nicht erstellt werden: ${input_path}"
			record_missing "Projektordner"
			record_next_step "Anderen Pfad setzen, z. B. PROJECT_FOLDER=${default_path} ./start.sh"
			return 1
		fi
	fi

	local escaped_path
	escaped_path="$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$input_path" 2>/dev/null || true)"
	if [[ -z "$escaped_path" ]]; then
		escaped_path='"'"$input_path"'"'
	fi

	mkdir -p "$(dirname "$PROJECT_CONTEXT_FILE")" "$(dirname "$PROJECT_SETTINGS_FILE")"
	local now_ts
	now_ts="$(date '+%Y-%m-%d %H:%M:%S')"
	printf '{
  "project_path": %s,
  "updated_at": "%s"
}
' "$escaped_path" "$now_ts" >"$PROJECT_CONTEXT_FILE"
	printf '{
  "project_path": %s,
  "path_source": "start_routine",
  "updated_at": "%s"
}
' "$escaped_path" "$now_ts" >"$PROJECT_SETTINGS_FILE"
	if ! python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8")); json.load(open(sys.argv[2], encoding="utf-8"))' "$PROJECT_CONTEXT_FILE" "$PROJECT_SETTINGS_FILE" >/dev/null 2>&1; then
		print_error_with_actions "Projektpfad konnte nicht sicher gespeichert werden (JSON-Prüfung fehlgeschlagen)."
		record_missing "Projektpfad-Konfiguration"
		record_next_step "Dateien data/project_context.json und config/project_settings.json prüfen, dann './start.sh --debug' erneut starten"
		return 1
	fi

	DASHBOARD_PROJECT_PATH="$input_path"
	record_checked "Projektpfad gespeichert"
	record_checked "Projektpfad in config gespiegelt"
	return 0
}

launch_local_gui() {
	local requested_gui_port="${GUI_PORT:-}"
	if [[ -n "$requested_gui_port" ]] && { [[ ! "$requested_gui_port" =~ ^[0-9]+$ ]] || [[ "$requested_gui_port" -lt "$GUI_PORT_MIN" ]] || [[ "$requested_gui_port" -gt "$GUI_PORT_MAX" ]]; }; then
		print_error_with_actions "Ungültiger GUI_PORT '${requested_gui_port}'. Erlaubt sind Zahlen von ${GUI_PORT_MIN} bis ${GUI_PORT_MAX} (keine Systemports)."
		record_next_step "GUI_PORT korrigieren, z. B. 'GUI_PORT=24567 ./start.sh'"
		return 1
	fi

	local gui_port=""
	if ! gui_port="$(
		python3 - "$requested_gui_port" "$GUI_PORT_MIN" "$GUI_PORT_MAX" "$GUI_PORT_RANDOM_ATTEMPTS" <<'PY'
import random
import socket
import sys

preferred_raw = (sys.argv[1] or "").strip()
port_min = int(sys.argv[2])
port_max = int(sys.argv[3])
attempts = int(sys.argv[4])

def is_free(port: int) -> bool:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("127.0.0.1", port))
        return True
    except OSError:
        return False
    finally:
        sock.close()

if preferred_raw:
    preferred = int(preferred_raw)
    if is_free(preferred):
        print(f"preferred:{preferred}")
        raise SystemExit(0)
    print(f"fallback:{preferred}")

for _ in range(max(1, attempts)):
    candidate = random.SystemRandom().randint(port_min, port_max)
    if is_free(candidate):
        print(f"random:{candidate}")
        raise SystemExit(0)

raise SystemExit(1)
PY
	)"; then
		print_error_with_actions "Kein freier GUI-Port gefunden. Bitte kurz warten und erneut versuchen."
		record_next_step "Offene Ports prüfen und erneut './start.sh' ausführen"
		return 1
	fi

	local gui_port_source="${gui_port%%:*}"
	gui_port="${gui_port##*:}"
	if [[ "$gui_port_source" == "fallback" ]]; then
		print_step "⚠️" "Gewünschter GUI-Port ${requested_gui_port} ist belegt. Es wird automatisch ein freier Alternativ-Port gesucht."
		record_next_step "Optional festen Port setzen: GUI_PORT=24567 ./start.sh"
		gui_port_source="random"
	fi
	if [[ "$gui_port_source" == "random" ]]; then
		print_step "ℹ️" "GUI-Port wurde zufällig gewählt (${gui_port}), damit Konflikte automatisch vermieden werden."
		record_checked "GUI-Port zufällig gewählt"
	else
		record_checked "GUI-Port ${gui_port}"
	fi

	local gui_theme="${GUI_THEME:-high-contrast}"
	if ! is_allowed_theme "$gui_theme"; then
		print_error_with_actions "Ungültiges GUI_THEME '${gui_theme}'. Erlaubte Werte laut config/themes.json oder Standard: $(load_theme_list_csv)."
		record_next_step "GUI_THEME setzen, z. B. 'GUI_THEME=high-contrast ./start.sh'"
		return 1
	fi
	record_checked "GUI-Theme ${gui_theme}"

	local gui_entry="${GUI_ENTRY:-dashboard}"
	if [[ "$gui_entry" != "dashboard" && "$gui_entry" != "status" ]]; then
		print_error_with_actions "Ungültiges GUI_ENTRY '${gui_entry}'. Erlaubt sind nur 'dashboard' oder 'status'."
		record_next_step "GUI_ENTRY korrigieren, z. B. 'GUI_ENTRY=dashboard ./start.sh'"
		return 1
	fi

	local palette
	palette="$(resolve_theme_colors "$gui_theme" 2>/dev/null || true)"
	if [[ -z "$palette" ]]; then
		print_error_with_actions "Theme-Farben konnten für '${gui_theme}' nicht berechnet werden."
		record_missing "Theme-Farbberechnung"
		record_next_step "Theme prüfen und mit 'GUI_THEME=high-contrast ./start.sh --debug' erneut starten"
		return 1
	fi
	IFS='|' read -r bg_color text_color panel_color border_color focus_color ok_color warn_color <<<"$palette"

	if ! command -v python3 >/dev/null 2>&1; then
		print_error_with_actions "GUI-Start nicht möglich, weil python3 fehlt."
		record_next_step "'./start.sh --repair' starten, damit fehlende Werkzeuge automatisch installiert werden"
		return 1
	fi

	local gui_dir="${LOG_DIR}/gui"
	local gui_file="${gui_dir}/index.html"
	local gui_pid_file="${gui_dir}/server.pid"
	mkdir -p "$gui_dir"
	if [[ "$gui_entry" == "dashboard" ]]; then
		resolve_dashboard_project_path || return 1
	fi
	local theme_choices
	theme_choices="$(load_theme_list_csv | sed 's/,/|/g')"
	if ! render_gui_status_html "$gui_file" "$gui_theme" "$theme_choices" "$gui_port" "$bg_color" "$text_color" "$panel_color" "$border_color" "$focus_color" "$ok_color" "$warn_color"; then
		print_error_with_actions "GUI-Datei konnte nicht erzeugt werden."
		record_missing "GUI-Datei"
		record_next_step "Dateirechte prüfen und './start.sh --debug' erneut ausführen"
		return 1
	fi
	record_checked "GUI-Datei erzeugt"
	if [[ "$gui_entry" == "dashboard" ]]; then
		if [[ -f "${PROJECT_ROOT}/templates/dashboard_musterseite.html" ]] && cp "${PROJECT_ROOT}/templates/dashboard_musterseite.html" "$gui_file"; then
			python3 - "$gui_file" "$DASHBOARD_PROJECT_PATH" "$(load_module_sources_json)" <<'PY'
import json
import pathlib
import sys

path = pathlib.Path(sys.argv[1])
project_path = sys.argv[2]
module_sources_json = sys.argv[3]
text = path.read_text(encoding="utf-8")
escaped_project_path = json.dumps(project_path)[1:-1]
text = text.replace("__PROJECT_PATH__", escaped_project_path)
try:
    parsed_sources = json.loads(module_sources_json)
except json.JSONDecodeError:
    parsed_sources = {}
text = text.replace("__MODULE_SOURCES__", json.dumps(parsed_sources, ensure_ascii=False))
path.write_text(text, encoding="utf-8")
PY
			print_step "✅" "Hauptmodul-GUI als Startseite aktiviert (GUI_ENTRY=dashboard)."
			print_step "ℹ️" "Aktiver Projektordner im Dashboard: ${DASHBOARD_PROJECT_PATH}"
			record_checked "GUI-Einstieg dashboard"
		else
			print_step "⚠️" "Hauptmodul-Template fehlt oder ist nicht lesbar, Statusseite bleibt aktiv."
			record_next_step "Template prüfen: templates/dashboard_musterseite.html und danach './start.sh' neu starten"
		fi
	else
		print_step "ℹ️" "GUI-Einstieg auf Statusseite gesetzt (GUI_ENTRY=status)."
		record_checked "GUI-Einstieg status"
	fi

	local server_ok="0"
	if [[ -f "$gui_pid_file" ]] && kill -0 "$(cat "$gui_pid_file" 2>/dev/null)" 2>/dev/null && curl -fsS "http://127.0.0.1:${gui_port}/" >/dev/null 2>&1; then
		server_ok="1"
		print_step "✅" "GUI-Server läuft bereits auf Port ${gui_port}."
	fi

	if [[ "$server_ok" == "0" ]]; then
		rm -f "$gui_pid_file"
		python3 -m http.server "$gui_port" --directory "$gui_dir" >/dev/null 2>&1 &
		echo "$!" >"$gui_pid_file"
		sleep 1
		if curl -fsS "http://127.0.0.1:${gui_port}/" >/dev/null 2>&1; then
			print_step "✅" "GUI-Server gestartet auf Port ${gui_port}."
			record_fixed "GUI-Server automatisch gestartet"
		else
			print_error_with_actions "GUI-Server konnte nicht gestartet werden."
			record_next_step "Port prüfen und erneut './start.sh' ausführen"
			return 1
		fi
	fi

	local gui_url="http://127.0.0.1:${gui_port}/"
	local open_ok="0"
	if command -v xdg-open >/dev/null 2>&1; then
		if xdg-open "$gui_url" >/dev/null 2>&1; then
			open_ok="1"
			print_step "✅" "GUI im Browser geöffnet: ${gui_url}"
		else
			print_step "⚠️" "Browser-Öffnung über xdg-open nicht möglich (z. B. SSH/Headless-Umgebung)."
		fi
	elif command -v open >/dev/null 2>&1; then
		if open "$gui_url" >/dev/null 2>&1; then
			open_ok="1"
			print_step "✅" "GUI im Browser geöffnet: ${gui_url}"
		else
			print_step "⚠️" "Browser-Öffnung über open nicht möglich (z. B. Server ohne Desktop)."
		fi
	fi

	if [[ "$open_ok" == "0" ]]; then
		print_step "ℹ️" "Warum kein Auto-Öffnen? Es läuft wahrscheinlich ohne Desktop-Sitzung oder ohne Standardbrowser."
		print_command_hint "Dashboard manuell öffnen" "$gui_url" || true
		record_next_step "URL im Browser öffnen: ${gui_url}"
	fi

	return 0
}

run_start_mode() {
	print_section "Startmodus" || true
	print_step "✅" "Startmodus aktiv: Check, Repair, Format, Test laufen automatisch."
	run_dependency_bootstrap || true
	run_check_mode || true
	run_repair_mode
	run_formatting
	if ! run_tests; then
		print_error_with_actions "Startmodus abgebrochen: Selbsttest nicht erfolgreich."
		record_next_step "'./start.sh --debug' ausführen und danach die gemeldeten Schritte nacheinander beheben"
		return 1
	fi
	launch_local_gui || true
	print_step "✅" "Start erfolgreich abgeschlossen."
}

run_full_gates_mode() {
	print_section "Full-Gates" || true
	print_step "✅" "Full-Gates-Modus aktiv: Gates 1-5 werden strikt ausgeführt."
	local failed=0

	print_step "ℹ️" "GATE 1: python3 -m compileall -q ."
	if run_with_retry "GATE 1" python3 -m compileall -q "$PROJECT_ROOT"; then
		print_step "✅" "GATE 1 erfolgreich."
		record_checked "GATE 1"
	else
		print_error_with_actions "GATE 1 fehlgeschlagen."
		record_next_step "Syntaxfehler beheben und './start.sh --full-gates' erneut starten"
		failed=1
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 2: bash tools/run_quality_checks.sh (inklusive Kontrastprüfung)"
		if run_with_retry "GATE 2" bash "$PROJECT_ROOT/tools/run_quality_checks.sh"; then
			print_step "✅" "GATE 2 erfolgreich."
			record_checked "GATE 2"
		else
			print_error_with_actions "GATE 2 fehlgeschlagen."
			record_next_step "Quality-Hinweise beheben und './start.sh --full-gates' erneut starten"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 3: python3 tools/smoke_test.py --profile full"
		if run_with_retry "GATE 3" env SKIP_FULL_GATES=1 python3 "$PROJECT_ROOT/tools/smoke_test.py" --profile full; then
			print_step "✅" "GATE 3 erfolgreich."
			record_checked "GATE 3"
		else
			print_error_with_actions "GATE 3 fehlgeschlagen."
			record_next_step "Smoke-Test-Hinweise beheben und './start.sh --full-gates' erneut starten"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 4: bash start.sh --check"
		if run_with_retry "GATE 4" bash "$PROJECT_ROOT/start.sh" --check; then
			print_step "✅" "GATE 4 erfolgreich."
			record_checked "GATE 4"
		else
			print_error_with_actions "GATE 4 fehlgeschlagen."
			record_next_step "Startausgabe prüfen und './start.sh --check --debug' ausführen"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 5: ./start.sh --ux-check-auto"
		if run_with_retry "GATE 5" bash "$PROJECT_ROOT/start.sh" --ux-check-auto; then
			print_step "✅" "GATE 5 erfolgreich."
			record_checked "GATE 5"
			print_step "✅" "Alle automatischen Gates 1-5 erfolgreich abgeschlossen."
			record_next_step "Optional: ./start.sh --release-check für finalen Release-Status ausführen"
			return 0
		fi
		print_error_with_actions "GATE 5 fehlgeschlagen."
		record_next_step "Mini-UX-Hinweise beheben und './start.sh --full-gates' erneut starten"
		failed=1
	fi

	print_step "⚠️" "Full-Gates-Modus beendet mit mindestens einem Fehler."
	return 1
}

run_visual_baseline_check_mode() {
	print_step "✅" "Visual-Baseline-Check gestartet (Screenshot-Soll-Ist-Schutz)."
	if [[ ! -f "$PROJECT_ROOT/tools/visual_baseline_check.py" ]]; then
		print_error_with_actions "Visual-Baseline-Check fehlgeschlagen: tools/visual_baseline_check.py fehlt."
		record_missing "Visual-Baseline-Tool"
		record_next_step "Datei tools/visual_baseline_check.py wiederherstellen und erneut starten"
		return 1
	fi

	if python3 "$PROJECT_ROOT/tools/visual_baseline_check.py"; then
		print_step "✅" "Visual-Baseline erfolgreich geprüft."
		record_checked "Visual-Baseline"
		record_next_step "Optional: Screenshot-Artefakt in logs/artifacts visuell mit der letzten Iteration vergleichen"
		return 0
	fi

	print_error_with_actions "Visual-Baseline-Check meldet Abweichung oder fehlendes Artefakt."
	record_missing "Visual-Baseline"
	record_next_step "Erst 'python3 tools/browser_e2e_test.py' ausführen, dann './start.sh --visual-baseline-check' wiederholen"
	return 1
}

run_auto_ux_check_mode() {
	print_step "✅" "Automatischer Mini-UX-Check gestartet (Texte, Next Steps, A11y, Kontrast-Hinweise)."
	local template_file="${PROJECT_ROOT}/templates/dashboard_musterseite.html"
	if [[ ! -f "$template_file" ]]; then
		print_error_with_actions "Mini-UX-Check fehlgeschlagen: Dashboard-Template fehlt."
		record_missing "Mini-UX-Template"
		record_next_step "Datei templates/dashboard_musterseite.html wiederherstellen und erneut starten"
		return 1
	fi

	if python3 - "$template_file" <<'PY'; then
from pathlib import Path
import re
import sys

template_path = Path(sys.argv[1])
content = template_path.read_text(encoding="utf-8")

required_markers = {
    "next_steps": 'id="hilfe-next-steps"',
    "error_dialog": 'id="error-dialog"',
    "a11y_modal": 'aria-modal="true"',
    "theme_help": 'id="theme-help"',
    "theme_desc": 'aria-describedby="theme-help"',
    "theme_status": 'id="theme-status"',
}

missing_markers = [label for label, marker in required_markers.items() if marker not in content]
if missing_markers:
    print("fehlende Marker: " + ", ".join(missing_markers))
    raise SystemExit(1)

next_step_commands = ["./start.sh", "./start.sh --repair", "cat logs/status_summary.txt"]
if any(cmd not in content for cmd in next_step_commands):
    print("fehlende Next-Step-Befehle im Hilfebereich")
    raise SystemExit(1)

if "hoher Kontrast" not in content or "Theme" not in content:
    print("fehlende Kontrast- oder Theme-Hinweise")
    raise SystemExit(1)

if len(re.findall(r"Nächster|nächsten Schritte|Erneut versuchen|Reparatur", content, flags=re.IGNORECASE)) < 4:
    print("zu wenige leicht verständliche Hilfetexte")
    raise SystemExit(1)

if "focus-visible" not in content:
    print("fehlender Tastatur-Fokushinweis (focus-visible)")
    raise SystemExit(1)

if "Daten sparen" not in content:
    print("fehlender Hinweis für reduzierte Bewegung")
    raise SystemExit(1)

if "Empfohlene Reihenfolge (Priorität)" not in content:
    print("fehlender Prioritäts-Hinweis im Template")
    raise SystemExit(1)

priority_section_match = re.search(r'<section[^>]*id="hilfe-next-steps"[^>]*>', content)
if not priority_section_match:
    print("Prioritätsbereich für Fokus-Test fehlt")
    raise SystemExit(1)

priority_section_tag = priority_section_match.group(0)
if 'tabindex="-1"' not in priority_section_tag:
    print("Prioritätsbereich ist nicht direkt fokussierbar (tabindex=-1 fehlt)")
    raise SystemExit(1)

priority_block_match = re.search(r'<section[^>]*id="hilfe-next-steps"[^>]*>(.*?)</section>', content, flags=re.DOTALL)
if not priority_block_match:
    print("Prioritätsbereich-Inhalt fehlt")
    raise SystemExit(1)

priority_block = priority_block_match.group(1)
if not re.search(r'<(button|a)\b', priority_block):
    print("Prioritätsbereich hat kein fokusfähiges Element (button/link)")
    raise SystemExit(1)
PY
		print_step "✅" "Mini-UX-Check erfolgreich: Deutsche Hilfetexte, Next Steps und A11y-Marker sind vollständig."
		record_checked "Mini-UX-Check"
		record_next_step "Optional: Template im Browser öffnen und Dialogfluss per Tastatur (Tab/Enter) manuell prüfen"
		return 0
	fi

	print_error_with_actions "Mini-UX-Check fehlgeschlagen: Pflichttexte oder A11y-Marker sind unvollständig."
	record_missing "Mini-UX-Check"
	record_next_step "Template-Hinweise ergänzen und './start.sh --ux-check-auto' erneut starten"
	return 1
}

run_weakness_report_mode() {
	print_step "✅" "Schwachstellen-Bericht gestartet (automatischer Rest-Risiko-Check)."
	local issues=0

	if ! command -v ruff >/dev/null 2>&1; then
		print_step "⚠️" "Schwachstelle: Optionaler Python-Lint (ruff) ist noch nicht aktiv."
		print_step "➡️" "Befehl: python3 -m pip install ruff && ruff check tools"
		record_next_step "Optionalen Ruff-Lint aktivieren, damit Python-Fehler früher sichtbar werden"
		issues=$((issues + 1))
	fi

	local browser
	for browser in chromium firefox webkit; do
		if [[ ! -f "$PROJECT_ROOT/logs/artifacts/dashboard-dialog-e2e-${browser}.png" ]]; then
			print_step "⚠️" "Schwachstelle: Browser-Artefakt für ${browser} fehlt."
			print_step "➡️" "Befehl: python3 tools/browser_e2e_test.py --browser ${browser}"
			record_next_step "Browser-E2E für ${browser} ausführen und Artefakt für die Multi-Browser-Absicherung erzeugen"
			issues=$((issues + 1))
		fi
	done

	if ! python3 "$PROJECT_ROOT/tools/visual_baseline_check.py" >/dev/null 2>&1; then
		print_step "⚠️" "Schwachstelle: Visual-Baseline weicht ab oder ist noch nicht freigegeben."
		print_step "➡️" "Befehl: python3 tools/visual_baseline_check.py"
		record_next_step "Visual-Baseline prüfen und bei gewollter UI-Änderung mit --accept-current freigeben"
		issues=$((issues + 1))
	fi

	if ! validate_theme_config; then
		print_step "⚠️" "Schwachstelle: Theme-Konfiguration ist ungültig oder leer."
		print_step "➡️" "Befehl: python3 -m json.tool config/themes.json"
		print_step "➡️" "Befehl: config/themes.json öffnen und entweder eine Theme-Liste ODER Farbobjekte pflegen"
		print_step "ℹ️" "Hilfe: Liste {'themes':['high-contrast','light','dark']} | Objekt {'themes': {'high-contrast': {'bg':'#000000','text':'#FFFFFF','primary':'#00E5FF','focus':'#FFD400'}}}"
		record_next_step "Theme-Konfiguration korrigieren und danach './start.sh --weakness-report' wiederholen"
		issues=$((issues + 1))
	else
		record_checked "Theme-Konfiguration Vollständigkeit"
	fi

	if [[ "$issues" -eq 0 ]]; then
		print_step "✅" "Keine kritischen Rest-Schwachstellen gefunden."
		record_checked "Schwachstellen-Bericht"
		record_next_step "Optional: './start.sh --full-gates' für den vollständigen Merge-Check ausführen"
		return 0
	fi

	print_step "⚠️" "Schwachstellen-Bericht abgeschlossen: ${issues} Punkt(e) mit Verbesserungspotenzial gefunden."
	record_missing "Schwachstellen ${issues}"
	return 0
}

validate_theme_config() {
	python3 - "$PROJECT_ROOT/config/themes.json" <<'PY'
from pathlib import Path
import json, sys
p = Path(sys.argv[1])
if not p.exists(): raise SystemExit("config/themes.json fehlt")
t = json.loads(p.read_text(encoding="utf-8")).get("themes")
req = {"bg", "text", "primary", "focus"}
if isinstance(t, list):
    clean = [name for name in t if isinstance(name, str) and name.strip()]
    if not clean:
        raise SystemExit("Theme-Liste ist leer oder enthält ungültige Einträge")
    print("Theme-Liste gültig")
    raise SystemExit(0)
if not isinstance(t, dict) or not t: raise SystemExit("Ungültige Theme-Struktur: erwartet Liste oder Objekt unter 'themes'")
for n, v in t.items():
    if not isinstance(v, dict): raise SystemExit(f"Theme '{n}' ist kein Objekt")
    miss = sorted(req.difference(v.keys()))
    if miss: raise SystemExit(f"Theme '{n}' fehlt: {', '.join(miss)}")
print("Theme-Objektstruktur vollständig")
PY
}

print_safe_mode_help() {
	print_step "ℹ️" "$(replace_placeholders "$(get_text "safe_help_1")")"
	print_step "ℹ️" "$(replace_placeholders "$(get_text "safe_help_2")")"
	print_step "ℹ️" "$(replace_placeholders "$(get_text "safe_help_3")")"
	print_step "ℹ️" "$(replace_placeholders "$(get_text "developer_doc_hint")")"
	record_checked "Safe-Mode Hilfeelemente"
}

run_release_check() {
	print_step "✅" "Release-Check aktiv: Vollständige Freigabeprüfung läuft."
	local failed=0
	local theme_validation_status=0

	if ! check_runtime_prerequisites; then
		failed=1
	fi
	if ! check_required_files; then
		failed=1
	fi
	if ! check_line_limit; then
		failed=1
	fi
	if ! bash -n "$PROJECT_ROOT/start.sh"; then
		print_error_with_actions "Syntaxprüfung für start.sh fehlgeschlagen."
		failed=1
	fi
	if ! ensure_tool "shfmt"; then
		failed=1
	fi
	if ! ensure_tool "shellcheck"; then
		failed=1
	fi
	if ! validate_theme_config; then
		theme_validation_status=1
		failed=1
		print_step "⚠️" "Theme-Validierung für Release fehlgeschlagen."
		print_step "➡️" "Befehl: python3 -m json.tool config/themes.json"
		print_step "➡️" "Befehl: Theme-Liste korrigieren ODER bei Farbobjekt je Theme bg/text/primary/focus ergänzen"
		record_next_step "Theme-Datei korrigieren (Liste oder Farbobjekt) und Release-Check erneut starten"
	fi

	if [[ "$theme_validation_status" -eq 0 ]]; then
		record_checked "Theme-Validierung (Release)"
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "$(get_text "release_ready")"
		record_checked "Release-Check"
		record_next_step "Release Tag setzen und anschließend ./start.sh --test ausführen"
		return 0
	fi

	print_step "⚠️" "$(get_text "release_not_ready")"
	print_step "➡️" "Schnellfix: './start.sh --repair && ./start.sh --format && ./start.sh --test && ./start.sh --release-check'"
	record_missing "Release-Check"
	record_next_step "Fehlende Punkte beheben und erneut './start.sh --release-check' ausführen"
	return 1
}

run_safe_mode() {
	print_step "⚠️" "Safe-Mode aktiv: nur Basisprüfung, keine Schreibänderung außer Log."
	print_safe_mode_help
	if check_required_files && check_line_limit; then
		print_step "✅" "Safe-Mode erfolgreich abgeschlossen."
		record_next_step "Optional: './start.sh --check' für Codequalität starten"
		return 0
	fi

	print_error_with_actions "Safe-Mode hat fehlende Pflichtdateien oder Zeilenlimit-Probleme erkannt."
	record_next_step "Nach Reparatur erneut './start.sh --safe' ausführen"
	return 1
}

main() {
	ensure_writable_log
	validate_args "$@"
	validate_next_step_limit
	validate_show_all_next_steps
	validate_priority_mode
	run_debug_hint

	case "$MODE" in
	help)
		print_help
		;;
	esac

	case "$MODE" in
	check)
		run_check_mode
		;;
	full-gates)
		run_full_gates_mode
		;;
	ux-check-auto)
		run_auto_ux_check_mode
		;;
	weakness-report)
		run_weakness_report_mode
		;;
	visual-baseline-check)
		run_visual_baseline_check_mode
		;;
	offline-pack)
		run_offline_pack_mode
		;;
	repair)
		run_repair_mode
		;;
	format)
		run_formatting
		;;
	test)
		run_tests
		;;
	autopilot)
		run_autopilot_mode
		;;
	release-check)
		run_release_check
		;;
	doctor)
		run_doctor_mode
		;;
	dashboard-guide)
		run_dashboard_guide
		;;
	dashboard-template)
		run_dashboard_template_mode
		;;
	safe)
		run_safe_mode
		;;
	start)
		run_start_mode
		;;
	help) ;;
	esac

	print_summary
	write_accessible_status_summary || true
	print_step "✅" "Routine abgeschlossen. Protokoll: ${LOG_FILE}"
}

main "$@"
