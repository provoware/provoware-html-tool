#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${name} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function readUtf8(filePath) {
  assertText(filePath, "Dateipfad");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Datei fehlt: ${filePath}. Bitte reparieren und erneut versuchen.`,
    );
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJsonText(jsonText, name) {
  assertText(jsonText, `${name} Inhalt`);

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(
      `${name} ist ungueltig. Reparatur starten oder Protokoll oeffnen.`,
    );
  }
}

function checkIncludes(haystack, needle, message) {
  assertText(haystack, "Prueftext");
  assertText(needle, "Suchtext");
  assertText(message, "Pruefmeldung");

  return {
    ok: haystack.includes(needle),
    message,
  };
}

function checkMessageText(value, message) {
  assertText(message, "Pruefmeldung");
  return {
    ok: typeof value === "string" && value.trim() !== "",
    message,
  };
}

function checkMessageTriplet(messages, sectionName) {
  if (!messages || typeof messages !== "object") {
    return [
      {
        ok: false,
        message: `Textbereich '${sectionName}' fehlt`,
      },
    ];
  }

  return [
    checkMessageText(
      messages.what,
      `Textbereich '${sectionName}.what' ist gesetzt`,
    ),
    checkMessageText(
      messages.data,
      `Textbereich '${sectionName}.data' ist gesetzt`,
    ),
    checkMessageText(
      messages.undo,
      `Textbereich '${sectionName}.undo' ist gesetzt`,
    ),
  ];
}

function parseHexColor(colorText) {
  assertText(colorText, "Farbwert");
  const clean = colorText.trim();
  const match = clean.match(/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/);
  if (!match) {
    throw new Error(
      `Farbwert '${colorText}' ist ungueltig. Reparatur starten oder Protokoll oeffnen.`,
    );
  }

  const hex =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : match[1];

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function getRelativeLuminance(rgb) {
  const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
    const normalized = value / 255;
    if (normalized <= 0.03928) {
      return normalized / 12.92;
    }
    return ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function getContrastRatio(foregroundColor, backgroundColor) {
  const fg = parseHexColor(foregroundColor);
  const bg = parseHexColor(backgroundColor);
  const fgLum = getRelativeLuminance(fg);
  const bgLum = getRelativeLuminance(bg);
  const light = Math.max(fgLum, bgLum);
  const dark = Math.min(fgLum, bgLum);
  return (light + 0.05) / (dark + 0.05);
}

function getThemeVariables(dashboardCss) {
  const rootMatch = dashboardCss.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) {
    return { light: {} };
  }

  const parseBlockVariables = (blockText) => {
    const parsed = {};
    const variablePattern = /--([a-z-]+):\s*([^;]+);/g;
    let match = variablePattern.exec(blockText);
    while (match) {
      parsed[match[1]] = match[2].trim();
      match = variablePattern.exec(blockText);
    }
    return parsed;
  };

  const baseVariables = parseBlockVariables(rootMatch[1]);
  const themeVariables = { light: baseVariables };
  const themes = ["dark", "contrast", "warm", "camo"];

  themes.forEach((themeName) => {
    const sectionMatch = dashboardCss.match(
      new RegExp(`\\[data-theme=\"${themeName}\"\\]\\s*\\{([\\s\\S]*?)\\}`),
    );
    if (!sectionMatch) {
      themeVariables[themeName] = { ...baseVariables };
      return;
    }

    themeVariables[themeName] = {
      ...baseVariables,
      ...parseBlockVariables(sectionMatch[1]),
    };
  });

  return themeVariables;
}

function checkThemeContrast(dashboardCss, minContrastRatio = 4.5) {
  const themeVariables = getThemeVariables(dashboardCss);
  const targets = [
    { key: "fg", backgroundKey: "bg", label: "Haupttext" },
    { key: "topbar-fg", backgroundKey: "topbar", label: "Topbar" },
    { key: "banner-fg", backgroundKey: "banner-bg", label: "Statusbanner" },
    { key: "fg", backgroundKey: "rail-bg", label: "Rail" },
    { key: "fg", backgroundKey: "module-project-bg", label: "Modul Projekt" },
    { key: "fg", backgroundKey: "module-sales-bg", label: "Modul Vertrieb" },
    { key: "fg", backgroundKey: "module-analytics-bg", label: "Modul Analyse" },
    { key: "fg", backgroundKey: "module-support-bg", label: "Modul Support" },
  ];

  return Object.entries(themeVariables).flatMap(([themeName, variables]) => {
    return targets.map((target) => {
      const foregroundColor = variables[target.key];
      const backgroundColor = variables[target.backgroundKey];
      if (!foregroundColor || !backgroundColor) {
        return {
          ok: false,
          message:
            `Kontrastwert fehlt (${themeName}, ${target.label}). ` +
            "Reparatur starten oder Protokoll oeffnen.",
        };
      }

      const ratio = getContrastRatio(foregroundColor, backgroundColor);
      return {
        ok: ratio >= minContrastRatio,
        message:
          `Kontrast ${themeName}/${target.label}: ${ratio.toFixed(2)} ` +
          `(mindestens ${minContrastRatio.toFixed(1)})`,
      };
    });
  });
}

