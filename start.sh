#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"
DEBUG_MODE="0"
LINE_LIMIT=1200
STATUS_SUMMARY_FILE=""
TEXT_CONFIG_FILE="${PROJECT_ROOT}/config/messages.json"
THEME_CONFIG_FILE="${PROJECT_ROOT}/config/themes.json"
CHECKED_ITEMS=()
MISSING_ITEMS=()
FIXED_ITEMS=()
NEXT_STEPS=()
DEFAULT_TEXT_JSON='{
  "help_title": "Provoware Start-Routine",
  "help_usage": "Verwendung:",
  "help_doctor": "Doctor-Modus: Zeigt konkrete Verbesserungen mit vollständigen Befehlen.",
  "help_accessibility": "Barrierefreiheit: Jeder Status hat Symbol + Text, damit Hinweise nicht nur über Farbe verstanden werden.",
  "help_keyboard": "Tastatur-Hinweis: Alle Befehle sind per Enter startbar, ohne Maus.",
  "help_icon_legend": "Symbol-Legende: ✅ Erfolg, ⚠️ Hinweis, ❌ Fehler, ➡️ Aktion, ℹ️ Zusatzinfo.",
  "help_message_source": "Textquelle: Externe Datei config/messages.json wird genutzt, sonst sichere Standardtexte.",
  "help_full_gates": "Voll-Gates: Führt die vier Pflicht-Gates in fixer Reihenfolge aus und stoppt bei Fehlern mit klaren Next Steps.",
  "help_status_summary": "Statusbericht: Legt logs/status_summary.txt in einfacher Sprache für Screenreader an.",
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
  "doctor_quality": "Codequalität verbessern: ./start.sh --format && ./start.sh --test",
  "doctor_release": "Release-Reife prüfen: ./start.sh --release-check",
  "dashboard_intro": "Dashboard-Guide: So wird eine Oberfläche laienfreundlich, barrierefrei und klar bedienbar.",
  "dashboard_layout": "Layout-Regel: Oben Status, Mitte wichtigste Aufgaben, unten Hilfe + nächste Schritte.",
  "dashboard_accessibility": "Barrierefreiheit-Regel: Hoher Kontrast, große Klickflächen, Fokusrahmen und klare Sprache.",
  "dashboard_feedback": "Feedback-Regel: Jede Aktion zeigt sofort Ergebnis + nächsten Schritt in einfacher Sprache."
}'
TEXT_JSON_CACHE=""
THEME_LIST_CACHE=""

DEFAULT_THEMES_CSV="high-contrast,light,dark"

