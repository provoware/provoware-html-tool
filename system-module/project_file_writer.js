(function bootstrapProjectFileWriter(globalObject) {
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

  function parseRelativePath(relativePath) {
    const safePath = assertText(relativePath, "Dateipfad");
    const parts = safePath.split("/").filter(Boolean);
    if (parts.length < 2) {
      throw new Error(
        "Dateipfad unvollstaendig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    if (parts.some((part) => part === "." || part === "..")) {
      throw new Error(
        "Dateipfad ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    return {
      directories: parts.slice(0, -1),
      fileName: parts[parts.length - 1],
    };
  }

  async function resolveProjectFileHandle(rootHandle, relativePath) {
    let directory = assertDirectoryHandle(rootHandle);
    const parsed = parseRelativePath(relativePath);

    for (const folder of parsed.directories) {
      directory = await directory.getDirectoryHandle(folder, { create: true });
    }

    return directory.getFileHandle(parsed.fileName, { create: true });
  }

  async function appendProjectTextFile(rootHandle, relativePath, textLine) {
    assertDirectoryHandle(rootHandle);
    parseRelativePath(relativePath);
    const safeLine = assertText(textLine, "Notiztext");

    const fileHandle = await resolveProjectFileHandle(rootHandle, relativePath);
    let existing = "";
    try {
      const file = await fileHandle.getFile();
      existing = await file.text();
    } catch {
      existing = "";
    }

    const writer = await fileHandle.createWritable();
    const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
    await writer.write(`${existing}${prefix}${safeLine}\n`);
    await writer.close();
    return true;
  }

  async function writeProjectTextFile(rootHandle, relativePath, textContent) {
    assertDirectoryHandle(rootHandle);
    parseRelativePath(relativePath);
    const safeContent =
      typeof textContent === "string" ? textContent : String(textContent || "");

    const fileHandle = await resolveProjectFileHandle(rootHandle, relativePath);
    const writer = await fileHandle.createWritable();
    await writer.write(`${safeContent}
`);
    await writer.close();
    return true;
  }

  async function writeProjectJsonFile(rootHandle, relativePath, payload) {
    assertDirectoryHandle(rootHandle);
    parseRelativePath(relativePath);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error(
        "JSON-Daten ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const fileHandle = await resolveProjectFileHandle(rootHandle, relativePath);
    const writer = await fileHandle.createWritable();
    await writer.write(`${JSON.stringify(payload, null, 2)}\n`);
    await writer.close();
    return true;
  }

  const api = {
    parseRelativePath,
    resolveProjectFileHandle,
    writeProjectJsonFile,
    writeProjectTextFile,
    appendProjectTextFile,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalObject.ProjectFileWriter = api;
})(typeof window !== "undefined" ? window : globalThis);
