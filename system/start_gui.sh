#!/usr/bin/env bash

resolve_theme_colors() {
	local gui_theme="$1"
	if [[ -z "$gui_theme" || ! "$gui_theme" =~ ^[a-z][a-z0-9-]{1,30}$ ]]; then
		printf '%s\n' "Ungültiges Theme-Format: '${gui_theme}'."
		return 1
	fi

	local bg_color="#0b0f14"
	local text_color="#ffffff"
	local panel_color="#101820"
	local border_color="#ffffff"
	local focus_color="#ffd60a"
	local ok_color="#74f2ce"
	local warn_color="#ffe08a"

	case "$gui_theme" in
	light)
		bg_color="#f8fafc"
		text_color="#0f172a"
		panel_color="#ffffff"
		border_color="#0f172a"
		focus_color="#1d4ed8"
		ok_color="#0f766e"
		warn_color="#92400e"
		;;
	dark)
		bg_color="#111827"
		text_color="#f9fafb"
		panel_color="#1f2937"
		border_color="#93c5fd"
		focus_color="#f59e0b"
		ok_color="#34d399"
		warn_color="#fbbf24"
		;;
	high-contrast) ;;
	*)
		printf '%s\n' "Unbekanntes Theme '${gui_theme}'."
		return 1
		;;
	esac

	printf '%s|%s|%s|%s|%s|%s|%s\n' "$bg_color" "$text_color" "$panel_color" "$border_color" "$focus_color" "$ok_color" "$warn_color"
}

render_gui_status_html() {
	local gui_file="$1"
	local gui_theme="$2"
	local theme_choices="$3"
	local bg_color="$4"
	local text_color="$5"
	local panel_color="$6"
	local border_color="$7"
	local focus_color="$8"
	local ok_color="$9"
	local warn_color="${10}"

	if [[ -z "$gui_file" || -z "$gui_theme" || -z "$theme_choices" ]]; then
		printf '%s\n' "Pflichtwerte für GUI-Datei fehlen."
		return 1
	fi

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
		  <main class="panel" role="main" aria-live="polite" aria-describedby="theme-note">
		    <h1>✅ Provoware ist gestartet</h1>
		    <p><span class="badge-ok">Status: OK</span> <span class="badge-warn">Theme: ${gui_theme}</span></p>
		    <p><strong>Was geprüft wurde:</strong> Check, Repair, Format und Test wurden automatisch ausgeführt.</p>
		    <p id="theme-note"><strong>Hilfe (Help = Unterstützung):</strong> Theme kann mit <code>GUI_THEME=${theme_choices}</code> gewählt werden.</p>
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
}
