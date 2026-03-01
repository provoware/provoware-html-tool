(function setupTodoModule() {
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
        check.addEventListener("click", () => {
          model.completeTodo(todo.id);
          renderAll();
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

    function onAdd() {
      try {
        const text = textInput.value.trim();
        const date = dateInput.value;
        model.addTodo({ text, date });
        textInput.value = "";
        renderAll();
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
    renderAll();
  };
})();
