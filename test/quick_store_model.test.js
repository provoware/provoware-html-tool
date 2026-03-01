const test = require("node:test");
const assert = require("node:assert/strict");
const { createQuickStoreModel } = require("../system-module/quick_store_model");

test("Schnellspeicher speichert Eintrag vorne im aktiven Bereich", () => {
  const model = createQuickStoreModel();
  model.addEntry({ title: "A", content: "Erster", area: "inbox" });
  model.addEntry({ title: "B", content: "Zweiter", area: "inbox" });

  const entries = model.listEntries("inbox");
  assert.equal(entries.length, 2);
  assert.equal(entries[0].title, "B");
  assert.equal(entries[1].title, "A");
});

test("Schnellspeicher validiert leeren Titel", () => {
  const model = createQuickStoreModel();
  assert.throws(
    () => model.addEntry({ title: " ", content: "Inhalt", area: "inbox" }),
    /Titel fehlt/,
  );
});

test("Schnellspeicher validiert ungueltigen Bereich", () => {
  const model = createQuickStoreModel();
  assert.throws(
    () => model.addEntry({ title: "A", content: "Inhalt", area: "falsch" }),
    /Bereich ist ungueltig/,
  );
});

test("Schnellspeicher kann Zustand je Bereich importieren", () => {
  const model = createQuickStoreModel();
  const result = model.importState({
    areas: {
      inbox: [{ title: "A", content: "I" }],
      lyrics: [{ title: "B", content: "L" }],
      research: [{ title: "C", content: "R" }],
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.count, 3);
  assert.equal(model.listEntries("lyrics")[0].title, "B");
});

test("Schnellspeicher exportiert alle Bereiche", () => {
  const model = createQuickStoreModel();
  model.addEntry({ title: "A", content: "Text", area: "research" });
  const exported = model.exportState();

  assert.equal(exported.ok, true);
  assert.equal(exported.state.version, 1);
  assert.equal(exported.state.areas.research.length, 1);
  assert.equal(exported.state.areas.inbox.length, 0);
});

test("Schnellspeicher kann aktiven Bereich wechseln", () => {
  const model = createQuickStoreModel();
  const result = model.setActiveArea("lyrics");

  assert.equal(result.ok, true);
  assert.equal(model.getActiveArea(), "lyrics");
});
