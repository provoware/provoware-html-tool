const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseRelativePath,
  writeProjectJsonFile,
  appendProjectTextFile,
} = require("../system-module/project_file_writer");

test("parseRelativePath validiert Ordner und Dateiname", () => {
  const result = parseRelativePath("data/kanban_board.json");
  assert.deepEqual(result, {
    directories: ["data"],
    fileName: "kanban_board.json",
  });
});

test("parseRelativePath lehnt Traversal ab", () => {
  assert.throws(
    () => parseRelativePath("../data/kanban_board.json"),
    /Dateipfad ungueltig/,
  );
});

test("writeProjectJsonFile schreibt JSON in verschachtelte Ordner", async () => {
  const writes = [];
  const writer = {
    async write(content) {
      writes.push(content);
      return true;
    },
    async close() {
      return true;
    },
  };

  const rootHandle = {
    async getDirectoryHandle(name) {
      assert.equal(name, "data");
      return {
        async getFileHandle(fileName) {
          assert.equal(fileName, "kanban_board.json");
          return {
            async createWritable() {
              return writer;
            },
          };
        },
      };
    },
  };

  const ok = await writeProjectJsonFile(rootHandle, "data/kanban_board.json", {
    version: 1,
    columns: [{ id: "idea", title: "Idee", items: [] }],
  });

  assert.equal(ok, true);
  assert.equal(writes.length, 1);
  assert.match(writes[0], /"version": 1/);
});

test("appendProjectTextFile haengt Zeile mit bestehendem Inhalt an", async () => {
  let written = "";
  const rootHandle = {
    async getDirectoryHandle() {
      return {
        async getFileHandle() {
          return {
            async getFile() {
              return {
                async text() {
                  return "[2026-03-01 10:00] Start";
                },
              };
            },
            async createWritable() {
              return {
                async write(content) {
                  written = content;
                },
                async close() {
                  return true;
                },
              };
            },
          };
        },
      };
    },
  };

  const ok = await appendProjectTextFile(
    rootHandle,
    "data/KASI_NOTIZ.txt",
    "[2026-03-01 10:05] Idee",
  );

  assert.equal(ok, true);
  assert.match(written, /10:00/);
  assert.match(written, /10:05/);
});
