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

  window.createQuickStoreModule = function createQuickStoreModule(options) {
    const model = window.QuickStoreModel?.createQuickStoreModel?.();
    if (!model) {
      throw new Error(
        "Schnellspeicher-Modell fehlt. Reparatur starten oder erneut versuchen.",
      );
    }

    const titleInput = assertElement(options.titleInput, "Schnell-Titel");
    const contentInput = assertElement(options.contentInput, "Schnell-Inhalt");
    const saveButton = assertElement(options.saveButton, "Schnell-Speichern");
    const clearButton = assertElement(options.clearButton, "Schnell-Leeren");
    const list = assertElement(options.list, "Schnell-Liste");
    const setStatus = assertElement(options.setStatus, "Statusfunktion");
    const setDebug = options.setDebug;
    const saveJson = assertElement(options.saveJson, "Dateischreiber");

    async function persist() {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        entries: model.listEntries(),
      };
      const ok = await saveJson(QUICK_STORE_PATH, payload);
      if (!ok) {
        throw new Error(
          "Schnellspeicher-Datei konnte nicht gesichert werden. Erneut versuchen.",
        );
      }
      return true;
    }

    function render() {
      const entries = model.listEntries();
      list.innerHTML = "";

      if (entries.length === 0) {
        const empty = document.createElement("li");
        empty.textContent =
          "Noch kein Eintrag. Naechster Schritt: Titel und Inhalt speichern.";
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
        });
        await persist();
        const count = render();
        contentInput.value = "";
        setStatus(
          "Schnellspeicher gesichert. Naechster Schritt: Eintrag pruefen oder erneut speichern.",
        );
        if (typeof setDebug === "function") {
          setDebug(
            `Debug: Schnellspeicher hat ${count} Eintraege. Letzter Titel: ${result.entry.title}`,
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

    saveButton.addEventListener("click", onSave);
    clearButton.addEventListener("click", onClear);

    render();

    return {
      render,
    };
  };
})();
