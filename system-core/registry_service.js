const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, readJson } = require("./json_store");

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} fehlt. Bitte erneut versuchen.`);
  }
}

function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${name} ist ungueltig. Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function loadRegistryManifest(manifestPath) {
  assertText(manifestPath, "Manifest-Pfad");
  const manifest = readJson(manifestPath);
  assertObject(manifest, "Manifest");
  return manifest;
}

function validateRegistryEntry(entry, manifest) {
  assertObject(entry, "Registry-Eintrag");
  const required = manifest.requiredEntryFields || [];

  for (const key of required) {
    if (!(key in entry)) {
      throw new Error(
        `Registry-Eintrag fehlt Feld ${key}. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
  }

  if (!manifest.allowedKinds.includes(entry.kind)) {
    throw new Error(
      `Registry-Kind ${entry.kind} ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }

  assertText(entry.id, "Eintrag-ID");
  assertText(entry.version, "Eintrag-Version");
  assertObject(entry.entry, "Eintrag-Daten");

  return true;
}

function validateRegistry(registry, manifest) {
  assertObject(registry, "Registry");
  assertObject(manifest, "Manifest");

  for (const key of manifest.requiredRootFields || []) {
    if (!(key in registry)) {
      throw new Error(
        `Registry fehlt Feld ${key}. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
  }

  if (!Array.isArray(registry.entries)) {
    throw new Error(
      "Registry entries muessen eine Liste sein. Bitte erneut versuchen.",
    );
  }

  for (const entry of registry.entries) {
    validateRegistryEntry(entry, manifest);
  }

  return {
    ok: true,
    count: registry.entries.length,
  };
}

function nextVersionNumber(versionDir) {
  if (!fs.existsSync(versionDir)) {
    return 1;
  }

  const names = fs
    .readdirSync(versionDir)
    .filter((item) => item.startsWith("registry_v") && item.endsWith(".json"))
    .sort();

  if (names.length === 0) {
    return 1;
  }

  const last = names[names.length - 1];
  const number = Number(last.replace("registry_v", "").replace(".json", ""));

  if (!Number.isFinite(number)) {
    throw new Error(
      "Version konnte nicht gelesen werden. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return number + 1;
}

function createRegistryVersion(dataDir, registry) {
  assertText(dataDir, "Datenordner");
  assertObject(registry, "Registry");

  const versionDir = path.join(dataDir, "registry_versions");
  fs.mkdirSync(versionDir, { recursive: true });

  const versionNumber = String(nextVersionNumber(versionDir)).padStart(4, "0");
  const versionFile = `registry_v${versionNumber}.json`;
  const versionPath = path.join(versionDir, versionFile);

  const writeResult = atomicWriteJson(versionPath, registry);

  if (!writeResult || !writeResult.filePath) {
    throw new Error(
      "Versionierung fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return {
    versionNumber,
    versionPath,
  };
}

function writeRegistryWithVersion(options) {
  assertObject(options, "Optionen");
  assertText(options.dataDir, "Datenordner");
  assertText(options.manifestPath, "Manifest-Pfad");
  assertObject(options.registry, "Registry-Daten");

  const manifest = loadRegistryManifest(options.manifestPath);
  validateRegistry(options.registry, manifest);

  const versionInfo = createRegistryVersion(options.dataDir, options.registry);
  const currentPath = path.join(options.dataDir, "registry.current.json");
  const registryPath = path.join(options.dataDir, "registry.json");

  atomicWriteJson(currentPath, {
    current: path.basename(versionInfo.versionPath),
    versionNumber: versionInfo.versionNumber,
    updatedAt: new Date().toISOString(),
  });

  const writeResult = atomicWriteJson(registryPath, options.registry);

  return {
    ok: true,
    registryPath: writeResult.filePath,
    versionPath: versionInfo.versionPath,
    versionNumber: versionInfo.versionNumber,
  };
}

function runRegistryHealthCheck() {
  const manifestPath = path.join(
    process.cwd(),
    "config",
    "manifests",
    "registry.manifest.json",
  );
  const registryPath = path.join(process.cwd(), "data", "registry.json");

  const manifest = loadRegistryManifest(manifestPath);

  if (!fs.existsSync(registryPath)) {
    return {
      ok: true,
      message: "Registry fehlt noch. Wird bei erstem Schreiben angelegt.",
    };
  }

  const registry = readJson(registryPath);
  const result = validateRegistry(registry, manifest);

  return {
    ok: true,
    message: `Registry ist gueltig mit ${result.count} Eintraegen.`,
  };
}

module.exports = {
  loadRegistryManifest,
  runRegistryHealthCheck,
  validateRegistry,
  writeRegistryWithVersion,
};
