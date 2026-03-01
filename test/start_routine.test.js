const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  formatStartError,
  getDebugMode,
  validateProjectStructure,
} = require("../tools/start_routine");

test("validateProjectStructure meldet fehlende Pfade", () => {
  const result = validateProjectStructure([
    "package.json",
    "dummys/datei-die-es-nicht-gibt.txt",
  ]);

  assert.equal(result.ok, false);
  assert.equal(result.missing.length, 1);
});

test("validateProjectStructure ist ok wenn alle Pfade vorhanden sind", () => {
  const result = validateProjectStructure(["package.json", "README.txt"]);

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
});

test("Dashboard-Dateien sind als Pflichtpfade vorhanden", () => {
  const result = validateProjectStructure([
    "templates/dashboard.html",
    "templates/dashboard.js",
    "templates/dashboard_help.js",
    "templates/module_workspace.js",
    "system-module/dashboard_model.js",
    "test/dashboard_model.test.js",
    "system-core/dashboard_core.js",
    "test/dashboard_core.test.js",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
});

test("Plugin-Loader-Dateien sind als Pflichtpfade vorhanden", () => {
  const result = validateProjectStructure([
    "config/manifests/plugins.manifest.json",
    "system-core/plugin_loader.js",
    "system-module/plugins_accessibility.js",
    "test/plugin_loader.test.js",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
});

test("Release-Readiness-Dateien sind als Pflichtpfade vorhanden", () => {
  const result = validateProjectStructure([
    "tools/release_readiness_check.js",
    "test/release_readiness_check.test.js",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
});

test("getDebugMode ist false ohne Umgebungswert", () => {
  const previousValue = process.env.START_DEBUG;
  delete process.env.START_DEBUG;
  assert.equal(getDebugMode(), false);
  process.env.START_DEBUG = previousValue;
});

test("formatStartError liefert naechsten Schritt mit Log-Pfad", () => {
  const previousValue = process.env.START_DEBUG;
  delete process.env.START_DEBUG;

  const text = formatStartError(new Error("Beispiel-Fehler"));
  assert.match(text, /Naechster Schritt: Protokoll oeffnen/);

  const logPath = path.join(process.cwd(), "data", "logs", "start_routine.log");
  assert.equal(fs.existsSync(logPath), true);

  process.env.START_DEBUG = previousValue;
});
