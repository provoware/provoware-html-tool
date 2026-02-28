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
  return {
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
  };
}

module.exports = {
  buildHelpPanelModel,
  readLog,
  runSystemTest,
};
