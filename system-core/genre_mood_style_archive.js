const fs = require("node:fs");

const CATEGORIES = ["genres", "moods", "styles"];
const DEFAULT_PROFILES = ["techno", "hoerspiele", "chill"];

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `${name} fehlt. Bitte Eingabe pruefen und erneut versuchen.`,
    );
  }
}

function assertArchive(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Archiv ist ungueltig. Bitte Reparatur starten.");
  }

  for (const profile of Object.keys(value)) {
    const entry = value[profile];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Profil ist ungueltig. Bitte Reparatur starten.");
    }

    for (const category of CATEGORIES) {
      if (!Array.isArray(entry[category])) {
        throw new Error(
          `Kategorie ${category} fehlt. Bitte Reparatur starten oder Protokoll oeffnen.`,
        );
      }
    }
  }
}

function normalizeProfile(profile) {
  assertText(profile, "Profil");
  const safe = toLinuxSlug(profile);
  if (safe === "") {
    throw new Error(
      "Profil ist leer. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }
  return safe;
}

function createEmptyArchive(profiles = DEFAULT_PROFILES) {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error(
      "Profile fehlen. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  const archive = {};
  for (const profile of profiles) {
    const key = normalizeProfile(profile);
    archive[key] = {
      genres: [],
      moods: [],
      styles: [],
    };
  }

  assertArchive(archive);
  return archive;
}

function assertCategory(category) {
  assertText(category, "Kategorie");
  if (!CATEGORIES.includes(category)) {
    throw new Error(
      `Kategorie ${category} ist ungueltig. Bitte Erneut versuchen oder Protokoll oeffnen.`,
    );
  }
}

function splitCsvEntries(csvText) {
  assertText(csvText, "CSV-Eingabe");
  const parts = csvText
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    throw new Error(
      "Keine Eintraege gefunden. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  return parts;
}

function toLinuxSlug(text) {
  assertText(text, "Text");
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFavoriteToken(token) {
  assertText(token, "Eintrag");
  const trimmed = token.trim();
  const isFavorite =
    (trimmed.startsWith("*") && trimmed.endsWith("*")) ||
    trimmed.startsWith("*") ||
    trimmed.endsWith("*");
  const cleanLabel = trimmed.replace(/^\*+|\*+$/g, "").trim();

  if (cleanLabel === "") {
    throw new Error(
      "Eintrag ist leer. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  return {
    label: cleanLabel,
    favorite: isFavorite,
  };
}

function ensureProfile(archive, profile) {
  assertArchive(archive);
  const safeProfile = normalizeProfile(profile);
  if (!archive[safeProfile]) {
    archive[safeProfile] = {
      genres: [],
      moods: [],
      styles: [],
    };
  }
  return safeProfile;
}

function addEntriesFromCsv(archive, options) {
  assertArchive(archive);
  if (!options || typeof options !== "object") {
    throw new Error(
      "Optionen fehlen. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  const { category, csvText, profile } = options;
  assertCategory(category);
  const safeProfile = ensureProfile(archive, profile);
  const tokens = splitCsvEntries(csvText);
  const existing = new Set(
    archive[safeProfile][category].map((item) => item.slug),
  );
  const added = [];
  const skippedDuplicates = [];

  for (const token of tokens) {
    const parsed = parseFavoriteToken(token);
    const slug = toLinuxSlug(parsed.label);
    if (slug === "") {
      continue;
    }

    if (existing.has(slug)) {
      skippedDuplicates.push(parsed.label);
      continue;
    }

    existing.add(slug);
    const entry = {
      id: `${safeProfile}-${category}-${slug}`,
      label: parsed.label,
      slug,
      favorite: parsed.favorite,
      createdAt: new Date().toISOString(),
    };
    archive[safeProfile][category].push(entry);
    added.push(entry);
  }

  archive[safeProfile][category].sort((a, b) =>
    a.label.localeCompare(b.label, "de", { sensitivity: "base" }),
  );

  return {
    archive,
    added,
    skippedDuplicates,
  };
}

function exportArchiveJson(archive) {
  assertArchive(archive);
  const output = JSON.stringify({ version: 1, archive }, null, 2);
  if (typeof output !== "string" || output.length === 0) {
    throw new Error("Export fehlgeschlagen. Bitte erneut versuchen.");
  }
  return output;
}

function importArchiveJson(rawJson) {
  assertText(rawJson, "Import-Text");
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error(
      "Import ist kein gueltiges JSON. Bitte Reparatur starten oder Protokoll oeffnen.",
    );
  }

  if (!parsed || typeof parsed !== "object" || !parsed.archive) {
    throw new Error(
      "Import-Struktur fehlt. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  assertArchive(parsed.archive);
  return parsed.archive;
}

function appendArchiveLog(logPath, eventName, details = {}) {
  assertText(logPath, "Log-Pfad");
  assertText(eventName, "Ereignisname");
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    throw new Error("Log-Details sind ungueltig. Bitte Eingabe pruefen.");
  }

  const record = {
    timestamp: new Date().toISOString(),
    event: eventName,
    details,
  };
  fs.appendFileSync(logPath, `${JSON.stringify(record)}\n`, "utf8");

  const output = { logPath, event: eventName };
  if (output.logPath !== logPath) {
    throw new Error("Log-Ausgabe ungueltig. Bitte Protokoll oeffnen.");
  }
  return output;
}

module.exports = {
  CATEGORIES,
  DEFAULT_PROFILES,
  addEntriesFromCsv,
  appendArchiveLog,
  createEmptyArchive,
  exportArchiveJson,
  importArchiveJson,
  splitCsvEntries,
  toLinuxSlug,
};
