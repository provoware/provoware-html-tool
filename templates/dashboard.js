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
  const layoutRoot = document.querySelector(".layout");
  const leftRail = document.getElementById("left-rail");
  const rightRail = document.getElementById("right-rail");
  const splitterLeft = document.getElementById("splitter-left");
  const splitterRight = document.getElementById("splitter-right");
  const leftRailToggle = document.getElementById("left-rail-toggle");
  const rightRailToggle = document.getElementById("right-rail-toggle");
  const layoutReset = document.getElementById("layout-reset");
  const focusModeToggle = document.getElementById("focus-mode-toggle");
  const focusModeRestore = document.getElementById("focus-mode-restore");
  const footerDebugOutput = document.getElementById("footer-debug-output");
  const footerLogList = document.getElementById("footer-log-list");
  const systemMeta = document.getElementById("system-meta");
  const kasiNoteInput = document.getElementById("kasi-note-input");
  const kasiNotePaste = document.getElementById("kasi-note-paste");
  const kasiNoteSave = document.getElementById("kasi-note-save");
  const toolExport = document.getElementById("tool-export");

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
  let layoutState = {
    leftWidth: 260,
    rightWidth: 280,
    leftCollapsed: false,
    rightCollapsed: false,
  };
  let zoneModel = [
    { id: "fav", title: "⭐ Favoriten" },
    { id: "quick", title: "⚡ Schnellzugriff" },
    { id: "modules", title: "📦 Module" },
  ];
  let moduleLayoutState = {};

  const dashboardModel = window.DashboardModel || {};
  const normalizeLayoutWithModel =
    dashboardModel.normalizeLayoutState || normalizeLayoutStateLocal;
  const getGridColumnsWithModel =
    dashboardModel.getGridColumnCount || getGridColumnCountLocal;
  const createLayoutSnapshot =
    dashboardModel.createLayoutSnapshot || createLayoutSnapshotLocal;
  const applyLayoutSnapshot =
    dashboardModel.applyLayoutSnapshot || applyLayoutSnapshotLocal;

  let focusSnapshot = null;

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

  function normalizeLayoutStateLocal(input) {
    const source = input && typeof input === "object" ? input : {};
    return {
      leftWidth: clampNumber(source.leftWidth, 220, 340),
      rightWidth: clampNumber(source.rightWidth, 220, 340),
      leftCollapsed: Boolean(source.leftCollapsed),
      rightCollapsed: Boolean(source.rightCollapsed),
    };
  }

  function getGridColumnCountLocal(viewportWidth) {
    if (!Number.isFinite(viewportWidth) || viewportWidth < 1) {
      return 1;
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

  function createLayoutSnapshotLocal(layoutStateInput) {
    return normalizeLayoutStateLocal(layoutStateInput);
  }

  function applyLayoutSnapshotLocal(layoutStateInput, snapshot) {
    if (!snapshot || typeof snapshot !== "object") {
      return normalizeLayoutStateLocal(layoutStateInput);
    }
    return normalizeLayoutStateLocal(snapshot);
  }

  function updateGridColumns() {
    const grid = document.getElementById("active-modules");
    if (!grid) {
      return false;
    }

    const columns = getGridColumnsWithModel(window.innerWidth || 1);
    grid.style.setProperty("--grid-columns", String(columns));
    return true;
  }

  function applyLayoutState() {
    if (!layoutRoot || !leftRail || !rightRail) {
      return false;
    }

    layoutRoot.style.setProperty(
      "--left-rail-width",
      `${layoutState.leftWidth}px`,
    );
    layoutRoot.style.setProperty(
      "--right-rail-width",
      `${layoutState.rightWidth}px`,
    );

    leftRail.hidden = layoutState.leftCollapsed;
    rightRail.hidden = layoutState.rightCollapsed;
    splitterLeft.hidden = layoutState.leftCollapsed;
    splitterRight.hidden = layoutState.rightCollapsed;

    leftRailToggle.textContent = layoutState.leftCollapsed
      ? "Navigation einblenden"
      : "Navigation ausblenden";
    rightRailToggle.textContent = layoutState.rightCollapsed
      ? "Einstellungen einblenden"
      : "Einstellungen ausblenden";

    layoutRoot.dataset.leftCollapsed = String(layoutState.leftCollapsed);
    layoutRoot.dataset.rightCollapsed = String(layoutState.rightCollapsed);
    updateGridColumns();
    return true;
  }

  async function persistLayoutState() {
    const safeLayout = normalizeLayoutWithModel(layoutState);
    layoutState = safeLayout;

    if (!selectedProjectDir) {
      return { ok: false, message: "Kein Projektordner verbunden." };
    }

    await writeProjectJson("data/layout.json", {
      version: "v001",
      updatedAt: new Date().toISOString(),
      layout: safeLayout,
      modules: moduleLayoutState,
    });

    return { ok: true, message: "Layout gespeichert." };
  }

  async function loadLayoutState() {
    const fallback = normalizeLayoutWithModel(layoutState);
    const loaded = await readProjectJson("data/layout.json");
    if (!loaded.ok) {
      layoutState = fallback;
      applyLayoutState();
      return false;
    }

    layoutState = normalizeLayoutWithModel(loaded.value?.layout);
    const modules = loaded.value?.modules;
    moduleLayoutState = modules && typeof modules === "object" ? modules : {};
    applyLayoutState();
    return true;
  }

  function changeRailWidth(side, delta) {
    const safeDelta = clampNumber(delta, -20, 20);
    if (side === "left") {
      layoutState.leftWidth = clampNumber(
        layoutState.leftWidth + safeDelta,
        220,
        340,
      );
    }

    if (side === "right") {
      layoutState.rightWidth = clampNumber(
        layoutState.rightWidth + safeDelta,
        220,
        340,
      );
    }

    applyLayoutState();
    persistLayoutState().catch(() => {
      setStatus("Layout konnte nicht gespeichert werden. Protokoll oeffnen.");
    });
  }

  function applyFocusModeState(isActive) {
    if (!layoutRoot || !focusModeToggle || !focusModeRestore) {
      return false;
    }

    layoutRoot.dataset.focusMode = String(Boolean(isActive));
    focusModeToggle.hidden = Boolean(isActive);
    focusModeRestore.hidden = !isActive;
    return true;
  }

  function startFocusMode() {
    focusSnapshot = createLayoutSnapshot(layoutState);
    applyFocusModeState(true);
    setStatus(
      "Fokusmodus aktiv. Naechster Schritt: Mit Escape oder Knopf beenden.",
    );
    if (helpWhat) {
      helpWhat.textContent =
        "Fokusmodus ist aktiv. Rueckweg: Button Fokusmodus beenden oder Escape.";
    }
    return true;
  }

  function stopFocusMode() {
    layoutState = applyLayoutSnapshot(layoutState, focusSnapshot);
    focusSnapshot = null;
    applyLayoutState();
    applyFocusModeState(false);
    setStatus("Fokusmodus beendet. Naechster Schritt: Layout weiter nutzen.");
    if (helpWhat) {
      helpWhat.textContent =
        "Fokusmodus beendet. Naechster Schritt: Modulflaeche im Raster nutzen.";
    }
    return true;
  }

  function registerLayoutControls() {
    leftRailToggle.addEventListener("click", () => {
      layoutState.leftCollapsed = !layoutState.leftCollapsed;
      applyLayoutState();
      persistLayoutState().catch(() => {
        setStatus("Layout konnte nicht gespeichert werden. Protokoll oeffnen.");
      });
      setStatus("Navigation angepasst. Naechster Schritt: Layout pruefen.");
    });

    rightRailToggle.addEventListener("click", () => {
      layoutState.rightCollapsed = !layoutState.rightCollapsed;
      applyLayoutState();
      persistLayoutState().catch(() => {
        setStatus("Layout konnte nicht gespeichert werden. Protokoll oeffnen.");
      });
      setStatus("Einstellungen angepasst. Naechster Schritt: Layout pruefen.");
    });

    layoutReset.addEventListener("click", () => {
      layoutState = normalizeLayoutWithModel({
        leftWidth: 260,
        rightWidth: 280,
      });
      applyLayoutState();
      persistLayoutState().catch(() => {
        setStatus("Layout konnte nicht gespeichert werden. Protokoll oeffnen.");
      });
      setStatus(
        "Layout zurueckgesetzt. Naechster Schritt: Bereich weiter nutzen.",
      );
    });

    splitterLeft.addEventListener("click", () => changeRailWidth("left", 20));
    splitterRight.addEventListener("click", () => changeRailWidth("right", 20));

    focusModeToggle.addEventListener("click", startFocusMode);
    focusModeRestore.addEventListener("click", stopFocusMode);

    [splitterLeft, splitterRight].forEach((splitter) => {
      splitter.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          changeRailWidth(
            splitter.id === "splitter-left" ? "left" : "right",
            -20,
          );
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          changeRailWidth(
            splitter.id === "splitter-left" ? "left" : "right",
            20,
          );
        }
      });
    });

    window.addEventListener("resize", updateGridColumns);
    applyLayoutState();
    return true;
  }

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
    addLogEntry(safe);
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

  function addLogEntry(message) {
    if (!footerLogList || typeof message !== "string" || !message.trim()) {
      return false;
    }
    const entry = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    entry.textContent = `[${timestamp}] ${message}`;
    footerLogList.prepend(entry);
    while (footerLogList.children.length > 12) {
      footerLogList.removeChild(footerLogList.lastChild);
    }
    return true;
  }

  function buildNoteLine(rawText) {
    if (typeof rawText !== "string" || !rawText.trim()) {
      throw new Error(
        "Notiz fehlt. Naechster Schritt: Text eingeben und erneut versuchen.",
      );
    }
    const stamp = new Date().toISOString();
    return `[${stamp}] ${rawText.trim()}`;
  }

  async function saveKasiNote() {
    if (
      !window.ProjectFileWriter?.appendProjectTextFile ||
      !selectedProjectDir
    ) {
      setStatus(
        "Projektordner oder Dateischreiber fehlt. Naechster Schritt: Ordner waehlen und erneut versuchen.",
      );
      return false;
    }

    const line = buildNoteLine(kasiNoteInput?.value || "");
    await window.ProjectFileWriter.appendProjectTextFile(
      selectedProjectDir,
      "data/KASI_NOTIZ.txt",
      line,
    );
    kasiNoteInput.value = "";
    setStatus(
      "Notiz gespeichert. Naechster Schritt: Erneut versuchen oder neue Notiz erfassen.",
    );
    addLogEntry("KASI_NOTIZ gespeichert");
    return true;
  }

  async function exportToolState() {
    const payload = {
      exportedAt: new Date().toISOString(),
      layoutState,
      modules: Array.from(
        document.querySelectorAll(".module-card h3"),
        (node) => node.textContent || "",
      ),
      status: status?.textContent || "",
    };

    await writeProjectJson("data/tool_export.json", payload);
    setStatus(
      "Gesamt-Export gespeichert. Naechster Schritt: Datei data/tool_export.json pruefen.",
    );
    addLogEntry("Gesamt-Export geschrieben");
    return true;
  }

  function registerZoomControls() {
    const root = document.documentElement;
    root.style.setProperty("--ui-font-scale", "1");
    root.style.setProperty("--ui-area-scale", "1");
    document.addEventListener(
      "wheel",
      (event) => {
        if (!event.ctrlKey) {
          return;
        }
        event.preventDefault();
        const target = event.target;
        const overText =
          target instanceof HTMLElement &&
          !!target.closest("p, span, h1, h2, h3, h4, label, button, li, a");
        const variable = overText ? "--ui-font-scale" : "--ui-area-scale";
        const current = Number.parseFloat(
          getComputedStyle(root).getPropertyValue(variable),
        );
        const next = Math.min(
          1.5,
          Math.max(0.8, current + (event.deltaY < 0 ? 0.05 : -0.05)),
        );
        root.style.setProperty(variable, String(next));
      },
      { passive: false },
    );
  }

  function setDebug(message) {
    const safe = ensureMessage(message, "Debug-Text fehlt.");
    debugOutput.textContent = safe;
    if (footerDebugOutput) {
      footerDebugOutput.textContent = safe;
    }
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

      if (layoutRoot?.dataset.focusMode === "true") {
        stopFocusMode();
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

  async function readProjectJson(relativePath) {
    if (typeof relativePath !== "string" || !relativePath.trim()) {
      throw new Error(
        "Datei-Pfad fehlt. Bitte Eingabe pruefen und erneut versuchen.",
      );
    }

    if (!selectedProjectDir || !selectedProjectDir.getFileHandle) {
      return {
        ok: false,
        message:
          "Projektordner fehlt. Naechster Schritt: Ordner waehlen und erneut versuchen.",
      };
    }

    try {
      const pathParts = relativePath.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        throw new Error(
          "Datei-Pfad ist ungueltig. Bitte Eingabe pruefen und erneut versuchen.",
        );
      }

      const fileName = pathParts.pop();
      let currentDir = selectedProjectDir;

      for (const segment of pathParts) {
        currentDir = await currentDir.getDirectoryHandle(segment);
      }

      const fileHandle = await currentDir.getFileHandle(fileName);
      const raw = await (await fileHandle.getFile()).text();
      const parsed = JSON.parse(raw);

      return { ok: true, value: parsed };
    } catch {
      return {
        ok: false,
        message:
          "Datei fehlt oder ist ungueltig. Naechster Schritt: Neu speichern und erneut versuchen.",
      };
    }
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
      if (systemMeta) {
        systemMeta.textContent = `Version: Iteration 78 | Projektpfad: verbunden (${HANDLE_KEY})`;
      }
      const folders = await ensureStructure(handle);
      await loadLayoutState();
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
      if (systemMeta) {
        systemMeta.textContent = `Version: Iteration 78 | Projektpfad: verbunden (${HANDLE_KEY})`;
      }
      const folders = await ensureStructure(handle);
      await loadLayoutState();
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

  if (window.createWikiModule) {
    window.createWikiModule({
      categoryInput: document.getElementById("wiki-category"),
      titleInput: document.getElementById("wiki-title-input"),
      contentInput: document.getElementById("wiki-content"),
      saveButton: document.getElementById("wiki-save"),
      reloadButton: document.getElementById("wiki-reload"),
      list: document.getElementById("wiki-list"),
      setStatus,
      setDebug,
      getProjectDir: () => selectedProjectDir,
      saveJson: writeProjectJson,
    });
  }

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

  if (window.createQuickStoreModule) {
    window.createQuickStoreModule({
      areaSelect: document.getElementById("quick-store-area"),
      titleInput: document.getElementById("quick-store-title-input"),
      contentInput: document.getElementById("quick-store-content"),
      saveButton: document.getElementById("quick-store-save"),
      clearButton: document.getElementById("quick-store-clear"),
      list: document.getElementById("quick-store-list"),
      lyricsEditor: document.getElementById("lyrics-editor"),
      introButton: document.getElementById("lyrics-template-intro"),
      refrainButton: document.getElementById("lyrics-template-refrain"),
      bridgeButton: document.getElementById("lyrics-template-bridge"),
      miscButton: document.getElementById("lyrics-template-misc"),
      randomProfileSelect: document.getElementById("lyrics-random-profile"),
      randomButton: document.getElementById("lyrics-template-random"),
      randomProfileChip: document.getElementById("lyrics-random-profile-chip"),
      previewButton: document.getElementById("lyrics-open-preview"),
      previewPanel: document.getElementById("lyrics-preview-panel"),
      previewTitle: document.getElementById("lyrics-preview-title"),
      previewContent: document.getElementById("lyrics-preview-content"),
      lyricsBackButton: document.getElementById("lyrics-back-to-inbox"),
      closePreviewButton: document.getElementById("lyrics-close-preview"),
      previewFocusTargetSelect: document.getElementById(
        "lyrics-preview-focus-target",
      ),
      previewFocusInlineHelp: document.getElementById(
        "lyrics-preview-focus-inline-help",
      ),
      copyPreviewButton: document.getElementById("lyrics-copy-preview"),
      copyHelp: document.getElementById("lyrics-copy-help"),
      guideWrap: document.getElementById("lyrics-short-guide"),
      guideToggleButton: document.getElementById("lyrics-guide-toggle"),
      guideContent: document.getElementById("lyrics-guide-content"),
      guideFocusTarget: document.getElementById("lyrics-guide-focus"),
      lyricsClearButton: document.getElementById("lyrics-clear-draft"),
      setStatus,
      setDebug,
      saveJson: writeProjectJson,
      readJson: readProjectJson,
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
    slotCount: 9,
    initialModuleState: moduleLayoutState,
    setStatus,
    onModuleStateChange: (modules) => {
      moduleLayoutState = modules.reduce((acc, entry) => {
        acc[entry.id] = {
          pinned: Boolean(entry.pinned),
        };
        return acc;
      }, {});
      persistLayoutState().catch(() => {});
      setDebug(`Debug: ${modules.length} Module im Raster aktiv.`);
    },
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
    [leftRailToggle, "Layout-Nav-Knopf"],
    [rightRailToggle, "Layout-Einstellungen-Knopf"],
    [layoutReset, "Layout-Reset-Knopf"],
    [focusModeToggle, "Fokusmodus-Start-Knopf"],
    [focusModeRestore, "Fokusmodus-Ende-Knopf"],
    [splitterLeft, "Layout-Splitter links"],
    [splitterRight, "Layout-Splitter rechts"],
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
  registerZoomControls();
  registerLayoutControls();
  applyFocusModeState(false);
  renderZones();
  reconnectProjectFolder();
})();
