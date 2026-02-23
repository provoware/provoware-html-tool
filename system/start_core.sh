#!/usr/bin/env bash

print_step() {
	local icon="$1"
	local text="$2"
	printf '%s %s\n' "$icon" "$text" | tee -a "$LOG_FILE"
}

print_section() {
	local title="$1"
	if [[ -z "$title" ]]; then
		print_error_with_actions "Abschnittstitel fehlt."
		record_next_step "Startskript erneut ohne geänderte Parameter ausführen"
		return 1
	fi
	print_step "🧭" "──────── ${title} ────────"
	return 0
}

print_command_hint() {
	local label="$1"
	local command_text="$2"
	if [[ -z "$label" || -z "$command_text" ]]; then
		print_error_with_actions "Befehlshinweis unvollständig."
		record_next_step "Hilfe mit './start.sh --help' prüfen und danach erneut starten"
		return 1
	fi
	print_step "➡️" "${label}: ${command_text}"
	return 0
}

is_valid_record_text() {
	local value="$1"
	if [[ -z "$value" ]] || [[ "$value" =~ [[:cntrl:]] ]]; then
		return 1
	fi
	return 0
}

append_unique_item() {
	local item="$1"
	shift
	local -n target_array="$1"

	if ! is_valid_record_text "$item"; then
		print_step "⚠️" "Interner Statushinweis wurde verworfen (leer oder ungültige Zeichen)."
		return 1
	fi

	local existing
	for existing in "${target_array[@]}"; do
		if [[ "$existing" == "$item" ]]; then
			return 0
		fi
	done

	target_array+=("$item")
	return 0
}

record_checked() {
	append_unique_item "$1" CHECKED_ITEMS
}

record_missing() {
	append_unique_item "$1" MISSING_ITEMS
}

record_fixed() {
	append_unique_item "$1" FIXED_ITEMS
}

