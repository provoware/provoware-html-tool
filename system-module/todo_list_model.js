(function exposeTodoListModel(globalObject) {
  function assertText(value, name) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `${name} fehlt. Erneut versuchen oder Protokoll oeffnen.`,
      );
    }
    return value.trim();
  }

  function assertDateIso(value, name) {
    const safe = assertText(value, name);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(safe)) {
      throw new Error(`${name} ist ungueltig. Bitte Datum erneut waehlen.`);
    }
    return safe;
  }

  function assertArray(value, name) {
    if (!Array.isArray(value)) {
      throw new Error(
        `${name} ist ungueltig. Reparatur starten oder erneut versuchen.`,
      );
    }
    return value;
  }

  function assertTodoEntry(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(
        `${name} ist ungueltig. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    const id = assertText(value.id, `${name}-ID`);
    const text = assertText(value.text, `${name}-Text`);
    const date = assertDateIso(value.date, `${name}-Datum`);
    const doneAt =
      value.doneAt === "" ? "" : assertText(value.doneAt, `${name}-Erledigt`);
    return {
      id,
      text,
      date,
      doneAt,
    };
  }

  function assertStateShape(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(
        "Todo-Status ist ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    const active = assertArray(value.active, "Aktive Aufgaben").map(
      (entry, index) => assertTodoEntry(entry, `Aktive Aufgabe ${index + 1}`),
    );
    const archive = assertArray(value.archive, "Archivierte Aufgaben").map(
      (entry, index) =>
        assertTodoEntry(entry, `Archivierte Aufgabe ${index + 1}`),
    );
    return { active, archive };
  }

  function createTodoModel() {
    let seq = 0;
    const state = {
      active: [],
      archive: [],
    };

    function addTodo(input) {
      const text = assertText(input?.text, "Aufgabe");
      const date = assertDateIso(input?.date, "Datum");
      const todo = {
        id: `todo-${Date.now()}-${seq++}`,
        text,
        date,
        doneAt: "",
      };
      state.active.push(todo);
      if (!state.active.some((item) => item.id === todo.id)) {
        throw new Error("Aufgabe wurde nicht gespeichert. Erneut versuchen.");
      }
      return { ok: true, todo };
    }

    function completeTodo(todoId) {
      const safeId = assertText(todoId, "Aufgaben-ID");
      const index = state.active.findIndex((entry) => entry.id === safeId);
      if (index < 0) {
        throw new Error("Aufgabe nicht gefunden. Erneut versuchen.");
      }
      const [todo] = state.active.splice(index, 1);
      const doneAt = new Date().toISOString();
      state.archive.unshift({ ...todo, doneAt });
      if (state.active.some((item) => item.id === safeId)) {
        throw new Error("Aufgabe konnte nicht archiviert werden.");
      }
      return { ok: true, todoId: safeId, doneAt };
    }

    function listByDate(date) {
      const safeDate = assertDateIso(date, "Datum");
      const result = state.active.filter((entry) => entry.date === safeDate);
      assertArray(result, "Aktive Liste");
      return result;
    }

    function listArchive() {
      const copy = [...state.archive];
      assertArray(copy, "Archivliste");
      return copy;
    }

    function exportState() {
      const output = {
        active: state.active.map((entry) => ({ ...entry })),
        archive: state.archive.map((entry) => ({ ...entry })),
      };
      assertStateShape(output);
      return output;
    }

    function importState(input) {
      const safeState = assertStateShape(input);
      state.active = safeState.active;
      state.archive = safeState.archive;
      return { ok: true, count: state.active.length + state.archive.length };
    }

    return {
      addTodo,
      completeTodo,
      listByDate,
      listArchive,
      exportState,
      importState,
    };
  }

  const api = { createTodoModel };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.TodoListModel = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
