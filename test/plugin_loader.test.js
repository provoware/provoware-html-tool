const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  createSafeModeRepairPlan,
  runPluginLoaderHealthCheck,
  runSafeModeOneClickRepair,
  runSafeModeReset,
  createDefaultPluginManifest,
  resolvePluginPath,
  validatePluginManifest,
} = require("../system-core/plugin_loader");

const manifestPath = path.join(
  process.cwd(),
  "config",
  "manifests",
  "plugins.manifest.json",
);

test("validatePluginManifest akzeptiert gueltige Plugin-Liste", () => {
  const result = validatePluginManifest({
    manifestType: "plugin-loader",
    version: "1.0.0",
    plugins: [
      {
        id: "plugin-a11y-assist",
        enabled: true,
        modulePath: "system-module/plugins_accessibility.js",
      },
    ],
  });

  assert.equal(result.ok, true);
  assert.equal(result.pluginCount, 1);
});

test("runPluginLoaderHealthCheck laedt aktive Plugins isoliert", () => {
  const result = runPluginLoaderHealthCheck({
    manifestPath,
    projectRoot: process.cwd(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.pluginResults.length, 1);
  assert.equal(result.pluginResults[0].id, "plugin-a11y-assist");
  assert.equal(result.pluginResults[0].ok, true);
});

test("runPluginLoaderHealthCheck meldet fehlende Plugin-Datei klar", () => {
  const result = runPluginLoaderHealthCheck({
    manifestPath: path.join(
      process.cwd(),
      "dummys",
      "missing-plugin-manifest.json",
    ),
    projectRoot: process.cwd(),
  });

  assert.equal(result.ok, false);
  assert.match(result.message, /Plugin-Loader meldet 1 Fehler/);
  assert.match(result.pluginResults[0].message, /Reparatur starten/);
});

test("validatePluginManifest lehnt falschen Manifest-Typ ab", () => {
  assert.throws(
    () =>
      validatePluginManifest({
        manifestType: "wrong-type",
        version: "1.0.0",
        plugins: [],
      }),
    /Manifest-Typ ungueltig/,
  );
});

test("validatePluginManifest lehnt ungueltige Version ab", () => {
  assert.throws(
    () =>
      validatePluginManifest({
        manifestType: "plugin-loader",
        version: "1.0",
        plugins: [],
      }),
    /Manifest-Version ungueltig/,
  );
});

test("validatePluginManifest lehnt absolute Modulpfade ab", () => {
  assert.throws(
    () =>
      validatePluginManifest({
        manifestType: "plugin-loader",
        version: "1.0.0",
        plugins: [
          {
            id: "plugin-a11y-assist",
            enabled: true,
            modulePath: "/tmp/plugin.js",
          },
        ],
      }),
    /absoluten Modulpfad/,
  );
});

test("resolvePluginPath blockiert direkte Elternpfade", () => {
  assert.throws(
    () => resolvePluginPath(process.cwd(), "../outside/not-allowed.js"),
    /Plugin-Pfad ist ungueltig/,
  );
});

test("validatePluginManifest lehnt doppelte Plugin-ID ab", () => {
  assert.throws(
    () =>
      validatePluginManifest({
        manifestType: "plugin-loader",
        version: "1.0.0",
        plugins: [
          {
            id: "plugin-a11y-assist",
            enabled: true,
            modulePath: "system-module/plugins_accessibility.js",
          },
          {
            id: "plugin-a11y-assist",
            enabled: false,
            modulePath: "system-module/plugins_accessibility.js",
          },
        ],
      }),
    /ist doppelt/,
  );
});

test("runPluginLoaderHealthCheck blockiert Pfade ausserhalb vom Projekt", () => {
  const result = runPluginLoaderHealthCheck({
    manifestPath,
    projectRoot: process.cwd(),
  });

  assert.equal(result.ok, true);

  const unsafeResult = runPluginLoaderHealthCheck({
    projectRoot: process.cwd(),
    manifestPath: path.join(
      process.cwd(),
      "dummys",
      "unsafe-plugin-manifest.json",
    ),
  });

  assert.equal(unsafeResult.ok, false);
  assert.match(
    unsafeResult.pluginResults[0].message,
    /Plugin-Pfad ist ungueltig|ausserhalb des Projekts/,
  );
  assert.match(unsafeResult.pluginResults[0].message, /Erneut versuchen/);
});

test("runSafeModeOneClickRepair schreibt Safe-Mode-Manifest", () => {
  const tmpRoot = path.join(process.cwd(), "dummys", "tmp-plugin-safe");
  fs.rmSync(tmpRoot, { recursive: true, force: true });

  const plan = createSafeModeRepairPlan({ projectRoot: tmpRoot });
  const result = runSafeModeOneClickRepair({ projectRoot: tmpRoot });
  const manifest = JSON.parse(fs.readFileSync(plan.manifestPath, "utf8"));

  assert.equal(result.ok, true);
  assert.equal(manifest.mode, "safe");
  assert.equal(Array.isArray(manifest.plugins), true);
  assert.equal(manifest.plugins.length, 0);
});

test("createDefaultPluginManifest liefert gueltigen Standard", () => {
  const manifest = createDefaultPluginManifest();
  const result = validatePluginManifest(manifest);

  assert.equal(result.ok, true);
  assert.equal(result.pluginCount, 1);
  assert.equal(manifest.plugins[0].id, "plugin-a11y-assist");
});

test("runSafeModeReset schreibt Standard-Manifest", () => {
  const tmpRoot = path.join(process.cwd(), "dummys", "tmp-plugin-reset");
  fs.rmSync(tmpRoot, { recursive: true, force: true });
  fs.mkdirSync(path.join(tmpRoot, "config", "manifests"), {
    recursive: true,
  });

  runSafeModeOneClickRepair({ projectRoot: tmpRoot });
  const result = runSafeModeReset({ projectRoot: tmpRoot });
  const manifest = JSON.parse(
    fs.readFileSync(
      path.join(tmpRoot, "config", "manifests", "plugins.manifest.json"),
      "utf8",
    ),
  );

  assert.equal(result.ok, true);
  assert.equal(Array.isArray(manifest.plugins), true);
  assert.equal(manifest.plugins.length, 1);
  assert.equal(manifest.plugins[0].enabled, true);
});
