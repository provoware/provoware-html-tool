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

module.exports = {
  buildQuickAccess,
  moveZone,
  reorderZones,
};
