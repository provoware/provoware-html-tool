const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildRestorePlan,
  inferTargetPathFromBackupPath,
  isRestoreConfirmationValid,
  listVersionFilesFromDirectory,
  restoreBackupFromDirectory,
  restoreVersionFromDirectory,
  compareVersionWithCurrentFromDirectory,
  createVersionCompareSummary,
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

test("inferTargetPathFromBackupPath erkennt store/registry korrekt", () => {
  assert.equal(
    inferTargetPathFromBackupPath("data/store.backup.json"),
    "data/store.json",
  );
  assert.equal(
    inferTargetPathFromBackupPath("data/registry.backup.json"),
    "data/registry.json",
  );
});

test("buildRestorePlan erkennt Ziel automatisch", () => {
  const plan = buildRestorePlan("data/store.backup.json", "");
  assert.equal(plan.targetFileName, "store.json");
});

test("buildRestorePlan blockiert unpassende Ziel-Datei", () => {
  assert.throws(() =>
    buildRestorePlan("data/store.backup.json", "data/registry.json"),
  );
});

test("isRestoreConfirmationValid akzeptiert exakten Dateinamen", () => {
  assert.equal(isRestoreConfirmationValid("store.json", "store.json"), true);
  assert.equal(
    isRestoreConfirmationValid("  registry.json  ", "registry.json"),
    true,
  );
});

test("isRestoreConfirmationValid blockiert falsche oder leere Eingabe", () => {
  assert.equal(isRestoreConfirmationValid("", "store.json"), false);
  assert.equal(isRestoreConfirmationValid("store", "store.json"), false);
  assert.equal(isRestoreConfirmationValid(null, "store.json"), false);
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

test("listVersionFilesFromDirectory listet Versionen sortiert", async () => {
  const fileMap = {
    "store.json": createFileHandle('{"x":1}\n'),
  };
  const versionMap = {
    "store_v0002.json": createFileHandle('{"x":2}\n'),
    "store_v0001.json": createFileHandle('{"x":1}\n'),
  };

  const directoryHandle = {
    async getDirectoryHandle(name) {
      if (name !== "data") {
        throw new Error("Ungueltiger Unterordner");
      }
      return {
        async getDirectoryHandle(versionName) {
          if (versionName !== "store_versions") {
            throw new Error("Version-Ordner fehlt");
          }
          return {
            async *entries() {
              for (const [entryName, handle] of Object.entries(versionMap)) {
                yield [entryName, { kind: "file", ...handle }];
              }
            },
            async getFileHandle(fileName) {
              return versionMap[fileName];
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
    },
  };

  const versions = await listVersionFilesFromDirectory(
    directoryHandle,
    "store.json",
  );

  assert.deepEqual(versions, ["store_v0001.json", "store_v0002.json"]);
});

test("restoreVersionFromDirectory schreibt gewaehlte Version", async () => {
  const fileMap = {
    "store.json": createFileHandle('{"x":0}\n'),
  };
  const versionMap = {
    "store_v0003.json": createFileHandle('{"x":3}\n'),
  };

  const directoryHandle = {
    async getDirectoryHandle(name) {
      if (name !== "data") {
        throw new Error("Ungueltiger Unterordner");
      }
      return {
        async getDirectoryHandle(versionName) {
          if (versionName !== "store_versions") {
            throw new Error("Version-Ordner fehlt");
          }
          return {
            async entries() {},
            async getFileHandle(fileName) {
              if (!(fileName in versionMap)) {
                throw new Error("Datei fehlt");
              }
              return versionMap[fileName];
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
    },
  };

  const result = await restoreVersionFromDirectory(
    directoryHandle,
    "store.json",
    "store_v0003.json",
  );

  assert.equal(result.ok, true);
  assert.match(fileMap["store.json"].read(), /"x": 3/);
});

test("createVersionCompareSummary gibt klare Vergleichshilfe", () => {
  const result = createVersionCompareSummary({
    currentKeys: 4,
    versionKeys: 6,
    currentBytes: 120,
    versionBytes: 140,
    timeSummary: "Zeit: Aktuell 2026-03-01, Version 2026-03-02.",
  });

  assert.equal(result.ok, true);
  assert.equal(result.keyDiff, 2);
  assert.match(result.text, /Dateigroesse/);
  assert.match(result.text, /Zeit:/);
  assert.match(result.text, /Naechster Schritt/);
});

test("compareVersionWithCurrentFromDirectory vergleicht aktuelle Datei", async () => {
  const fileMap = {
    "store.json": createFileHandle(
      '{"a":1,"b":2,"updatedAt":"2026-03-01T10:00:00.000Z"}\n',
    ),
  };
  const versionMap = {
    "store_v0002.json": createFileHandle(
      '{"a":1,"b":2,"c":3,"updatedAt":"2026-03-02T10:00:00.000Z"}\n',
    ),
  };

  const directoryHandle = {
    async getDirectoryHandle(name) {
      if (name !== "data") {
        throw new Error("Ungueltiger Unterordner");
      }
      return {
        async getDirectoryHandle(versionName) {
          if (versionName !== "store_versions") {
            throw new Error("Version-Ordner fehlt");
          }
          return {
            async getFileHandle(fileName) {
              return versionMap[fileName];
            },
          };
        },
        async getFileHandle(fileName) {
          return fileMap[fileName];
        },
      };
    },
  };

  const result = await compareVersionWithCurrentFromDirectory(
    directoryHandle,
    "store.json",
    "store_v0002.json",
  );

  assert.equal(result.ok, true);
  assert.equal(result.keyDiff, 1);
  assert.match(result.text, /Felder/);
  assert.match(result.text, /Dateigroesse/);
  assert.match(result.text, /Zeit: Aktuell/);
});

test("compareVersionWithCurrentFromDirectory liefert Detail-Schluesselliste", async () => {
  const targetHandle =
    createFileHandle(`{"alpha":1,"beta":2,"updatedAt":"2026-03-01"}
`);
  const versionHandle =
    createFileHandle(`{"alpha":1,"gamma":3,"updatedAt":"2026-03-02"}
`);

  const directoryHandle = {
    async getDirectoryHandle(name) {
      if (name !== "data") {
        throw new Error("Ungueltiger Unterordner");
      }
      return {
        async getDirectoryHandle(versionName) {
          if (versionName !== "store_versions") {
            throw new Error("Version-Ordner fehlt");
          }
          return {
            async getFileHandle(fileName) {
              if (fileName !== "store_v0003.json") {
                throw new Error("Version fehlt");
              }
              return versionHandle;
            },
          };
        },
        async getFileHandle(fileName) {
          if (fileName !== "store.json") {
            throw new Error("Datei fehlt");
          }
          return targetHandle;
        },
      };
    },
  };

  const result = await compareVersionWithCurrentFromDirectory(
    directoryHandle,
    "store.json",
    "store_v0003.json",
  );

  assert.equal(result.ok, true);
  assert.match(result.detailText, /Aktuell:/);
  assert.match(result.detailText, /Version:/);
});
