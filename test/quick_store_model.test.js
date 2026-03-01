const test = require("node:test");
const assert = require("node:assert/strict");
const { createQuickStoreModel } = require("../system-module/quick_store_model");

test("Schnellspeicher speichert Eintrag vorne", () => {
  const model = createQuickStoreModel();
  model.addEntry({ title: "A", content: "Erster" });
  model.addEntry({ title: "B", content: "Zweiter" });

  const entries = model.listEntries();
  assert.equal(entries.length, 2);
  assert.equal(entries[0].title, "B");
  assert.equal(entries[1].title, "A");
});

test("Schnellspeicher validiert leeren Titel", () => {
  const model = createQuickStoreModel();
  assert.throws(
    () => model.addEntry({ title: " ", content: "Inhalt" }),
    /Titel fehlt/,
  );
});

test("Schnellspeicher kann Zustand importieren", () => {
  const source = createQuickStoreModel();
  source.addEntry({ title: "A", content: "Inhalt" });

  const target = createQuickStoreModel();
  const result = target.importState(source.listEntries());

  assert.equal(result.ok, true);
  assert.equal(result.count, 1);
  assert.equal(target.listEntries()[0].title, "A");
});
