const fs = require("node:fs");
const path = require("node:path");
const { readJson } = require("./json_store");

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${name} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${name} ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertArray(value, name) {
  if (!Array.isArray(value)) {
    throw new Error(
      `${name} ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function validatePluginManifest(manifest) {
  assertObject(manifest, "Plugin-Manifest");
  assertText(manifest.manifestType, "Manifest-Typ");
  assertText(manifest.version, "Manifest-Version");
  assertArray(manifest.plugins, "Plugin-Liste");

  if (manifest.manifestType !== "plugin-loader") {
    throw new Error(
      "Manifest-Typ ungueltig. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error(
      "Manifest-Version ungueltig. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  const knownIds = new Set();

  manifest.plugins.forEach((plugin, index) => {
    assertObject(plugin, `Plugin ${index + 1}`);
    assertText(plugin.id, `Plugin ${index + 1} ID`);
    assertText(plugin.modulePath, `Plugin ${index + 1} Modulpfad`);

    if (!/^[a-z0-9-]+$/i.test(plugin.id)) {
      throw new Error(
        `Plugin-ID ${plugin.id} ist ungueltig. Eingabe pruefen und erneut versuchen.`,
      );
    }

    if (path.isAbsolute(plugin.modulePath)) {
      throw new Error(
        `Plugin ${plugin.id} hat absoluten Modulpfad. Reparatur starten oder Protokoll oeffnen.`,
      );
    }

    if (knownIds.has(plugin.id)) {
      throw new Error(
        `Plugin-ID ${plugin.id} ist doppelt. Eingabe pruefen und erneut versuchen.`,
      );
    }
    knownIds.add(plugin.id);

    if (typeof plugin.enabled !== "boolean") {
      throw new Error(
        `Plugin ${plugin.id} hat kein gueltiges enabled-Flag. Eingabe pruefen und erneut versuchen.`,
      );
    }
  });

  return {
    ok: true,
    pluginCount: manifest.plugins.length,
  };
}

function resolvePluginPath(projectRoot, modulePath) {
  assertText(projectRoot, "Projektpfad");
  assertText(modulePath, "Plugin-Modulpfad");

  const absoluteProjectRoot = path.resolve(projectRoot);
  const safeModulePath = path.normalize(modulePath);
  if (safeModulePath.startsWith(`..${path.sep}`) || safeModulePath === "..") {
    throw new Error(
      "Plugin-Pfad ist ungueltig. Reparatur starten oder Protokoll oeffnen.",
    );
  }
  const absolutePluginPath = path.resolve(absoluteProjectRoot, safeModulePath);
  const rootWithSeparator = `${absoluteProjectRoot}${path.sep}`;

  if (
    absolutePluginPath !== absoluteProjectRoot &&
    !absolutePluginPath.startsWith(rootWithSeparator)
  ) {
    throw new Error(
      "Plugin-Pfad liegt ausserhalb des Projekts. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return absolutePluginPath;
}

function runPluginLoaderHealthCheck(options) {
  assertObject(options, "Plugin-Optionen");
  assertText(options.manifestPath, "Manifest-Pfad");
  assertText(options.projectRoot, "Projektpfad");

  const manifest = readJson(options.manifestPath);
  validatePluginManifest(manifest);

  const pluginResults = manifest.plugins.map((plugin) => {
    if (!plugin.enabled) {
      return {
        id: plugin.id,
        ok: true,
        message: "Plugin ist deaktiviert und wird uebersprungen.",
      };
    }

    let absolutePath = "";
    try {
      absolutePath = resolvePluginPath(options.projectRoot, plugin.modulePath);
    } catch (error) {
      return {
        id: plugin.id,
        ok: false,
        message: `${error.message} Naechster Schritt: Erneut versuchen oder Reparatur starten.`,
      };
    }

    if (!fs.existsSync(absolutePath)) {
      return {
        id: plugin.id,
        ok: false,
        message:
          "Plugin-Datei fehlt. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      };
    }

    try {
      const pluginModule = require(absolutePath);
      if (!pluginModule || typeof pluginModule.activate !== "function") {
        return {
          id: plugin.id,
          ok: false,
          message:
            "Plugin-Schnittstelle fehlt. Naechster Schritt: Reparatur starten.",
        };
      }

      const result = pluginModule.activate({ mode: "health-check" });
      if (!result || typeof result.ok !== "boolean") {
        return {
          id: plugin.id,
          ok: false,
          message: "Plugin-Ergebnis ist ungueltig. Protokoll oeffnen.",
        };
      }

      return {
        id: plugin.id,
        ok: result.ok,
        message:
          result.message ||
          "Plugin geladen. Naechster Schritt: Start erneut versuchen.",
      };
    } catch (error) {
      return {
        id: plugin.id,
        ok: false,
        message: `${error.message} Naechster Schritt: Protokoll oeffnen.`,
      };
    }
  });

  const failed = pluginResults.filter((item) => !item.ok);

  return {
    ok: failed.length === 0,
    pluginResults,
    message:
      failed.length === 0
        ? `Plugin-Loader ok mit ${pluginResults.length} Eintraegen.`
        : `Plugin-Loader meldet ${failed.length} Fehler. Reparatur starten oder Protokoll oeffnen.`,
  };
}

module.exports = {
  runPluginLoaderHealthCheck,
  resolvePluginPath,
  validatePluginManifest,
};
