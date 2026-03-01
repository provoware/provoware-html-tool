const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { writeRegistryWithVersion } = require("../system-core/registry_service");
const { readBackupLog } = require("../system-core/backup_hook_log");
const {
  buildRestorePlan,
  restoreBackupFromDirectory,
} = require("../templates/backup_restore");

function createFsDirectoryHandle(baseDir) {
  return {
    async getDirectoryHandle(name) {
      const nextDir = path.join(baseDir, name);
      return createFsDirectoryHandle(nextDir);
    },
    async getFileHandle(fileName, options = {}) {
      const filePath = path.join(baseDir, fileName);
      if (!fs.existsSync(filePath)) {
        if (options.create !== true) {
          throw new Error(`Datei fehlt: ${filePath}`);
        }
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, "{}\n", "utf8");
      }

      return {
        async getFile() {
          return {
            async text() {
              return fs.readFileSync(filePath, "utf8");
            },
          };
        },
        async createWritable() {
          return {
            async write(content) {
              fs.writeFileSync(filePath, content, "utf8");
            },
            async close() {
              return true;
            },
          };
        },
      };
    },
  };
}

test("Backup-Hook + Restore-Flow laufen Ende-zu-Ende", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "backup-e2e-"));
  const dataDir = path.join(tempDir, "data");
  const configDir = path.join(tempDir, "config");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(configDir, { recursive: true });

  const manifestPath = path.join(configDir, "registry.manifest.json");
  const backupLogPath = path.join(dataDir, "backup_events.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        requiredRootFields: ["entries"],
        requiredEntryFields: ["id", "kind", "version", "entry"],
        allowedKinds: ["module"],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const originalRegistry = {
    entries: [
      {
        id: "module.alpha",
        kind: "module",
        version: "1.0.0",
        entry: { title: "Alt" },
      },
    ],
  };

  const newRegistry = {
    entries: [
      {
        id: "module.alpha",
        kind: "module",
        version: "1.1.0",
        entry: { title: "Neu" },
      },
    ],
  };

  fs.writeFileSync(
    path.join(dataDir, "registry.json"),
    `${JSON.stringify(originalRegistry, null, 2)}\n`,
    "utf8",
  );

  writeRegistryWithVersion({
    dataDir,
    manifestPath,
    registry: newRegistry,
    backupLogPath,
  });

  const events = readBackupLog(backupLogPath);
  assert.equal(events.length > 0, true);
  assert.equal(typeof events[0].backupPath, "string");

  const plan = buildRestorePlan(events[0].backupPath, "data/registry.json");
  assert.equal(plan.targetFileName, "registry.json");

  const projectDirHandle = createFsDirectoryHandle(tempDir);
  const restoreResult = await restoreBackupFromDirectory(
    projectDirHandle,
    plan,
  );

  assert.equal(restoreResult.ok, true);
  const restored = JSON.parse(
    fs.readFileSync(path.join(dataDir, "registry.json"), "utf8"),
  );
  assert.deepEqual(restored, originalRegistry);
});
