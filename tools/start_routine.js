#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");
const {
  runRegistryHealthCheckWithOptions,
} = require("../system-core/registry_service");
const { runPluginLoaderHealthCheck } = require("../system-core/plugin_loader");
const { startDashboardMainModule } = require("../system-core/dashboard_core");
const {
  runReleaseReadinessCheck,
} = require("../tools/release_readiness_check");

function assertArray(value, name) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `${name} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${name} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertRunOutput(output) {
  if (!output || typeof output !== "object") {
    throw new Error(
      "Befehls-Ergebnis fehlt. Protokoll oeffnen und erneut versuchen.",
    );
  }

  if (typeof output.ok !== "boolean" || typeof output.code !== "number") {
    throw new Error(
      "Befehls-Ergebnis ist ungueltig. Protokoll oeffnen und erneut versuchen.",
    );
  }
}

function runCommand(command, args) {
  assertText(command, "Befehl");
  assertArray(args, "Argumente");

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  const output = {
    ok: result.status === 0,
    code: result.status ?? 1,
    signal: result.signal || null,
  };

  assertRunOutput(output);

  return output;
}

function getDebugMode() {
  const debugRaw = process.env.START_DEBUG || "";
  return debugRaw === "1" || debugRaw.toLowerCase() === "true";
}

function writeStartLog(error) {
  if (!(error instanceof Error)) {
    throw new Error(
      "Fehlerobjekt fehlt. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  const logDir = path.join(process.cwd(), "data", "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, "start_routine.log");
  const details = [
    `Zeit: ${new Date().toISOString()}`,
    `Meldung: ${error.message}`,
    error.stack ? `Stack: ${error.stack}` : "Stack: nicht vorhanden",
    "---",
  ].join("\n");
  fs.appendFileSync(logPath, `${details}\n`, "utf8");
  return logPath;
}

function formatStartError(error) {
  if (!(error instanceof Error)) {
    throw new Error(
      "Fehlerobjekt fehlt. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  const logPath = writeStartLog(error);
  if (!getDebugMode()) {
    return `${error.message} Naechster Schritt: Protokoll oeffnen (${logPath}).`;
  }

  return [
    error.message,
    `Debug-Details: ${error.stack || "kein Stack verfuegbar"}`,
    `Naechster Schritt: Protokoll oeffnen (${logPath}).`,
  ].join("\n");
}

function validateProjectStructure(requiredPaths) {
  assertArray(requiredPaths, "Pfadliste");
  const missing = requiredPaths.filter((filePath) => !fs.existsSync(filePath));

  return {
    ok: missing.length === 0,
    missing,
  };
}

function ensureRequiredDirectories() {
  const directories = [
    path.join(process.cwd(), "data"),
    path.join(process.cwd(), "data", "logs"),
  ];

  directories.forEach((directory) => {
    assertText(directory, "Verzeichnis");
    fs.mkdirSync(directory, { recursive: true });
    if (!fs.existsSync(directory)) {
      throw new Error(
        `Verzeichnis fehlt: ${directory}. Reparatur starten und erneut versuchen.`,
      );
    }
  });

  console.log("[2/11] Datenordner geprueft");
}

function createFingerprint(text) {
  assertText(text, "Fingerprint-Quelle");
  return crypto.createHash("sha256").update(text).digest("hex");
}

function readDependencyState(statePath) {
  assertText(statePath, "Status-Datei");
  if (!fs.existsSync(statePath)) {
    return null;
  }

  const raw = fs.readFileSync(statePath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed.fingerprint !== "string") {
    throw new Error(
      "Abhaengigkeits-Status ist ungueltig. Protokoll oeffnen und Reparatur starten.",
    );
  }

  return parsed;
}

function writeDependencyState(statePath, fingerprint) {
  assertText(statePath, "Status-Datei");
  assertText(fingerprint, "Fingerprint");
  fs.writeFileSync(
    statePath,
    JSON.stringify(
      {
        fingerprint,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );

  if (!fs.existsSync(statePath)) {
    throw new Error(
      "Abhaengigkeits-Status konnte nicht gespeichert werden. Erneut versuchen.",
    );
  }
}

function resolveDependencySyncPlan({
  hasNodeModules,
  previousFingerprint,
  currentFingerprint,
}) {
  if (typeof hasNodeModules !== "boolean") {
    throw new Error(
      "Abhaengigkeits-Status fehlt. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  assertText(currentFingerprint, "Aktueller Fingerprint");
  if (!hasNodeModules) {
    return {
      shouldInstall: true,
      reason: "Abhaengigkeiten fehlen",
    };
  }

  if (!previousFingerprint) {
    return {
      shouldInstall: true,
      reason: "Abhaengigkeits-Status fehlt",
    };
  }

  return {
    shouldInstall: previousFingerprint !== currentFingerprint,
    reason:
      previousFingerprint !== currentFingerprint
        ? "Abhaengigkeiten sind veraltet"
        : "Abhaengigkeiten aktuell",
  };
}

function installDependencies() {
  const lockPath = path.join(process.cwd(), "package-lock.json");
  const packagePath = path.join(process.cwd(), "package.json");
  const lockSource = fs.existsSync(lockPath)
    ? fs.readFileSync(lockPath, "utf8")
    : fs.readFileSync(packagePath, "utf8");
  const currentFingerprint = createFingerprint(lockSource);
  const statePath = path.join(process.cwd(), "data", "dependency_state.json");
  const previousState = readDependencyState(statePath);
  const plan = resolveDependencySyncPlan({
    hasNodeModules: fs.existsSync("node_modules"),
    previousFingerprint: previousState?.fingerprint || "",
    currentFingerprint,
  });

  if (!plan.shouldInstall) {
    console.log("[3/11] Abhaengigkeiten aktuell");
    return { ok: true };
  }

  console.log(`[3/11] ${plan.reason}. Installation startet`);
  const install = runCommand("npm", ["install", "--no-audit", "--no-fund"]);

  if (!install.ok) {
    throw new Error(
      "Installieren fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  writeDependencyState(statePath, currentFingerprint);

  return { ok: true };
}

function runRegistryCheck() {
  const result = runRegistryHealthCheckWithOptions({
    debugMode: getDebugMode(),
    manifestPath: path.join(
      process.cwd(),
      "config",
      "manifests",
      "registry.manifest.json",
    ),
    registryPath: path.join(process.cwd(), "data", "registry.json"),
  });

  if (!result.ok) {
    const details = result.details ? ` Details: ${result.details}` : "";
    throw new Error(`${result.message}${details}`);
  }

  console.log(`[7/11] ${result.message}`);
}
function runPluginLoaderCheck() {
  const result = runPluginLoaderHealthCheck({
    manifestPath: path.join(
      process.cwd(),
      "config",
      "manifests",
      "plugins.manifest.json",
    ),
    projectRoot: process.cwd(),
  });

  if (!result.ok) {
    throw new Error(
      "Plugin-Loader-Check fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  console.log(`[8/11] ${result.message}`);
}

function verifyFormatting() {
  console.log("[5/11] Format pruefen");
  const formatCheck = runCommand("npm", ["run", "format:check"]);
  if (!formatCheck.ok) {
    throw new Error(
      "Format-Pruefung fehlgeschlagen. Protokoll oeffnen und erneut versuchen.",
    );
  }
}

function scanPlaceholderMarkers(rootPath, options = {}) {
  assertText(rootPath, "Projektpfad");
  const markers = Array.isArray(options.markers)
    ? options.markers
    : ["TODO", "FIXME", "PLACEHOLDER", "DUMMY"];
  const directories = Array.isArray(options.directories)
    ? options.directories
    : ["system-core", "system-module", "templates", "tools", "config"];

  const findings = [];
  const markerPattern = new RegExp(
    String.raw`\b(${markers.join("|")})\s*:`,
    "i",
  );
  const allowedExtensions = new Set([
    ".js",
    ".cjs",
    ".mjs",
    ".json",
    ".html",
    ".css",
    ".md",
    ".txt",
    ".sh",
  ]);

  function shouldScanAsTaskComment(lineText) {
    if (typeof lineText !== "string") {
      return false;
    }

    return [
      /^\s*\/\//,
      /^\s*#/,
      /^\s*\/\*/,
      /^\s*\*/,
      /^\s*<!--/,
      /^\s*- \[ \]/,
    ].some((pattern) => pattern.test(lineText));
  }

  function collectFilesRecursively(startDirectory) {
    const collectedFiles = [];
    const stack = [startDirectory];

    while (stack.length > 0) {
      const currentDirectory = stack.pop();
      const entries = fs.readdirSync(currentDirectory, { withFileTypes: true });

      entries.forEach((entry) => {
        const entryPath = path.join(currentDirectory, entry.name);
        if (entry.isDirectory()) {
          stack.push(entryPath);
          return;
        }

        if (!entry.isFile()) {
          return;
        }

        const extension = path.extname(entry.name).toLowerCase();
        if (!allowedExtensions.has(extension)) {
          return;
        }

        collectedFiles.push(entryPath);
      });
    }

    return collectedFiles;
  }

  directories.forEach((relativeDirectory) => {
    assertText(relativeDirectory, "Scan-Verzeichnis");
    const absoluteDirectory = path.join(rootPath, relativeDirectory);
    if (!fs.existsSync(absoluteDirectory)) {
      return;
    }

    const files = collectFilesRecursively(absoluteDirectory);

    files.forEach((absoluteFilePath) => {
      const relativePath = path.relative(rootPath, absoluteFilePath);
      const lines = fs.readFileSync(absoluteFilePath, "utf8").split("\n");

      lines.forEach((line, index) => {
        const match = line.match(markerPattern);
        if (!match || !shouldScanAsTaskComment(line)) {
          return;
        }

        findings.push({
          marker: match[1].toUpperCase(),
          filePath: relativePath,
          line: index + 1,
          text: line.trim(),
        });
      });
    });
  });

  return {
    ok: findings.length === 0,
    findings,
  };
}

function validateOpenMiniPoints(todoContent) {
  assertText(todoContent, "TODO-Inhalt");
  const openMiniPoints =
    todoContent.match(/^- \[ \] Naechster Mini-Punkt:/gim) || [];

  return {
    ok: openMiniPoints.length === 2,
    count: openMiniPoints.length,
  };
}

function runShortcutConflictCheck(options = {}) {
  const platform =
    typeof options.platform === "string" ? options.platform : process.platform;
  const entries = Array.isArray(options.shortcuts)
    ? options.shortcuts
    : ["Alt+T", "Alt+I", "Enter", "Escape"];

  const shortcutRules = {
    darwin: {
      "Alt+I": "Kann auf manchen Tastaturen Sonderzeichen ausloesen.",
    },
  };

  const warnings = [];

  entries.forEach((shortcut) => {
    assertText(shortcut, "Shortcut");
    const platformRules = shortcutRules[platform] || {};
    if (platformRules[shortcut]) {
      warnings.push({
        shortcut,
        reason: platformRules[shortcut],
      });
    }
  });

  if (warnings.length > 0) {
    const warningText = warnings
      .map((entry) => `${entry.shortcut}: ${entry.reason}`)
      .join(" | ");
    return {
      ok: true,
      warnings,
      message:
        "Shortcut-Konfliktcheck mit Hinweis. Naechster Schritt: " +
        `Shortcut pruefen oder Protokoll oeffnen. Details: ${warningText}`,
    };
  }

  return {
    ok: true,
    warnings,
    message: "Shortcut-Konfliktcheck ohne kritische Konflikte.",
  };
}

function calculateTodoProgress(todoContent) {
  assertText(todoContent, "TODO-Inhalt");
  const doneMatches = todoContent.match(/^- \[x\] /gim) || [];
  const openMatches = todoContent.match(/^- \[ \] /gim) || [];
  const done = doneMatches.length;
  const open = openMatches.length;
  const total = done + open;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    done,
    open,
    total,
    percent,
  };
}

function syncReadmeProgressFromTodo(rootPath) {
  assertText(rootPath, "Projektpfad");
  const todoPath = path.join(rootPath, "todo.txt");
  const readmePath = path.join(rootPath, "README.txt");
  const todoContent = fs.readFileSync(todoPath, "utf8");
  const readmeContent = fs.readFileSync(readmePath, "utf8");
  const progress = calculateTodoProgress(todoContent);
  const progressBlock = [
    "## Entwicklungsfortschritt",
    "",
    `- **Fortschritt:** ${progress.percent} %`,
    `- **Erledigt:** ${progress.done} Punkte`,
    `- **Offen:** ${progress.open} Punkte`,
    "",
    "Stand: automatisch aus `todo.txt` gezaehlt.",
  ].join("\n");

  const updatedReadme = readmeContent.replace(
    /## Entwicklungsfortschritt\n[\s\S]*?Stand: automatisch aus `todo\.txt` gezaehlt\./,
    progressBlock,
  );

  if (updatedReadme !== readmeContent) {
    fs.writeFileSync(readmePath, updatedReadme, "utf8");
  }

  return progress;
}

function runDashboardAutoStart() {
  const result = startDashboardMainModule({
    dashboardPath: path.join(process.cwd(), "templates", "dashboard.html"),
  });
  console.log(`[11/11] ${result.message}`);
}

function runStartRoutine() {
  console.log("[1/12] Projektstruktur pruefen");
  const structure = validateProjectStructure([
    "package.json",
    "config/messages_de.json",
    "config/manifests/global.manifest.json",
    "config/manifests/kernel.manifest.json",
    "config/manifests/registry.manifest.json",
    "config/manifests/plugins.manifest.json",
    "system-core/json_store.js",
    "system-core/registry_service.js",
    "system-core/plugin_loader.js",
    "system-core/dashboard_core.js",
    "test/json_store.test.js",
    "templates/dashboard.html",
    "templates/dashboard.js",
    "templates/dashboard_help.js",
    "templates/boot_status.js",
    "templates/kanban_preview.js",
    "templates/module_workspace.js",
    "templates/quick_store_module.js",
    "system-module/dashboard_model.js",
    "system-module/quick_store_model.js",
    "data/quick_store_inbox.json",
    "data/quick_store_lyrics.json",
    "data/quick_store_research.json",
    "system-module/plugins_accessibility.js",
    "test/dashboard_model.test.js",
    "test/dashboard_core.test.js",
    "test/kanban_preview.test.js",
    "test/plugin_loader.test.js",
    "test/quick_store_model.test.js",
    "tools/release_readiness_check.js",
    "test/release_readiness_check.test.js",
  ]);

  if (!structure.ok) {
    throw new Error(
      `Dateien fehlen: ${structure.missing.join(", ")}. Bitte reparieren und erneut versuchen.`,
    );
  }

  ensureRequiredDirectories();
  installDependencies();

  console.log("[4/12] Code formatieren");
  const format = runCommand("npm", ["run", "format"]);
  if (!format.ok) {
    throw new Error(
      "Formatierung fehlgeschlagen. Protokoll oeffnen und Reparatur starten.",
    );
  }

  verifyFormatting();

  console.log("[6/12] Unit-Tests ausfuehren");
  const tests = runCommand("npm", ["test"]);
  if (!tests.ok) {
    throw new Error(
      "Tests fehlgeschlagen. Fehler pruefen und erneut versuchen.",
    );
  }

  runRegistryCheck();
  runPluginLoaderCheck();

  console.log("[9/13] Shortcut-Konfliktcheck pruefen");
  const shortcutCheck = runShortcutConflictCheck();
  console.log(`[9/13] ${shortcutCheck.message}`);

  console.log("[10/13] Release-Readiness pruefen");
  const release = runReleaseReadinessCheck({ rootPath: process.cwd() });
  if (!release.ok) {
    throw new Error(
      "Release-Readiness fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }
  console.log(`[10/13] ${release.message}`);

  console.log("[11/13] Platzhalter-Scan pruefen");
  const placeholderCheck = scanPlaceholderMarkers(process.cwd());
  if (!placeholderCheck.ok) {
    const first = placeholderCheck.findings[0];
    throw new Error(
      `Platzhalter gefunden (${placeholderCheck.findings.length}). ` +
        `Bitte TODO aktualisieren und Stelle beheben: ${first.filePath}:${first.line} ` +
        `(${first.marker}). Naechster Schritt: Protokoll oeffnen oder Reparatur starten.`,
    );
  }
  console.log("[11/13] Platzhalter-Scan ohne offene Marker");

  const todoPath = path.join(process.cwd(), "todo.txt");
  const todoContent = fs.readFileSync(todoPath, "utf8");
  const miniPointCheck = validateOpenMiniPoints(todoContent);
  if (!miniPointCheck.ok) {
    throw new Error(
      `TODO-Regel verletzt: Es muessen genau zwei offene Naechster Mini-Punkt-Eintraege vorhanden sein. Aktuell: ${miniPointCheck.count}. ` +
        "Naechster Schritt: TODO anpassen und erneut versuchen.",
    );
  }
  console.log("[12/14] TODO-Regel geprueft: genau zwei offene Mini-Punkte");

  console.log("[13/14] README-Fortschritt aus TODO synchronisieren");
  const progress = syncReadmeProgressFromTodo(process.cwd());
  console.log(
    `[13/14] Fortschritt: ${progress.percent} % (${progress.done} erledigt, ${progress.open} offen)`,
  );

  console.log("[14/14] Systemtest ausfuehren");
  const systemTest = runCommand("npm", ["run", "system:test"]);
  if (!systemTest.ok) {
    throw new Error(
      "Systemtest fehlgeschlagen. Protokoll oeffnen oder Reparatur starten.",
    );
  }

  runDashboardAutoStart();

  console.log("[15/15] Fertig");
  console.log(
    "Geprueft und geloest. Naechster Schritt: Hilfe in docs/HILFE.md oeffnen.",
  );

  return {
    ok: true,
    nextStep: "docs/HILFE.md oeffnen",
  };
}

if (require.main === module) {
  try {
    runStartRoutine();
  } catch (error) {
    console.error(formatStartError(error));
    process.exit(1);
  }
}

module.exports = {
  formatStartError,
  getDebugMode,
  runCommand,
  runDashboardAutoStart,
  runStartRoutine,
  validateProjectStructure,
  writeStartLog,
  assertRunOutput,
  ensureRequiredDirectories,
  verifyFormatting,
  createFingerprint,
  readDependencyState,
  resolveDependencySyncPlan,
  scanPlaceholderMarkers,
  writeDependencyState,
  calculateTodoProgress,
  syncReadmeProgressFromTodo,
  validateOpenMiniPoints,
  runShortcutConflictCheck,
};
