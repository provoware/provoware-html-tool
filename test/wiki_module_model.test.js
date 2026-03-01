const test = require("node:test");
const assert = require("node:assert/strict");
const { createWikiModel } = require("../system-module/wiki_module_model");

test("Wiki-Modell speichert neuen Eintrag", () => {
  const model = createWikiModel();
  const result = model.saveEntry({
    category: "tool",
    title: "Startcheck",
    content: "Startet Format, Tests und Abschlusspruefung.",
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, "created");
  assert.equal(model.listByCategory("tool").length, 1);
});

test("Wiki-Modell aktualisiert vorhandenen Eintrag", () => {
  const model = createWikiModel();
  model.saveEntry({
    category: "prozess",
    title: "Ablauf",
    content: "Version 1",
  });

  const updated = model.saveEntry({
    category: "prozess",
    title: "Ablauf",
    content: "Version 2",
  });

  assert.equal(updated.mode, "updated");
  assert.equal(model.listByCategory("prozess")[0].content, "Version 2");
});

test("Wiki-Modell validiert Kategorie", () => {
  const model = createWikiModel();
  assert.throws(
    () =>
      model.saveEntry({
        category: "A11y Hilfe",
        title: "Fehler",
        content: "ungueltig",
      }),
    /Kategorie ist ungueltig/,
  );
});

test("Wiki-Modell exportiert und importiert Zustand", () => {
  const source = createWikiModel();
  source.saveEntry({
    category: "a11y",
    title: "Fokus",
    content: "Fokus immer sichtbar machen.",
  });

  const exported = source.exportState();
  const target = createWikiModel();
  const result = target.importState(exported);

  assert.equal(result.ok, true);
  assert.equal(target.listByCategory("a11y").length, 1);
});
