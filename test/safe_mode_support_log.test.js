const test = require("node:test");
const assert = require("node:assert/strict");

const {
  LOG_FILE_PATH,
  appendSafeModeSupportEvent,
  createSupportEventEntry,
  normalizeEventLog,
} = require("../system-module/safe_mode_support_log.js");

function createFileHandle(initialText = "") {
  let content = initialText;
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

function createRootHandle(fileMap) {
  return {
    async getDirectoryHandle() {
      return {
        async getFileHandle(name, options = {}) {
          if (!(name in fileMap) && options.create === true) {
            fileMap[name] = createFileHandle("");
          }
          if (!(name in fileMap)) {
            throw new Error("Datei fehlt");
          }
          return fileMap[name];
        },
      };
    },
  };
}

function createProjectFileWriter(fileMap) {
  return {
    async resolveProjectFileHandle(rootHandle, relativePath) {
      const dataHandle = await rootHandle.getDirectoryHandle("data", {
        create: true,
      });
      const fileName = relativePath.replace("data/", "");
      return dataHandle.getFileHandle(fileName, { create: true });
    },
    async writeProjectJsonFile(rootHandle, relativePath, payload) {
      const fileHandle = await this.resolveProjectFileHandle(
        rootHandle,
        relativePath,
      );
      const writer = await fileHandle.createWritable();
      await writer.write(`${JSON.stringify(payload, null, 2)}\n`);
      await writer.close();
      return true;
    },
  };
}

test("createSupportEventEntry validiert Input und liefert Event", () => {
  const entry = createSupportEventEntry("Manueller Reset", "Plugin defekt");
  assert.equal(entry.kind, "safe-mode-reset");
  assert.match(entry.id, /^safe-mode-reset-/);
  assert.equal(entry.cause, "Manueller Reset");
  assert.equal(entry.details, "Plugin defekt");
  assert.match(entry.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("normalizeEventLog filtert ungueltige Eintraege", () => {
  const normalized = normalizeEventLog({
    events: [{ id: "1" }, null, "text", { id: "2", ok: true }],
  });
  assert.equal(normalized.events.length, 2);
});

test("appendSafeModeSupportEvent haengt Verlaufseintrag an", async () => {
  const fileMap = {
    "backup_events.json": createFileHandle('{"events":[{"id":"old"}]}'),
  };
  const rootHandle = createRootHandle(fileMap);
  globalThis.ProjectFileWriter = createProjectFileWriter(fileMap);

  const result = await appendSafeModeSupportEvent(
    rootHandle,
    "Safe-Mode-Reset",
    "Standard-Manifest wiederhergestellt",
  );

  assert.equal(result.ok, true);
  assert.equal(result.filePath, LOG_FILE_PATH);
  assert.equal(result.eventCount, 2);

  const parsed = JSON.parse(fileMap["backup_events.json"].read());
  assert.equal(parsed.events.length, 2);
  assert.equal(parsed.events[1].kind, "safe-mode-reset");
});