load_text_json() {
	if [[ -n "$TEXT_JSON_CACHE" ]]; then
		printf '%s' "$TEXT_JSON_CACHE"
		return 0
	fi

	local candidate_json="$DEFAULT_TEXT_JSON"
	if [[ -f "$TEXT_CONFIG_FILE" ]]; then
		if command -v python3 >/dev/null 2>&1 && python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "$TEXT_CONFIG_FILE" >/dev/null 2>&1; then
			candidate_json="$(cat "$TEXT_CONFIG_FILE")"
			record_checked "Textkonfiguration geladen"
		else
			record_missing "Textkonfiguration ungültig"
			record_next_step "Konfigurationsdatei config/messages.json prüfen und erneut versuchen"
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

print_help() {
	cat <<TXT
$(get_text "help_title")

$(get_text "help_usage")
  ./start.sh             Normaler Start mit Check, Reparatur, Formatierung und Test
  ./start.sh --check     Nur automatische Prüfungen ausführen
  ./start.sh --repair    Nur automatische Reparaturen ausführen
  ./start.sh --format    Nur Formatierung ausführen
  ./start.sh --test      Nur Tests ausführen
  ./start.sh --safe      Safe-Mode: nur Basis-Checks + klare Hilfehinweise
  ./start.sh --doctor    Verbesserungsbericht mit klaren Befehlen anzeigen
  ./start.sh --dashboard-guide Laien-Guide für ein perfektes Dashboard anzeigen
  ./start.sh --dashboard-template Konkrete Dashboard-Musterseite als HTML-Template bereitstellen
  ./start.sh --full-gates Vollständige Gates 1-4 strikt nacheinander ausführen
  ./start.sh --ux-check-auto Automatischer Mini-UX-Check für Texte, Next Steps und A11y-Marker
  ./start.sh --release-check Vollständiger Release-Check mit klaren nächsten Schritten
  ./start.sh --debug     Zusätzliche Debug-Hinweise im Protokoll
  ./start.sh --help      Hilfe anzeigen

Einfache Begriffe:
  Check (Prüfung) = automatische Kontrolle
  Repair (Reparatur) = automatische Behebung
  Format = einheitliche Schreibweise im Code
  Test = kurzer Selbsttest mit Erfolg/Fehler-Ausgabe

$(get_text "help_accessibility")
$(get_text "help_keyboard")
$(get_text "help_icon_legend")
$(get_text "help_message_source")
$(get_text "help_full_gates")
$(get_text "help_status_summary")
$(get_text "help_doctor")
$(get_text "release_help")
TXT
}

print_step() {
	local icon="$1"
	local text="$2"
	printf '%s %s\n' "$icon" "$text" | tee -a "$LOG_FILE"
}

record_checked() {
	CHECKED_ITEMS+=("$1")
}

record_missing() {
	MISSING_ITEMS+=("$1")
}

record_fixed() {
	FIXED_ITEMS+=("$1")
}

record_next_step() {
	NEXT_STEPS+=("$1")
}

replace_placeholders() {
	local template="$1"
	template="${template//\{\{LOG_FILE\}\}/$LOG_FILE}"
	template="${template//\{\{LIMIT\}\}/$LINE_LIMIT}"
	printf '%s' "$template"
}

print_error_with_actions() {
	local cause="$1"
	print_step "❌" "${cause}"
	print_step "➡️" "$(replace_placeholders "$(get_text "error_retry")")"
	print_step "➡️" "$(replace_placeholders "$(get_text "error_repair")")"
	print_step "➡️" "$(replace_placeholders "$(get_text "error_log")")"
	print_step "➡️" "$(replace_placeholders "$(get_text "error_debug")")"
}

print_summary() {
	local checked_text="${CHECKED_ITEMS[*]:-keine}"
	local missing_text="${MISSING_ITEMS[*]:-nichts}"
	local fixed_text="${FIXED_ITEMS[*]:-nichts}"
	print_step "📋" "Geprüft: ${checked_text}"
	print_step "📋" "Fehlt: ${missing_text}"
	print_step "📋" "Automatisch gelöst: ${fixed_text}"
	if [[ ${#NEXT_STEPS[@]} -gt 0 ]]; then
		local step
		for step in "${NEXT_STEPS[@]}"; do
			print_step "➡️" "Nächster Schritt: ${step}"
		done
	else
		print_step "➡️" "Nächster Schritt: Bei Bedarf './start.sh --debug' für Details nutzen."
	fi
}

ensure_writable_log() {
	mkdir -p "$LOG_DIR"
	: >"$LOG_FILE"
	STATUS_SUMMARY_FILE="${LOG_DIR}/status_summary.txt"
	: >"$STATUS_SUMMARY_FILE"
	record_checked "Log-Verzeichnis"
}

write_accessible_status_summary() {
	if [[ -z "$STATUS_SUMMARY_FILE" || ! "$STATUS_SUMMARY_FILE" =~ ^/ ]]; then
		print_error_with_actions "Statusbericht-Pfad ist ungültig."
		record_next_step "Startskript ohne geänderte Umgebungsvariablen erneut ausführen"
		return 1
	fi

	{
		printf 'Provoware Statusbericht\n'
		printf 'Geprueft: %s\n' "${CHECKED_ITEMS[*]:-keine}"
		printf 'Fehlt: %s\n' "${MISSING_ITEMS[*]:-nichts}"
		printf 'Automatisch geloest: %s\n' "${FIXED_ITEMS[*]:-nichts}"
		if [[ ${#NEXT_STEPS[@]} -gt 0 ]]; then
			printf 'Naechste Schritte:\n'
			local step
			for step in "${NEXT_STEPS[@]}"; do
				printf -- '- %s\n' "$step"
			done
		else
			printf 'Naechster Schritt: Bei Bedarf ./start.sh --debug nutzen.\n'
		fi
	} >"$STATUS_SUMMARY_FILE"

	if [[ -s "$STATUS_SUMMARY_FILE" ]]; then
		print_step "✅" "Statusbericht erstellt: ${STATUS_SUMMARY_FILE}"
		record_checked "Statusbericht"
		return 0
	fi

	print_error_with_actions "Statusbericht konnte nicht geschrieben werden."
	record_next_step "Schreibrechte im Ordner logs prüfen und Start erneut ausführen"
	return 1
}

validate_args() {
	if [[ $# -gt 2 ]]; then
		print_error_with_actions "Zu viele Parameter. Bitte maximal eine Modus-Option und optional --debug nutzen."
		return 1
	fi

	local mode_count=0
	local debug_count=0

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
		--ux-check-auto)
			MODE="ux-check-auto"
			mode_count=$((mode_count + 1))
			;;
		--debug)
			DEBUG_MODE="1"
			debug_count=$((debug_count + 1))
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
	local install_attempted="0"
	if command -v apt-get >/dev/null 2>&1; then
		install_attempted="1"
		if apt-get update >/dev/null 2>&1 && apt-get install -y "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über apt-get installiert."
			record_fixed "$tool_name via apt-get"
			return 0
		fi
		print_step "⚠️" "apt-get konnte ${tool_name} nicht installieren."
		record_next_step "Bei apt-get-Fehlern zuerst './start.sh --check --debug' ausführen"
	fi

	if command -v brew >/dev/null 2>&1; then
		install_attempted="1"
		if brew install "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über Homebrew installiert."
			record_fixed "$tool_name via brew"
			return 0
		fi
		print_step "⚠️" "Homebrew konnte ${tool_name} nicht installieren."
		record_next_step "Bei brew-Fehlern zuerst './start.sh --check --debug' ausführen"
	fi

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
	for file in "README.md" "todo.txt" "CHANGELOG.md" "data/version_registry.json"; do
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
	for runtime_tool in "bash" "python3" "rg" "curl"; do
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
		print_step "ℹ️" "Hilfe: Voraussetzungen sind bereit. Bei neuen Fehlern zuerst './start.sh --repair' ausführen."
		record_checked "Voraussetzungen vollständig"
		return 0
	fi

	return 1
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
	done < <(cd "$PROJECT_ROOT" && rg --files)

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
		if shellcheck "$PROJECT_ROOT/start.sh"; then
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
}

run_tests() {
	print_step "✅" "Schnelltest gestartet: Voraussetzungen + Syntax + Pflichtdateien + Zeilenlimit."
	if check_runtime_prerequisites && bash -n "$PROJECT_ROOT/start.sh" && check_required_files && check_line_limit; then
		if [[ -s "$LOG_FILE" ]]; then
			print_step "✅" "Selbsttest erfolgreich (Voraussetzungen, Syntax, Pflichtdateien, Zeilenlimit ok)."
			record_checked "Testausgabe vorhanden"
		else
			print_error_with_actions "Selbsttest lieferte keine Protokollausgabe."
			record_next_step "Erneut './start.sh --test --debug' ausführen und Log prüfen"
			return 1
		fi
		record_checked "Selbsttest"
	else
		print_error_with_actions "Selbsttest fehlgeschlagen."
		record_next_step "./start.sh --check --debug ausführen"
		return 1
	fi
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
	print_step "ℹ️" "Farben: Standardmäßig high-contrast nutzen; optional light/dark als Auswahl anbieten."
	print_step "ℹ️" "Struktur: 1 Hauptaktion pro Bereich, maximal 5 Hauptpunkte pro Bildschirm, klare Überschriften."
	print_step "ℹ️" "Eingabeprüfung: Pflichtfelder sofort prüfen und bei Fehlern konkrete Lösungen anzeigen."
	print_step "ℹ️" "Output-Bestätigung: Nach jeder Aktion sichtbar bestätigen (z. B. 'Gespeichert um 10:42 Uhr')."
	print_step "➡️" "Vollständige Befehle: './start.sh --check', './start.sh --repair', './start.sh --test', './start.sh --release-check'"
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

run_check_mode() {
	print_step "✅" "Check-Modus aktiv."
	check_runtime_prerequisites
	check_required_files
	check_line_limit
	run_quality_checks
}

run_repair_mode() {
	print_step "✅" "Repair-Modus aktiv."
	ensure_tool "shfmt" || true
	ensure_tool "shellcheck" || true
	print_step "✅" "Repair-Modus abgeschlossen."
}

launch_local_gui() {
	local gui_port="${GUI_PORT:-8765}"
	if [[ ! "$gui_port" =~ ^[0-9]+$ ]] || [[ "$gui_port" -lt 1024 ]] || [[ "$gui_port" -gt 65535 ]]; then
		print_error_with_actions "Ungültiger GUI_PORT '${gui_port}'. Erlaubt sind Zahlen von 1024 bis 65535."
		record_next_step "GUI_PORT korrigieren, z. B. 'GUI_PORT=8765 ./start.sh'"
		return 1
	fi

	local gui_theme="${GUI_THEME:-high-contrast}"
	if ! is_allowed_theme "$gui_theme"; then
		print_error_with_actions "Ungültiges GUI_THEME '${gui_theme}'. Erlaubte Werte laut config/themes.json oder Standard: $(load_theme_list_csv)."
		record_next_step "GUI_THEME setzen, z. B. 'GUI_THEME=high-contrast ./start.sh'"
		return 1
	fi
	record_checked "GUI-Theme ${gui_theme}"

	local bg_color="#0b0f14"
	local text_color="#ffffff"
	local panel_color="#101820"
	local border_color="#ffffff"
	local focus_color="#ffd60a"
	local ok_color="#74f2ce"
	local warn_color="#ffe08a"
	if [[ "$gui_theme" == "light" ]]; then
		bg_color="#f8fafc"
		text_color="#0f172a"
		panel_color="#ffffff"
		border_color="#0f172a"
		focus_color="#1d4ed8"
		ok_color="#0f766e"
		warn_color="#92400e"
	fi
	if [[ "$gui_theme" == "dark" ]]; then
		bg_color="#111827"
		text_color="#f9fafb"
		panel_color="#1f2937"
		border_color="#93c5fd"
		focus_color="#f59e0b"
		ok_color="#34d399"
		warn_color="#fbbf24"
	fi

	if ! command -v python3 >/dev/null 2>&1; then
		print_error_with_actions "GUI-Start nicht möglich, weil python3 fehlt."
		record_next_step "'./start.sh --repair' starten, damit fehlende Werkzeuge automatisch installiert werden"
		return 1
	fi

	local gui_dir="${LOG_DIR}/gui"
	local gui_file="${gui_dir}/index.html"
	local gui_pid_file="${gui_dir}/server.pid"
	mkdir -p "$gui_dir"
	cat >"$gui_file" <<-HTML
		<!doctype html>
		<html lang="de">
		<head>
		  <meta charset="utf-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1">
		  <title>Provoware GUI Startstatus</title>
		  <style>
		    :root { color-scheme: light dark; }
		    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; background: ${bg_color}; color: ${text_color}; }
		    .panel { max-width: 760px; border: 3px solid ${border_color}; border-radius: 12px; padding: 1rem 1.25rem; background: ${panel_color}; }
		    .badge-ok { display: inline-block; border: 2px solid ${ok_color}; color: ${ok_color}; padding: .1rem .5rem; border-radius: 999px; font-weight: 700; }
		    .badge-warn { display: inline-block; border: 2px solid ${warn_color}; color: ${warn_color}; padding: .1rem .5rem; border-radius: 999px; font-weight: 700; }
		    a, button { font-size: 1rem; color: inherit; }
		    a:focus-visible, button:focus-visible { outline: 3px solid ${focus_color}; outline-offset: 3px; border-radius: 4px; }
		    .hint { margin-top: 1rem; }
		  </style>
		</head>
		<body>
		  <main class="panel" role="main" aria-live="polite">
		    <h1>✅ Provoware ist gestartet</h1>
		    <p><span class="badge-ok">Status: OK</span> <span class="badge-warn">Theme: ${gui_theme}</span></p>
		    <p><strong>Was geprüft wurde:</strong> Check, Repair, Format und Test wurden automatisch ausgeführt.</p>
		    <p><strong>Hilfe (Help = Unterstützung):</strong> Theme kann mit <code>GUI_THEME=light|dark|high-contrast</code> gewählt werden.</p>
		    <p><strong>Nutzerhilfe:</strong> Bei Problemen zuerst "Erneut versuchen", dann "Reparatur starten", danach "Protokoll öffnen".</p>
		    <ul>
		      <li>➡️ Erneut versuchen: <code>./start.sh</code></li>
		      <li>➡️ Reparatur starten: <code>./start.sh --repair</code></li>
		      <li>➡️ Protokoll öffnen: <code>cat logs/start.log</code></li>
		    </ul>
		    <p class="hint">Diese GUI ist tastaturfreundlich (Tab + Enter), nutzt Status nicht nur über Farben und bietet ein Kontrast-Theme für gute Lesbarkeit.</p>
		  </main>
		</body>
		</html>
	HTML
	record_checked "GUI-Datei erzeugt"

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
	if command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$gui_url" >/dev/null 2>&1 || true
		print_step "✅" "GUI im Browser geöffnet: ${gui_url}"
	elif command -v open >/dev/null 2>&1; then
		open "$gui_url" >/dev/null 2>&1 || true
		print_step "✅" "GUI im Browser geöffnet: ${gui_url}"
	else
		print_step "⚠️" "Kein Browser-Öffner gefunden. GUI manuell öffnen: ${gui_url}"
		record_next_step "URL im Browser öffnen: ${gui_url}"
	fi

	return 0
}

run_start_mode() {
	print_step "✅" "Startmodus aktiv: Check, Repair, Format, Test laufen automatisch."
	run_check_mode
	run_repair_mode
	run_formatting
	run_tests
	launch_local_gui || true
	print_step "✅" "Start erfolgreich abgeschlossen."
}

run_full_gates_mode() {
	print_step "✅" "Full-Gates-Modus aktiv: Gates 1-4 werden strikt ausgeführt."
	local failed=0

	print_step "ℹ️" "GATE 1: python -m compileall -q ."
	if python -m compileall -q "$PROJECT_ROOT"; then
		print_step "✅" "GATE 1 erfolgreich."
		record_checked "GATE 1"
	else
		print_error_with_actions "GATE 1 fehlgeschlagen."
		record_next_step "Syntaxfehler beheben und './start.sh --full-gates' erneut starten"
		failed=1
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 2: bash tools/run_quality_checks.sh"
		if bash "$PROJECT_ROOT/tools/run_quality_checks.sh"; then
			print_step "✅" "GATE 2 erfolgreich."
			record_checked "GATE 2"
		else
			print_error_with_actions "GATE 2 fehlgeschlagen."
			record_next_step "Quality-Hinweise beheben und './start.sh --full-gates' erneut starten"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "ℹ️" "GATE 3: python tools/smoke_test.py"
		if SKIP_FULL_GATES=1 python "$PROJECT_ROOT/tools/smoke_test.py"; then
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
		if bash "$PROJECT_ROOT/start.sh" --check; then
			print_step "✅" "GATE 4 erfolgreich."
			record_checked "GATE 4"
		else
			print_error_with_actions "GATE 4 fehlgeschlagen."
			record_next_step "Startausgabe prüfen und './start.sh --check --debug' ausführen"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "Alle automatischen Gates 1-4 erfolgreich abgeschlossen."
		record_next_step "Für Gate 5 jetzt 2 Minuten Mini-UX-Check manuell durchführen"
		return 0
	fi

	print_step "⚠️" "Full-Gates-Modus beendet mit mindestens einem Fehler."
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

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "$(get_text "release_ready")"
		record_checked "Release-Check"
		record_next_step "Release Tag setzen und anschließend ./start.sh --test ausführen"
		return 0
	fi

	print_step "⚠️" "$(get_text "release_not_ready")"
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
	repair)
		run_repair_mode
		;;
	format)
		run_formatting
		;;
	test)
		run_tests
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
