#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"
DEBUG_MODE="0"
LINE_LIMIT=1200
CHECKED_ITEMS=()
MISSING_ITEMS=()
FIXED_ITEMS=()
NEXT_STEPS=()
TEXT_JSON='{
  "help_title": "Provoware Start-Routine",
  "help_usage": "Verwendung:",
  "help_accessibility": "Barrierefreiheit: Jeder Status hat Symbol + Text, damit Hinweise nicht nur über Farbe verstanden werden.",
  "help_keyboard": "Tastatur-Hinweis: Alle Befehle sind per Enter startbar, ohne Maus.",
  "help_icon_legend": "Symbol-Legende: ✅ Erfolg, ⚠️ Hinweis, ❌ Fehler, ➡️ Aktion, ℹ️ Zusatzinfo.",
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
  "release_not_ready": "Release-Check unvollständig: Mindestens ein Pflichtkriterium fehlt noch."
}'

get_text() {
	local key="$1"
	local value
	if ! command -v python3 >/dev/null 2>&1; then
		printf '%s' "$key"
		return 0
	fi
	value="$(python3 -c 'import json,sys; print(json.loads(sys.stdin.read()).get(sys.argv[1], sys.argv[1]))' "$key" <<<"$TEXT_JSON" 2>/dev/null || true)"
	if [[ -z "$value" ]]; then
		printf '%s' "$key"
		return 0
	fi
	printf '%s' "$value"
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
	record_checked "Log-Verzeichnis"
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
	for runtime_tool in "bash" "python3" "rg"; do
		if command -v "$runtime_tool" >/dev/null 2>&1; then
			print_step "✅" "Voraussetzung verfügbar: ${runtime_tool}"
			record_checked "Voraussetzung ${runtime_tool}"
		else
			print_error_with_actions "Voraussetzung fehlt: ${runtime_tool}."
			record_missing "Voraussetzung ${runtime_tool}"
			record_next_step "Fehlendes Werkzeug '${runtime_tool}' installieren"
			missing=1
		fi
	done

	[[ $missing -eq 0 ]]
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
		print_step "✅" "Selbsttest erfolgreich (Voraussetzungen, Syntax, Pflichtdateien, Zeilenlimit ok)."
		record_checked "Selbsttest"
	else
		print_error_with_actions "Selbsttest fehlgeschlagen."
		record_next_step "./start.sh --check --debug ausführen"
		return 1
	fi
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

run_start_mode() {
	print_step "✅" "Startmodus aktiv: Check, Repair, Format, Test laufen automatisch."
	run_check_mode
	run_repair_mode
	run_formatting
	run_tests
	print_step "✅" "Start erfolgreich abgeschlossen."
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
	safe)
		run_safe_mode
		;;
	start)
		run_start_mode
		;;
	help) ;;
	esac

	print_summary
	print_step "✅" "Routine abgeschlossen. Protokoll: ${LOG_FILE}"
}

main "$@"
