#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"
DEBUG_MODE="0"
CHECKED_ITEMS=()
MISSING_ITEMS=()
FIXED_ITEMS=()
NEXT_STEPS=()

print_help() {
	cat <<'TXT'
Provoware Start-Routine

Verwendung:
  ./start.sh             Normaler Start mit Check, Reparatur, Formatierung und Test
  ./start.sh --check     Nur automatische Prüfungen ausführen
  ./start.sh --repair    Nur automatische Reparaturen ausführen
  ./start.sh --format    Nur Formatierung ausführen
  ./start.sh --test      Nur Tests ausführen
  ./start.sh --safe      Safe-Mode: nur Basis-Checks + klare Hilfehinweise
  ./start.sh --debug     Zusätzliche Debug-Hinweise im Protokoll
  ./start.sh --help      Hilfe anzeigen

Einfache Begriffe:
  Check (Prüfung) = automatische Kontrolle
  Repair (Reparatur) = automatische Behebung
  Format = einheitliche Schreibweise im Code
  Test = kurzer Selbsttest mit Erfolg/Fehler-Ausgabe
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

print_error_with_actions() {
	local cause="$1"
	print_step "❌" "${cause}"
	print_step "➡️" "Erneut versuchen: Befehl mit denselben Optionen erneut starten."
	print_step "➡️" "Reparatur starten: ./start.sh --repair"
	print_step "➡️" "Protokoll öffnen: cat ${LOG_FILE}"
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

	for arg in "$@"; do
		case "$arg" in
		--check) MODE="check" ;;
		--repair) MODE="repair" ;;
		--format) MODE="format" ;;
		--test) MODE="test" ;;
		--safe) MODE="safe" ;;
		--help | -h) MODE="help" ;;
		--debug) DEBUG_MODE="1" ;;
		*)
			print_error_with_actions "Unbekannte Option '$arg'."
			record_next_step "./start.sh --help ausführen"
			return 1
			;;
		esac
	done

	print_step "✅" "Eingabeprüfung abgeschlossen (Modus: ${MODE}, Debug: ${DEBUG_MODE})."
	record_checked "Eingabeparameter"
}

run_debug_hint() {
	if [[ "$DEBUG_MODE" == "1" ]]; then
		print_step "ℹ️" "Debug aktiv: Zusätzliche Fehlersuche-Infos werden geschrieben."
		record_checked "Debug-Hinweise"
	fi
}

try_auto_install_tool() {
	local tool_name="$1"

	print_step "⚠️" "${tool_name} fehlt. Automatische Reparatur wird versucht."
	record_missing "$tool_name"
	if command -v apt-get >/dev/null 2>&1; then
		if apt-get update >/dev/null 2>&1 && apt-get install -y "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über apt-get installiert."
			record_fixed "$tool_name via apt-get"
			return 0
		fi
	fi

	if command -v brew >/dev/null 2>&1; then
		if brew install "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über Homebrew installiert."
			record_fixed "$tool_name via brew"
			return 0
		fi
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
	print_step "✅" "Schnelltest gestartet: Syntax + Pflichtdateien."
	if bash -n "$PROJECT_ROOT/start.sh" && check_required_files; then
		print_step "✅" "Selbsttest erfolgreich (Syntax und Pflichtdateien ok)."
		record_checked "Selbsttest"
	else
		print_error_with_actions "Selbsttest fehlgeschlagen."
		record_next_step "./start.sh --check --debug ausführen"
		return 1
	fi
}

run_check_mode() {
	print_step "✅" "Check-Modus aktiv."
	check_required_files
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
	print_step "ℹ️" "Safe-Mode Hilfe: Dieser Modus zeigt nur sichere Prüfungen und klare nächste Schritte."
	print_step "ℹ️" "Wiederherstellung: Starten Sie danach './start.sh --repair', damit fehlende Werkzeuge automatisch nachinstalliert werden."
	print_step "ℹ️" "Protokoll-Nutzung: Öffnen Sie Details mit 'cat ${LOG_FILE}' und teilen Sie die letzte Fehlermeldung."
	record_checked "Safe-Mode Hilfeelemente"
}

run_safe_mode() {
	print_step "⚠️" "Safe-Mode aktiv: nur Basisprüfung, keine Schreibänderung außer Log."
	print_safe_mode_help
	if check_required_files; then
		print_step "✅" "Safe-Mode erfolgreich abgeschlossen."
		record_next_step "Optional: './start.sh --check' für Codequalität starten"
		return 0
	fi

	print_error_with_actions "Safe-Mode hat fehlende Pflichtdateien erkannt."
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
