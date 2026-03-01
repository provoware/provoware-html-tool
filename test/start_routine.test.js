const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  assertRunOutput,
  createFingerprint,
  ensureRequiredDirectories,
  formatStartError,
  getDebugMode,
  readDependencyState,
  resolveDependencySyncPlan,
  scanPlaceholderMarkers,
  syncReadmeProgressFromTodo,
  calculateTodoProgress,
  validateProjectStructure,
  writeDependencyState,
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

test("assertRunOutput wirft Fehler bei ungueltigem Ergebnis", () => {
  assert.throws(() => assertRunOutput(null), /Befehls-Ergebnis fehlt/);
});

test("assertRunOutput akzeptiert gueltiges Ergebnis", () => {
  assert.doesNotThrow(() => {
    assertRunOutput({ ok: true, code: 0, signal: null });
  });
});

test("ensureRequiredDirectories erzeugt data und logs", () => {
  const dataDir = path.join(process.cwd(), "data");
  const logsDir = path.join(dataDir, "logs");

  if (fs.existsSync(logsDir)) {
    fs.rmSync(logsDir, { recursive: true, force: true });
  }

  ensureRequiredDirectories();

  assert.equal(fs.existsSync(dataDir), true);
  assert.equal(fs.existsSync(logsDir), true);
});

test("resolveDependencySyncPlan fordert Installation ohne node_modules", () => {
  const plan = resolveDependencySyncPlan({
    hasNodeModules: false,
    previousFingerprint: "abc",
    currentFingerprint: "abc",
  });

  assert.equal(plan.shouldInstall, true);
  assert.equal(plan.reason, "Abhaengigkeiten fehlen");
});

test("resolveDependencySyncPlan fordert Installation bei Fingerprint-Aenderung", () => {
  const plan = resolveDependencySyncPlan({
    hasNodeModules: true,
    previousFingerprint: "alt",
    currentFingerprint: "neu",
  });

  assert.equal(plan.shouldInstall, true);
  assert.equal(plan.reason, "Abhaengigkeiten sind veraltet");
});

test("resolveDependencySyncPlan erkennt aktuelle Abhaengigkeiten", () => {
  const plan = resolveDependencySyncPlan({
    hasNodeModules: true,
    previousFingerprint: "gleich",
    currentFingerprint: "gleich",
  });

  assert.equal(plan.shouldInstall, false);
  assert.equal(plan.reason, "Abhaengigkeiten aktuell");
});

test("writeDependencyState und readDependencyState arbeiten zusammen", () => {
  const dataDir = path.join(process.cwd(), "data");
  const statePath = path.join(dataDir, "dependency_state.test.json");
  const fingerprint = createFingerprint("test-inhalt");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  writeDependencyState(statePath, fingerprint);
  const state = readDependencyState(statePath);

  assert.equal(state.fingerprint, fingerprint);
  assert.match(state.updatedAt, /\d{4}-\d{2}-\d{2}T/);

  fs.rmSync(statePath, { force: true });
});

test("scanPlaceholderMarkers findet bewusst gesetzten TODO-Marker", () => {
  const result = scanPlaceholderMarkers(process.cwd(), {
    directories: ["dummys"],
    markers: ["TODO"],
  });

  assert.equal(result.ok, true);

  const dummyPath = path.join(process.cwd(), "dummys", "scan_marker.tmp.js");
  fs.writeFileSync(dummyPath, "// TODO: test marker\n", "utf8");

  const findingResult = scanPlaceholderMarkers(process.cwd(), {
    directories: ["dummys"],
    markers: ["TODO"],
  });

  assert.equal(findingResult.ok, false);
  assert.equal(findingResult.findings.length, 1);
  assert.equal(findingResult.findings[0].filePath, "dummys/scan_marker.tmp.js");
  assert.equal(findingResult.findings[0].line, 1);

  fs.rmSync(dummyPath, { force: true });
});

test("scanPlaceholderMarkers ignoriert normale Woerter wie todo-title", () => {
  const dummyPath = path.join(
    process.cwd(),
    "dummys",
    "scan_marker_ignore.tmp.html",
  );
  fs.writeFileSync(
    dummyPath,
    '<section aria-labelledby="todo-title"></section>\n',
    "utf8",
  );

  const result = scanPlaceholderMarkers(process.cwd(), {
    directories: ["dummys"],
    markers: ["TODO"],
  });

  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);

  fs.rmSync(dummyPath, { force: true });
});

test("calculateTodoProgress zaehlt erledigt/offen und Prozent", () => {
  const progress = calculateTodoProgress("- [x] A\n- [ ] B\n- [x] C\n");

  assert.equal(progress.done, 2);
  assert.equal(progress.open, 1);
  assert.equal(progress.total, 3);
  assert.equal(progress.percent, 67);
});

test("syncReadmeProgressFromTodo aktualisiert den Fortschrittsblock", () => {
  const tempRoot = fs.mkdtempSync(
    path.join(process.cwd(), "dummys", "tmp-sync-"),
  );
  const todoPath = path.join(tempRoot, "todo.txt");
  const readmePath = path.join(tempRoot, "README.txt");

  fs.writeFileSync(todoPath, "- [x] Fertig\n- [ ] Offen\n", "utf8");
  fs.writeFileSync(
    readmePath,
    [
      "# Beispiel",
      "",
      "## Entwicklungsfortschritt",
      "",
      "- **Fortschritt:** 0 %",
      "- **Erledigt:** 0 Punkte",
      "- **Offen:** 0 Punkte",
      "",
      "Stand: automatisch aus `todo.txt` gezaehlt.",
      "",
      "## Rest",
    ].join("\n"),
    "utf8",
  );

  const progress = syncReadmeProgressFromTodo(tempRoot);
  const updatedReadme = fs.readFileSync(readmePath, "utf8");

  assert.equal(progress.done, 1);
  assert.equal(progress.open, 1);
  assert.equal(progress.percent, 50);
  assert.match(updatedReadme, /- \*\*Fortschritt:\*\* 50 %/);
  assert.match(updatedReadme, /- \*\*Erledigt:\*\* 1 Punkte/);

  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test("scanPlaceholderMarkers erkennt TODO in Unterordnern", () => {
  const nestedDir = path.join(process.cwd(), "dummys", "nested");
  const nestedFile = path.join(nestedDir, "scan_marker_nested.tmp.js");
  fs.mkdirSync(nestedDir, { recursive: true });
  fs.writeFileSync(nestedFile, "// TODO: nested marker\n", "utf8");

  const result = scanPlaceholderMarkers(process.cwd(), {
    directories: ["dummys"],
    markers: ["TODO"],
  });

  assert.equal(result.ok, false);
  assert.equal(result.findings.length, 1);
  assert.equal(
    result.findings[0].filePath,
    "dummys/nested/scan_marker_nested.tmp.js",
  );

  fs.rmSync(path.join(process.cwd(), "dummys", "nested"), {
    recursive: true,
    force: true,
  });
});

test("scanPlaceholderMarkers ignoriert TODO in normalen String-Zeilen", () => {
  const dummyPath = path.join(
    process.cwd(),
    "dummys",
    "scan_marker_textline.tmp.js",
  );
  fs.writeFileSync(dummyPath, 'const note = "TODO: nur Text";\n', "utf8");

  const result = scanPlaceholderMarkers(process.cwd(), {
    directories: ["dummys"],
    markers: ["TODO"],
  });

  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);

  fs.rmSync(dummyPath, { force: true });
});
