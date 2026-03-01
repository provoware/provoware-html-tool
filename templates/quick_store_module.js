(function exposeQuickStoreModule(globalObject) {
  const LEGACY_STORE_PATH = "data/quick_store_entries.json";
  const AREA_STORE_PATHS = {
    inbox: "data/quick_store_inbox.json",
    lyrics: "data/quick_store_lyrics.json",
    research: "data/quick_store_research.json",
  };

  function assertElement(element, name) {
    if (!element) {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return element;
  }

  function assertFunction(value, name) {
    if (typeof value !== "function") {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return value;
  }

  function assertArea(area) {
    if (typeof area !== "string" || !AREA_STORE_PATHS[area]) {
      throw new Error(
        "Bereich ist ungueltig. Bitte Bereich waehlen und erneut versuchen.",
      );
    }
    return area;
  }

  function getStorePathForArea(area) {
    return AREA_STORE_PATHS[assertArea(area)];
  }

  function normalizeAreaPayload(payload, area) {
    assertArea(area);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return [];
    }

    const entries = Array.isArray(payload.entries) ? payload.entries : [];
    return entries.map((item) => ({ ...item, area }));
  }

  function buildAreaPayload(entries, area) {
    assertArea(area);
    if (!Array.isArray(entries)) {
      throw new Error(
        "Bereichseintraege sind ungueltig. Reparatur starten oder erneut versuchen.",
      );
    }

    return {
      version: 1,
      area,
      updatedAt: new Date().toISOString(),
      entries,
    };
  }

  function renderAreaLabel(area) {
    if (area === "inbox") {
      return "Allgemein";
    }
    if (area === "lyrics") {
      return "Songideen";
    }
    return "Recherche";
  }

  function insertTemplateIntoContent(inputElement, templateText) {
    const field = assertElement(inputElement, "Songtext-Inhalt");
    if (typeof templateText !== "string" || !templateText.trim()) {
      throw new Error(
        "Vorlage ist ungueltig. Bitte erneut versuchen oder Protokoll oeffnen.",
      );
    }

    const before = field.value ? `${field.value.trimEnd()}\n\n` : "";
    field.value = `${before}${templateText.trim()}\n`;
    return field.value;
  }

  globalObject.createQuickStoreModule = function createQuickStoreModule(
    options,
  ) {
    const model = globalObject.QuickStoreModel?.createQuickStoreModel?.();
    if (!model) {
      throw new Error(
        "Schnellspeicher-Modell fehlt. Reparatur starten oder erneut versuchen.",
      );
    }

    const areaSelect = assertElement(options.areaSelect, "Schnell-Bereich");
    const titleInput = assertElement(options.titleInput, "Schnell-Titel");
    const contentInput = assertElement(options.contentInput, "Schnell-Inhalt");
    const saveButton = assertElement(options.saveButton, "Schnell-Speichern");
    const clearButton = assertElement(options.clearButton, "Schnell-Leeren");
    const list = assertElement(options.list, "Schnell-Liste");
    const lyricsEditor = assertElement(options.lyricsEditor, "Lyrics-Editor");
    const introButton = assertElement(options.introButton, "Intro-Vorlage");
    const refrainButton = assertElement(
      options.refrainButton,
      "Refrain-Vorlage",
    );
    const lyricsBackButton = assertElement(
      options.lyricsBackButton,
      "Lyrics-Zurueck",
    );
    const lyricsClearButton = assertElement(
      options.lyricsClearButton,
      "Lyrics-Leeren",
    );
    const setStatus = assertElement(options.setStatus, "Statusfunktion");
    const setDebug = options.setDebug;
    const saveJson = assertElement(options.saveJson, "Dateischreiber");
    const readJson = assertFunction(options.readJson, "Dateileser");

    function renderAreaOptions() {
      areaSelect.innerHTML = "";
      model.listAreas().forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = renderAreaLabel(area);
        areaSelect.appendChild(option);
      });
      areaSelect.value = model.getActiveArea();
      return true;
    }

    function renderLyricsEditor() {
      const isLyrics = model.getActiveArea() === "lyrics";
      lyricsEditor.hidden = !isLyrics;
      return isLyrics;
    }

    async function persistArea(area) {
      const state = model.exportState().state;
      const entries = Array.isArray(state.areas?.[area])
        ? state.areas[area]
        : [];
      const payload = buildAreaPayload(entries, area);
      const ok = await saveJson(getStorePathForArea(area), payload);
      if (!ok) {
        throw new Error(
          "Schnellspeicher-Datei konnte nicht gesichert werden. Erneut versuchen.",
        );
      }
      return true;
    }

    async function persistAllAreas() {
      const areas = model.listAreas();
      for (const area of areas) {
        await persistArea(area);
      }
      return true;
    }

    async function loadFromAreaFiles() {
      const areas = model.listAreas();
      const imported = { areas: {} };
      let loadedCount = 0;

      for (const area of areas) {
        const path = getStorePathForArea(area);
        const payload = await readJson(path);
        if (payload.ok) {
          imported.areas[area] = normalizeAreaPayload(payload.value, area);
          loadedCount += 1;
        }
      }

      if (loadedCount === 0) {
        return { ok: true, loaded: false };
      }

      model.importState(imported);
      return { ok: true, loaded: true, loadedCount };
    }

    async function migrateLegacyStore() {
      const legacy = await readJson(LEGACY_STORE_PATH);
      if (!legacy.ok) {
        return { ok: true, migrated: false };
      }

      model.importState(legacy.value);
      await persistAllAreas();
      return { ok: true, migrated: true };
    }

    async function loadPersistedState() {
      const areaLoad = await loadFromAreaFiles();
      if (areaLoad.loaded) {
        render();
        renderLyricsEditor();
        setStatus(
          "Schnellspeicher geladen. Naechster Schritt: Bereich waehlen oder Notiz speichern.",
        );
        return areaLoad;
      }

      const migration = await migrateLegacyStore();
      if (migration.migrated) {
        render();
        renderLyricsEditor();
        setStatus(
          "Alte Schnellspeicher-Datei uebernommen. Naechster Schritt: Songideen oder Notiz speichern.",
        );
        return migration;
      }

      setStatus(
        "Schnellspeicher startet leer. Naechster Schritt: Erste Notiz speichern.",
      );
      return { ok: true, loaded: false };
    }

    function render() {
      const entries = model.listEntries();
      list.innerHTML = "";
      if (entries.length === 0) {
        const empty = document.createElement("li");
        empty.textContent =
          "Noch kein Eintrag in diesem Bereich. Naechster Schritt: Titel und Inhalt speichern.";
        list.appendChild(empty);
        return 0;
      }

      entries.slice(0, 8).forEach((entry) => {
        const item = document.createElement("li");
        item.className = "quick-item";
        const title = document.createElement("strong");
        title.textContent = entry.title;
        const content = document.createElement("p");
        content.textContent = entry.content;
        item.append(title, content);
        list.appendChild(item);
      });
      return entries.length;
    }

    async function onSave() {
      try {
        const result = model.addEntry({
          title: titleInput.value,
          content: contentInput.value,
          area: areaSelect.value,
        });
        await persistArea(result.entry.area);
        const count = render();
        contentInput.value = "";
        setStatus(
          "Schnellspeicher gesichert. Naechster Schritt: Eintrag pruefen oder erneut speichern.",
        );
        if (typeof setDebug === "function") {
          setDebug(
            `Debug: Bereich ${result.entry.area} hat ${count} Eintraege. Letzter Titel: ${result.entry.title}`,
          );
        }
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Erneut versuchen.`);
      }
    }

    function onClear() {
      titleInput.value = "";
      contentInput.value = "";
      titleInput.focus();
      setStatus(
        "Eingabe geleert. Naechster Schritt: Neue Notiz schreiben oder Zurueck gehen.",
      );
      return true;
    }

    function onAreaChange() {
      try {
        model.setActiveArea(areaSelect.value);
        const count = render();
        const isLyrics = renderLyricsEditor();
        const hint = isLyrics
          ? "Songtext-Hilfe nutzen"
          : "Notiz speichern oder Eintrag pruefen";
        setStatus(
          `Bereich gewechselt. Naechster Schritt: ${hint} (${count} sichtbar).`,
        );
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Erneut versuchen.`);
      }
    }

    function onLyricsTemplate(templateText, templateLabel) {
      try {
        const nextValue = insertTemplateIntoContent(contentInput, templateText);
        if (nextValue.trim().length === 0) {
          throw new Error(
            "Vorlage konnte nicht eingefuegt werden. Erneut versuchen.",
          );
        }
        contentInput.focus();
        setStatus(
          `${templateLabel} eingefuegt. Naechster Schritt: Text anpassen oder Notiz speichern.`,
        );
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Erneut versuchen.`);
      }
    }

    function onLyricsBack() {
      model.setActiveArea("inbox");
      areaSelect.value = "inbox";
      render();
      renderLyricsEditor();
      areaSelect.focus();
      setStatus(
        "Rueckweg aktiv: Bereich Allgemein geoeffnet. Naechster Schritt: Notiz speichern oder Songideen spaeter fortsetzen.",
      );
      return true;
    }

    function onLyricsEscape(event) {
      if (event.key !== "Escape" || model.getActiveArea() !== "lyrics") {
        return false;
      }
      event.preventDefault();
      return onLyricsBack();
    }

    saveButton.addEventListener("click", onSave);
    clearButton.addEventListener("click", onClear);
    areaSelect.addEventListener("change", onAreaChange);
    introButton.addEventListener("click", () =>
      onLyricsTemplate("[Intro]\nZeile 1\nZeile 2", "Intro-Vorlage"),
    );
    refrainButton.addEventListener("click", () =>
      onLyricsTemplate(
        "[Refrain]\nHook-Zeile 1\nHook-Zeile 2",
        "Refrain-Vorlage",
      ),
    );
    lyricsBackButton.addEventListener("click", onLyricsBack);
    lyricsClearButton.addEventListener("click", onClear);
    contentInput.addEventListener("keydown", onLyricsEscape);

    renderAreaOptions();
    renderLyricsEditor();
    loadPersistedState();
    render();

    return {
      render,
      persistAllAreas,
    };
  };

  const api = {
    AREA_STORE_PATHS,
    buildAreaPayload,
    getStorePathForArea,
    insertTemplateIntoContent,
    normalizeAreaPayload,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
