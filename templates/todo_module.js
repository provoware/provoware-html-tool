(function setupTodoModule() {
  const STORE_FILE = "store.json";
  const STORE_DIR = "data";

  function assertElement(element, name) {
    if (!element) {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return element;
  }

  function todayIso() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(isoDate) {
    const [year, month, day] = isoDate.split("-");
    return `${day}.${month}.${year}`;
  }

  function validateStorePayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error(
        "Todo-Speicher ist ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    const items = payload.items;
    if (Array.isArray(items)) {
      payload.items = { active: items, archive: [] };
      return payload;
    }
    if (!items || typeof items !== "object" || Array.isArray(items)) {
      throw new Error(
        "Todo-Daten fehlen. Erneut versuchen oder Protokoll oeffnen.",
      );
    }
    if (!Array.isArray(items.active) || !Array.isArray(items.archive)) {
      throw new Error(
        "Todo-Listen sind ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    return payload;
  }

  async function readStoreFromDirectory(projectDir) {
    if (!projectDir || typeof projectDir.getDirectoryHandle !== "function") {
      return null;
    }
    const dataDir = await projectDir.getDirectoryHandle(STORE_DIR, {
      create: true,
    });
    const fileHandle = await dataDir.getFileHandle(STORE_FILE, {
      create: true,
    });
    const file = await fileHandle.getFile();
    const text = await file.text();
    if (!text.trim()) {
      return null;
    }
    return validateStorePayload(JSON.parse(text));
  }

  async function writeStoreToDirectory(projectDir, payload) {
    if (!projectDir || typeof projectDir.getDirectoryHandle !== "function") {
      return false;
    }
    const safePayload = validateStorePayload(payload);
    const dataDir = await projectDir.getDirectoryHandle(STORE_DIR, {
      create: true,
    });
    const fileHandle = await dataDir.getFileHandle(STORE_FILE, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(`${JSON.stringify(safePayload, null, 2)}\n`);
    await writable.close();
    const file = await fileHandle.getFile();
    if (file.size <= 0) {
      throw new Error(
        "Todo-Speicher blieb leer. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    return true;
  }

  window.createTodoModule = function createTodoModule(options) {
    const model = window.TodoListModel?.createTodoModel?.();
    if (!model) {
      throw new Error(
        "Todo-Modell fehlt. Reparatur starten oder erneut versuchen.",
      );
    }

    const dateInput = assertElement(options.dateInput, "Kalenderfeld");
    const textInput = assertElement(options.textInput, "Aufgabenfeld");
    const addButton = assertElement(options.addButton, "Speicher-Knopf");
    const resetButton = assertElement(options.resetButton, "Heute-Knopf");
    const activeList = assertElement(options.activeList, "Aktive Liste");
    const archiveList = assertElement(options.archiveList, "Archivliste");
    const setStatus = assertElement(options.setStatus, "Statusfunktion");
    const setDebug = options.setDebug;
    const getProjectDir = options.getProjectDir;

    async function persistState() {
      try {
        const projectDir =
          typeof getProjectDir === "function" ? getProjectDir() : null;
        if (!projectDir) {
          return false;
        }
        const payload = {
          version: 1,
          updatedAt: new Date().toISOString(),
          items: model.exportState(),
        };
        const ok = await writeStoreToDirectory(projectDir, payload);
        if (ok && typeof setDebug === "function") {
          setDebug("Debug: Todo-Liste in data/store.json gespeichert.");
        }
        return ok;
      } catch (error) {
        if (typeof setDebug === "function") {
          const details =
            error instanceof Error ? error.message : "Unbekannter Fehler";
          setDebug(`Todo-Speicherfehler: ${details}`);
        }
        return false;
      }
    }

    async function restoreState() {
      try {
        const projectDir =
          typeof getProjectDir === "function" ? getProjectDir() : null;
        if (!projectDir) {
          return false;
        }
        const payload = await readStoreFromDirectory(projectDir);
        if (!payload) {
          return false;
        }
        model.importState(payload.items);
        return true;
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(
          "Todo-Speicher konnte nicht geladen werden. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
        );
        if (typeof setDebug === "function") {
          setDebug(`Todo-Ladefehler: ${details}`);
        }
        return false;
      }
    }

    function renderActive() {
      const date = dateInput.value;
      const activeTodos = model.listByDate(date);
      activeList.innerHTML = "";
      if (activeTodos.length === 0) {
        const item = document.createElement("li");
        item.textContent =
          "Keine Aufgabe fuer den Tag. Neue Aufgabe speichern.";
        activeList.appendChild(item);
        return;
      }
      activeTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.className = "todo-item";
        const check = document.createElement("button");
        check.type = "button";
        check.className = "todo-check";
        check.setAttribute("aria-label", `Aufgabe erledigt: ${todo.text}`);
        check.textContent = "Abhaken";
        check.addEventListener("click", async () => {
          model.completeTodo(todo.id);
          renderAll();
          await persistState();
          setStatus(
            "Aufgabe erledigt und archiviert. Naechster Schritt: Erneut versuchen oder weitere Aufgabe planen.",
          );
        });
        const text = document.createElement("span");
        text.textContent = `${todo.text} (${formatDate(todo.date)})`;
        li.append(check, text);
        activeList.appendChild(li);
      });
    }

    function renderArchive() {
      const archiveTodos = model.listArchive();
      archiveList.innerHTML = "";
      if (archiveTodos.length === 0) {
        const item = document.createElement("li");
        item.textContent =
          "Archiv ist leer. Erledigte Aufgaben erscheinen hier.";
        archiveList.appendChild(item);
        return;
      }
      archiveTodos.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = `${todo.text} · erledigt ${todo.doneAt.slice(0, 10)}`;
        archiveList.appendChild(li);
      });
    }

    function renderAll() {
      renderActive();
      renderArchive();
      return true;
    }

    async function onAdd() {
      try {
        const text = textInput.value.trim();
        const date = dateInput.value;
        model.addTodo({ text, date });
        textInput.value = "";
        renderAll();
        await persistState();
        setStatus(
          "Aufgabe gespeichert. Naechster Schritt: Aufgabe abhaken oder weitere Aufgabe anlegen.",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${message} Naechster Schritt: Erneut versuchen.`);
      }
    }

    function onResetDate() {
      dateInput.value = todayIso();
      renderAll();
      setStatus(
        "Datum auf heute gesetzt. Naechster Schritt: Neue Aufgabe speichern.",
      );
    }

    addButton.addEventListener("click", onAdd);
    resetButton.addEventListener("click", onResetDate);
    dateInput.addEventListener("change", renderAll);
    dateInput.value = todayIso();
    restoreState().finally(() => {
      renderAll();
    });
  };
})();
