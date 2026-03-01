(function bootstrapSafeModeSupportLog(globalObject) {
  const LOG_FILE_PATH = "data/backup_events.json";

  function assertText(value, name) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `${name} fehlt. Erneut versuchen oder Protokoll oeffnen.`,
      );
    }
    return value.trim();
  }

  function assertDirectoryHandle(handle) {
    if (!handle || typeof handle.getDirectoryHandle !== "function") {
      throw new Error(
        "Projektordner fehlt. Erneut versuchen oder Protokoll oeffnen.",
      );
    }
    return handle;
  }

  function createSupportEventEntry(cause, details) {
    const safeCause = assertText(cause, "Anlass");
    const safeDetails =
      typeof details === "string" && details.trim() !== ""
        ? details.trim()
        : "Safe-Mode wurde auf Standard zurueckgesetzt.";

    return {
      id: `safe-mode-reset-${Date.now()}`,
      kind: "safe-mode-reset",
      cause: safeCause,
      details: safeDetails,
      createdAt: new Date().toISOString(),
    };
  }

  function normalizeEventLog(parsedLog) {
    if (
      !parsedLog ||
      typeof parsedLog !== "object" ||
      Array.isArray(parsedLog)
    ) {
      return { events: [] };
    }

    if (!Array.isArray(parsedLog.events)) {
      return { events: [] };
    }

    return {
      events: parsedLog.events.filter((entry) => {
        return entry && typeof entry === "object" && !Array.isArray(entry);
      }),
    };
  }

  async function appendSafeModeSupportEvent(rootHandle, cause, details) {
    assertDirectoryHandle(rootHandle);
    const entry = createSupportEventEntry(cause, details);

    const writerApi = globalObject.ProjectFileWriter;
    if (
      !writerApi ||
      typeof writerApi.resolveProjectFileHandle !== "function"
    ) {
      throw new Error(
        "Datei-Schreiber fehlt. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    let fileHandle;
    try {
      fileHandle = await writerApi.resolveProjectFileHandle(
        rootHandle,
        LOG_FILE_PATH,
      );
    } catch {
      throw new Error(
        "Support-Verlauf konnte nicht geoeffnet werden. Protokoll oeffnen.",
      );
    }

    let nextLog = { events: [] };
    try {
      const file = await fileHandle.getFile();
      const raw = await file.text();
      if (typeof raw === "string" && raw.trim() !== "") {
        const parsed = JSON.parse(raw);
        nextLog = normalizeEventLog(parsed);
      }
    } catch {
      nextLog = { events: [] };
    }

    nextLog.events.push(entry);

    await writerApi.writeProjectJsonFile(rootHandle, LOG_FILE_PATH, nextLog);

    return {
      ok: true,
      entry,
      eventCount: nextLog.events.length,
      filePath: LOG_FILE_PATH,
    };
  }

  const api = {
    LOG_FILE_PATH,
    appendSafeModeSupportEvent,
    createSupportEventEntry,
    normalizeEventLog,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalObject.SafeModeSupportLog = api;
})(typeof window !== "undefined" ? window : globalThis);
