(function exposeModuleWorkspace() {
  const MODULE_CATALOG = [
    {
      id: "project",
      title: "Projektmanagement",
      what: "Plant Aufgaben und Reihenfolgen.",
      data: "Speichert nur Modulstatus im Dashboard.",
      undo: "Sie koennen das Modul ausblenden oder minimieren.",
    },
    {
      id: "sales",
      title: "Vertrieb & CRM",
      what: "Zeigt Leads und Kundentermine.",
      data: "Liest nur verknuepfte CRM-Daten.",
      undo: "Sie koennen jederzeit auf Standardansicht zurueckgehen.",
    },
    {
      id: "analytics",
      title: "Analyse & Berichte",
      what: "Erstellt Kennzahlen im Team-Format.",
      data: "Greift nur auf freigegebene Berichtsdaten zu.",
      undo: "Berichte koennen neu erzeugt werden.",
    },
    {
      id: "support",
      title: "Support",
      what: "Bietet Ticket- und Fehleruebersicht.",
      data: "Zeigt nur vorhandene Support-Eintraege.",
      undo: "Blenden Sie das Modul aus, wenn es nicht noetig ist.",
    },
  ];

  function assertNode(node, name) {
    if (!node || typeof node.appendChild !== "function") {
      throw new Error(`${name} fehlt. Bitte Protokoll oeffnen.`);
    }
  }

  function buildWorkspace(options) {
    const catalog = options.catalog;
    const grid = options.grid;
    const emptyState = options.emptyState;
    const scale = options.scale;
    const align = options.align;
    const setStatus = options.setStatus;

    assertNode(catalog, "Modulkatalog");
    assertNode(grid, "Modulflaeche");
    assertNode(emptyState, "Leerstatus");

    let moduleModel = [];
    let maximizedId = null;

    function getCatalogModule(moduleId) {
      const match = MODULE_CATALOG.find((entry) => entry.id === moduleId);
      if (!match) {
        throw new Error("Modul nicht gefunden. Bitte erneut versuchen.");
      }
      return match;
    }

    function renderActiveModules() {
      const visibleModules = moduleModel.filter((entry) => !entry.hidden);
      grid.innerHTML = "";

      if (visibleModules.length === 0) {
        grid.appendChild(emptyState);
        emptyState.hidden = false;
        return;
      }

      emptyState.hidden = true;
      visibleModules.forEach((entry, index) => {
        const card = document.createElement("article");
        card.className = "module-card";
        card.dataset.moduleProfile = entry.id;
        card.setAttribute("role", "listitem");
        if (maximizedId === entry.id) {
          card.classList.add("is-maximized");
        }

        const order = document.createElement("p");
        order.className = "module-order";
        order.textContent = `Reihenfolge ${index + 1}`;

        const title = document.createElement("h3");
        title.textContent = entry.title;

        const actions = document.createElement("div");
        actions.className = "module-card-actions";

        const maximize = document.createElement("button");
        maximize.type = "button";
        maximize.textContent =
          maximizedId === entry.id ? "Normalgroesse" : "Maximieren";
        maximize.addEventListener("click", () => {
          maximizedId = maximizedId === entry.id ? null : entry.id;
          renderActiveModules();
          if (maximizedId) {
            setStatus("Modul maximiert. Naechster Schritt: Funktionen nutzen.");
            return;
          }
          setStatus(
            "Maximierung beendet. Naechster Schritt: Raster weiter nutzen.",
          );
        });

        const minimize = document.createElement("button");
        minimize.type = "button";
        minimize.textContent = entry.minimized ? "Aufklappen" : "Minimieren";
        minimize.addEventListener("click", () => {
          entry.minimized = !entry.minimized;
          if (entry.minimized && maximizedId === entry.id) {
            maximizedId = null;
          }
          renderActiveModules();
          setStatus(
            "Modulstatus geaendert. Naechster Schritt: Ansicht pruefen.",
          );
        });

        const hide = document.createElement("button");
        hide.type = "button";
        hide.textContent = "Ausblenden";
        hide.addEventListener("click", () => {
          entry.hidden = true;
          entry.minimized = false;
          if (maximizedId === entry.id) {
            maximizedId = null;
          }
          renderActiveModules();
          setStatus(
            "Modul ausgeblendet. Naechster Schritt: anderes Modul waehlen.",
          );
        });

        actions.append(maximize, minimize, hide);
        card.append(order, title, actions);

        if (!entry.minimized) {
          const what = document.createElement("p");
          what.textContent = `Was macht das? ${entry.what}`;
          const data = document.createElement("p");
          data.textContent = `Was passiert mit den Daten? ${entry.data}`;
          const undo = document.createElement("p");
          undo.textContent = `Wie rueckgaengig? ${entry.undo}`;
          card.append(what, data, undo);
        }

        grid.appendChild(card);
      });
    }

    function addModule(moduleId) {
      const source = getCatalogModule(moduleId);
      if (moduleModel.some((entry) => entry.id === moduleId && !entry.hidden)) {
        setStatus("Modul ist schon aktiv. Naechster Schritt: Modul oeffnen.");
        return;
      }

      const position = moduleModel.filter((entry) => !entry.hidden).length + 1;
      moduleModel.push({
        ...source,
        position,
        minimized: false,
        hidden: false,
      });
      renderActiveModules();
      setStatus(
        `Modul aktiv: ${source.title}. Naechster Schritt: Bei Bedarf maximieren.`,
      );
    }

    function renderCatalog() {
      catalog.innerHTML = "";
      MODULE_CATALOG.forEach((moduleEntry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${moduleEntry.title} aktivieren`;
        button.setAttribute("aria-label", `${moduleEntry.title} aktivieren`);
        button.addEventListener("click", () => addModule(moduleEntry.id));
        catalog.appendChild(button);
      });
    }

    scale.addEventListener("change", () => {
      grid.dataset.scale = scale.value;
      setStatus("Rastergroesse geaendert. Naechster Schritt: Module pruefen.");
    });

    align.addEventListener("change", () => {
      grid.dataset.align = align.value;
      setStatus("Position geaendert. Naechster Schritt: Ausrichtung pruefen.");
    });

    renderCatalog();
    renderActiveModules();
  }

  window.createModuleWorkspace = buildWorkspace;
})();
