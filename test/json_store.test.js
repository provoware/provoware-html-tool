const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, readJson } = require("../system-core/json_store");
const { listBackups, repairFromBackup } = require("../system-core/self_repair");

const tmp = path.join(process.cwd(), "dummys", "tmp-tests");
const filePath = path.join(tmp, "store.json");

test("atomicWriteJson schreibt Datei und erstellt Backup", () => {
  fs.mkdirSync(tmp, { recursive: true });
  atomicWriteJson(filePath, { v: 1 });
  atomicWriteJson(filePath, { v: 2 });
  const data = readJson(filePath);
  const backups = listBackups(tmp, "store");

  assert.equal(data.v, 2);
  assert.equal(backups.length, 1);
});

test("repairFromBackup stellt Daten wieder her", () => {
  atomicWriteJson(filePath, { v: 100 });
  const backupPath = path.join(tmp, "store.backup.json");
  const result = repairFromBackup(filePath, backupPath);
  const data = readJson(filePath);

  assert.ok(result.filePath.endsWith("store.json"));
  assert.equal(typeof data.v, "number");
});
