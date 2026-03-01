const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  addEntriesFromCsv,
  appendArchiveLog,
  createEmptyArchive,
  exportArchiveJson,
  importArchiveJson,
  splitCsvEntries,
  toLinuxSlug,
} = require("../system-core/genre_mood_style_archive");

const tmpDir = path.join(process.cwd(), "dummys", "tmp-tests");
const logPath = path.join(tmpDir, "genre-archive.log");

test("splitCsvEntries trennt Komma-Eingaben robust", () => {
  const result = splitCsvEntries("Techno, Chill, Hörspiele ");
  assert.deepEqual(result, ["Techno", "Chill", "Hörspiele"]);
});

test("toLinuxSlug erstellt linuxkonforme Namen", () => {
  const slug = toLinuxSlug("Hörspiel Nächte 2026");
  assert.equal(slug, "horspiel-nachte-2026");
});

test("addEntriesFromCsv speichert favoriten und entfernt Duplikate", () => {
  const archive = createEmptyArchive(["Techno"]);
  const result = addEntriesFromCsv(archive, {
    category: "genres",
    csvText: "*Techno*, House, techno",
    profile: "Techno",
  });

  assert.equal(result.added.length, 2);
  assert.equal(result.skippedDuplicates.length, 1);
  assert.equal(result.archive.techno.genres[1].favorite, true);
});

test("export und import liefern valides Archiv", () => {
  const archive = createEmptyArchive();
  addEntriesFromCsv(archive, {
    category: "moods",
    csvText: "*Dunkel*, Euphorisch",
    profile: "chill",
  });

  const raw = exportArchiveJson(archive);
  const imported = importArchiveJson(raw);

  assert.equal(imported.chill.moods.length, 2);
  assert.equal(imported.chill.moods[0].label, "Dunkel");
});

test("appendArchiveLog schreibt JSON-Logzeilen", () => {
  fs.mkdirSync(tmpDir, { recursive: true });
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }

  const out = appendArchiveLog(logPath, "archive-import", {
    profile: "techno",
    count: 2,
  });

  const line = fs.readFileSync(logPath, "utf8").trim();
  const parsed = JSON.parse(line);

  assert.equal(out.logPath, logPath);
  assert.equal(parsed.event, "archive-import");
  assert.equal(parsed.details.count, 2);
});
