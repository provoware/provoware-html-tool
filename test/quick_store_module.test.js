const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildAreaPayload,
  buildLyricsPreview,
  buildLyricsTemplate,
  buildTemplateHelp,
  getStorePathForArea,
  insertTemplateIntoContent,
  normalizeAreaPayload,
  copyPreviewToClipboard,
  buildRandomLyricsSnippet,
  resolveRandomProfile,
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

test("buildTemplateHelp liefert kurze Hilfetexte", () => {
  assert.match(buildTemplateHelp("intro"), /^Intro:/);
  assert.match(buildTemplateHelp("refrain"), /^Refrain:/);
  assert.match(buildTemplateHelp("bridge"), /^Bridge:/);
  assert.match(buildTemplateHelp("sonstiges"), /^Sonstiges:/);
});

test("buildTemplateHelp validiert ungueltigen Typ", () => {
  assert.throws(() => buildTemplateHelp("x"), /Vorlagen-Hilfe ist ungueltig/);
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

test("copyPreviewToClipboard schreibt bereinigten Text", async () => {
  let written = "";
  const clipboard = {
    writeText: async (value) => {
      written = value;
    },
  };

  await copyPreviewToClipboard("  Zeile 1\nZeile 2  ", clipboard);
  assert.equal(written, "Zeile 1\nZeile 2");
});

test("copyPreviewToClipboard validiert fehlenden Text", () => {
  assert.throws(
    () => copyPreviewToClipboard("   ", { writeText: async () => {} }),
    /Songtext zum Kopieren fehlt/,
  );
});

test("copyPreviewToClipboard meldet manuellen Rueckweg ohne Clipboard", () => {
  assert.throws(
    () => copyPreviewToClipboard("Zeile 1", null),
    /manuell kopieren/,
  );
});

test("buildRandomLyricsSnippet erstellt gueltigen Zufallsblock", () => {
  const fixedRandom = () => 0;
  const snippet = buildRandomLyricsSnippet("techno", fixedRandom);

  assert.match(snippet, /^\[Impuls\]/);
  assert.match(snippet, /Profil: techno/);
  assert.match(snippet, /Genre:/);
  assert.match(snippet, /Stimmung:/);
  assert.match(snippet, /Stil:/);
});

test("buildRandomLyricsSnippet validiert Zufallsfunktion", () => {
  assert.throws(
    () => buildRandomLyricsSnippet("standard", null),
    /Zufallsfunktion fehlt/,
  );
});

test("resolveRandomProfile validiert ungueltiges Profil", () => {
  assert.throws(
    () => resolveRandomProfile("metal"),
    /Zufallsprofil ist ungueltig/,
  );
});

test("buildRandomLyricsSnippet nutzt Standardprofil bei leerem Profil", () => {
  const snippet = buildRandomLyricsSnippet("", () => 0);
  assert.match(snippet, /Profil: standard/);
});
