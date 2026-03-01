const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  runPluginLoaderHealthCheck,
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

test("validatePluginManifest lehnt doppelte Plugin-ID ab", () => {
  assert.throws(
    () =>
      validatePluginManifest({
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
    /ausserhalb des Projekts/,
  );
  assert.match(unsafeResult.pluginResults[0].message, /Erneut versuchen/);
});
