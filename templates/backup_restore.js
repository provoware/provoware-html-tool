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

  function isRestoreConfirmationValid(userInput, expectedFileName) {
    assertText(expectedFileName, "Erwarteter Dateiname");
    if (typeof userInput !== "string") {
      return false;
    }
    return userInput.trim() === expectedFileName;
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

  async function listVersionFilesFromDirectory(
    projectDirectoryHandle,
    targetFileName,
  ) {
    assertObject(projectDirectoryHandle, "Projektordner");
    assertText(targetFileName, "Ziel-Dateiname");

    const dataDirectoryHandle = await getDataDirectoryHandle(
      projectDirectoryHandle,
    );
    const baseName = targetFileName.replace(/\.json$/, "");
    const versionDirName = `${baseName}_versions`;

    try {
      const versionDirectory = await dataDirectoryHandle.getDirectoryHandle(
        versionDirName,
        { create: false },
      );
      const entries = [];
      for await (const [entryName, handle] of versionDirectory.entries()) {
        if (handle.kind !== "file" || !entryName.endsWith(".json")) {
          continue;
        }
        entries.push(entryName);
      }
      return entries.sort();
    } catch {
      return [];
    }
  }

  async function restoreVersionFromDirectory(
    projectDirectoryHandle,
    targetFileName,
    versionFileName,
  ) {
    assertObject(projectDirectoryHandle, "Projektordner");
    assertText(targetFileName, "Ziel-Dateiname");
    assertText(versionFileName, "Versions-Dateiname");

    const dataDirectoryHandle = await getDataDirectoryHandle(
      projectDirectoryHandle,
    );
    const baseName = targetFileName.replace(/\.json$/, "");
    const versionDirectory = await dataDirectoryHandle.getDirectoryHandle(
      `${baseName}_versions`,
      { create: false },
    );

    const versionHandle = await versionDirectory.getFileHandle(
      versionFileName,
      {
        create: false,
      },
    );
    const targetHandle = await dataDirectoryHandle.getFileHandle(
      targetFileName,
      {
        create: true,
      },
    );

    const versionRaw = await readHandleText(versionHandle);
    const parsed = JSON.parse(versionRaw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error(
        "Versions-Daten sind ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    await writeHandleText(
      targetHandle,
      `${JSON.stringify(parsed, null, 2)}
`,
    );
    const verifyRaw = await readHandleText(targetHandle);
    JSON.parse(verifyRaw);

    return {
      ok: true,
      targetFileName,
      versionFileName,
    };
  }

  function describeTimestampDifference(currentParsed, versionParsed) {
    assertObject(currentParsed, "Aktuelle Daten");
    assertObject(versionParsed, "Versions-Daten");

    const currentTime =
      typeof currentParsed.updatedAt === "string"
        ? currentParsed.updatedAt
        : "";
    const versionTime =
      typeof versionParsed.updatedAt === "string"
        ? versionParsed.updatedAt
        : "";

    if (!currentTime && !versionTime) {
      return "Zeit: Kein Zeitstempel vorhanden.";
    }
    if (!currentTime && versionTime) {
      return `Zeit: Nur Version hat Zeitstempel (${versionTime}).`;
    }
    if (currentTime && !versionTime) {
      return `Zeit: Nur aktuelle Datei hat Zeitstempel (${currentTime}).`;
    }
    if (currentTime === versionTime) {
      return `Zeit: Gleich (${currentTime}).`;
    }

    return `Zeit: Aktuell ${currentTime}, Version ${versionTime}.`;
  }

  function buildGroupedKeyDetails(currentKeyList, versionKeyList) {
    const currentSet = new Set(currentKeyList);
    const versionSet = new Set(versionKeyList);

    const neu = versionKeyList.filter((key) => !currentSet.has(key));
    const entfernt = currentKeyList.filter((key) => !versionSet.has(key));
    const gleich = currentKeyList.filter((key) => versionSet.has(key));

    const toList = (label, values) =>
      `${label}: ${values.length > 0 ? values.join(", ") : "(leer)"}.`;

    return (
      `${toList("Neu", neu)} ` +
      `${toList("Entfernt", entfernt)} ` +
      `${toList("Gleich", gleich)} ` +
      "Naechster Schritt: Unterschiede pruefen und Entscheidung treffen."
    );
  }

  function createVersionCompareSummary(compareInput) {
    assertObject(compareInput, "Versionsvergleich");
    const currentKeys = Number(compareInput.currentKeys || 0);
    const versionKeys = Number(compareInput.versionKeys || 0);
    const currentBytes = Number(compareInput.currentBytes || 0);
    const versionBytes = Number(compareInput.versionBytes || 0);

    if (
      Number.isNaN(currentKeys) ||
      Number.isNaN(versionKeys) ||
      Number.isNaN(currentBytes) ||
      Number.isNaN(versionBytes)
    ) {
      throw new Error(
        "Versionsvergleich ist ungueltig. Bitte erneut versuchen.",
      );
    }

    const keyDiff = versionKeys - currentKeys;
    const byteDiff = versionBytes - currentBytes;
    const keyTrend =
      keyDiff === 0 ? "gleich viele" : keyDiff > 0 ? "mehr" : "weniger";
    const byteTrend =
      byteDiff === 0 ? "gleich gross" : byteDiff > 0 ? "groesser" : "kleiner";
    const timeSummaryRaw =
      compareInput.timeSummary || "Zeit: Kein Zeitstempel vorhanden.";
    assertText(timeSummaryRaw, "Zeitvergleich");
    const timeSummary = timeSummaryRaw.trim();

    const detailText =
      typeof compareInput.detailText === "string" &&
      compareInput.detailText.trim()
        ? compareInput.detailText.trim()
        : "Detailmodus leer. Naechster Schritt: Version waehlen.";

    return {
      ok: true,
      keyDiff,
      byteDiff,
      detailText,
      text:
        `Vergleich: Felder ${Math.abs(keyDiff)} ${keyTrend}. ` +
        `Dateigroesse ${Math.abs(byteDiff)} Bytes ${byteTrend}. ` +
        `${timeSummary} ` +
        "Naechster Schritt: Version wiederherstellen oder Zurueck.",
    };
  }

  async function compareVersionWithCurrentFromDirectory(
    projectDirectoryHandle,
    targetFileName,
    versionFileName,
  ) {
    assertObject(projectDirectoryHandle, "Projektordner");
    assertText(targetFileName, "Ziel-Dateiname");
    assertText(versionFileName, "Versions-Dateiname");

    const dataDirectoryHandle = await getDataDirectoryHandle(
      projectDirectoryHandle,
    );
    const baseName = targetFileName.replace(/\.json$/, "");
    const versionDirectory = await dataDirectoryHandle.getDirectoryHandle(
      `${baseName}_versions`,
      { create: false },
    );
    const targetHandle = await dataDirectoryHandle.getFileHandle(
      targetFileName,
      {
        create: false,
      },
    );
    const versionHandle = await versionDirectory.getFileHandle(
      versionFileName,
      {
        create: false,
      },
    );

    const currentRaw = await readHandleText(targetHandle);
    const versionRaw = await readHandleText(versionHandle);
    const currentParsed = JSON.parse(currentRaw);
    const versionParsed = JSON.parse(versionRaw);

    if (!currentParsed || typeof currentParsed !== "object") {
      throw new Error(
        "Aktuelle Datei ist ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }
    if (!versionParsed || typeof versionParsed !== "object") {
      throw new Error(
        "Version ist ungueltig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    const currentKeyList = Object.keys(currentParsed).sort();
    const versionKeyList = Object.keys(versionParsed).sort();

    return createVersionCompareSummary({
      currentKeys: currentKeyList.length,
      versionKeys: versionKeyList.length,
      currentBytes: currentRaw.length,
      versionBytes: versionRaw.length,
      timeSummary: describeTimestampDifference(currentParsed, versionParsed),
      detailText: buildGroupedKeyDetails(currentKeyList, versionKeyList),
    });
  }

  const api = {
    buildRestorePlan,
    inferTargetPathFromBackupPath,
    isRestoreConfirmationValid,
    compareVersionWithCurrentFromDirectory,
    createVersionCompareSummary,
    listVersionFilesFromDirectory,
    restoreBackupFromDirectory,
    restoreVersionFromDirectory,
  };

  if (typeof module === "object" && module.exports) {
    module.exports = api;
    return;
  }

  globalObject.BackupRestore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