record_next_step() {
	local step_text="$1"
	if ! is_valid_record_text "$step_text"; then
		print_step "⚠️" "Interner Next-Step-Hinweis wurde verworfen (leer oder ungültige Zeichen)."
		return 1
	fi

	if [[ ! "${NEXT_STEP_LIMIT:-}" =~ ^[0-9]+$ ]] || [[ "${NEXT_STEP_LIMIT:-0}" -lt 1 ]]; then
		NEXT_STEP_LIMIT=8
	fi

	if append_unique_item "$step_text" NEXT_STEPS; then
		if [[ ${#NEXT_STEPS[@]} -gt "$NEXT_STEP_LIMIT" ]]; then
			local overflow_index=$((NEXT_STEP_LIMIT))
			local overflow_item="${NEXT_STEPS[$overflow_index]}"
			NEXT_STEPS=("${NEXT_STEPS[@]:0:$NEXT_STEP_LIMIT}")
			if [[ -n "$overflow_item" ]]; then
				append_unique_item "$overflow_item" HIDDEN_NEXT_STEPS || true
			fi
			NEXT_STEPS_OVERFLOW=1
		fi
		return 0
	fi
	return 1
}

replace_placeholders() {
	local template="$1"
	template="${template//\{\{LOG_FILE\}\}/$LOG_FILE}"
	template="${template//\{\{LIMIT\}\}/$LINE_LIMIT}"
	template="${template//\{\{STATUS_SUMMARY_FILE\}\}/${STATUS_SUMMARY_FILE:-logs/status_summary.txt}}"
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
	local checked_count="${#CHECKED_ITEMS[@]}"
	local missing_count="${#MISSING_ITEMS[@]}"
	local fixed_count="${#FIXED_ITEMS[@]}"
	local next_count="${#NEXT_STEPS[@]}"
	print_step "🧾" "Kurzstatus: ${checked_count} geprüft, ${fixed_count} automatisch gelöst, ${missing_count} offen."
	print_step "📋" "Geprüft: ${checked_text}"
	print_step "📋" "Fehlt: ${missing_text}"
	print_step "📋" "Automatisch gelöst: ${fixed_text}"
	if [[ "$missing_count" -gt 0 ]]; then
		print_step "⚠️" "Es sind noch offene Punkte vorhanden. Für Release-Reife jetzt './start.sh --release-check' nutzen."
	fi
	if [[ ${#NEXT_STEPS[@]} -gt 0 ]]; then
		print_step "ℹ️" "$(get_text "summary_priority_title")"
		local step
		local step_index=0
		for step in "${NEXT_STEPS[@]}"; do
			step_index=$((step_index + 1))
			print_step "➡️" "Nächster Schritt ${step_index}: ${step}"
		done
		if [[ "${NEXT_STEPS_OVERFLOW:-0}" -eq 1 ]] || [[ ${#HIDDEN_NEXT_STEPS[@]} -gt 0 ]]; then
			if [[ "${SHOW_ALL_NEXT_STEPS:-0}" == "1" ]]; then
				print_step "ℹ️" "$(get_text "summary_more_hints_expanded")"
				local hidden_step
				for hidden_step in "${HIDDEN_NEXT_STEPS[@]}"; do
					print_step "➡️" "Weitere Hinweise: ${hidden_step}"
				done
			else
				print_step "ℹ️" "$(get_text "summary_more_hints_collapsed")"
				print_step "➡️" "$(replace_placeholders "$(get_text "summary_more_hints_next_step")")"
			fi
		fi
	else
		print_step "➡️" "Nächster Schritt: Bei Bedarf './start.sh --debug' für Details nutzen."
	fi
	print_step "ℹ️" "Zusammenfassung gespeichert für Konsole/Screenreader: ${STATUS_SUMMARY_FILE:-logs/status_summary.txt}"
	print_step "ℹ️" "Next-Step-Zähler: ${next_count}"
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
			local step_index=0
			for step in "${NEXT_STEPS[@]}"; do
				step_index=$((step_index + 1))
				printf -- '- Schritt %s: %s\n' "$step_index" "$step"
			done
			if [[ "${NEXT_STEPS_OVERFLOW:-0}" -eq 1 ]] || [[ ${#HIDDEN_NEXT_STEPS[@]} -gt 0 ]]; then
				if [[ "${SHOW_ALL_NEXT_STEPS:-0}" == "1" ]]; then
					printf 'Weitere Hinweise (vollstaendig):\n'
				else
					printf 'Weitere Hinweise (gebuendelt):\n'
				fi
				local hidden_step
				for hidden_step in "${HIDDEN_NEXT_STEPS[@]}"; do
					printf -- '- %s\n' "$hidden_step"
				done
				if [[ "${SHOW_ALL_NEXT_STEPS:-0}" == "1" ]]; then
					printf 'Hinweis: Vollstaendige Hinweise wurden direkt ausgegeben.\n'
				else
					printf '%s\n' "$(replace_placeholders "$(get_text "summary_more_hints_status_tip")")"
				fi
			fi
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

	if command -v python3 >/dev/null 2>&1; then
		if python3 -c 'import playwright' >/dev/null 2>&1; then
			print_step "✅" "Playwright-Python-Modul verfügbar (Browser-Automation für Tests)."
			record_checked "Playwright Modul"
		else
			print_step "⚠️" "Playwright-Python-Modul fehlt. Offline-freundlicher Installationspfad wird vorbereitet."
			record_missing "Playwright Modul"
			record_next_step "Online vorbereiten: python3 -m pip download playwright -d data/offline_wheels"
			record_next_step "Offline installieren: python3 -m pip install --no-index --find-links data/offline_wheels playwright"
			failed=1
		fi

		local pw_cache_dir="${PLAYWRIGHT_BROWSERS_PATH:-${PROJECT_ROOT}/data/playwright-browsers}"
		if [[ -d "$pw_cache_dir" ]] && find "$pw_cache_dir" -mindepth 1 -maxdepth 2 -type d | head -n 1 >/dev/null 2>&1; then
			print_step "✅" "Playwright-Browsercache gefunden: ${pw_cache_dir}"
			record_checked "Playwright Browsercache"
		else
			print_step "⚠️" "Playwright-Browsercache fehlt oder ist leer: ${pw_cache_dir}"
			record_missing "Playwright Browsercache"
			record_next_step "Online vorbereiten: PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 -m playwright install chromium"
			record_next_step "Offline nutzen: PLAYWRIGHT_BROWSERS_PATH=data/playwright-browsers python3 tools/browser_e2e_test.py"
			failed=1
		fi
	fi

	if [[ "$failed" -eq 0 ]]; then
		print_step "✅" "Start-Prüfung abgeschlossen: Alle benötigten Werkzeuge sind einsatzbereit."
		record_fixed "Werkzeuge automatisch bestätigt"
		return 0
	fi

	print_step "⚠️" "Start-Prüfung unvollständig: Mindestens ein Werkzeug fehlt noch."
	print_step "➡️" "Nächster Schritt: './start.sh --repair' ausführen und danach './start.sh --check --debug' starten."
	return 1
}

load_dependency_json() {
	if [[ -n "${DEPENDENCY_JSON_CACHE:-}" ]]; then
		printf '%s' "$DEPENDENCY_JSON_CACHE"
		return 0
	fi
	local candidate_json="$DEFAULT_DEPENDENCY_JSON"
	if [[ -f "$DEPENDENCY_CONFIG_FILE" ]] && command -v python3 >/dev/null 2>&1 && python3 -c 'import json,sys; json.load(open(sys.argv[1], encoding="utf-8"))' "$DEPENDENCY_CONFIG_FILE" >/dev/null 2>&1; then
		candidate_json="$(cat "$DEPENDENCY_CONFIG_FILE")"
		record_checked "Abhängigkeits-Konfiguration geladen"
	fi
	DEPENDENCY_JSON_CACHE="$candidate_json"
	printf '%s' "$DEPENDENCY_JSON_CACHE"
}

get_dependency_package() {
	local tool_name="$1"
	local manager_name="$2"
	if [[ -z "$tool_name" || -z "$manager_name" ]] || [[ ! "$tool_name" =~ ^[a-zA-Z0-9._+-]+$ ]] || [[ ! "$manager_name" =~ ^[a-zA-Z0-9._+-]+$ ]] || ! command -v python3 >/dev/null 2>&1; then
		return 1
	fi
	python3 -c 'import json,sys; print((json.loads(sys.stdin.read()).get(sys.argv[1], {}) or {}).get(sys.argv[2], ""))' "$tool_name" "$manager_name" <<<"$(load_dependency_json)" 2>/dev/null
}

install_with_package_manager() {
	local manager_name="$1"
	local package_name="$2"
	local install_log_file="${LOG_DIR}/install.log"
	mkdir -p "$LOG_DIR"
	: >"$install_log_file"

	run_install_command() {
		"$@" >>"$install_log_file" 2>&1
	}

	ensure_apt_access() {
		if [[ "$(id -u 2>/dev/null || printf '1')" -eq 0 ]]; then
			printf 'apt-get'
			return 0
		fi
		if command -v sudo >/dev/null 2>&1; then
			printf 'sudo apt-get'
			return 0
		fi
		print_step "⚠️" "apt-get benötigt Root-Rechte (Administratorrechte)."
		print_step "➡️" "Nächster Schritt: Mit Root starten oder sudo installieren, dann './start.sh --repair' erneut ausführen."
		record_next_step "Root/Sudo für apt-get bereitstellen und './start.sh --repair' erneut starten"
		return 1
	}

	case "$manager_name" in
	apt)
		command -v apt-get >/dev/null 2>&1 || return 1
		local apt_cmd
		apt_cmd="$(ensure_apt_access)" || return 1
		run_install_command bash -lc "$apt_cmd update && $apt_cmd install -y '$package_name'"
		;;
	brew)
		command -v brew >/dev/null 2>&1 || return 1
		run_install_command brew install "$package_name"
		;;
	pip)
		command -v python3 >/dev/null 2>&1 || return 1
		run_install_command python3 -m pip install --disable-pip-version-check --quiet "$package_name"
		;;
	*) return 1 ;;
	esac

	if [[ -s "$install_log_file" ]]; then
		record_checked "Installer-Log ${install_log_file}"
	fi
}
