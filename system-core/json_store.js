const fs = require("node:fs");
const path = require("node:path");

function assertNonEmptyString(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} ist leer. Bitte erneut versuchen.`);
  }
}

function assertObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name} ist kein Objekt. Bitte Eingabe prüfen.`);
  }
}

function parseJson(raw, filePath) {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `JSON in ${filePath} ist beschädigt. Reparatur starten oder Protokoll öffnen.`,
    );
  }
}

function readJson(filePath) {
  assertNonEmptyString(filePath, "Dateipfad");
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Datei fehlt: ${filePath}. Backup auswählen und erneut versuchen.`,
    );
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const output = parseJson(raw, filePath);
  if (!output) {
    throw new Error("Leeres Ergebnis beim Laden. Bitte Reparatur starten.");
  }
  return output;
}

function atomicWriteJson(filePath, payload) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(payload, "JSON-Daten");

  const dir = path.dirname(filePath);
  const name = path.basename(filePath, ".json");
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = path.join(dir, `${name}.tmp.json`);
  const backupPath = path.join(dir, `${name}.backup.json`);

  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const content = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(tmpPath, content, "utf8");
  fs.renameSync(tmpPath, filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("Schreiben fehlgeschlagen. Bitte Reparatur starten.");
  }

  return {
    filePath,
    backupPath: fs.existsSync(backupPath) ? backupPath : null,
  };
}

module.exports = {
  atomicWriteJson,
  readJson,
};
