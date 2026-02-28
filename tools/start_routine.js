#!/usr/bin/env node
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");

function assertArray(value, name) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(
      `${name} fehlt. Bitte Eingabe prüfen und erneut versuchen.`,
    );
  }
}

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${name} fehlt. Bitte Eingabe prüfen und erneut versuchen.`,
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
    console.log("[2/6] Abhängigkeiten vorhanden");
    return { ok: true };
  }

  console.log("[2/6] Abhängigkeiten fehlen. Installation startet");
  const install = runCommand("npm", ["install"]);

  if (!install.ok) {
    throw new Error(
      "Installieren fehlgeschlagen. Reparatur starten oder Protokoll öffnen.",
    );
  }

  return { ok: true };
}

function runStartRoutine() {
  console.log("[1/6] Projektstruktur prüfen");
  const structure = validateProjectStructure([
    "package.json",
    "config/messages_de.json",
    "system-core/json_store.js",
    "test/json_store.test.js",
  ]);

  if (!structure.ok) {
    throw new Error(
      `Dateien fehlen: ${structure.missing.join(", ")}. Bitte reparieren und erneut versuchen.`,
    );
  }

  installDependencies();

  console.log("[3/6] Code formatieren");
  const format = runCommand("npm", ["run", "format"]);
  if (!format.ok) {
    throw new Error(
      "Formatierung fehlgeschlagen. Protokoll öffnen und Reparatur starten.",
    );
  }

  console.log("[4/6] Unit-Tests ausführen");
  const tests = runCommand("npm", ["test"]);
  if (!tests.ok) {
    throw new Error(
      "Tests fehlgeschlagen. Fehler prüfen und erneut versuchen.",
    );
  }

  console.log("[5/6] Systemtest ausführen");
  const systemTest = runCommand("npm", ["run", "system:test"]);
  if (!systemTest.ok) {
    throw new Error(
      "Systemtest fehlgeschlagen. Protokoll öffnen oder Reparatur starten.",
    );
  }

  console.log("[6/6] Fertig");
  console.log(
    "Geprüft und gelöst. Nächster Schritt: Hilfe in docs/HILFE.md öffnen.",
  );

  return {
    ok: true,
    nextStep: "docs/HILFE.md öffnen",
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
