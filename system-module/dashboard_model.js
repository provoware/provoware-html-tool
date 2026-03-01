function assertList(value, name) {
  if (!Array.isArray(value)) {
    throw new Error(`${name} muss eine Liste sein. Bitte erneut versuchen.`);
  }
}

function assertText(value, name) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} fehlt. Bitte erneut versuchen.`);
  }
}

const MODULE_REGISTRY = [
  {
    id: "notes",
    title: "Notizen",
    what: "Sammelt kurze Ideen direkt im Hauptbereich.",
    data: "Speichert nur den sichtbaren Notizstatus im Layout.",
    undo: "Sie koennen das Modul ausblenden oder erneut aktivieren.",
  },
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

function getModuleRegistry() {
  return MODULE_REGISTRY.map((entry) => ({ ...entry }));
}

function getDefaultModuleStart() {
  return ["notes"];
}

function reorderZones(zones, sourceIndex, targetIndex) {
  assertList(zones, "Zonen");
  if (!Number.isInteger(sourceIndex) || !Number.isInteger(targetIndex)) {
    throw new Error(
      "Positionen sind ungueltig. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  if (
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= zones.length ||
    targetIndex >= zones.length
  ) {
    throw new Error("Position ausserhalb der Liste. Bitte erneut versuchen.");
  }

  const copy = [...zones];
  const [moved] = copy.splice(sourceIndex, 1);
  copy.splice(targetIndex, 0, moved);

  if (copy.length !== zones.length) {
    throw new Error("Zonenliste unvollstaendig. Reparatur starten.");
  }

  return copy;
}

function moveZone(zones, zoneId, direction) {
  assertList(zones, "Zonen");
  assertText(zoneId, "Zone-ID");
  assertText(direction, "Richtung");

  const startIndex = zones.findIndex((zone) => zone.id === zoneId);
  if (startIndex < 0) {
    throw new Error("Zone nicht gefunden. Bitte Protokoll oeffnen.");
  }

  if (direction === "up" && startIndex > 0) {
    return reorderZones(zones, startIndex, startIndex - 1);
  }

  if (direction === "down" && startIndex < zones.length - 1) {
    return reorderZones(zones, startIndex, startIndex + 1);
  }

  return [...zones];
}

function buildQuickAccess(pinnedItems, usageItems, limit = 6) {
  assertList(pinnedItems, "Gepinnte Eintraege");
  assertList(usageItems, "Nutzungs-Eintraege");

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Limit ist ungueltig. Bitte erneut versuchen.");
  }

  const seen = new Set();
  const merged = [];

  [...pinnedItems, ...usageItems].forEach((item) => {
    if (typeof item !== "string") {
      return;
    }

    const safeItem = item.trim();
    if (safeItem === "" || seen.has(safeItem)) {
      return;
    }

    seen.add(safeItem);
    merged.push(safeItem);
  });

  const result = merged.slice(0, limit);
  if (!Array.isArray(result)) {
    throw new Error("Schnellzugriff konnte nicht erstellt werden.");
  }

  return result;
}

function clampNumber(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return min;
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function normalizeLayoutState(input) {
  const source = input && typeof input === "object" ? input : {};
  const leftWidth = clampNumber(source.leftWidth, 220, 340);
  const rightWidth = clampNumber(source.rightWidth, 220, 340);
  const leftCollapsed = Boolean(source.leftCollapsed);
  const rightCollapsed = Boolean(source.rightCollapsed);
  const bootFocusTarget = normalizeBootFocusTarget(source.bootFocusTarget);

  return {
    leftWidth,
    rightWidth,
    leftCollapsed,
    rightCollapsed,
    bootFocusTarget,
  };
}

function createLayoutSnapshot(layoutState) {
  const normalized = normalizeLayoutState(layoutState);
  return {
    leftWidth: normalized.leftWidth,
    rightWidth: normalized.rightWidth,
    leftCollapsed: normalized.leftCollapsed,
    rightCollapsed: normalized.rightCollapsed,
    bootFocusTarget: normalized.bootFocusTarget,
  };
}

function applyLayoutSnapshot(layoutState, snapshot) {
  const base = normalizeLayoutState(layoutState);
  if (!snapshot || typeof snapshot !== "object") {
    return base;
  }

  const safeSnapshot = normalizeLayoutState(snapshot);
  return {
    leftWidth: safeSnapshot.leftWidth,
    rightWidth: safeSnapshot.rightWidth,
    leftCollapsed: safeSnapshot.leftCollapsed,
    rightCollapsed: safeSnapshot.rightCollapsed,
    bootFocusTarget: safeSnapshot.bootFocusTarget,
  };
}

function getGridColumnCount(viewportWidth) {
  if (!Number.isFinite(viewportWidth) || viewportWidth < 1) {
    throw new Error(
      "Breite ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.",
    );
  }

  if (viewportWidth < 620) {
    return 1;
  }

  if (viewportWidth < 960) {
    return 2;
  }

  if (viewportWidth < 1280) {
    return 3;
  }

  return 3;
}

function resolveSidebarShortcut(eventLike, sidebarOpen) {
  const openNow = Boolean(sidebarOpen);
  const event = eventLike && typeof eventLike === "object" ? eventLike : {};
  const key = typeof event.key === "string" ? event.key.toLowerCase() : "";
  const altKey = event.altKey === true;

  if (key !== "f" || !altKey) {
    return {
      handled: false,
      nextOpen: openNow,
      status: "",
    };
  }

  const nextOpen = !openNow;
  const status = nextOpen
    ? "Favoritenleiste geoeffnet. Naechster Schritt: Schnellaktion waehlen."
    : "Favoritenleiste geschlossen. Naechster Schritt: Mit Alt+F erneut oeffnen.";

  return {
    handled: true,
    nextOpen,
    status,
  };
}

function resolveFavoritesAction(actionKey, context = {}) {
  assertText(actionKey, "Favoriten-Aktion");
  const safeContext = context && typeof context === "object" ? context : {};
  const activeModules = Array.isArray(safeContext.activeModules)
    ? safeContext.activeModules.filter(
        (entry) => entry && typeof entry.title === "string",
      )
    : [];
  const lastModule =
    typeof safeContext.lastModuleTitle === "string"
      ? safeContext.lastModuleTitle
      : "";

  if (actionKey === "open-last-module") {
    if (lastModule.trim()) {
      return {
        handled: true,
        status: `${lastModule} geoeffnet. Naechster Schritt: Modulinhalt pruefen.`,
      };
    }

    return {
      handled: true,
      status:
        "Noch kein letztes Modul vorhanden. Naechster Schritt: Modul anklicken und erneut versuchen.",
    };
  }

  if (actionKey === "show-all-modules") {
    if (activeModules.length === 0) {
      return {
        handled: true,
        status:
          "Keine aktiven Module sichtbar. Naechster Schritt: Links ein Modul aktivieren.",
      };
    }

    const moduleNames = activeModules.map((entry) => entry.title).join(", ");
    return {
      handled: true,
      status: `Aktive Module: ${moduleNames}. Naechster Schritt: Gewuenschtes Modul waehlen.`,
    };
  }

  if (actionKey === "show-focus-help") {
    return {
      handled: true,
      status:
        "Fokus-Hilfe: Erst Fokusmodus starten, dann Escape fuer Rueckweg nutzen. Naechster Schritt: Fokusmodus oben aktivieren.",
    };
  }

  return {
    handled: false,
    status:
      "Aktion nicht bekannt. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
  };
}

function buildBootGateHint(allPhasesOk) {
  const open = allPhasesOk === true;
  if (open) {
    return {
      gateOpen: true,
      hint: "Weiter ist frei. Naechster Schritt: Mit Weiter direkt ins Dashboard.",
      help: "Boot ist bereit. Rueckweg: Bei Bedarf Phase pruefen und dann Weiter nutzen.",
    };
  }

  return {
    gateOpen: false,
    hint: "Weiter ist gesperrt. Naechster Schritt: Erst alle Phasen auf Gruen bringen.",
    help: "Boot ist noch nicht fertig. Naechster Schritt: Phase pruefen, dann erneut versuchen.",
  };
}

function normalizeBootFocusTarget(value) {
  return value === "help" ? "help" : "module";
}

function resolveBootFocusTarget(layoutStateInput) {
  const source =
    layoutStateInput && typeof layoutStateInput === "object"
      ? layoutStateInput
      : {};
  const focusTarget = normalizeBootFocusTarget(source.bootFocusTarget);

  if (focusTarget === "help") {
    return {
      target: "help",
      status:
        "Boot ist frei. Fokus ist jetzt auf Hilfe. Naechster Schritt: Aktion waehlen.",
    };
  }

  return {
    target: "module",
    status:
      "Boot ist frei. Fokus ist jetzt auf dem ersten Modul. Naechster Schritt: Modul pruefen.",
  };
}

function buildSafeModeStatus(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const isSafeMode = source.isSafeMode === true;
  const reason =
    typeof source.reason === "string" && source.reason.trim()
      ? source.reason.trim()
      : "kein Fehlergrund gemeldet";

  if (isSafeMode) {
    return {
      isSafeMode: true,
      text: `Safe-Mode aktiv. Grund: ${reason}. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.`,
    };
  }

  return {
    isSafeMode: false,
    text: "Safe-Mode aus. Naechster Schritt: Normal weiterarbeiten oder bei Fehlern Protokoll oeffnen.",
  };
}

module.exports = {
  applyLayoutSnapshot,
  buildQuickAccess,
  createLayoutSnapshot,
  getModuleRegistry,
  getDefaultModuleStart,
  getGridColumnCount,
  resolveFavoritesAction,
  buildBootGateHint,
  buildSafeModeStatus,
  resolveSidebarShortcut,
  resolveBootFocusTarget,
  moveZone,
  normalizeLayoutState,
  reorderZones,
};

if (typeof window !== "undefined") {
  window.DashboardModel = {
    applyLayoutSnapshot,
    buildQuickAccess,
    createLayoutSnapshot,
    getModuleRegistry,
    getDefaultModuleStart,
    getGridColumnCount,
    resolveFavoritesAction,
    buildBootGateHint,
    buildSafeModeStatus,
    resolveSidebarShortcut,
    resolveBootFocusTarget,
    moveZone,
    normalizeLayoutState,
    reorderZones,
  };
}
