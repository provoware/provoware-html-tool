(function setupDashboard() {
  const DB_NAME = "provoware-dashboard";
  const STORE_NAME = "handles";
  const HANDLE_KEY = "project-root";
  const REQUIRED_FOLDERS = [
    "system-core",
    "system-module",
    "config",
    "data",
    "tools",
    "templates",
    "test",
    "dummys",
  ];

  const zones = document.getElementById("zones");
  const status = document.getElementById("status");
  const debugButton = document.getElementById("toggle-debug");
  const debugOutput = document.getElementById("debug-output");
  const chooseFolder = document.getElementById("choose-folder");
  const reconnect = document.getElementById("reconnect-folder");
  const themeSelect = document.getElementById("theme-select");
  const themeTooltip = document.getElementById("theme-tooltip");
  const controlWhat = document.getElementById("control-what");
  const workspaceHelp = document.getElementById("workspace-help");
  const helpWhat = document.getElementById("help-what");
  const guideIntro = document.getElementById("guide-intro");
  const guideList = document.getElementById("guide-list");
  const showNextStep = document.getElementById("show-next-step");
  const showLaienTip = document.getElementById("show-laien-tip");
  const bootStatus = document.getElementById("boot-status");
  const bootSummary = document.getElementById("boot-summary");
  const kanbanPreview = document.getElementById("kanban-preview");
  const kanbanStatus = document.getElementById("kanban-status");

  function formatText(template, values) {
    if (typeof template !== "string" || !template.trim()) {
      return "";
    }

    return Object.entries(values).reduce((text, entry) => {
      const [key, value] = entry;
      const safeValue = typeof value === "string" ? value : "";
      return text.replace(`{${key}}`, safeValue);
    }, template);
  }
  const helpRetry = document.getElementById("help-retry");
  const helpRepair = document.getElementById("help-repair");
  const helpLog = document.getElementById("help-log");
  const helpBackup = document.getElementById("help-backup");
  const backupDialog = document.getElementById("backup-dialog");
  const backupDialogClose = document.getElementById("backup-dialog-close");
  const backupSelect = document.getElementById("backup-select");
  const backupTargetSelect = document.getElementById("backup-target-select");
  const backupRestore = document.getElementById("backup-restore");

  const ensureMessage =
    window.DashboardHelp?.ensureMessage || ((m, f) => m || f);
  const validateElement = window.DashboardHelp?.validateElement;

  const bootController = window.BootStatus?.createBootStatusController({
    root: bootStatus,
    summary: bootSummary,
  });

  let dragSourceId = null;
  let selectedProjectDir = null;
  let zoneModel = [
    { id: "fav", title: "⭐ Favoriten" },
    { id: "quick", title: "⚡ Schnellzugriff" },
    { id: "modules", title: "📦 Module" },
  ];

  async function loadMessages() {
    try {
      const response = await fetch("../config/messages_de.json");
      if (!response.ok) {
        throw new Error("Textdatei nicht erreichbar");
      }
      const json = await response.json();
      return json.dashboardCompact || {};
    } catch {
      return {};
    }
  }

  function setStatus(message) {
    const safe = ensureMessage(
      message,
      "Status fehlt. Naechster Schritt: Erneut versuchen.",
    );
    status.textContent = safe;
    return safe;
  }

  function setKanbanStatus(message) {
    const safe = ensureMessage(
      message,
      "Kanban-Status fehlt. Naechster Schritt: Erneut versuchen.",
    );
    if (kanbanStatus) {
      kanbanStatus.textContent = safe;
    }
    return safe;
  }

  function setDebug(message) {
    const safe = ensureMessage(message, "Debug-Text fehlt.");
    debugOutput.textContent = safe;
    return safe;
  }

  function updateBootPhase(phaseId, state, detail, summaryText) {
    if (!bootController) {
      return false;
    }

    bootController.setPhase(phaseId, state, detail);
    if (summaryText) {
      bootController.setSummary(state, summaryText);
    }
    return true;
  }

  function registerKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
      if (!event || typeof event.key !== "string") {
        setStatus(
          "Tastaturereignis ungueltig. Naechster Schritt: Erneut versuchen.",
        );
        return false;
      }

      if (event.key !== "Escape") {
        return true;
      }

      if (backupDialog?.open) {
        closeBackupDialog();
        return true;
      }

      if (!debugOutput.hidden) {
        debugOutput.hidden = true;
        setStatus(
          "Debug-Ansicht geschlossen. Naechster Schritt: Weiterarbeiten.",
        );
        return true;
      }

      setStatus(
        "Escape gedrueckt. Naechster Schritt: Bereich mit Tab waehlen.",
      );
      return true;
    });

    return true;
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveHandle(handle) {
    if (!handle) {
      throw new Error("Handle fehlt. Bitte Ordner erneut waehlen.");
    }

    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadHandle() {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(HANDLE_KEY);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function ensureStructure(handle) {
    if (!handle || typeof handle.getDirectoryHandle !== "function") {
      throw new Error(
        "Projektordner ungueltig. Erneut versuchen oder Protokoll oeffnen.",
      );
    }

    const created = [];
    for (const folder of REQUIRED_FOLDERS) {
      await handle.getDirectoryHandle(folder, { create: true });
      created.push(folder);
    }

    if (created.length !== REQUIRED_FOLDERS.length) {
      throw new Error(
        "Projektstruktur unvollstaendig. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    return created;
  }

  async function writeProjectJson(relativePath, payload) {
    if (!window.ProjectFileWriter?.writeProjectJsonFile) {
      throw new Error(
        "Datei-Schreiber fehlt. Reparatur starten oder Protokoll oeffnen.",
      );
    }

    return window.ProjectFileWriter.writeProjectJsonFile(
      selectedProjectDir,
      relativePath,
      payload,
    );
  }

  function renderZones() {
    zones.innerHTML = "";
    zoneModel.forEach((zone, index) => {
      const article = document.createElement("article");
      article.className = "card";
      article.draggable = true;
      article.dataset.zoneId = zone.id;

      article.addEventListener("dragstart", () => {
        dragSourceId = zone.id;
      });
      article.addEventListener("dragover", (event) => event.preventDefault());
      article.addEventListener("drop", () => {
        const source = zoneModel.findIndex((item) => item.id === dragSourceId);
        const target = zoneModel.findIndex((item) => item.id === zone.id);
        if (source < 0 || target < 0) {
          setStatus("Verschieben nicht moeglich. Erneut versuchen.");
          return;
        }
        const moved = zoneModel.splice(source, 1)[0];
        zoneModel.splice(target, 0, moved);
        renderZones();
        setStatus("Zone verschoben. Naechster Schritt: Reihenfolge pruefen.");
      });

      const header = document.createElement("div");
      header.className = "zone-header";
      header.innerHTML = `<strong>${zone.title}</strong>`;

      const actions = document.createElement("div");
      actions.className = "actions";

      const up = document.createElement("button");
      up.textContent = "Nach oben";
      up.disabled = index === 0;
      up.addEventListener("click", () => {
        if (index > 0) {
          const moved = zoneModel.splice(index, 1)[0];
          zoneModel.splice(index - 1, 0, moved);
          renderZones();
        }
      });

      const down = document.createElement("button");
      down.textContent = "Nach unten";
      down.disabled = index === zoneModel.length - 1;
      down.addEventListener("click", () => {
        if (index < zoneModel.length - 1) {
          const moved = zoneModel.splice(index, 1)[0];
          zoneModel.splice(index + 1, 0, moved);
          renderZones();
        }
      });

      actions.append(up, down);
      header.appendChild(actions);
      article.appendChild(header);
      zones.appendChild(article);
    });
  }

  async function chooseProjectFolder() {
    try {
      if (!window.showDirectoryPicker) {
        throw new Error(
          "Browser unterstuetzt keinen Ordnerzugriff. Erneut versuchen.",
        );
      }
      const handle = await window.showDirectoryPicker({ mode: "readwrite" });
      const permission = await handle.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        throw new Error("Berechtigung fehlt. Erneut versuchen.");
      }
      await saveHandle(handle);
      selectedProjectDir = handle;
      const folders = await ensureStructure(handle);
      setStatus(`Projekt verbunden. Struktur ok (${folders.length} Ordner).`);
      updateBootPhase(
        "folder",
        "ok",
        `Projektordner verbunden (${folders.length} Ordner).`,
        "Gruen: Ordnerverbindung ist bereit.",
      );
      setDebug(
        "Debug: Projektordner gespeichert. Bei Problem Protokoll oeffnen.",
      );
    } catch (error) {
      setStatus(`${error.message} Naechster Schritt: Reparatur starten.`);
      updateBootPhase(
        "folder",
        "fail",
        "Projektordner fehlt oder ist gesperrt.",
        "Rot: Ordnerverbindung fehlt. Naechster Schritt: Reparatur starten.",
      );
    }
  }

  async function reconnectProjectFolder() {
    try {
      const handle = await loadHandle();
      if (!handle) {
        throw new Error(
          "Kein gespeicherter Ordner gefunden. Erneut versuchen.",
        );
      }
      const permission = await handle.requestPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        throw new Error(
          "Berechtigung abgelehnt. Bitte Projektordner erneut waehlen.",
        );
      }
      selectedProjectDir = handle;
      const folders = await ensureStructure(handle);
      setStatus(`Auto-Reconnect ok. ${folders.length} Ordner sind bereit.`);
      updateBootPhase(
        "folder",
        "ok",
        `Auto-Reconnect bereit (${folders.length} Ordner).`,
        "Gruen: Ordnerverbindung ist bereit.",
      );
    } catch (error) {
      setStatus(`${error.message} Naechster Schritt: Erneut versuchen.`);
      updateBootPhase(
        "folder",
        "warn",
        "Ordner noch nicht verbunden. Erneut versuchen.",
        "Gelb: Start laeuft. Ordner noch offen.",
      );
    }
  }

  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.options[themeSelect.selectedIndex].text;
    document.body.dataset.theme = themeSelect.value;

    const tooltipTemplate =
      themeSelect.dataset.tooltipChanged ||
      "Thema gewechselt zu {theme}. Rueckweg: Im Feld wieder das alte Thema waehlen.";
    themeTooltip.textContent = ensureMessage(
      formatText(tooltipTemplate, { theme: selectedTheme }),
      "Thema gewechselt. Rueckweg: Vorheriges Thema wieder waehlen.",
    );

    setStatus(`Thema aktiv: ${selectedTheme}.`);
  });

  showNextStep.addEventListener("click", () => {
    setStatus("Naechster Schritt: Projektordner waehlen und Struktur pruefen.");
  });

  showLaienTip.addEventListener("click", () => {
    setStatus(
      "Laien-Tipp: Erst lesen, dann klicken. Bei Fehlern erneut versuchen.",
    );
  });

  async function loadBackupEvents() {
    try {
      const response = await fetch("../data/backup_events.json", {
        cache: "no-store",
      });
      if (!response.ok) {
        return [];
      }
      const events = await response.json();
      if (!Array.isArray(events)) {
        throw new Error("Backup-Log ist ungueltig.");
      }
      return events;
    } catch {
      return [];
    }
  }

  function renderBackupOptions(events) {
    if (!backupSelect) {
      setStatus("Backup-Auswahl fehlt. Naechster Schritt: Reparatur starten.");
      return false;
    }

    backupSelect.innerHTML = "";
    const safeEvents = Array.isArray(events) ? events : [];
    if (safeEvents.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Keine Backup-Datei gefunden";
      backupSelect.appendChild(option);
      return false;
    }

    safeEvents.forEach((event, index) => {
      if (!event || typeof event.backupPath !== "string") {
        return;
      }
      const option = document.createElement("option");
      option.value = event.backupPath;
      const when = typeof event.createdAt === "string" ? event.createdAt : "";
      option.textContent = `${index + 1}) ${event.backupPath} ${when}`.trim();
      backupSelect.appendChild(option);
    });

    return backupSelect.options.length > 0;
  }

  async function restoreSelectedBackup() {
    if (!backupSelect) {
      setStatus("Backup-Auswahl fehlt. Naechster Schritt: Reparatur starten.");
      return false;
    }

    const backupPath = backupSelect.value || "";
    if (!backupPath) {
      setStatus(
        "Kein Backup gewaehlt. Naechster Schritt: Erneut versuchen oder Zurueck.",
      );
      return false;
    }

    if (!selectedProjectDir) {
      setStatus(
        "Projektordner fehlt. Naechster Schritt: Projektordner waehlen und erneut versuchen.",
      );
      return false;
    }

    if (!window.BackupRestore) {
      setStatus(
        "Backup-Tool fehlt. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
      return false;
    }

    const targetPath = backupTargetSelect?.value || "";

    const safetyHint =
      "Sicherheitsabfrage: Bitte den Dateinamen (store.json oder registry.json) bestaetigen.";

    try {
      const plan = window.BackupRestore.buildRestorePlan(
        backupPath,
        targetPath,
      );
      const confirmation = window.prompt(
        `${safetyHint} Eingeben: ${plan.targetFileName}`,
        "",
      );
      const hasValidConfirmation =
        window.BackupRestore.isRestoreConfirmationValid(
          confirmation,
          plan.targetFileName,
        );
      if (!hasValidConfirmation) {
        setStatus(
          "Sicherheitsabfrage abgebrochen. Naechster Schritt: Erneut versuchen oder Zurueck.",
        );
        return false;
      }
      const result = await window.BackupRestore.restoreBackupFromDirectory(
        selectedProjectDir,
        plan,
      );

      if (!result || result.ok !== true) {
        throw new Error("Restore-Ergebnis ungueltig.");
      }

      setStatus(
        `Backup wiederhergestellt (${result.targetFileName}). Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.`,
      );
      setDebug(
        `Restore erfolgreich: ${result.backupFileName} -> ${result.targetFileName}`,
      );
      return true;
    } catch (error) {
      const details =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setStatus(
        "Backup-Wiederherstellung fehlgeschlagen. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
      setDebug(`Restore-Fehler: ${details}`);
      return false;
    }
  }

  function openBackupDialog() {
    if (!backupDialog || typeof backupDialog.showModal !== "function") {
      setStatus("Backup-Dialog fehlt. Naechster Schritt: Reparatur starten.");
      return false;
    }
    backupDialog.showModal();
    loadBackupEvents().then((events) => {
      renderBackupOptions(events);
    });
    setStatus(
      "Backup-Auswahl geoeffnet. Naechster Schritt: 5-Punkte-Check lesen.",
    );
    return true;
  }

  function closeBackupDialog() {
    if (!backupDialog || typeof backupDialog.close !== "function") {
      setStatus("Backup-Dialog fehlt. Naechster Schritt: Reparatur starten.");
      return false;
    }
    backupDialog.close();
    setStatus("Dialog geschlossen. Naechster Schritt: Erneut versuchen.");
    return true;
  }

  function onHelpAction(actionKey) {
    const actionMessage = window.DashboardHelp?.getHelpActionMessage(actionKey);
    setStatus(`${actionMessage} Naechster Schritt: Meldung lesen.`);
  }

  helpRetry.addEventListener("click", () => onHelpAction("retry"));
  helpRepair.addEventListener("click", () => onHelpAction("repair"));
  helpLog.addEventListener("click", () => onHelpAction("log"));
  helpBackup.addEventListener("click", openBackupDialog);
  if (backupDialogClose) {
    backupDialogClose.addEventListener("click", closeBackupDialog);
  }
  if (backupRestore) {
    backupRestore.addEventListener("click", restoreSelectedBackup);
  }
  if (backupDialog) {
    backupDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeBackupDialog();
    });
  }

  debugButton.addEventListener("click", () => {
    debugOutput.hidden = !debugOutput.hidden;
    setStatus("Debug-Ansicht umgeschaltet. Naechster Schritt: Meldung lesen.");
  });

  chooseFolder.addEventListener("click", chooseProjectFolder);
  reconnect.addEventListener("click", reconnectProjectFolder);

  if (window.createTodoModule) {
    window.createTodoModule({
      dateInput: document.getElementById("todo-date"),
      textInput: document.getElementById("todo-input"),
      addButton: document.getElementById("todo-add"),
      resetButton: document.getElementById("todo-reset-date"),
      filterInput: document.getElementById("todo-filter"),
      activeList: document.getElementById("todo-active-list"),
      archiveList: document.getElementById("todo-archive-list"),
      setStatus,
      setDebug,
      getProjectDir: () => selectedProjectDir,
    });
  }

  if (window.KanbanPreview && kanbanPreview) {
    const kanban = window.KanbanPreview.createKanbanPreview({
      root: kanbanPreview,
      setStatus: setKanbanStatus,
      sourcePath: "../data/kanban_board.json",
      saveImpl: async (payload) => {
        await writeProjectJson("data/kanban_board.json", payload);
        return true;
      },
    });
    kanban.load().then((result) => {
      if (result.ok) {
        setDebug(
          `Debug: Kanban geladen (${result.count} Spalten, ${result.keyboardCount} Fokusbereiche).`,
        );
      }
    });
  } else {
    setKanbanStatus(
      "Kanban-Modul fehlt. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
    );
  }

  window.createModuleWorkspace({
    catalog: document.getElementById("module-catalog"),
    grid: document.getElementById("active-modules"),
    emptyState: document.getElementById("empty-state"),
    scale: document.getElementById("grid-scale"),
    align: document.getElementById("grid-align"),
    setStatus,
  });

  [
    [zones, "Zonenbereich"],
    [status, "Statusfeld"],
    [debugButton, "Debug-Knopf"],
    [guideList, "Hilfe-Liste"],
    [themeTooltip, "Theme-Hinweis"],
    [helpBackup, "Backup-Knopf"],
    [backupDialog, "Backup-Dialog"],
    [backupSelect, "Backup-Auswahl"],
    [backupTargetSelect, "Ziel-Datei-Auswahl"],
    [backupRestore, "Backup-Wiederherstellen"],
    [backupDialogClose, "Backup-Dialog-Zurueck"],
    [kanbanPreview, "Kanban-Bereich"],
    [kanbanStatus, "Kanban-Status"],
  ].forEach(([element, name]) => validateElement(element, name));

  updateBootPhase(
    "ui",
    "ok",
    "Oberflaeche geladen. Enter fuer Knopf, Escape zum Schliessen.",
    "Gelb: Start laeuft. Pruefe die vier Phasen.",
  );
  updateBootPhase(
    "modules",
    "ok",
    "Module sind vorbereitet. Naechster Schritt: Modul aktivieren.",
  );
  updateBootPhase(
    "backup",
    "ok",
    "Backup-Dialog ist bereit. Naechster Schritt: Backup pruefen.",
  );

  loadMessages().then((ui) => {
    controlWhat.textContent = ensureMessage(
      ui.controlWhat,
      "Startet Zugriff und prueft den Projektordner.",
    );
    workspaceHelp.textContent = ensureMessage(
      ui.workspaceHelp,
      "Die Flaeche startet leer. Module erscheinen erst nach Aktivierung.",
    );
    helpWhat.textContent = ensureMessage(
      ui.helpWhat,
      "Bei Fehlern: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
    );
    guideIntro.textContent = ensureMessage(
      ui.guideIntro,
      "Diese Liste fuehrt in klaren Schritten durch den Start.",
    );
    themeTooltip.textContent = ensureMessage(
      ui.themeTooltipDefault,
      "Tipp: Kontrast+ waehlen. Rueckweg: Altes Thema erneut waehlen.",
    );
    themeSelect.dataset.tooltipChanged = ensureMessage(
      ui.themeTooltipChanged,
      "Thema gewechselt zu {theme}. Rueckweg: Altes Thema erneut waehlen.",
    );
    const stepCount = window.DashboardHelp.renderGuideSteps(
      guideList,
      ui.guideSteps,
    );
    status.textContent = ensureMessage(ui.readyStatus, status.textContent);
    setDebug(`Debug: Hilfe mit ${stepCount} Schritten geladen.`);
    updateBootPhase(
      "ui",
      "ok",
      "Texte geladen. Status ist lesbar und bereit.",
      "Gruen: Start bereit. Sie koennen direkt arbeiten.",
    );
  });

  registerKeyboardShortcuts();
  renderZones();
  reconnectProjectFolder();
})();
