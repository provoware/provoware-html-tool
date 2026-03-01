const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeKanbanPayload,
  getNextColumnIndex,
  fetchKanbanData,
  renderKanbanColumns,
  bindKanbanKeyboardA11y,
  moveKanbanItem,
  saveKanbanData,
} = require("../templates/kanban_preview");

test("normalizeKanbanPayload validiert Spalten", () => {
  const payload = normalizeKanbanPayload({
    columns: [{ id: "idea", title: "Idee", items: [{ text: "A" }] }],
  });

  assert.equal(payload.columns.length, 1);
  assert.equal(payload.columns[0].items[0].text, "A");
});

test("getNextColumnIndex bewegt Fokus sicher", () => {
  assert.equal(getNextColumnIndex(0, "left", 4), 0);
  assert.equal(getNextColumnIndex(0, "right", 4), 1);
  assert.equal(getNextColumnIndex(3, "right", 4), 3);
});

test("fetchKanbanData liest JSON und validiert", async () => {
  const mockFetch = async () => ({
    ok: true,
    json: async () => ({
      columns: [{ id: "review", title: "Review", items: [{ text: "B" }] }],
    }),
  });

  const result = await fetchKanbanData(mockFetch, "../data/kanban_board.json");
  assert.equal(result.columns[0].title, "Review");
});

test("renderKanbanColumns und Keyboard-A11y nutzen Fokusdaten", () => {
  class Element {
    constructor(tag) {
      this.tagName = tag;
      this.children = [];
      this.dataset = {};
      this.attributes = {};
      this.listeners = {};
      this.parentElement = null;
      this.className = "";
      this.tabIndex = -1;
      this.textContent = "";
      this._innerHTML = "";
    }

    set innerHTML(value) {
      this._innerHTML = value;
      if (value === "") {
        this.children = [];
      }
    }

    get innerHTML() {
      return this._innerHTML;
    }

    appendChild(child) {
      child.parentElement = this;
      this.children.push(child);
      return child;
    }

    append(...nodes) {
      nodes.forEach((node) => this.appendChild(node));
    }

    setAttribute(name, value) {
      this.attributes[name] = value;
    }

    addEventListener(name, fn) {
      this.listeners[name] = fn;
    }

    querySelector(selector) {
      if (selector === "h3") {
        return this.children.find((child) => child.tagName === "h3") || null;
      }
      return null;
    }

    querySelectorAll(selector) {
      const matches = [];
      const walk = (node) => {
        node.children.forEach((child) => {
          if (
            selector === ".kanban-items" &&
            child.className === "kanban-items"
          ) {
            matches.push(child);
          }
          walk(child);
        });
      };
      walk(this);
      return matches;
    }

    focus() {
      if (this.listeners.focus) {
        this.listeners.focus();
      }
    }
  }

  global.document = {
    createElement: (tag) => new Element(tag),
  };

  const root = new Element("div");
  const payload = {
    columns: [
      { id: "idea", title: "Idee", items: [{ text: "T1" }] },
      { id: "plan", title: "Planung", items: [{ text: "T2" }] },
    ],
  };

  const rendered = renderKanbanColumns(root, payload);
  assert.equal(rendered, 2);

  const statusMessages = [];
  const focusCount = bindKanbanKeyboardA11y(root, (msg) => {
    statusMessages.push(msg);
  });

  assert.equal(focusCount, 2);
  const lists = root.querySelectorAll(".kanban-items");
  assert.equal(lists[0].dataset.columnId, "idea");
  assert.equal(lists[0].children[0].draggable, true);
  assert.equal(lists[0].tabIndex, 0);
  assert.equal(lists[1].tabIndex, -1);

  const keyHandler = lists[0].listeners.keydown;
  keyHandler({ key: "ArrowRight", preventDefault: () => true });

  assert.equal(lists[1].dataset.focused, "true");
  assert.equal(statusMessages.length > 0, true);

  delete global.document;
});

test("moveKanbanItem verschiebt eine Karte in eine andere Spalte", () => {
  const payload = {
    columns: [
      { id: "idea", title: "Idee", items: [{ text: "Karte A" }] },
      { id: "review", title: "Review", items: [] },
    ],
  };

  const result = moveKanbanItem(payload, "idea", 0, "review");

  assert.equal(result.columns[0].items.length, 0);
  assert.equal(result.columns[1].items.length, 1);
  assert.equal(result.columns[1].items[0].text, "Karte A");
  assert.equal(typeof result.updatedAt, "string");
});

test("saveKanbanData validiert Schema und Ergebnis", async () => {
  let savedPayload = null;
  const result = await saveKanbanData(
    async (payload) => {
      savedPayload = payload;
      return true;
    },
    {
      version: 1,
      columns: [{ id: "idea", title: "Idee", items: [{ text: "A" }] }],
    },
  );

  assert.equal(result.version, 1);
  assert.equal(savedPayload.columns[0].id, "idea");
});

test("saveKanbanData meldet Fehler bei fehlendem Speicher", async () => {
  await assert.rejects(
    saveKanbanData(null, {
      version: 1,
      columns: [{ id: "idea", title: "Idee", items: [{ text: "A" }] }],
    }),
    /Kanban-Speicher fehlt/,
  );
});
