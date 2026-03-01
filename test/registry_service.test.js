const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  loadRegistryManifest,
  runRegistryHealthCheckWithOptions,
  validateRegistry,
  writeRegistryWithVersion,
} = require("../system-core/registry_service");

const dataDir = path.join(process.cwd(), "dummys", "registry-tests");
const manifestPath = path.join(
  process.cwd(),
  "config",
  "manifests",
  "registry.manifest.json",
);

function cleanTestDir() {
  fs.rmSync(dataDir, { recursive: true, force: true });
  fs.mkdirSync(dataDir, { recursive: true });
}

test("validateRegistry akzeptiert gueltige Registry", () => {
  const manifest = loadRegistryManifest(manifestPath);
  const registry = {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    entries: [
      {
        id: "plugin-a11y",
        kind: "plugin",
        version: "0.0.1",
        entry: { enabled: true },
      },
    ],
  };

  const result = validateRegistry(registry, manifest);
  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
});

test("writeRegistryWithVersion schreibt Version und current-Zeiger", () => {
  cleanTestDir();
  const registry = {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    entries: [
      {
        id: "module-help",
        kind: "module",
        version: "1.2.0",
        entry: { label: "Hilfe" },
      },
    ],
  };

  const result = writeRegistryWithVersion({
    dataDir,
    manifestPath,
    registry,
  });

  assert.equal(result.ok, true);
  assert.ok(fs.existsSync(result.versionPath));
  assert.ok(fs.existsSync(path.join(dataDir, "registry.current.json")));
  assert.ok(fs.existsSync(path.join(dataDir, "registry.json")));
});

test("runRegistryHealthCheckWithOptions liefert Debug-Details bei Fehler", () => {
  const result = runRegistryHealthCheckWithOptions({
    debugMode: true,
    manifestPath,
    registryPath: path.join(process.cwd(), "dummys", "nicht-da.json"),
  });

  assert.equal(result.ok, true);
  assert.match(result.message, /Registry fehlt noch/);

  const brokenPath = path.join(process.cwd(), "dummys", "broken-registry.json");
  fs.writeFileSync(brokenPath, "{ kaputt", "utf8");

  const brokenResult = runRegistryHealthCheckWithOptions({
    debugMode: true,
    manifestPath,
    registryPath: brokenPath,
  });

  assert.equal(brokenResult.ok, false);
  assert.match(brokenResult.message, /Registry-Check fehlgeschlagen/);
  assert.match(brokenResult.details, /JSON/);

  fs.rmSync(brokenPath, { force: true });
});

test("runRegistryHealthCheckWithOptions versteckt Details ohne Debug", () => {
  const brokenPath = path.join(
    process.cwd(),
    "dummys",
    "broken-registry-no-debug.json",
  );
  fs.writeFileSync(brokenPath, "{ kaputt", "utf8");

  const result = runRegistryHealthCheckWithOptions({
    debugMode: false,
    manifestPath,
    registryPath: brokenPath,
  });

  assert.equal(result.ok, false);
  assert.equal(result.details, null);

  fs.rmSync(brokenPath, { force: true });
});
