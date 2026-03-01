const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  atomicWriteJson,
  findLatestVersionPath,
  readJson,
  recoverJsonFromCurrentPointer,
  recoverJsonFromLatestVersion,
} = require("../system-core/json_store");
const { listBackups, repairFromBackup } = require("../system-core/self_repair");

const tmp = path.join(process.cwd(), "dummys", "tmp-tests");
const filePath = path.join(tmp, "store.json");
const versionedPath = path.join(tmp, "versioned_store.json");

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

test("atomicWriteJson validiert requiredKeys im Schema", () => {
  assert.throws(
    () =>
      atomicWriteJson(
        filePath,
        { id: 7 },
        {
          schema: { requiredKeys: ["id", "name"] },
        },
      ),
    /Pflichtfeld fehlt: name/,
  );
});

test("atomicWriteJson validiert Typen im Schema", () => {
  assert.throws(
    () =>
      atomicWriteJson(
        filePath,
        { id: "7", name: "Demo" },
        {
          schema: {
            requiredKeys: ["id", "name"],
            types: { id: "number", name: "string" },
          },
        },
      ),
    /Datentyp ungueltig bei id/,
  );
});

test("atomicWriteJson ruft Backup-Hook bei Backup-Erstellung auf", () => {
  const events = [];
  atomicWriteJson(
    filePath,
    { id: 1, name: "Alt" },
    {
      schema: {
        requiredKeys: ["id", "name"],
        types: { id: "number", name: "string" },
      },
    },
  );

  const result = atomicWriteJson(
    filePath,
    { id: 2, name: "Neu" },
    {
      schema: {
        requiredKeys: ["id", "name"],
        types: { id: "number", name: "string" },
      },
      onBackupCreated(payload) {
        events.push(payload);
      },
    },
  );

  assert.equal(events.length, 1);
  assert.equal(events[0].filePath, filePath);
  assert.equal(events[0].backupPath.endsWith("store.backup.json"), true);
  assert.equal(result.backupPath.endsWith("store.backup.json"), true);
});

test("atomicWriteJson erzeugt versionierte Dateien bei aktiviertem Modus", () => {
  fs.rmSync(path.join(tmp, "versioned_store_versions"), {
    recursive: true,
    force: true,
  });
  atomicWriteJson(
    versionedPath,
    { value: 1 },
    { versioning: { enabled: true } },
  );
  const result = atomicWriteJson(
    versionedPath,
    { value: 2 },
    { versioning: { enabled: true } },
  );

  assert.equal(result.versionNumber, "0002");
  assert.equal(result.versionPath.endsWith("versioned_store_v0002.json"), true);
  assert.equal(fs.existsSync(result.versionPath), true);
});

test("recoverJsonFromLatestVersion stellt neueste Version wieder her", () => {
  atomicWriteJson(
    versionedPath,
    { value: 3 },
    { versioning: { enabled: true } },
  );
  atomicWriteJson(
    versionedPath,
    { value: 4 },
    { versioning: { enabled: true } },
  );

  fs.writeFileSync(versionedPath, "{}\n", "utf8");
  const recover = recoverJsonFromLatestVersion(versionedPath);
  const data = readJson(versionedPath);
  const latestVersion = findLatestVersionPath(versionedPath);

  assert.equal(recover.ok, true);
  assert.equal(data.value, 4);
  assert.equal(recover.sourceVersionPath, latestVersion);
});

test("atomicWriteJson schreibt current-Pointer bei Versionierung", () => {
  fs.mkdirSync(tmp, { recursive: true });
  const result = atomicWriteJson(
    versionedPath,
    { value: 10 },
    { versioning: { enabled: true } },
  );

  assert.equal(
    result.currentPointerPath.endsWith("versioned_store.current.json"),
    true,
  );
  assert.equal(fs.existsSync(result.currentPointerPath), true);
});

test("recoverJsonFromCurrentPointer nutzt Pointer oder faellt auf letzte Version zurueck", () => {
  atomicWriteJson(
    versionedPath,
    { value: 21 },
    { versioning: { enabled: true } },
  );
  fs.writeFileSync(versionedPath, "{}\n", "utf8");

  const recover = recoverJsonFromCurrentPointer(versionedPath);
  const data = readJson(versionedPath);

  assert.equal(recover.ok, true);
  assert.equal(typeof recover.sourceVersionPath, "string");
  assert.equal(data.value, 21);
});
