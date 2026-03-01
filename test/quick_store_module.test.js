const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildAreaPayload,
  buildLyricsPreview,
  buildLyricsTemplate,
  getStorePathForArea,
  insertTemplateIntoContent,
  normalizeAreaPayload,
} = require("../templates/quick_store_module");

test("Quick-Store-Pfade sind pro Bereich getrennt", () => {
  assert.equal(getStorePathForArea("inbox"), "data/quick_store_inbox.json");
  assert.equal(getStorePathForArea("lyrics"), "data/quick_store_lyrics.json");
  assert.equal(
    getStorePathForArea("research"),
    "data/quick_store_research.json",
  );
});

test("normalizeAreaPayload setzt Bereich konsistent", () => {
  const entries = normalizeAreaPayload(
    {
      entries: [{ title: "A", content: "B", area: "falsch" }],
    },
    "lyrics",
  );

  assert.equal(entries.length, 1);
  assert.equal(entries[0].area, "lyrics");
});

test("buildAreaPayload erzeugt gueltiges Ergebnis", () => {
  const payload = buildAreaPayload([{ title: "T", content: "I" }], "research");

  assert.equal(payload.version, 1);
  assert.equal(payload.area, "research");
  assert.equal(Array.isArray(payload.entries), true);
  assert.equal(payload.entries.length, 1);
});

test("insertTemplateIntoContent fuegt Vorlage am Ende ein", () => {
  const field = { value: "Start" };
  const updated = insertTemplateIntoContent(field, "[Intro]\nZeile");

  assert.match(updated, /^Start\n\n\[Intro\]/);
  assert.match(updated, /Zeile\n$/);
});

test("buildLyricsTemplate liefert Bridge und Sonstiges", () => {
  assert.match(buildLyricsTemplate("bridge"), /^\[Bridge\]/);
  assert.match(buildLyricsTemplate("sonstiges"), /^\[Sonstiges\]/);
});

test("buildLyricsPreview erstellt Lesemodusdaten", () => {
  const preview = buildLyricsPreview("Titel", "Zeile 1\n\nZeile 2");

  assert.equal(preview.title, "Titel");
  assert.equal(preview.lineCount, 2);
  assert.equal(preview.text, "Zeile 1\nZeile 2");
});

test("buildLyricsPreview validiert leeren Inhalt", () => {
  assert.throws(() => buildLyricsPreview("Titel", "   "), /Songtext ist leer/);
});
