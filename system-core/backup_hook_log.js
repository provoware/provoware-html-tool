const fs = require("node:fs");
const path = require("node:path");

function assertText(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${label} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${label} ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function readBackupLog(logPath) {
  assertText(logPath, "Backup-Log-Pfad");
  if (!fs.existsSync(logPath)) {
    return [];
  }

  const raw = fs.readFileSync(logPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(
      "Backup-Log ist ungueltig. Protokoll oeffnen und Reparatur starten.",
    );
  }
  return parsed;
}

function appendBackupEvent(logPath, payload) {
  assertText(logPath, "Backup-Log-Pfad");
  assertObject(payload, "Backup-Hook-Payload");
  assertText(payload.filePath, "Backup-Hook Datei");
  assertText(payload.backupPath, "Backup-Hook Backup-Datei");

  const events = readBackupLog(logPath);
  const event = {
    filePath: payload.filePath,
    backupPath: payload.backupPath,
    createdAt: new Date().toISOString(),
  };

  events.unshift(event);
  const trimmed = events.slice(0, 20);

  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.writeFileSync(logPath, `${JSON.stringify(trimmed, null, 2)}\n`, "utf8");

  return event;
}

function createBackupEventHook(logPath) {
  assertText(logPath, "Backup-Log-Pfad");
  return function backupEventHook(payload) {
    return appendBackupEvent(logPath, payload);
  };
}

module.exports = {
  appendBackupEvent,
  createBackupEventHook,
  readBackupLog,
};
