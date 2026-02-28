const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, readJson } = require("./json_store");

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
};
