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

  return {
    leftWidth,
    rightWidth,
    leftCollapsed,
    rightCollapsed,
  };
}

function createLayoutSnapshot(layoutState) {
  const normalized = normalizeLayoutState(layoutState);
  return {
    leftWidth: normalized.leftWidth,
    rightWidth: normalized.rightWidth,
    leftCollapsed: normalized.leftCollapsed,
    rightCollapsed: normalized.rightCollapsed,
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

  return 4;
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

module.exports = {
  applyLayoutSnapshot,
  buildQuickAccess,
  createLayoutSnapshot,
  getGridColumnCount,
  resolveSidebarShortcut,
  moveZone,
  normalizeLayoutState,
  reorderZones,
};

if (typeof window !== "undefined") {
  window.DashboardModel = {
    applyLayoutSnapshot,
    buildQuickAccess,
    createLayoutSnapshot,
    getGridColumnCount,
    resolveSidebarShortcut,
    moveZone,
    normalizeLayoutState,
    reorderZones,
  };
}
