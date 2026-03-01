(function bootstrapKanbanPreview(globalObject) {
  function assertElement(element, name) {
    if (!element || typeof element !== "object") {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return element;
  }

  function assertText(value, name) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(
        `${name} fehlt. Erneut versuchen oder Protokoll oeffnen.`,
      );
    }
    return value.trim();
  }

  function normalizeKanbanPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error(
        "Kanban-Daten sind ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const columns = Array.isArray(payload.columns) ? payload.columns : [];
    if (columns.length === 0) {
      throw new Error(
        "Kanban-Spalten fehlen. Erneut versuchen oder Protokoll oeffnen.",
      );
    }

    const normalizedColumns = columns.map((column) => {
      const id = assertText(column?.id, "Spalten-ID");
      const title = assertText(column?.title, "Spaltentitel");
      const items = Array.isArray(column?.items) ? column.items : [];
      return {
        id,
        title,
        items: items
          .map((item) => {
            if (!item || typeof item !== "object") {
              return null;
            }
            const text = typeof item.text === "string" ? item.text.trim() : "";
            if (!text) {
              return null;
            }
            return { text };
          })
          .filter(Boolean),
      };
    });

    return {
      updatedAt: typeof payload.updatedAt === "string" ? payload.updatedAt : "",
      columns: normalizedColumns,
    };
  }

  function getNextColumnIndex(currentIndex, direction, total) {
    if (!Number.isInteger(currentIndex) || currentIndex < 0) {
      return 0;
    }
    if (!Number.isInteger(total) || total <= 0) {
      return 0;
    }

    if (direction === "right") {
      return Math.min(currentIndex + 1, total - 1);
    }
    if (direction === "left") {
      return Math.max(currentIndex - 1, 0);
    }
    return currentIndex;
  }

  async function fetchKanbanData(fetchImpl, dataPath) {
    if (typeof fetchImpl !== "function") {
      throw new Error(
        "Kanban-Lader fehlt. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    const safePath = assertText(dataPath, "Kanban-Dateipfad");
    const response = await fetchImpl(safePath, { cache: "no-store" });
    if (!response || response.ok !== true) {
      throw new Error(
        "Kanban-Datei nicht gefunden. Erneut versuchen oder Protokoll oeffnen.",
      );
    }
    const json = await response.json();
    return normalizeKanbanPayload(json);
  }

  function renderKanbanColumns(root, payload) {
    const safeRoot = assertElement(root, "Kanban-Bereich");
    const safePayload = normalizeKanbanPayload(payload);
    safeRoot.innerHTML = "";

    safePayload.columns.forEach((column, columnIndex) => {
      const article = document.createElement("article");
      article.className = "kanban-col";
      article.setAttribute("role", "listitem");

      const header = document.createElement("h3");
      header.id = `kanban-col-${column.id}`;
      header.textContent = column.title;

      const list = document.createElement("ul");
      list.className = "kanban-items";
      list.setAttribute("role", "list");
      list.setAttribute("aria-labelledby", header.id);
      list.dataset.columnIndex = String(columnIndex);

      column.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.text;
        list.appendChild(li);
      });

      if (column.items.length === 0) {
        const li = document.createElement("li");
        li.textContent =
          "Keine Aufgabe. Erneut versuchen oder neue Karte planen.";
        list.appendChild(li);
      }

      article.append(header, list);
      safeRoot.appendChild(article);
    });

    return safePayload.columns.length;
  }

  function bindKanbanKeyboardA11y(root, setStatus) {
    const safeRoot = assertElement(root, "Kanban-Bereich");
    const listNodes = Array.from(safeRoot.querySelectorAll(".kanban-items"));
    if (listNodes.length === 0) {
      return 0;
    }

    listNodes.forEach((node, index) => {
      node.tabIndex = index === 0 ? 0 : -1;
      node.dataset.focused = index === 0 ? "true" : "false";

      node.addEventListener("focus", () => {
        listNodes.forEach((entry) => {
          entry.dataset.focused = "false";
          entry.tabIndex = -1;
        });
        node.dataset.focused = "true";
        node.tabIndex = 0;
      });

      node.addEventListener("keydown", (event) => {
        if (!event || typeof event.key !== "string") {
          return;
        }

        const currentIndex = Number.parseInt(
          node.dataset.columnIndex || "0",
          10,
        );
        let targetIndex = currentIndex;
        if (event.key === "ArrowRight") {
          targetIndex = getNextColumnIndex(
            currentIndex,
            "right",
            listNodes.length,
          );
        } else if (event.key === "ArrowLeft") {
          targetIndex = getNextColumnIndex(
            currentIndex,
            "left",
            listNodes.length,
          );
        } else {
          return;
        }

        event.preventDefault();
        const target = listNodes[targetIndex];
        if (!target) {
          return;
        }
        target.focus();
        if (typeof setStatus === "function") {
          const label =
            target.parentElement?.querySelector("h3")?.textContent || "Spalte";
          setStatus(
            `Kanban-Fokus auf ${label}. Naechster Schritt: Enter fuer Karte lesen oder Pfeile nutzen.`,
          );
        }
      });
    });

    return listNodes.length;
  }

  function createKanbanPreview(options = {}) {
    const root = assertElement(options.root, "Kanban-Bereich");
    const status =
      typeof options.setStatus === "function" ? options.setStatus : () => true;
    const sourcePath = options.sourcePath || "../data/kanban_board.json";

    async function load() {
      try {
        const payload = await fetchKanbanData(
          options.fetchImpl || globalObject.fetch,
          sourcePath,
        );
        const count = renderKanbanColumns(root, payload);
        const keyboardCount = bindKanbanKeyboardA11y(root, status);
        status(
          `Kanban geladen (${count} Spalten, ${keyboardCount} Fokusbereiche). Naechster Schritt: Pfeiltasten testen.`,
        );
        return { ok: true, count, keyboardCount };
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        status(`${details} Naechster Schritt: Reparatur starten.`);
        return { ok: false, count: 0, keyboardCount: 0, details };
      }
    }

    return { load };
  }

  const api = {
    normalizeKanbanPayload,
    getNextColumnIndex,
    fetchKanbanData,
    renderKanbanColumns,
    bindKanbanKeyboardA11y,
    createKanbanPreview,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalObject.KanbanPreview = api;
})(typeof window !== "undefined" ? window : globalThis);
