#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
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

function runCommand(command, args) {
  assertText(command, "Befehl");
  assertArray(args, "Argumente");

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  const output = {
    ok: result.status === 0,
    code: result.status,
    signal: result.signal || null,
  };

  if (typeof output.ok !== "boolean") {
    throw new Error(
      "Befehls-Ergebnis ist ungueltig. Protokoll oeffnen und erneut versuchen.",
    );
  }

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

function installDependencies() {
  if (fs.existsSync("node_modules")) {
    console.log("[2/10] Abhaengigkeiten vorhanden");
    return { ok: true };
  }

  console.log("[2/10] Abhaengigkeiten fehlen. Installation startet");
  const install = runCommand("npm", ["install"]);

  if (!install.ok) {
    throw new Error(
      "Installieren fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

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

  console.log(`[5/10] ${result.message}`);
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

  console.log(`[6/10] ${result.message}`);
}

function runDashboardAutoStart() {
  const result = startDashboardMainModule({
    dashboardPath: path.join(process.cwd(), "templates", "dashboard.html"),
  });
  console.log(`[9/10] ${result.message}`);
}

function runStartRoutine() {
  console.log("[1/10] Projektstruktur pruefen");
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
    "templates/module_workspace.js",
    "system-module/dashboard_model.js",
    "system-module/plugins_accessibility.js",
    "test/dashboard_model.test.js",
    "test/dashboard_core.test.js",
    "test/plugin_loader.test.js",
    "tools/release_readiness_check.js",
    "test/release_readiness_check.test.js",
  ]);

  if (!structure.ok) {
    throw new Error(
      `Dateien fehlen: ${structure.missing.join(", ")}. Bitte reparieren und erneut versuchen.`,
    );
  }

  installDependencies();

  console.log("[3/10] Code formatieren");
  const format = runCommand("npm", ["run", "format"]);
  if (!format.ok) {
    throw new Error(
      "Formatierung fehlgeschlagen. Protokoll oeffnen und Reparatur starten.",
    );
  }

  console.log("[4/10] Unit-Tests ausfuehren");
  const tests = runCommand("npm", ["test"]);
  if (!tests.ok) {
    throw new Error(
      "Tests fehlgeschlagen. Fehler pruefen und erneut versuchen.",
    );
  }

  runRegistryCheck();
  runPluginLoaderCheck();

  console.log("[7/10] Release-Readiness pruefen");
  const release = runReleaseReadinessCheck({ rootPath: process.cwd() });
  if (!release.ok) {
    throw new Error(
      "Release-Readiness fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }
  console.log(`[7/10] ${release.message}`);

  console.log("[8/10] Systemtest ausfuehren");
  const systemTest = runCommand("npm", ["run", "system:test"]);
  if (!systemTest.ok) {
    throw new Error(
      "Systemtest fehlgeschlagen. Protokoll oeffnen oder Reparatur starten.",
    );
  }

  runDashboardAutoStart();

  console.log("[10/10] Fertig");
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
};
