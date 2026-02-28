const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProjectStructure } = require("../tools/start_routine");

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
    "system-module/dashboard_model.js",
    "test/dashboard_model.test.js",
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
});
