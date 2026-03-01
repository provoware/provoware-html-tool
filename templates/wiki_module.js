(function exposeWikiModule() {
  const WIKI_PATH = "data/wiki_notes.json";

  function assertElement(element, name) {
    if (!element) {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return element;
  }

  async function readWikiFromProject(projectDir) {
    if (!projectDir || typeof projectDir.getFileHandle !== "function") {
      return [];
    }

    const fileHandle = await projectDir.getFileHandle(WIKI_PATH, {
      create: true,
    });
    const file = await fileHandle.getFile();
    const text = await file.text();
    if (!text.trim()) {
      return [];
    }
    const json = JSON.parse(text);
    if (!Array.isArray(json.entries)) {
      throw new Error(
        "Wiki-Datei ist ungueltig. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
    }
    return json.entries;
  }

  window.createWikiModule = function createWikiModule(options) {
    const model = window.WikiModuleModel?.createWikiModel?.();
    if (!model) {
      throw new Error(
        "Wiki-Modell fehlt. Naechster Schritt: Reparatur starten oder erneut versuchen.",
      );
    }

    const categoryInput = assertElement(
      options.categoryInput,
      "Wiki-Kategorie",
    );
    const titleInput = assertElement(options.titleInput, "Wiki-Titel");
    const contentInput = assertElement(options.contentInput, "Wiki-Text");
    const saveButton = assertElement(options.saveButton, "Wiki-Speichern");
    const reloadButton = assertElement(
      options.reloadButton,
      "Wiki-Aktualisieren",
    );
    const list = assertElement(options.list, "Wiki-Liste");
    const setStatus = assertElement(options.setStatus, "Statusfunktion");
    const setDebug = options.setDebug;
    const getProjectDir = options.getProjectDir;
    const saveJson = assertElement(options.saveJson, "Wiki-Dateischreiber");

    function renderList() {
      const selectedCategory = categoryInput.value;
      const entries = model.listByCategory(selectedCategory);
      list.innerHTML = "";

      if (entries.length === 0) {
        const empty = document.createElement("li");
        empty.textContent =
          "Noch kein Eintrag in dieser Kategorie. Naechster Schritt: Eintrag speichern.";
        list.appendChild(empty);
        return 0;
      }

      entries.forEach((entry) => {
        const item = document.createElement("li");
        item.className = "wiki-item";

        const headline = document.createElement("strong");
        headline.textContent = entry.title;

        const updated = document.createElement("p");
        updated.className = "wiki-updated";
        updated.textContent = `Letzte Aenderung: ${entry.updatedAt.slice(0, 10)}`;

        const body = document.createElement("p");
        body.textContent = entry.content;

        item.append(headline, updated, body);
        list.appendChild(item);
      });

      return entries.length;
    }

    async function persist() {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        entries: model.exportState(),
      };
      const ok = await saveJson(WIKI_PATH, payload);
      if (!ok) {
        throw new Error(
          "Wiki-Speichern fehlgeschlagen. Bitte erneut versuchen.",
        );
      }
      return true;
    }

    async function restore() {
      try {
        const projectDir =
          typeof getProjectDir === "function" ? getProjectDir() : null;
        if (!projectDir) {
          return false;
        }
        const entries = await readWikiFromProject(projectDir);
        model.importState(entries);
        const count = renderList();
        if (typeof setDebug === "function") {
          setDebug(
            `Debug: Wiki geladen (${count} Eintraege in aktueller Kategorie).`,
          );
        }
        return true;
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(
          "Wiki konnte nicht geladen werden. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
        );
        if (typeof setDebug === "function") {
          setDebug(`Wiki-Ladefehler: ${details}`);
        }
        return false;
      }
    }

    async function onSave() {
      try {
        const result = model.saveEntry({
          category: categoryInput.value,
          title: titleInput.value,
          content: contentInput.value,
        });
        await persist();
        const count = renderList();
        setStatus(
          `Wiki-Eintrag ${result.mode === "created" ? "gespeichert" : "aktualisiert"}. Naechster Schritt: Erneut versuchen oder weitere Notiz speichern.`,
        );
        if (typeof setDebug === "function") {
          setDebug(
            `Debug: Wiki-Kategorie ${categoryInput.value} hat ${count} Eintraege.`,
          );
        }
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Erneut versuchen.`);
      }
    }

    categoryInput.addEventListener("change", renderList);
    saveButton.addEventListener("click", onSave);
    reloadButton.addEventListener("click", restore);

    renderList();
    restore();

    return {
      reload: restore,
      render: renderList,
    };
  };
})();
