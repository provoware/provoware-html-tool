#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/start.log"
MODE="start"
DEBUG_MODE="0"

print_help() {
	cat <<'TXT'
Provoware Start-Routine

Verwendung:
  ./start.sh             Normaler Start mit Checks, Formatierung und Tests
  ./start.sh --check     Nur automatische Prüfungen (ohne Start)
  ./start.sh --safe      Safe-Mode: nur Basis-Checks + klare Hilfehinweise
  ./start.sh --debug     Normaler Start mit zusätzlichen Debug-Hinweisen im Log
  ./start.sh --help      Hilfe anzeigen

Einfache Begriffe:
  Check = automatische Prüfung
  Debug = detaillierte Fehlersuche mit mehr Infos
TXT
}

print_step() {
	local icon="$1"
	local text="$2"
	printf '%s %s\n' "$icon" "$text" | tee -a "$LOG_FILE"
}

ensure_writable_log() {
	mkdir -p "$LOG_DIR"
	: >"$LOG_FILE"
}

validate_args() {
	if [[ $# -gt 2 ]]; then
		print_step "❌" "Zu viele Parameter. Next Step: Bitte maximal eine Modus-Option und optional --debug verwenden."
		return 1
	fi

	for arg in "$@"; do
		case "$arg" in
		--check) MODE="check" ;;
		--safe) MODE="safe" ;;
		--help | -h) MODE="help" ;;
		--debug) DEBUG_MODE="1" ;;
		*)
			print_step "❌" "Unbekannte Option '$arg'. Next Step: ./start.sh --help ausführen."
			return 1
			;;
		esac
	done

	print_step "✅" "Eingabeprüfung abgeschlossen (Modus: ${MODE}, Debug: ${DEBUG_MODE})."
}

run_debug_hint() {
	if [[ "$DEBUG_MODE" == "1" ]]; then
		print_step "ℹ️" "Debug aktiv: Bei Fehlern stehen unten zusätzliche Lösungswege in einfacher Sprache."
	fi
}

try_auto_install_tool() {
	local tool_name="$1"

	print_step "⚠️" "${tool_name} fehlt. Automatische Reparatur wird versucht."
	if command -v apt-get >/dev/null 2>&1; then
		if apt-get update >/dev/null 2>&1 && apt-get install -y "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über apt-get installiert."
			return 0
		fi
	fi

	if command -v brew >/dev/null 2>&1; then
		if brew install "$tool_name" >/dev/null 2>&1; then
			print_step "✅" "${tool_name} wurde über Homebrew installiert."
			return 0
		fi
	fi

	print_step "⚠️" "Automatische Reparatur für ${tool_name} nicht erfolgreich. Next Steps: 1) Netzwerk prüfen 2) '${tool_name}' manuell installieren 3) './start.sh --check --debug' erneut starten."
	return 1
}

ensure_tool() {
	local tool_name="$1"

	if command -v "$tool_name" >/dev/null 2>&1; then
		print_step "✅" "Werkzeug verfügbar: ${tool_name}"
		return 0
	fi

	try_auto_install_tool "$tool_name" || true
	if command -v "$tool_name" >/dev/null 2>&1; then
		print_step "✅" "Werkzeug nach Reparatur verfügbar: ${tool_name}"
		return 0
	fi

	print_step "⚠️" "${tool_name} weiterhin nicht verfügbar. Prüfung läuft ohne diesen Schritt weiter."
	return 1
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
	if ensure_tool "shfmt"; then
		shfmt -w "$PROJECT_ROOT/start.sh"
		print_step "✅" "Formatierung erfolgreich (shfmt)."
	fi
}

run_quality_checks() {
	if ensure_tool "shellcheck"; then
		if shellcheck "$PROJECT_ROOT/start.sh"; then
			print_step "✅" "Codequalität geprüft (shellcheck ohne Fehler)."
		else
			print_step "❌" "shellcheck meldet Probleme. Next Step: Hinweise ausgeben lassen und danach erneut starten."
			return 1
		fi
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
	run_tests
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
	run_debug_hint

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
