(function bootstrapBackupRestore(globalObject) {
  function assertText(value, name) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${name} fehlt. Bitte erneut versuchen.`);
    }
  }

  function assertObject(value, name) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`${name} ist ungueltig. Bitte erneut versuchen.`);
    }
  }

  function getFileName(filePath, fieldName) {
    assertText(filePath, fieldName);
    const normalized = filePath.replaceAll("\\", "/").trim();
    const parts = normalized.split("/").filter(Boolean);
    const fileName = parts[parts.length - 1] || "";
    assertText(fileName, `${fieldName}-Dateiname`);
    return fileName;
  }

  function buildRestorePlan(selectedBackupPath, selectedTargetPath) {
    const backupFileName = getFileName(selectedBackupPath, "Backup-Pfad");
    const safeTargetPath =
      selectedTargetPath || inferTargetPathFromBackupPath(selectedBackupPath);
    const targetFileName = getFileName(safeTargetPath, "Ziel-Pfad");

    validateRestorePair(backupFileName, targetFileName);

    return {
      backupPath: selectedBackupPath,
      targetPath: safeTargetPath,
      backupFileName,
      targetFileName,
    };
  }

  function inferTargetPathFromBackupPath(selectedBackupPath) {
    const backupFileName = getFileName(selectedBackupPath, "Backup-Pfad");
    if (!backupFileName.endsWith(".backup.json")) {
      throw new Error(
        "Backup-Datei ungueltig. Bitte Backup erneut waehlen oder Reparatur starten.",
      );
    }

    const targetFileName = backupFileName.replace(".backup.json", ".json");
    assertText(targetFileName, "Ziel-Dateiname");
    return `data/${targetFileName}`;
  }

  function validateRestorePair(backupFileName, targetFileName) {
    assertText(backupFileName, "Backup-Dateiname");
    assertText(targetFileName, "Ziel-Dateiname");

    const allowedTargets = new Set(["store.json", "registry.json"]);
    if (!allowedTargets.has(targetFileName)) {
      throw new Error(
        "Ziel-Datei nicht erlaubt. Bitte store.json oder registry.json waehlen.",
      );
    }

    const expectedTarget = backupFileName.replace(".backup.json", ".json");
    if (expectedTarget !== targetFileName) {
      throw new Error(
        "Backup passt nicht zur Ziel-Datei. Bitte Auswahl pruefen und erneut versuchen.",
      );
    }
  }

  async function readHandleText(fileHandle) {
    assertObject(fileHandle, "Datei-Handle");
    const file = await fileHandle.getFile();
    const raw = await file.text();
    assertText(raw, "Dateiinhalt");
    return raw;
  }

  async function writeHandleText(fileHandle, content) {
    assertObject(fileHandle, "Datei-Handle");
    assertText(content, "Dateiinhalt");

    const writer = await fileHandle.createWritable();
    await writer.write(content);
    await writer.close();
    return true;
  }

  async function getDataDirectoryHandle(projectDirectoryHandle) {
    assertObject(projectDirectoryHandle, "Projektordner");

    try {
      return await projectDirectoryHandle.getDirectoryHandle("data", {
        create: false,
      });
    } catch {
      return projectDirectoryHandle;
    }
  }

  async function restoreBackupFromDirectory(projectDirectoryHandle, plan) {
    assertObject(plan, "Restore-Plan");
    assertText(plan.backupFileName, "Backup-Dateiname");
    assertText(plan.targetFileName, "Ziel-Dateiname");

    const dataDirectoryHandle = await getDataDirectoryHandle(
      projectDirectoryHandle,
    );

    const backupFileHandle = await dataDirectoryHandle.getFileHandle(
      plan.backupFileName,
      { create: false },
    );
    const targetFileHandle = await dataDirectoryHandle.getFileHandle(
      plan.targetFileName,
      { create: true },
    );

    const backupRaw = await readHandleText(backupFileHandle);
    const parsed = JSON.parse(backupRaw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error(
        "Backup-Daten sind ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const outputRaw = `${JSON.stringify(parsed, null, 2)}\n`;
    await writeHandleText(targetFileHandle, outputRaw);

    const verifyRaw = await readHandleText(targetFileHandle);
    JSON.parse(verifyRaw);

    return {
      ok: true,
      backupFileName: plan.backupFileName,
      targetFileName: plan.targetFileName,
    };
  }

  const api = {
    buildRestorePlan,
    inferTargetPathFromBackupPath,
    restoreBackupFromDirectory,
  };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.BackupRestore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
