const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

function ensureLogDir(logDir) {
  if (typeof logDir !== "string" || logDir.trim() === "") {
    throw new Error("Log-Ordner fehlt. Bitte erneut versuchen.");
  }
  fs.mkdirSync(logDir, { recursive: true });
}

function runSystemTest(logDir = "logs") {
  ensureLogDir(logDir);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logPath = path.join(logDir, `systemtest-${stamp}.log`);

  try {
    const output = execSync("node --test", { encoding: "utf8" });
    fs.writeFileSync(logPath, output, "utf8");
    return {
      ok: true,
      message: "Systemtest erfolgreich. Nächster Schritt: Logs ansehen.",
      logPath,
    };
  } catch (error) {
    const output = `${error.stdout || ""}\n${error.stderr || ""}`;
    fs.writeFileSync(logPath, output, "utf8");
    return {
      ok: false,
      message:
        "Systemtest fehlgeschlagen. Protokoll öffnen und Reparatur starten.",
      logPath,
    };
  }
}

function readLog(logPath) {
  if (typeof logPath !== "string" || logPath.trim() === "") {
    throw new Error("Log-Pfad fehlt. Bitte erneut versuchen.");
  }
  if (!fs.existsSync(logPath)) {
    throw new Error("Log nicht gefunden. Erst Systemtest ausführen.");
  }
  const output = fs.readFileSync(logPath, "utf8");
  if (output.trim() === "") {
    throw new Error("Log ist leer. Systemtest erneut versuchen.");
  }
  return output;
}

function buildHelpPanelModel() {
  const model = {
    title: "Hilfe und Diagnose",
    actions: [
      "Systemtest ausführen",
      "Logs anzeigen",
      "Backup auswählen",
      "Reparatur starten",
    ],
    plainInfo: [
      "Systemtest prüft automatisch die wichtigsten Funktionen.",
      "Logs zeigen technische Details und einfache Lösungsvorschläge.",
      "Backup-Auswahl stellt alte, gültige Daten wieder her.",
    ],
    quickGuide: [
      "1) bash start.sh ausfuehren.",
      "2) Ergebnis lesen und naechsten Schritt waehlen.",
      "3) Bei Fehlern: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
    ],
  };

  if (!Array.isArray(model.quickGuide) || model.quickGuide.length !== 3) {
    throw new Error("Hilfe-Leitfaden ungueltig. Bitte Reparatur starten.");
  }

  return model;
}

module.exports = {
  buildHelpPanelModel,
  readLog,
  runSystemTest,
};
