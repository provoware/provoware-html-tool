(function exposeQuickStoreModel(globalObject) {
  const DEFAULT_AREA = "inbox";
  const ALLOWED_AREAS = ["inbox", "lyrics", "research"];

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

  function assertArea(value) {
    if (typeof value !== "string" || !ALLOWED_AREAS.includes(value)) {
      throw new Error(
        "Bereich ist ungueltig. Bitte Bereich waehlen und erneut versuchen.",
      );
    }

    return value;
  }

  function assertArray(value, label) {
    if (!Array.isArray(value)) {
      throw new Error(
        `${label} ist ungueltig. Reparatur starten oder erneut versuchen.`,
      );
    }
  }

  function createQuickStoreModel(seed = []) {
    let activeArea = DEFAULT_AREA;
    let areaEntries = {
      inbox: [],
      lyrics: [],
      research: [],
    };

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
        id: input.id || `quick-${Date.now()}`,
        title,
        content,
        area: assertArea(input.area || activeArea),
        createdAt: input.createdAt || now,
      };
    }

    function importState(state) {
      if (Array.isArray(state)) {
        areaEntries.inbox = state.map((item) =>
          validateEntry({ ...item, area: "inbox" }),
        );
        return { ok: true, count: areaEntries.inbox.length };
      }

      if (!state || typeof state !== "object" || Array.isArray(state)) {
        throw new Error(
          "Schnellspeicher-Zustand ist ungueltig. Bitte erneut versuchen.",
        );
      }

      const safeAreas = state.areas || {};
      ALLOWED_AREAS.forEach((area) => {
        const entriesForArea = Array.isArray(safeAreas[area])
          ? safeAreas[area]
          : [];
        areaEntries[area] = entriesForArea.map((item) =>
          validateEntry({ ...item, area }),
        );
      });

      return {
        ok: true,
        count: ALLOWED_AREAS.reduce(
          (sum, area) => sum + areaEntries[area].length,
          0,
        ),
      };
    }

    function addEntry(input) {
      const entry = validateEntry(input);
      areaEntries[entry.area].unshift(entry);
      if (!areaEntries[entry.area].some((item) => item.id === entry.id)) {
        throw new Error(
          "Schnellspeicher konnte nicht gespeichert werden. Erneut versuchen.",
        );
      }
      return { ok: true, entry };
    }

    function listEntries(area = activeArea) {
      const safeArea = assertArea(area);
      return areaEntries[safeArea].map((item) => ({ ...item }));
    }

    function setActiveArea(area) {
      activeArea = assertArea(area);
      return { ok: true, area: activeArea };
    }

    function getActiveArea() {
      return activeArea;
    }

    function exportState() {
      const areas = {};
      ALLOWED_AREAS.forEach((area) => {
        areas[area] = listEntries(area);
      });

      return {
        ok: true,
        state: {
          version: 1,
          updatedAt: new Date().toISOString(),
          areas,
        },
      };
    }

    function listAreas() {
      return [...ALLOWED_AREAS];
    }

    importState(seed);

    return {
      addEntry,
      exportState,
      getActiveArea,
      importState,
      listAreas,
      listEntries,
      setActiveArea,
    };
  }

  const api = { createQuickStoreModel };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.QuickStoreModel = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
