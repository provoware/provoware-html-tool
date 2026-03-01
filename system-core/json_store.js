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

function assertFunction(value, name) {
  if (typeof value !== "function") {
    throw new Error(`${name} ist keine Funktion. Bitte Eingabe prüfen.`);
  }
}

function validateSchema(payload, schema) {
  if (schema === undefined || schema === null) {
    return;
  }

  assertObject(schema, "Schema");
  if (
    schema.requiredKeys !== undefined &&
    !Array.isArray(schema.requiredKeys)
  ) {
    throw new Error(
      "Schema.requiredKeys ist ungueltig. Bitte Eingabe pruefen.",
    );
  }

  if (schema.types !== undefined) {
    assertObject(schema.types, "Schema.types");
  }

  const requiredKeys = schema.requiredKeys || [];
  for (const key of requiredKeys) {
    assertNonEmptyString(key, "Schema-Schluessel");
    if (!(key in payload)) {
      throw new Error(
        `Pflichtfeld fehlt: ${key}. Reparatur starten oder Eingabe pruefen.`,
      );
    }
  }

  const types = schema.types || {};
  for (const [key, expectedType] of Object.entries(types)) {
    assertNonEmptyString(expectedType, "Schema-Typ");
    if (!(key in payload)) {
      continue;
    }

    const value = payload[key];
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (actualType !== expectedType) {
      throw new Error(
        `Datentyp ungueltig bei ${key}. Erwartet ${expectedType}, gefunden ${actualType}. Bitte Reparatur starten oder Eingabe pruefen.`,
      );
    }
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

function atomicWriteJson(filePath, payload, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(payload, "JSON-Daten");
  assertObject(options, "Optionen");

  const schema = options.schema || null;
  const onBackupCreated = options.onBackupCreated || null;
  validateSchema(payload, schema);
  if (onBackupCreated !== null) {
    assertFunction(onBackupCreated, "Backup-Hook");
  }

  const dir = path.dirname(filePath);
  const name = path.basename(filePath, ".json");
  fs.mkdirSync(dir, { recursive: true });

  const tmpPath = path.join(dir, `${name}.tmp.json`);
  const backupPath = path.join(dir, `${name}.backup.json`);

  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    if (onBackupCreated) {
      onBackupCreated({ filePath, backupPath });
    }
  }

  const content = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(tmpPath, content, "utf8");
  fs.renameSync(tmpPath, filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("Schreiben fehlgeschlagen. Bitte Reparatur starten.");
  }

  const output = {
    filePath,
    backupPath: fs.existsSync(backupPath) ? backupPath : null,
  };

  if (typeof output.filePath !== "string") {
    throw new Error(
      "Ausgabe ungueltig. Protokoll oeffnen und erneut versuchen.",
    );
  }
  return output;
}

module.exports = {
  atomicWriteJson,
  readJson,
};
