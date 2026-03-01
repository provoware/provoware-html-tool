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

function nextVersionNumber(versionDir, versionPrefix) {
  assertNonEmptyString(versionDir, "Versionsordner");
  assertNonEmptyString(versionPrefix, "Versionsprefix");

  if (!fs.existsSync(versionDir)) {
    return 1;
  }

  const names = fs
    .readdirSync(versionDir)
    .filter(
      (item) => item.startsWith(`${versionPrefix}_v`) && item.endsWith(".json"),
    )
    .sort();

  if (names.length === 0) {
    return 1;
  }

  const lastName = names[names.length - 1];
  const rawNumber = lastName
    .replace(`${versionPrefix}_v`, "")
    .replace(".json", "");
  const number = Number(rawNumber);

  if (!Number.isFinite(number)) {
    throw new Error(
      "Version konnte nicht gelesen werden. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return number + 1;
}

function createVersionWritePlan(filePath, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(options, "Versionierungsoptionen");

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ".json");
  const versionPrefix = options.versionPrefix || baseName;
  assertNonEmptyString(versionPrefix, "Versionierungs-Prefix");

  const versionDirName = options.versionDirName || `${baseName}_versions`;
  assertNonEmptyString(versionDirName, "Versionsordner-Name");

  const versionDir = path.join(dir, versionDirName);
  fs.mkdirSync(versionDir, { recursive: true });

  const nextNumber = String(
    nextVersionNumber(versionDir, versionPrefix),
  ).padStart(4, "0");

  return {
    versionNumber: nextNumber,
    versionPath: path.join(versionDir, `${versionPrefix}_v${nextNumber}.json`),
  };
}

function writeVersionedSnapshot(filePath, payload, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(payload, "JSON-Daten");
  assertObject(options, "Versionierungsoptionen");

  const plan = createVersionWritePlan(filePath, options);
  const content = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(plan.versionPath, content, "utf8");

  if (!fs.existsSync(plan.versionPath)) {
    throw new Error(
      "Versionierte Datei fehlt nach dem Schreiben. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return {
    versionPath: plan.versionPath,
    versionNumber: plan.versionNumber,
  };
}

function writeCurrentPointer(filePath, versionPath) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertNonEmptyString(versionPath, "Versionspfad");

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ".json");
  const pointerPath = path.join(dir, `${baseName}.current.json`);
  const payload = {
    current: path.basename(versionPath),
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    pointerPath,
    `${JSON.stringify(payload, null, 2)}
`,
    "utf8",
  );

  if (!fs.existsSync(pointerPath)) {
    throw new Error(
      "Current-Pointer konnte nicht geschrieben werden. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return pointerPath;
}

function findLatestVersionPath(filePath, options = {}) {
  const plan = createVersionWritePlan(filePath, options);
  const versionDir = path.dirname(plan.versionPath);
  const versionPrefix = path
    .basename(plan.versionPath)
    .replace(/_v\d+\.json$/, "");

  if (!fs.existsSync(versionDir)) {
    return null;
  }

  const files = fs
    .readdirSync(versionDir)
    .filter(
      (item) => item.startsWith(`${versionPrefix}_v`) && item.endsWith(".json"),
    )
    .sort();

  if (files.length === 0) {
    return null;
  }

  return path.join(versionDir, files[files.length - 1]);
}

function recoverJsonFromLatestVersion(filePath, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(options, "Optionen");

  const versionPath = findLatestVersionPath(filePath, options);
  if (!versionPath) {
    throw new Error(
      "Keine Version fuer Wiederherstellung gefunden. Erneut versuchen oder Protokoll oeffnen.",
    );
  }

  const payload = readJson(versionPath);
  const writeResult = atomicWriteJson(filePath, payload, {
    schema: options.schema || null,
    onBackupCreated: options.onBackupCreated || null,
  });

  if (!writeResult || writeResult.filePath !== filePath) {
    throw new Error(
      "Wiederherstellung fehlgeschlagen. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return {
    ok: true,
    filePath,
    sourceVersionPath: versionPath,
    backupPath: writeResult.backupPath,
  };
}

function recoverJsonFromCurrentPointer(filePath, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(options, "Optionen");

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ".json");
  const pointerPath = path.join(dir, `${baseName}.current.json`);
  if (!fs.existsSync(pointerPath)) {
    return recoverJsonFromLatestVersion(filePath, options);
  }

  const pointer = readJson(pointerPath);
  const currentName = pointer.current;
  assertNonEmptyString(currentName, "Current-Pointer");

  const versionOptions = options.versioning || {};
  const probePlan = createVersionWritePlan(filePath, versionOptions);
  const versionDir = path.dirname(probePlan.versionPath);
  const sourceVersionPath = path.join(versionDir, currentName);

  if (!fs.existsSync(sourceVersionPath)) {
    return recoverJsonFromLatestVersion(filePath, options);
  }

  const payload = readJson(sourceVersionPath);
  const writeResult = atomicWriteJson(filePath, payload, {
    schema: options.schema || null,
    onBackupCreated: options.onBackupCreated || null,
    versioning: options.versioning || null,
  });

  return {
    ok: true,
    filePath,
    sourceVersionPath,
    backupPath: writeResult.backupPath,
  };
}

function atomicWriteJson(filePath, payload, options = {}) {
  assertNonEmptyString(filePath, "Dateipfad");
  assertObject(payload, "JSON-Daten");
  assertObject(options, "Optionen");

  const schema = options.schema || null;
  const onBackupCreated = options.onBackupCreated || null;
  const versioning = options.versioning || null;
  validateSchema(payload, schema);
  if (onBackupCreated !== null) {
    assertFunction(onBackupCreated, "Backup-Hook");
  }
  if (versioning !== null) {
    assertObject(versioning, "Versionierungsoptionen");
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

  const versionResult =
    versioning && versioning.enabled === true
      ? writeVersionedSnapshot(filePath, payload, versioning)
      : null;
  const currentPointerPath = versionResult
    ? writeCurrentPointer(filePath, versionResult.versionPath)
    : null;

  const content = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(tmpPath, content, "utf8");
  fs.renameSync(tmpPath, filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error("Schreiben fehlgeschlagen. Bitte Reparatur starten.");
  }

  const output = {
    filePath,
    backupPath: fs.existsSync(backupPath) ? backupPath : null,
    versionPath: versionResult ? versionResult.versionPath : null,
    versionNumber: versionResult ? versionResult.versionNumber : null,
    currentPointerPath,
  };

  if (typeof output.filePath !== "string") {
    throw new Error(
      "Ausgabe ungueltig. Protokoll oeffnen und erneut versuchen.",
    );
  }

  if (versionResult && (!output.versionPath || !output.currentPointerPath)) {
    throw new Error(
      "Versionierung unvollstaendig. Reparatur starten oder Protokoll oeffnen.",
    );
  }

  return output;
}

module.exports = {
  atomicWriteJson,
  findLatestVersionPath,
  readJson,
  recoverJsonFromCurrentPointer,
  recoverJsonFromLatestVersion,
};
