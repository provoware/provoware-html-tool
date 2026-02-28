#!/usr/bin/env node
const path = require("node:path");
const { runSystemTest, readLog } = require("../system-module/help_panel");
const { listBackups, repairFromBackup } = require("../system-core/self_repair");

function latestLogPath() {
  const fs = require("node:fs");
  const dir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(dir)) {
    return null;
  }
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.startsWith("systemtest-") && name.endsWith(".log"))
    .sort();
  if (files.length === 0) {
    return null;
  }
  return path.join(dir, files[files.length - 1]);
}

function printHelp() {
  console.log(
    "Befehle: test | logs | backups <dateiname> | repair <ziel> <backup>",
  );
}

function main() {
  const [command, a, b] = process.argv.slice(2);
  if (!command) {
    printHelp();
    return;
  }

  if (command === "test") {
    const result = runSystemTest("logs");
    console.log(result.message);
    console.log(`Log: ${result.logPath}`);
    return;
  }

  if (command === "logs") {
    const logPath = a || latestLogPath();
    if (!logPath) {
      console.log("Kein Log gefunden. Erst Systemtest ausführen.");
      return;
    }
    console.log(readLog(logPath));
    return;
  }

  if (command === "backups") {
    const base = a || "store";
    const items = listBackups(path.join(process.cwd(), "data"), base);
    console.log(items.length ? items.join("\n") : "Keine Backups gefunden.");
    return;
  }

  if (command === "repair") {
    if (!a || !b) {
      console.log(
        "Fehlende Eingabe. Beispiel: repair data/store.json data/store.backup.json",
      );
      return;
    }
    const result = repairFromBackup(a, b);
    console.log(`Reparatur fertig: ${JSON.stringify(result)}`);
    return;
  }

  printHelp();
}

main();
