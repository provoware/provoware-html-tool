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

      column.items.forEach((item, itemIndex) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        text.textContent = item.text;
        const moveButton = document.createElement("button");
        moveButton.type = "button";
        moveButton.className = "kanban-move-btn";
        moveButton.dataset.columnId = column.id;
        moveButton.dataset.itemIndex = String(itemIndex);
        moveButton.textContent = "Verschieben";
        moveButton.setAttribute(
          "aria-label",
          `Karte verschieben: ${item.text}`,
        );
        li.append(text, moveButton);
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

  function moveKanbanItem(payload, sourceColumnId, itemIndex, targetColumnId) {
    const safePayload = normalizeKanbanPayload(payload);
    const safeSourceId = assertText(sourceColumnId, "Quellspalte");
    const safeTargetId = assertText(targetColumnId, "Zielspalte");
    if (!Number.isInteger(itemIndex) || itemIndex < 0) {
      throw new Error(
        "Kartenposition ungueltig. Erneut versuchen oder Protokoll oeffnen.",
      );
    }

    const sourceIndex = safePayload.columns.findIndex(
      (column) => column.id === safeSourceId,
    );
    const targetIndex = safePayload.columns.findIndex(
      (column) => column.id === safeTargetId,
    );
    if (sourceIndex < 0 || targetIndex < 0) {
      throw new Error(
        "Kanban-Spalte fehlt. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const sourceColumn = safePayload.columns[sourceIndex];
    if (itemIndex >= sourceColumn.items.length) {
      throw new Error("Karte fehlt. Erneut versuchen oder Protokoll oeffnen.");
    }

    const nextColumns = safePayload.columns.map((column) => ({
      ...column,
      items: [...column.items],
    }));
    const [movedCard] = nextColumns[sourceIndex].items.splice(itemIndex, 1);
    nextColumns[targetIndex].items.push(movedCard);

    return {
      ...safePayload,
      updatedAt: new Date().toISOString(),
      columns: nextColumns,
    };
  }

  function createMoveDialog(root) {
    const host = assertElement(root, "Kanban-Bereich").closest("article");
    if (!host) {
      throw new Error(
        "Kanban-Dialog fehlt. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const dialog = document.createElement("dialog");
    dialog.className = "kanban-move-dialog";
    dialog.innerHTML = `
      <form method="dialog" class="kanban-move-form">
        <h3 id="kanban-move-title">Karte verschieben</h3>
        <p id="kanban-move-help" class="field-tip">Was passiert? Die Karte wechselt die Spalte. Rueckweg: Escape oder Abbrechen.</p>
        <p class="field-tip" id="kanban-move-card"></p>
        <label for="kanban-move-target">Zielspalte</label>
        <select id="kanban-move-target"></select>
        <div class="dialog-actions">
          <button type="submit" value="confirm" id="kanban-move-confirm">Speichern</button>
          <button type="submit" value="cancel">Abbrechen</button>
        </div>
      </form>
    `;
    host.appendChild(dialog);

    return {
      root: dialog,
      cardLabel: dialog.querySelector("#kanban-move-card"),
      targetSelect: dialog.querySelector("#kanban-move-target"),
      confirmButton: dialog.querySelector("#kanban-move-confirm"),
    };
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
    const dialog = createMoveDialog(root);
    let currentPayload = null;
    let pendingMove = null;

    function fillDialogOptions(sourceColumnId, cardText) {
      dialog.targetSelect.innerHTML = "";
      currentPayload.columns.forEach((column) => {
        const option = document.createElement("option");
        option.value = column.id;
        option.textContent = column.title;
        if (column.id === sourceColumnId) {
          option.disabled = true;
        }
        dialog.targetSelect.appendChild(option);
      });

      dialog.cardLabel.textContent = `Karte: ${cardText}`;
      dialog.confirmButton.disabled = dialog.targetSelect.options.length <= 1;
    }

    function onMoveButtonClick(event) {
      const button = event.target?.closest(".kanban-move-btn");
      if (!button || !currentPayload) {
        return;
      }

      const sourceColumnId = assertText(button.dataset.columnId, "Quellspalte");
      const itemIndex = Number.parseInt(button.dataset.itemIndex || "-1", 10);
      if (!Number.isInteger(itemIndex) || itemIndex < 0) {
        setStatus(
          "Kartenindex fehlt. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
        );
        return;
      }

      const sourceColumn = currentPayload.columns.find(
        (column) => column.id === sourceColumnId,
      );
      const card = sourceColumn?.items[itemIndex];
      if (!sourceColumn || !card) {
        setStatus(
          "Karte fehlt. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
        );
        return;
      }

      pendingMove = { sourceColumnId, itemIndex };
      fillDialogOptions(sourceColumnId, card.text);
      dialog.root.showModal();
      dialog.targetSelect.focus();
      setStatus("Dialog offen. Naechster Schritt: Zielspalte waehlen.");
    }

    function onDialogClose(event) {
      if (event.target?.returnValue !== "confirm" || !pendingMove) {
        setStatus("Abgebrochen. Naechster Schritt: Erneut versuchen.");
        return;
      }

      try {
        const targetId = assertText(dialog.targetSelect.value, "Zielspalte");
        currentPayload = moveKanbanItem(
          currentPayload,
          pendingMove.sourceColumnId,
          pendingMove.itemIndex,
          targetId,
        );
        renderKanbanColumns(root, currentPayload);
        bindKanbanKeyboardA11y(root, status);
        setStatus(
          "Karte verschoben. Naechster Schritt: Pfeiltasten oder Tab fuer Kontrolle nutzen.",
        );
      } catch (error) {
        const details =
          error instanceof Error ? error.message : "Unbekannter Fehler";
        setStatus(`${details} Naechster Schritt: Reparatur starten.`);
      } finally {
        pendingMove = null;
      }
    }

    root.addEventListener("click", onMoveButtonClick);
    dialog.root.addEventListener("close", onDialogClose);

    async function load() {
      try {
        const payload = await fetchKanbanData(
          options.fetchImpl || globalObject.fetch,
          sourcePath,
        );
        currentPayload = payload;
        const count = renderKanbanColumns(root, currentPayload);
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
    moveKanbanItem,
    createKanbanPreview,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalObject.KanbanPreview = api;
})(typeof window !== "undefined" ? window : globalThis);
