const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildRestorePlan,
  restoreBackupFromDirectory,
} = require("../templates/backup_restore");

function createFileHandle(initialContent = "") {
  let content = initialContent;
  return {
    async getFile() {
      return {
        async text() {
          return content;
        },
      };
    },
    async createWritable() {
      return {
        async write(nextContent) {
          content = nextContent;
        },
        async close() {
          return true;
        },
      };
    },
    read() {
      return content;
    },
  };
}

function createDirectoryHandle(fileMap) {
  return {
    async getDirectoryHandle(name) {
      if (name !== "data") {
        throw new Error("Ungueltiger Unterordner");
      }
      return {
        async getFileHandle(fileName, options = {}) {
          if (!(fileName in fileMap) && options.create !== true) {
            throw new Error("Datei fehlt");
          }
          if (!(fileName in fileMap) && options.create === true) {
            fileMap[fileName] = createFileHandle("{}\n");
          }
          return fileMap[fileName];
        },
      };
    },
    async getFileHandle(fileName, options = {}) {
      if (!(fileName in fileMap) && options.create !== true) {
        throw new Error("Datei fehlt");
      }
      if (!(fileName in fileMap) && options.create === true) {
        fileMap[fileName] = createFileHandle("{}\n");
      }
      return fileMap[fileName];
    },
  };
}

test("buildRestorePlan validiert Eingabe und liefert Dateinamen", () => {
  const plan = buildRestorePlan(
    "data/registry.backup.json",
    "data/registry.json",
  );
  assert.equal(plan.backupFileName, "registry.backup.json");
  assert.equal(plan.targetFileName, "registry.json");
});

test("restoreBackupFromDirectory schreibt Backup in Zieldatei", async () => {
  const fileMap = {
    "registry.backup.json": createFileHandle('{"ok":true}\n'),
    "registry.json": createFileHandle('{"ok":false}\n'),
  };
  const directoryHandle = createDirectoryHandle(fileMap);

  const result = await restoreBackupFromDirectory(directoryHandle, {
    backupFileName: "registry.backup.json",
    targetFileName: "registry.json",
  });

  assert.equal(result.ok, true);
  assert.match(fileMap["registry.json"].read(), /"ok": true/);
});

test("restoreBackupFromDirectory meldet Fehler bei ungueltigem JSON", async () => {
  const fileMap = {
    "store.backup.json": createFileHandle("kein-json"),
    "store.json": createFileHandle('{"x":1}\n'),
  };
  const directoryHandle = createDirectoryHandle(fileMap);

  await assert.rejects(
    restoreBackupFromDirectory(directoryHandle, {
      backupFileName: "store.backup.json",
      targetFileName: "store.json",
    }),
  );
});
