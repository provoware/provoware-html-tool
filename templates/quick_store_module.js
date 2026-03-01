(function exposeQuickStoreModule() {
  const QUICK_STORE_PATH = "data/quick_store_entries.json";

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

  window.createQuickStoreModule = function createQuickStoreModule(options) {
    const model = window.QuickStoreModel?.createQuickStoreModel?.();
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
    const setStatus = assertElement(options.setStatus, "Statusfunktion");
    const setDebug = options.setDebug;
    const saveJson = assertElement(options.saveJson, "Dateischreiber");
    const readJson = assertFunction(options.readJson, "Dateileser");

    function renderAreaOptions() {
      areaSelect.innerHTML = "";
      model.listAreas().forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent =
          area === "inbox"
            ? "Allgemein"
            : area === "lyrics"
              ? "Songideen"
              : "Recherche";
        areaSelect.appendChild(option);
      });
      areaSelect.value = model.getActiveArea();
      return true;
    }

    async function persist() {
      const payload = model.exportState().state;
      const ok = await saveJson(QUICK_STORE_PATH, payload);
      if (!ok) {
        throw new Error(
          "Schnellspeicher-Datei konnte nicht gesichert werden. Erneut versuchen.",
        );
      }
      return true;
    }

    async function loadPersistedState() {
      const payload = await readJson(QUICK_STORE_PATH);
      if (!payload.ok) {
        setStatus(
          "Schnellspeicher startet leer. Naechster Schritt: Erste Notiz speichern.",
        );
        return { ok: true, loaded: false };
      }

      model.importState(payload.value);
      render();
      setStatus(
        "Schnellspeicher geladen. Naechster Schritt: Bereich waehlen oder Notiz speichern.",
      );
      return { ok: true, loaded: true };
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
        await persist();
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
        setStatus(
          `Bereich gewechselt. Naechster Schritt: Notiz speichern oder Eintrag pruefen (${count} sichtbar).`,
        );
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Erneut versuchen.`);
      }
    }

    saveButton.addEventListener("click", onSave);
    clearButton.addEventListener("click", onClear);
    areaSelect.addEventListener("change", onAreaChange);

    renderAreaOptions();
    loadPersistedState();
    render();

    return {
      render,
    };
  };
})();
