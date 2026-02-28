#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { runRegistryHealthCheck } = require("../system-core/registry_service");
const { runPluginLoaderHealthCheck } = require("../system-core/plugin_loader");

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
    console.log("[2/8] Abhaengigkeiten vorhanden");
    return { ok: true };
  }

  console.log("[2/8] Abhaengigkeiten fehlen. Installation startet");
  const install = runCommand("npm", ["install"]);

  if (!install.ok) {
    throw new Error(
      "Installieren fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return { ok: true };
}

function runRegistryCheck() {
  const result = runRegistryHealthCheck();
  if (!result.ok) {
    throw new Error(
      "Registry-Check fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }
  console.log(`[5/8] ${result.message}`);
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

  console.log(`[6/8] ${result.message}`);
}

function runStartRoutine() {
  console.log("[1/8] Projektstruktur pruefen");
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
    "test/json_store.test.js",
    "templates/dashboard.html",
    "templates/dashboard.js",
    "system-module/dashboard_model.js",
    "system-module/plugins_accessibility.js",
    "test/dashboard_model.test.js",
    "test/plugin_loader.test.js",
  ]);

  if (!structure.ok) {
    throw new Error(
      `Dateien fehlen: ${structure.missing.join(", ")}. Bitte reparieren und erneut versuchen.`,
    );
  }

  installDependencies();

  console.log("[3/8] Code formatieren");
  const format = runCommand("npm", ["run", "format"]);
  if (!format.ok) {
    throw new Error(
      "Formatierung fehlgeschlagen. Protokoll oeffnen und Reparatur starten.",
    );
  }

  console.log("[4/8] Unit-Tests ausfuehren");
  const tests = runCommand("npm", ["test"]);
  if (!tests.ok) {
    throw new Error(
      "Tests fehlgeschlagen. Fehler pruefen und erneut versuchen.",
    );
  }

  runRegistryCheck();
  runPluginLoaderCheck();

  console.log("[7/8] Systemtest ausfuehren");
  const systemTest = runCommand("npm", ["run", "system:test"]);
  if (!systemTest.ok) {
    throw new Error(
      "Systemtest fehlgeschlagen. Protokoll oeffnen oder Reparatur starten.",
    );
  }

  console.log("[8/8] Fertig");
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
  runStartRoutine,
  validateProjectStructure,
  writeStartLog,
};
