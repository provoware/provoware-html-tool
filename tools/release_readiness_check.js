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
  const messagesRaw = readUtf8(path.join(rootPath, "config/messages_de.json"));
  const messages = parseJsonText(messagesRaw, "messages_de.json");

  const checks = [
    checkIncludes(
      dashboardHtml,
      'id="status" aria-live="polite"',
      "Statusbereich mit aria-live vorhanden",
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
      'data-theme="light"',
      "Theme Hell in HTML vorhanden",
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
      dashboardHtml,
      "Escape zum",
      "Tastatur-Hinweis fuer Escape vorhanden",
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
  ];

  const errorKeys = ["retry", "repair", "openLog"];
  for (const key of errorKeys) {
    const value = messages?.errors?.[key];
    checks.push({
      ok: typeof value === "string" && value.trim() !== "",
      message: `Fehlertext '${key}' ist gesetzt`,
    });
  }

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
  parseJsonText,
  readUtf8,
  runReleaseReadinessCheck,
};
