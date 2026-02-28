#!/usr/bin/env node
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const { runRegistryHealthCheck } = require("../system-core/registry_service");

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

  return {
    ok: result.status === 0,
    code: result.status,
  };
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
    console.log("[2/7] Abhaengigkeiten vorhanden");
    return { ok: true };
  }

  console.log("[2/7] Abhaengigkeiten fehlen. Installation startet");
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
  console.log(`[5/7] ${result.message}`);
}

function runStartRoutine() {
  console.log("[1/7] Projektstruktur pruefen");
  const structure = validateProjectStructure([
    "package.json",
    "config/messages_de.json",
    "config/manifests/global.manifest.json",
    "config/manifests/kernel.manifest.json",
    "config/manifests/registry.manifest.json",
    "system-core/json_store.js",
    "system-core/registry_service.js",
    "test/json_store.test.js",
  ]);

  if (!structure.ok) {
    throw new Error(
      `Dateien fehlen: ${structure.missing.join(", ")}. Bitte reparieren und erneut versuchen.`,
    );
  }

  installDependencies();

  console.log("[3/7] Code formatieren");
  const format = runCommand("npm", ["run", "format"]);
  if (!format.ok) {
    throw new Error(
      "Formatierung fehlgeschlagen. Protokoll oeffnen und Reparatur starten.",
    );
  }

  console.log("[4/7] Unit-Tests ausfuehren");
  const tests = runCommand("npm", ["test"]);
  if (!tests.ok) {
    throw new Error(
      "Tests fehlgeschlagen. Fehler pruefen und erneut versuchen.",
    );
  }

  runRegistryCheck();

  console.log("[6/7] Systemtest ausfuehren");
  const systemTest = runCommand("npm", ["run", "system:test"]);
  if (!systemTest.ok) {
    throw new Error(
      "Systemtest fehlgeschlagen. Protokoll oeffnen oder Reparatur starten.",
    );
  }

  console.log("[7/7] Fertig");
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
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  runCommand,
  runStartRoutine,
  validateProjectStructure,
};
