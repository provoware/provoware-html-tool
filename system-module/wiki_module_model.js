(function exposeWikiModuleModel(globalObject) {
  function assertText(value, name, maxLength) {
    if (typeof value !== "string") {
      throw new Error(`${name} ist ungueltig. Bitte erneut versuchen.`);
    }

    const safeValue = value.trim();
    if (safeValue === "") {
      throw new Error(`${name} fehlt. Bitte erneut versuchen.`);
    }

    if (safeValue.length > maxLength) {
      throw new Error(
        `${name} ist zu lang. Bitte kuerzen oder Protokoll oeffnen.`,
      );
    }

    return safeValue;
  }

  function assertCategory(value) {
    const safe = assertText(value, "Kategorie", 40).toLowerCase();
    if (!/^[a-z0-9-]+$/.test(safe)) {
      throw new Error(
        "Kategorie ist ungueltig. Nur Buchstaben, Zahlen und Bindestriche nutzen.",
      );
    }
    return safe;
  }

  function assertList(value, name) {
    if (!Array.isArray(value)) {
      throw new Error(
        `${name} ist ungueltig. Reparatur starten oder erneut versuchen.`,
      );
    }
  }

  function createWikiModel(seed = []) {
    assertList(seed, "Wiki-Startliste");
    let entries = [];

    function validateEntry(entry) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error("Wiki-Eintrag ist ungueltig. Bitte erneut versuchen.");
      }

      const category = assertCategory(entry.category);
      const title = assertText(entry.title, "Titel", 120);
      const content = assertText(entry.content, "Inhalt", 2000);

      return {
        id:
          entry.id || `${category}-${title.toLowerCase().replace(/\s+/g, "-")}`,
        category,
        title,
        content,
        updatedAt: entry.updatedAt || new Date().toISOString(),
      };
    }

    function importState(state) {
      assertList(state, "Wiki-Liste");
      entries = state.map((item) => validateEntry(item));
      return { ok: true, count: entries.length };
    }

    function saveEntry(input) {
      const safe = validateEntry(input);
      const existingIndex = entries.findIndex(
        (entry) =>
          entry.category === safe.category && entry.title === safe.title,
      );

      if (existingIndex >= 0) {
        entries[existingIndex] = {
          ...entries[existingIndex],
          content: safe.content,
          updatedAt: new Date().toISOString(),
        };
        return { ok: true, mode: "updated", entry: entries[existingIndex] };
      }

      entries.push(safe);
      return { ok: true, mode: "created", entry: safe };
    }

    function listByCategory(category) {
      const safeCategory = assertCategory(category);
      const result = entries.filter((entry) => entry.category === safeCategory);
      if (!Array.isArray(result)) {
        throw new Error(
          "Wiki-Liste konnte nicht geladen werden. Reparatur starten.",
        );
      }
      return result;
    }

    function exportState() {
      return entries.map((entry) => ({ ...entry }));
    }

    importState(seed);

    return {
      exportState,
      importState,
      listByCategory,
      saveEntry,
    };
  }

  const api = { createWikiModel };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.WikiModuleModel = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
