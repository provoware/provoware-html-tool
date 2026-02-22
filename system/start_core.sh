#!/usr/bin/env bash

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

run_dependency_bootstrap() {
	print_step "ℹ️" "Start-Prüfung: Voraussetzungen und Qualitätswerkzeuge werden automatisch vorbereitet."
	local required_tools=("python3" "rg" "curl" "shfmt" "shellcheck")
	local tool
	local failed=0
	for tool in "${required_tools[@]}"; do
		if ensure_tool "$tool"; then
			record_checked "Bootstrap ${tool}"
		else
			failed=1
			record_missing "Bootstrap ${tool}"
			record_next_step "Fehlendes Werkzeug '${tool}' installieren und danach './start.sh --repair' ausführen"
		fi
	done

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "Start-Prüfung abgeschlossen: Alle benötigten Werkzeuge sind einsatzbereit."
		record_fixed "Werkzeuge automatisch bestätigt"
		return 0
	fi

	print_step "⚠️" "Start-Prüfung unvollständig: Mindestens ein Werkzeug fehlt noch."
	print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen und danach './start.sh --check --debug' starten."
	return 1
}
