(function exposeQuickStoreModel(globalObject) {
  function assertText(value, label, maxLength) {
    if (typeof value !== "string") {
      throw new Error(`${label} ist ungueltig. Bitte erneut versuchen.`);
    }

    const safe = value.trim();
    if (!safe) {
      throw new Error(`${label} fehlt. Bitte erneut versuchen.`);
    }

    if (safe.length > maxLength) {
      throw new Error(
        `${label} ist zu lang. Bitte kuerzen oder Protokoll oeffnen.`,
      );
    }

    return safe;
  }

  function assertArray(value, label) {
    if (!Array.isArray(value)) {
      throw new Error(
        `${label} ist ungueltig. Reparatur starten oder erneut versuchen.`,
      );
    }
  }

  function createQuickStoreModel(seed = []) {
    assertArray(seed, "Schnellspeicher-Startliste");
    let entries = [];

    function validateEntry(input) {
      if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new Error(
          "Schnellspeicher-Eintrag ist ungueltig. Bitte erneut versuchen.",
        );
      }

      const title = assertText(input.title, "Titel", 80);
      const content = assertText(input.content, "Inhalt", 2000);
      const now = new Date().toISOString();

      return {
        id: input.id || `quick-${Date.now()}-${entries.length + 1}`,
        title,
        content,
        createdAt: input.createdAt || now,
      };
    }

    function importState(state) {
      assertArray(state, "Schnellspeicher-Liste");
      entries = state.map((item) => validateEntry(item));
      return { ok: true, count: entries.length };
    }

    function addEntry(input) {
      const entry = validateEntry(input);
      entries.unshift(entry);
      if (!entries.some((item) => item.id === entry.id)) {
        throw new Error(
          "Schnellspeicher konnte nicht gespeichert werden. Erneut versuchen.",
        );
      }
      return { ok: true, entry };
    }

    function listEntries() {
      return entries.map((item) => ({ ...item }));
    }

    importState(seed);

    return {
      addEntry,
      importState,
      listEntries,
    };
  }

  const api = { createQuickStoreModel };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.QuickStoreModel = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
