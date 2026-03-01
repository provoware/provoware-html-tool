(function exposeModuleWorkspace() {
  const CONTROL_TOOLTIPS = {
    maximize: {
      short: "Groesser anzeigen",
      fallback: "Normalgroesse waehlen",
      undo: "Rueckweg: Gleichen Knopf erneut druecken.",
    },
    minimize: {
      short: "Kurz einklappen",
      fallback: "Wieder aufklappen",
      undo: "Rueckweg: Gleichen Knopf erneut druecken.",
    },
    hide: {
      short: "Ausblenden",
      fallback: "Ausblenden",
      undo: "Rueckweg: Modul im Katalog erneut aktivieren.",
    },
    pin: {
      short: "Oben anheften",
      fallback: "Anheftung loesen",
      undo: "Rueckweg: Gleichen Knopf erneut druecken.",
    },
  };

  const MODULE_OPTION_ACTIONS = {
    project: [
      {
        id: "project-plan",
        label: "Planung anzeigen",
        message:
          "Projektplanung geoeffnet. Naechster Schritt: Prioritaet festlegen.",
      },
      {
        id: "project-status",
        label: "Status pruefen",
        message:
          "Projektstatus geprueft. Naechster Schritt: Offenen Punkt waehlen.",
      },
    ],
    sales: [
      {
        id: "sales-leads",
        label: "Leads anzeigen",
        message: "Lead-Liste geoeffnet. Naechster Schritt: Kontakt auswaehlen.",
      },
      {
        id: "sales-follow-up",
        label: "Rueckruf planen",
        message: "Rueckruf vorbereitet. Naechster Schritt: Termin bestaetigen.",
      },
    ],
    analytics: [
      {
        id: "analytics-report",
        label: "Bericht erstellen",
        message: "Bericht gestartet. Naechster Schritt: Zeitraum waehlen.",
      },
      {
        id: "analytics-export",
        label: "Export vorbereiten",
        message: "Export vorbereitet. Naechster Schritt: Export-Knopf nutzen.",
      },
    ],
    support: [
      {
        id: "support-tickets",
        label: "Tickets anzeigen",
        message:
          "Ticketliste geoeffnet. Naechster Schritt: Ticket priorisieren.",
      },
      {
        id: "support-log",
        label: "Protokoll oeffnen",
        message:
          "Support-Protokoll geoeffnet. Naechster Schritt: Ursache lesen.",
      },
    ],
  };

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

  function getControlHint(actionKey, isActive) {
    if (!CONTROL_TOOLTIPS[actionKey]) {
      throw new Error("Steuerung fehlt. Bitte Protokoll oeffnen.");
    }

    const source = CONTROL_TOOLTIPS[actionKey];
    const shortText = isActive ? source.fallback : source.short;
    return `${shortText}. ${source.undo}`;
  }

  function buildWorkspace(options) {
    const catalog = options.catalog;
    const grid = options.grid;
    const emptyState = options.emptyState;
    const scale = options.scale;
    const align = options.align;
    const setStatus = options.setStatus;
    const moduleOptionsRoot = options.moduleOptionsRoot;
    const moduleOptionsHelp = options.moduleOptionsHelp;
    const onModuleStateChange =
      typeof options.onModuleStateChange === "function"
        ? options.onModuleStateChange
        : () => {};
    const slotCount = Number.isInteger(options.slotCount)
      ? Math.max(1, options.slotCount)
      : 9;
    const initialModuleState =
      options.initialModuleState &&
      typeof options.initialModuleState === "object"
        ? options.initialModuleState
        : {};

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

    function clearModuleOptions() {
      if (moduleOptionsRoot) {
        moduleOptionsRoot.innerHTML = "";
      }
      if (moduleOptionsHelp) {
        moduleOptionsHelp.textContent =
          "Noch kein Modul gewaehlt. Naechster Schritt: Modul im Raster aktivieren.";
      }
    }

    function renderModuleOptions(entry) {
      if (!moduleOptionsRoot || !moduleOptionsHelp) {
        return false;
      }

      if (!entry || typeof entry !== "object") {
        clearModuleOptions();
        return false;
      }

      moduleOptionsRoot.innerHTML = "";
      moduleOptionsHelp.textContent = `Optionen fuer ${entry.title}. Rueckweg: Anderes Modul anklicken.`;

      const heading = document.createElement("h4");
      heading.textContent = `${entry.title} Optionen`;

      const info = document.createElement("p");
      info.textContent = `Was macht das? ${entry.what}`;

      const nextStep = document.createElement("p");
      nextStep.textContent =
        "Naechster Schritt: Aktion waehlen, dann Modulstatus pruefen.";

      const actions = document.createElement("div");
      actions.className = "module-card-actions";

      const contextActions = MODULE_OPTION_ACTIONS[entry.id] || [];
      contextActions.forEach((actionEntry) => {
        const actionButton = document.createElement("button");
        actionButton.type = "button";
        actionButton.textContent = actionEntry.label;
        actionButton.setAttribute(
          "aria-label",
          `${actionEntry.label}. Rueckweg: Anderes Modul auswaehlen`,
        );
        actionButton.addEventListener("click", () => {
          setStatus(actionEntry.message);
        });
        actions.appendChild(actionButton);
      });

      const focusButton = document.createElement("button");
      focusButton.type = "button";
      focusButton.textContent = "Fokusmodus starten";
      focusButton.setAttribute(
        "aria-label",
        "Fokusmodus starten. Rueckweg: Escape oder Fokusmodus beenden",
      );
      focusButton.addEventListener("click", () => {
        setStatus(
          `Fokusmodus-Hinweis fuer ${entry.title} geoeffnet. Naechster Schritt: Fokusmodus oben starten.`,
        );
      });

      const hideButton = document.createElement("button");
      hideButton.type = "button";
      hideButton.textContent = "Modul ausblenden";
      hideButton.setAttribute(
        "aria-label",
        "Modul ausblenden. Rueckweg: Modul im Katalog erneut aktivieren",
      );
      hideButton.addEventListener("click", () => {
        setStatus(
          `Ausblenden fuer ${entry.title} vorbereitet. Naechster Schritt: Im Modul selbst Ausblenden klicken.`,
        );
      });

      actions.append(focusButton, hideButton);
      moduleOptionsRoot.append(heading, info, nextStep, actions);
      return true;
    }

    function renderActiveModules() {
      const visibleModules = moduleModel
        .filter((entry) => !entry.hidden)
        .sort((left, right) => Number(right.pinned) - Number(left.pinned));
      grid.innerHTML = "";

      emptyState.hidden = true;
      if (visibleModules.length === 0) {
        emptyState.textContent =
          "Raster ist leer. Naechster Schritt: links ein Modul aktivieren.";
      }

      for (let index = 0; index < slotCount; index += 1) {
        const entry = visibleModules[index];
        const slot = document.createElement("article");
        slot.className = "module-slot";
        slot.setAttribute("role", "listitem");
        slot.dataset.slotIndex = String(index + 1);
        if (!entry) {
          const slotLabel = document.createElement("p");
          slotLabel.className = "module-slot-label";
          slotLabel.textContent = `Rasterplatz ${index + 1} ist leer`;
          slot.append(slotLabel);
          grid.appendChild(slot);
          continue;
        }

        const card = document.createElement("article");
        card.className = "module-card";
        card.dataset.moduleProfile = entry.id;
        card.setAttribute("role", "group");
        card.tabIndex = 0;
        if (maximizedId === entry.id) {
          card.classList.add("is-maximized");
        }
        if (entry.pinned) {
          card.classList.add("is-pinned");
        }

        const order = document.createElement("p");
        order.className = "module-order";
        order.textContent = `Reihenfolge ${index + 1}`;

        const title = document.createElement("h3");
        title.textContent = entry.title;

        const actions = document.createElement("div");
        actions.className = "module-card-actions";

        const toggleMaximize = () => {
          maximizedId = maximizedId === entry.id ? null : entry.id;
          renderActiveModules();
          if (maximizedId) {
            setStatus("Modul maximiert. Naechster Schritt: Funktionen nutzen.");
            return;
          }
          setStatus(
            "Maximierung beendet. Naechster Schritt: Raster weiter nutzen.",
          );
        };

        const pin = document.createElement("button");
        pin.type = "button";
        const pinActive = entry.pinned === true;
        pin.textContent = pinActive ? "Loesen" : "Anheften";
        pin.title = getControlHint("pin", pinActive);
        pin.setAttribute("aria-label", pin.title);
        pin.addEventListener("click", () => {
          entry.pinned = !pinActive;
          renderActiveModules();
          setStatus(
            "Anheftung aktualisiert. Naechster Schritt: Reihenfolge pruefen.",
          );
        });

        const maximize = document.createElement("button");
        maximize.type = "button";
        const maximizeActive = maximizedId === entry.id;
        maximize.textContent = maximizeActive ? "Normalgroesse" : "Maximieren";
        maximize.title = getControlHint("maximize", maximizeActive);
        maximize.setAttribute("aria-label", maximize.title);
        maximize.addEventListener("click", toggleMaximize);

        const minimize = document.createElement("button");
        minimize.type = "button";
        const minimizeActive = entry.minimized;
        minimize.textContent = minimizeActive ? "Aufklappen" : "Minimieren";
        minimize.title = getControlHint("minimize", minimizeActive);
        minimize.setAttribute("aria-label", minimize.title);
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
        hide.title = getControlHint("hide", false);
        hide.setAttribute("aria-label", hide.title);
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

        actions.append(pin, maximize, minimize, hide);
        card.append(order, title, actions);
        card.addEventListener("click", (event) => {
          if (event.target && event.target.tagName === "BUTTON") {
            return;
          }
          toggleMaximize();
          renderModuleOptions(entry);
        });
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleMaximize();
            renderModuleOptions(entry);
          }
        });

        if (!entry.minimized) {
          const what = document.createElement("p");
          what.textContent = `Was macht das? ${entry.what}`;
          const data = document.createElement("p");
          data.textContent = `Was passiert mit den Daten? ${entry.data}`;
          const undo = document.createElement("p");
          undo.textContent = `Wie rueckgaengig? ${entry.undo}`;
          card.append(what, data, undo);
        }

        slot.appendChild(card);
        grid.appendChild(slot);
      }

      onModuleStateChange(
        visibleModules.map((entry) => ({
          id: entry.id,
          title: entry.title,
          pinned: Boolean(entry.pinned),
          maximized: maximizedId === entry.id,
        })),
      );
    }

    function openModuleByTitle(moduleTitle) {
      if (typeof moduleTitle !== "string" || !moduleTitle.trim()) {
        return false;
      }

      const match = moduleModel.find(
        (entry) => !entry.hidden && entry.title === moduleTitle,
      );
      if (!match) {
        return false;
      }

      maximizedId = match.id;
      renderActiveModules();
      renderModuleOptions(match);
      setStatus(
        `Modul geoeffnet: ${match.title}. Naechster Schritt: Funktionen nutzen.`,
      );
      return true;
    }

    function getActiveModules() {
      return moduleModel
        .filter((entry) => !entry.hidden)
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          pinned: Boolean(entry.pinned),
        }));
    }

    function addModule(moduleId) {
      const source = getCatalogModule(moduleId);
      if (moduleModel.some((entry) => entry.id === moduleId && !entry.hidden)) {
        setStatus("Modul ist schon aktiv. Naechster Schritt: Modul oeffnen.");
        return;
      }

      const position = moduleModel.filter((entry) => !entry.hidden).length + 1;
      const persisted = initialModuleState[moduleId] || {};
      moduleModel.push({
        ...source,
        position,
        minimized: false,
        hidden: false,
        pinned: Boolean(persisted.pinned),
      });
      renderActiveModules();
      renderModuleOptions(moduleModel[moduleModel.length - 1]);
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
    clearModuleOptions();

    return {
      openModuleByTitle,
      getActiveModules,
    };
  }

  window.createModuleWorkspace = buildWorkspace;
  window.getModuleWorkspaceControlHint = getControlHint;
})();