function runReleaseReadinessCheck(options = {}) {
  const rootPath = options.rootPath || process.cwd();
  assertText(rootPath, "Projektpfad");

  const dashboardHtml = readUtf8(
    path.join(rootPath, "templates/dashboard.html"),
  );
  const dashboardCss = readUtf8(path.join(rootPath, "templates/dashboard.css"));
  const dashboardScript = readUtf8(
    path.join(rootPath, "templates/dashboard.js"),
  );
  const moduleWorkspaceScript = readUtf8(
    path.join(rootPath, "templates/module_workspace.js"),
  );
  const messagesRaw = readUtf8(path.join(rootPath, "config/messages_de.json"));
  const messages = parseJsonText(messagesRaw, "messages_de.json");
  const readmeText = readUtf8(path.join(rootPath, "README.txt"));
  const changelogText = readUtf8(path.join(rootPath, "CHANGELOG.md"));
  const todoText = readUtf8(path.join(rootPath, "todo.txt"));

  const checks = [
    checkIncludes(
      dashboardHtml,
      'id="status" aria-live="polite"',
      "Statusbereich mit aria-live vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="boot-status"',
      "Boot-Statusbereich ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'data-boot-phase="ui"',
      "Boot-Phase UI ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'data-boot-phase="folder"',
      "Boot-Phase Ordner ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'data-boot-phase="modules"',
      "Boot-Phase Module ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'data-boot-phase="backup"',
      "Boot-Phase Backup ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="toggle-debug"',
      "Debug-Knopf fuer Hilfe vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="help-retry"',
      "Button 'Erneut versuchen' vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="help-repair"',
      "Button 'Reparatur starten' vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="help-log"',
      "Button 'Protokoll oeffnen' vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="help-backup"',
      "Button 'Backup auswählen' vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="backup-dialog"',
      "Backup-Dialog ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'src="backup_restore.js"',
      "Backup-Restore-Skript ist eingebunden",
    ),
    checkIncludes(
      dashboardHtml,
      'src="boot_status.js"',
      "Boot-Status-Skript ist eingebunden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="backup-checklist"',
      "5-Punkte-Check im Backup-Dialog ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      "README, CHANGELOG und todo",
      "Backup-Hilfe zeigt Doku-Pflicht im 5-Punkte-Check",
    ),
    checkIncludes(
      dashboardHtml,
      'data-theme="light"',
      "Theme Hell in HTML vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      '<option value="warm">Rötlich</option>',
      "Theme Roetlich in HTML vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      '<option value="camo">Camouflage</option>',
      "Theme Camouflage in HTML vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'id="theme-tooltip"',
      "Theme-Hinweis mit Rueckweg ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'aria-describedby="theme-tooltip"',
      "Theme-Auswahl ist mit Hilfetext verknuepft",
    ),
    checkIncludes(
      dashboardCss,
      '[data-theme="dark"]',
      "Theme Dunkel in CSS vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      '[data-theme="contrast"]',
      "Theme Kontrast+ in CSS vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      '[data-theme="warm"]',
      "Theme Roetlich in CSS vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      '[data-theme="camo"]',
      "Theme Camouflage in CSS vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      "--rail-frame",
      "Rail-Design-Token in CSS vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      "--banner-bg",
      "Statusbanner-Token in CSS vorhanden",
    ),
    checkIncludes(
      moduleWorkspaceScript,
      "card.dataset.moduleProfile = entry.id",
      "Modulprofil-Attribut fuer Karten ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      "Escape zum",
      "Tastatur-Hinweis fuer Escape vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      "Enter für Knopf",
      "Tastatur-Hinweis fuer Enter vorhanden",
    ),
    checkIncludes(
      dashboardScript,
      "registerKeyboardShortcuts",
      "Tastatur-Handler ist im Script vorhanden",
    ),
    checkIncludes(
      dashboardScript,
      'event.key !== "Escape"',
      "Escape-Logik fuer Tastatur ist vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      "min-height: 44px",
      "Mindestgroesse fuer Klickziele (44px) ist vorhanden",
    ),
    checkIncludes(
      dashboardCss,
      "focus-visible",
      "Sichtbarer Fokusstil ist vorhanden",
    ),
    checkIncludes(
      dashboardHtml,
      'role="status"',
      "Status-Text fuer Screenreader ist vorhanden",
    ),
  ];

  const errorKeys = ["retry", "repair", "openLog"];
  for (const key of errorKeys) {
    const value = messages?.errors?.[key];
    checks.push(checkMessageText(value, `Fehlertext '${key}' ist gesetzt`));
  }

  checks.push(...checkMessageTriplet(messages?.help, "help"));
  checks.push(...checkMessageTriplet(messages?.dashboard, "dashboard"));

  checks.push(
    checkIncludes(
      readmeText,
      "Doku ist kurz aktualisiert (README, CHANGELOG, todo)",
      "README dokumentiert Doku-Pflicht im Release-Check",
    ),
  );
  checks.push(
    checkIncludes(changelogText, "README", "CHANGELOG enthaelt README-Bezug"),
  );
  checks.push(
    checkIncludes(changelogText, "todo", "CHANGELOG enthaelt todo-Bezug"),
  );
  checks.push(
    checkIncludes(todoText, "README", "todo enthaelt README-Updatepunkt"),
  );
  checks.push(
    checkIncludes(todoText, "CHANGELOG", "todo enthaelt CHANGELOG-Updatepunkt"),
  );
  checks.push(...checkThemeContrast(dashboardCss));

  const failed = checks.filter((item) => !item.ok).map((item) => item.message);
  return {
    ok: failed.length === 0,
    message:
      failed.length === 0
        ? "Release-Check ok: A11y- und Theme-Basics sind vorhanden."
        : `Release-Check fehlgeschlagen: ${failed.join("; ")}`,
    failed,
    checks,
  };
}

if (require.main === module) {
  try {
    const result = runReleaseReadinessCheck();
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  checkIncludes,
  checkThemeContrast,
  getContrastRatio,
  parseJsonText,
  readUtf8,
  runReleaseReadinessCheck,
};
