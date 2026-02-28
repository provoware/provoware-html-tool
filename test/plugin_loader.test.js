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
