const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, readJson } = require("./json_store");
const { runSafeModeOneClickRepair } = require("./plugin_loader");

function listBackups(dirPath, baseName) {
  if (typeof dirPath !== "string" || typeof baseName !== "string") {
    throw new Error("Ungültige Eingabe. Bitte erneut versuchen.");
  }

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter(
      (name) => name.startsWith(baseName) && name.endsWith(".backup.json"),
    )
    .map((name) => path.join(dirPath, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
}

function repairPluginManifestToSafeMode(projectRoot, manifestPath) {
  if (typeof projectRoot !== "string" || !projectRoot.trim()) {
    throw new Error(
      "Projektpfad fehlt. Erneut versuchen oder Protokoll oeffnen.",
    );
  }

  return runSafeModeOneClickRepair({
    projectRoot,
    manifestPath,
  });
}

function repairFromBackup(targetPath, backupPath) {
  if (!targetPath || !backupPath) {
    throw new Error("Pfad fehlt. Backup auswählen und erneut versuchen.");
  }

  const backupData = readJson(backupPath);
  return atomicWriteJson(targetPath, backupData);
}

module.exports = {
  listBackups,
  repairFromBackup,
  repairPluginManifestToSafeMode,
};
