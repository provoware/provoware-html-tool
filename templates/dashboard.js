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
  const bootContinue = document.getElementById("boot-continue");
  const bootGateHint = document.getElementById("boot-gate-hint");
  const bootFocusTarget = document.getElementById("boot-focus-target");
  const bootFocusLive = document.getElementById("boot-focus-live");
  const safeModeStatus = document.getElementById("safe-mode-status");
  const kanbanPreview = document.getElementById("kanban-preview");
  const kanbanStatus = document.getElementById("kanban-status");
  const layoutRoot = document.querySelector(".layout");
  const leftRail = document.getElementById("left-rail");
  const rightRail = document.getElementById("right-rail");
  const splitterLeft = document.getElementById("splitter-left");
  const splitterRight = document.getElementById("splitter-right");
  const leftRailToggle = document.getElementById("left-rail-toggle");
  const rightRailToggle = document.getElementById("right-rail-toggle");
  const favoritesRail = document.getElementById("favorites-rail");
  const favoritesRailToggle = document.getElementById("favorites-rail-toggle");
  const favoritesActions = document.getElementById("favorites-actions");
  const layoutReset = document.getElementById("layout-reset");
  const focusModeToggle = document.getElementById("focus-mode-toggle");
  const focusModeRestore = document.getElementById("focus-mode-restore");
  const footerDebugOutput = document.getElementById("footer-debug-output");
  const footerLogList = document.getElementById("footer-log-list");
  const supportHistoryFilter = document.getElementById(
    "support-history-filter",
  );
  const supportHistoryApply = document.getElementById("support-history-apply");
  const supportHistoryQuery = document.getElementById("support-history-query");
  const supportHistoryMeta = document.getElementById("support-history-meta");
  const supportHistoryList = document.getElementById("support-history-list");
  const supportHistoryBootDebugToggle = document.getElementById(
    "support-history-boot-debug-toggle",
  );
  const supportHistoryPartialToggle = document.getElementById(
    "support-history-partial-toggle",
  );
  const supportHistoryFooterToggle = document.getElementById(
    "support-history-footer-toggle",
  );
  const supportHistoryFooterHint = document.getElementById(
    "support-history-footer-hint",
  );
  const supportHistorySortShortToggle = document.getElementById(
    "support-history-sort-short-toggle",
  );
  const supportHistoryLive = document.getElementById("support-history-live");
  const systemMeta = document.getElementById("system-meta");
  const kasiNoteInput = document.getElementById("kasi-note-input");
  const kasiNotePaste = document.getElementById("kasi-note-paste");
  const kasiNoteSave = document.getElementById("kasi-note-save");
  const toolExport = document.getElementById("tool-export");
  const moduleSearch = document.getElementById("module-search");
  const globalVersion = document.getElementById("global-version");
  const globalPath = document.getElementById("global-path");
  const globalStatus = document.getElementById("global-status");

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
  const helpSafeModeReset = document.getElementById("help-safe-mode-reset");
  const backupDialog = document.getElementById("backup-dialog");
  const backupDialogClose = document.getElementById("backup-dialog-close");
  const backupSelect = document.getElementById("backup-select");
  const backupTargetSelect = document.getElementById("backup-target-select");
  const backupVersionSelect = document.getElementById("backup-version-select");
  const backupVersionHelp = document.getElementById("backup-version-help");
  const backupVersionCompare = document.getElementById(
    "backup-version-compare",
  );
  const backupCompareDetailWrap = document.getElementById(
    "backup-compare-detail",
  );
  const backupCompareDetail = document.getElementById(
    "backup-compare-detail-text",
  );
  const backupRestoreVersion = document.getElementById(
    "backup-restore-version",
  );
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
    bootFocusTarget: "module",
    backupDetailOpen: false,
    showBootDebugInSupport: true,
    supportHistoryPartialMode: false,
    supportHistoryFooterCompact: true,
  };
  let zoneModel = [
    { id: "fav", title: "⭐ Favoriten" },
    { id: "quick", title: "⚡ Schnellzugriff" },
    { id: "modules", title: "📦 Module" },
  ];
  let moduleLayoutState = {};
  let favoritesRailOpen = false;
  let lastBootFocusDebugText = "";
  let lastBackupDetailStateText = "";

  const dashboardModel = window.DashboardModel || {};
  const normalizeLayoutWithModel =
    dashboardModel.normalizeLayoutState || normalizeLayoutStateLocal;
  const getGridColumnsWithModel =
    dashboardModel.getGridColumnCount || getGridColumnCountLocal;
  const createLayoutSnapshot =
    dashboardModel.createLayoutSnapshot || createLayoutSnapshotLocal;
  const applyLayoutSnapshot =
    dashboardModel.applyLayoutSnapshot || applyLayoutSnapshotLocal;
  const getDefaultModuleStart =
    dashboardModel.getDefaultModuleStart || (() => ["notes"]);
  const resolveSidebarShortcut =
    dashboardModel.resolveSidebarShortcut ||
    ((eventLike, isOpen) => ({
      handled:
        eventLike?.altKey === true &&
        String(eventLike?.key || "").toLowerCase() === "f",
      nextOpen: !Boolean(isOpen),
      status:
        "Favoritenleiste umgeschaltet. Naechster Schritt: Aktion waehlen.",
    }));
  const resolveFavoritesAction =
    dashboardModel.resolveFavoritesAction ||
    ((actionKey) => ({
      handled: typeof actionKey === "string" && actionKey.trim() !== "",
      status:
        "Aktion gestartet. Naechster Schritt: Ergebnis pruefen oder Protokoll oeffnen.",
    }));
  const buildBootGateHint =
    dashboardModel.buildBootGateHint ||
    ((allPhasesOk) => ({
      gateOpen: allPhasesOk === true,
      hint:
        allPhasesOk === true
          ? "Weiter ist frei. Naechster Schritt: Mit Weiter direkt ins Dashboard."
          : "Weiter ist gesperrt. Naechster Schritt: Erst alle Phasen auf Gruen bringen.",
      help:
        allPhasesOk === true
          ? "Boot ist bereit. Rueckweg: Bei Bedarf Phase pruefen und dann Weiter nutzen."
          : "Boot ist noch nicht fertig. Naechster Schritt: Phase pruefen, dann erneut versuchen.",
    }));
  const buildSafeModeStatus =
    dashboardModel.buildSafeModeStatus ||
    ((input) => {
      const safe = input && typeof input === "object" ? input : {};
      const enabled = safe.isSafeMode === true;
      const reason =
        typeof safe.reason === "string" && safe.reason.trim()
          ? safe.reason.trim()
          : "kein Fehlergrund gemeldet";
      if (enabled) {
        return {
          isSafeMode: true,
          text: `Safe-Mode aktiv. Grund: ${reason}. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.`,
        };
      }
      return {
        isSafeMode: false,
        text: "Safe-Mode aus. Naechster Schritt: Normal weiterarbeiten oder bei Fehlern Protokoll oeffnen.",
      };
    });

  let focusSnapshot = null;
  let activeModules = [];
  let lastModuleTitle = "";
  let moduleWorkspace = null;

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
      bootFocusTarget: source.bootFocusTarget === "help" ? "help" : "module",
      backupDetailOpen: source.backupDetailOpen === true,
      showBootDebugInSupport: source.showBootDebugInSupport !== false,
      supportHistoryPartialMode: source.supportHistoryPartialMode === true,
      supportHistoryFooterCompact: source.supportHistoryFooterCompact !== false,
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
      ? "Zeitbar links aufklappen"
      : "Zeitbar links einklappen";
    rightRailToggle.textContent = layoutState.rightCollapsed
      ? "Zeitbar rechts aufklappen"
      : "Zeitbar rechts einklappen";

    layoutRoot.dataset.leftCollapsed = String(layoutState.leftCollapsed);
    layoutRoot.dataset.rightCollapsed = String(layoutState.rightCollapsed);
    if (favoritesRail) {
      favoritesRail.hidden = !favoritesRailOpen || layoutState.rightCollapsed;
    }
    if (favoritesRailToggle) {
      favoritesRailToggle.textContent = favoritesRailOpen
        ? "Favoritenleiste ausblenden"
        : "Favoritenleiste einblenden";
    }
    if (bootFocusTarget) {
      bootFocusTarget.value =
        layoutState.bootFocusTarget === "help" ? "help" : "module";
    }
    if (supportHistoryBootDebugToggle) {
      supportHistoryBootDebugToggle.checked =
        layoutState.showBootDebugInSupport === true;
    }
    if (supportHistoryPartialToggle) {
      supportHistoryPartialToggle.checked =
        layoutState.supportHistoryPartialMode === true;
    }
    if (supportHistoryFooterToggle) {
      supportHistoryFooterToggle.checked =
        layoutState.supportHistoryFooterCompact !== false;
    }
    if (backupCompareDetailWrap) {
      backupCompareDetailWrap.open = layoutState.backupDetailOpen === true;
      updateBackupDetailStateText(backupCompareDetailWrap.open);
    }
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
      setStatus(
        "Zeitbar links umgeschaltet. Naechster Schritt: Layout pruefen.",
      );
    });

    rightRailToggle.addEventListener("click", () => {
      if (layoutState.rightCollapsed) {
        favoritesRailOpen = false;
      }
      layoutState.rightCollapsed = !layoutState.rightCollapsed;
      applyLayoutState();
      persistLayoutState().catch(() => {
        setStatus("Layout konnte nicht gespeichert werden. Protokoll oeffnen.");
      });
      setStatus(
        "Zeitbar rechts umgeschaltet. Naechster Schritt: Layout pruefen.",
      );
    });

    favoritesRailToggle?.addEventListener("click", () => {
      favoritesRailOpen = !favoritesRailOpen;
      applyLayoutState();
      setStatus(
        favoritesRailOpen
          ? "Favoritenleiste geoeffnet. Naechster Schritt: Schnellaktion waehlen."
          : "Favoritenleiste geschlossen. Naechster Schritt: Alt+F nutzt den Rueckweg.",
      );
    });

    layoutReset.addEventListener("click", () => {
      favoritesRailOpen = false;
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

  function updateSafeModeStatus(state) {
    if (!safeModeStatus) {
      return false;
    }

    const model = buildSafeModeStatus(state);
    safeModeStatus.textContent = model.text;
    safeModeStatus.dataset.state = model.isSafeMode ? "warn" : "ok";
    return model.isSafeMode;
  }

  function setStatus(message) {
    const safe = ensureMessage(
      message,
      "Status fehlt. Naechster Schritt: Erneut versuchen.",
    );
    status.textContent = safe;
    updateGlobalTop(safe);
    addLogEntry(safe);
    return safe;
  }

  function updateGlobalTop(statusText) {
    if (globalVersion) {
      globalVersion.textContent = "Version: 0.1.0";
    }
    if (globalPath) {
      const connected = selectedProjectDir ? "verbunden" : "nicht verbunden";
      globalPath.textContent = `Pfad: ${connected}`;
    }
    if (globalStatus) {
      const safe =
        typeof statusText === "string" && statusText.trim()
          ? statusText
          : "wartet auf Aktion";
      globalStatus.textContent = `Status: ${safe}`;
    }
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

  function loadKasiNoteFallback() {
    const raw = window.localStorage.getItem("quicknote-text") || "";
    if (kasiNoteInput && typeof raw === "string") {
      kasiNoteInput.value = raw;
    }
  }

  async function tryLoadProjectNote() {
    if (!selectedProjectDir) {
      return false;
    }

    const loaded = await readProjectText(".modultool/quicknote.txt");
    if (loaded.ok && kasiNoteInput) {
      kasiNoteInput.value = loaded.value;
      return true;
    }
    return false;
  }

  async function saveKasiNote() {
    const content = String(kasiNoteInput?.value || "").trim();
    window.localStorage.setItem("quicknote-text", content);

    if (!content) {
      setStatus(
        "Leere Notiz gespeichert. Naechster Schritt: Text eingeben oder leer lassen.",
      );
      return true;
    }

    if (
      !window.ProjectFileWriter?.writeProjectTextFile ||
      !selectedProjectDir
    ) {
      setStatus(
        "Notiz lokal gespeichert. Neutraler Hinweis: Projektordner fehlt. Naechster Schritt: Ordner waehlen und erneut speichern.",
      );
      return true;
    }

    try {
      await window.ProjectFileWriter.writeProjectTextFile(
        selectedProjectDir,
        ".modultool/quicknote.txt",
        content,
      );
      setStatus(
        "Notiz gespeichert. Naechster Schritt: Erneut versuchen oder neue Notiz erfassen.",
      );
      addLogEntry("Quicknote gespeichert");
      return true;
    } catch {
      setStatus(
        "Neutraler Hinweis: Notiz lokal gespeichert, Projektordner ohne Berechtigung. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
      );
      return true;
    }
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
    if (supportHistoryList && supportHistoryFilter) {
      refreshSupportHistory().catch(() => false);
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
    syncBootGate();
    return true;
  }
  function syncBootGate() {
    if (!bootController || !bootContinue || !bootGateHint) {
      return false;
    }

    const gate = buildBootGateHint(
      bootController.areAllPhasesOk(),
      layoutState.bootFocusTarget,
    );
    bootContinue.disabled = !gate.gateOpen;
    bootGateHint.textContent = gate.hint;
    if (helpWhat) {
      helpWhat.textContent = gate.help;
    }
    if (bootFocusLive) {
      const focusLabel =
        layoutState.bootFocusTarget === "help" ? "Hilfe-Panel" : "Erstes Modul";
      const liveMessage = `Fokusziel aktuell: ${focusLabel}.`;
      bootFocusLive.textContent = liveMessage;
      const debugText = `Debug: Boot-Live-Ansage aktualisiert (${liveMessage})`;
      if (debugText !== lastBootFocusDebugText) {
        setDebug(debugText);
        lastBootFocusDebugText = debugText;
      }
    }
    return gate.gateOpen;
  }

  function buildSupportKeyboardHint(detailsText) {
    const safeDetails =
      typeof detailsText === "string" ? detailsText.trim() : "";
    if (safeDetails.length > 110) {
      return "Tastatur-Hinweis kurz: Tab waehlt, Enter startet, Escape schliesst.";
    }
    return "Tastatur-Hinweis: Tab waehlt Eintrag, Enter oeffnet Aktion, Escape schliesst Dialog.";
  }

  function updateBackupDetailStateText(isOpen) {
    const detailState = document.getElementById("backup-detail-state");
    if (!(detailState instanceof HTMLElement)) {
      return false;
    }

    const safeOpen = isOpen === true;
    const text = safeOpen
      ? "Zuletzt geoeffneter Zustand: Detailmodus ist geoeffnet. Naechster Schritt: Inhalte pruefen oder schliessen."
      : "Zuletzt geoeffneter Zustand: Detailmodus ist eingeklappt. Naechster Schritt: Bei Bedarf oeffnen.";
    if (text === lastBackupDetailStateText) {
      return true;
    }
    detailState.textContent = text;
    lastBackupDetailStateText = text;
    return true;
  }

  function registerBootGate() {
    if (!bootContinue) {
      return false;
    }

    bootContinue.addEventListener("click", () => {
      const ready = syncBootGate();
      if (!ready) {
        setStatus(
          "Start-Gate blockiert. Naechster Schritt: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
        );
        return;
      }

      const focusTargetModel = resolveBootFocusTarget(layoutState);
      setStatus(focusTargetModel.status);
      setDebug("Debug: Boot-Gate geoeffnet und Fokusziel angewendet.");

      if (focusTargetModel.target === "help") {
        const helpPanel = document.getElementById("help-title");
        if (helpPanel instanceof HTMLElement) {
          helpPanel.focus();
        }
      } else {
        const firstModule = document.querySelector(
          "#active-modules .module-card",
        );
        if (firstModule instanceof HTMLElement) {
          firstModule.focus();
        }
      }

      if (helpWhat) {
        helpWhat.textContent = focusTargetModel.status;
      }
    });

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

      const sidebarShortcut = resolveSidebarShortcut(event, favoritesRailOpen);
      if (sidebarShortcut.handled) {
        event.preventDefault();
        favoritesRailOpen = sidebarShortcut.nextOpen;
        applyLayoutState();
        setStatus(sidebarShortcut.status);
        return true;
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

  function registerFavoritesActions() {
    if (!favoritesActions) {
      return false;
    }

    favoritesActions.addEventListener("click", (event) => {
      const target = event.target;
      if (!target || target.tagName !== "BUTTON") {
        return;
      }

      const actionKey = target.dataset.favoriteAction || "";
      const result = resolveFavoritesAction(actionKey, {
        activeModules,
        lastModuleTitle,
      });

      if (!result.handled) {
        setStatus(result.status);
        return;
      }

      if (actionKey === "open-last-module") {
        const opened = moduleWorkspace?.openModuleByTitle?.(lastModuleTitle);
        if (!opened) {
          setStatus(result.status);
          return;
        }
      }

      if (actionKey === "show-all-modules") {
        const allTitles = activeModules.map((entry) => entry.title).join(", ");
        const details = allTitles ? ` Details: ${allTitles}.` : "";
        setStatus(`${result.status}${details}`);
        return;
      }

      setStatus(result.status);
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

  async function readProjectText(relativePath) {
    if (typeof relativePath !== "string" || !relativePath.trim()) {
      return { ok: false, value: "" };
    }
    if (!selectedProjectDir || !selectedProjectDir.getFileHandle) {
      return { ok: false, value: "" };
    }

    try {
      const pathParts = relativePath.split("/").filter(Boolean);
      const fileName = pathParts.pop();
      let currentDir = selectedProjectDir;
      for (const segment of pathParts) {
        currentDir = await currentDir.getDirectoryHandle(segment);
      }
      const fileHandle = await currentDir.getFileHandle(fileName);
      const raw = await (await fileHandle.getFile()).text();
      return { ok: true, value: raw };
    } catch {
      return { ok: false, value: "" };
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
      await tryLoadProjectNote();
      await tryLoadProjectNote();
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
      await tryLoadProjectNote();
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

  function normalizeSearchToken(token) {
    const safeToken = typeof token === "string" ? token.trim() : "";
    if (!safeToken) {
      return "";
    }
    return safeToken
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9_-]+/g, "");
  }

  function splitSearchTokens(queryText, minLength = 2) {
    const safeQuery = typeof queryText === "string" ? queryText.trim() : "";
    if (!safeQuery) {
      return [];
    }

    const safeMinLength =
      Number.isInteger(minLength) && minLength > 0 ? minLength : 2;
    const tokens = safeQuery
      .split(/\s+/)
      .map(normalizeSearchToken)
      .filter((entry) => entry.length >= safeMinLength);
    return Array.from(new Set(tokens));
  }

  function isSupportPartialModeEnabled() {
    return layoutState.supportHistoryPartialMode === true;
  }

  function isSupportFooterCompactEnabled() {
    return layoutState.supportHistoryFooterCompact !== false;
  }

  function isSmallViewportForSupportFooter() {
    if (typeof window === "undefined") {
      return false;
    }
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 639px)").matches;
    }
    return Number.isFinite(window.innerWidth) && window.innerWidth < 640;
  }

  function shouldAutoCompactSupportFooter() {
    return isSmallViewportForSupportFooter();
  }

  function isVerySmallViewportForSupportBadge() {
    if (typeof window === "undefined") {
      return false;
    }
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(max-width: 479px)").matches;
    }
    return Number.isFinite(window.innerWidth) && window.innerWidth < 480;
  }

  function isSortIgnoredShortTokensEnabled() {
    return layoutState.supportHistorySortShortTokens === true;
  }

  function normalizeSupportQueryTokens(queryText) {
    const usePartialMode = isSupportPartialModeEnabled();
    const minLength = usePartialMode ? 3 : 2;
    const tokens = splitSearchTokens(queryText, minLength);
    const rawTokens = splitSearchTokens(queryText, 1);
    const ignoredShortTokens = usePartialMode
      ? rawTokens.filter((token) => token.length < 3)
      : [];

    return {
      tokens,
      ignoredShortTokens: isSortIgnoredShortTokensEnabled()
        ? ignoredShortTokens
            .slice()
            .sort((left, right) =>
              left.localeCompare(right, "de", { sensitivity: "base" }),
            )
        : ignoredShortTokens,
      usePartialMode,
      minLength,
    };
  }

  function buildNormalizedWordList(sourceText) {
    const safeSource = typeof sourceText === "string" ? sourceText : "";
    const matches = safeSource.match(/[A-Za-z0-9_-]+/g);
    if (!Array.isArray(matches)) {
      return [];
    }
    return matches.map(normalizeSearchToken).filter(Boolean);
  }

  function normalizeSupportHistoryEvents(events) {
    const safeEvents = Array.isArray(events) ? events : [];
    return safeEvents.filter((event) => event && typeof event === "object");
  }

  function highlightQueryText(sourceText, queryText) {
    const safeSource = typeof sourceText === "string" ? sourceText : "";
    const { tokens } = normalizeSupportQueryTokens(queryText);
    if (tokens.length === 0) {
      return [{ text: safeSource, mark: false }];
    }

    const wordRegex = /[A-Za-z0-9_-]+/g;
    const chunks = [];
    let cursor = 0;
    let match = wordRegex.exec(safeSource);

    while (match) {
      const [word] = match;
      const start = match.index;
      const end = start + word.length;

      if (start > cursor) {
        chunks.push({ text: safeSource.slice(cursor, start), mark: false });
      }

      const normalizedWord = normalizeSearchToken(word);
      const shouldMark = tokens.includes(normalizedWord);
      chunks.push({ text: safeSource.slice(start, end), mark: shouldMark });
      cursor = end;
      match = wordRegex.exec(safeSource);
    }

    if (cursor < safeSource.length) {
      chunks.push({ text: safeSource.slice(cursor), mark: false });
    }

    return chunks.length > 0 ? chunks : [{ text: safeSource, mark: false }];
  }

  function appendHighlightedText(root, text, queryText) {
    if (!(root instanceof HTMLElement)) {
      return false;
    }

    const chunks = highlightQueryText(text, queryText);
    chunks.forEach((chunk) => {
      const node = document.createElement(chunk.mark ? "mark" : "span");
      node.textContent = chunk.text;
      root.appendChild(node);
    });
    return true;
  }

  function renderSupportHistory(events, filterKey, queryText) {
    if (!supportHistoryList) {
      return false;
    }

    supportHistoryList.innerHTML = "";
    const safeFilter = typeof filterKey === "string" ? filterKey : "all";
    const normalized = normalizeSupportHistoryEvents(events);
    const safeQuery = typeof queryText === "string" ? queryText.trim() : "";
    const queryContext = normalizeSupportQueryTokens(safeQuery);
    const queryTokens = queryContext.tokens;
    const bootDebugEntry =
      typeof lastBootFocusDebugText === "string" &&
      lastBootFocusDebugText.trim()
        ? {
            kind: "boot-debug",
            createdAt: new Date().toISOString(),
            details: lastBootFocusDebugText,
          }
        : null;
    const shouldShowBootDebug = layoutState.showBootDebugInSupport === true;
    const normalizedWithBoot =
      shouldShowBootDebug && bootDebugEntry
        ? [bootDebugEntry, ...normalized]
        : normalized;

    const filtered = normalizedWithBoot.filter((entry) => {
      if (safeFilter === "safe-mode" && entry.kind !== "safe-mode-reset") {
        return false;
      }

      if (!safeQuery) {
        return true;
      }

      if (queryTokens.length === 0) {
        return true;
      }

      const kindWords = buildNormalizedWordList(entry.kind);
      const createdAtWords = buildNormalizedWordList(entry.createdAt);
      const detailsWords = buildNormalizedWordList(entry.details);
      const haystack = [...kindWords, ...createdAtWords, ...detailsWords];
      const usePartialMode = isSupportPartialModeEnabled();
      return queryTokens.every((token) =>
        usePartialMode
          ? haystack.some((word) => word.includes(token))
          : haystack.includes(token),
      );
    });

    if (supportHistoryMeta) {
      const modeText = queryContext.usePartialMode
        ? "Modus: Teilwort (enthaelt, min. 3 Zeichen)."
        : "Modus: Ganze Woerter (Standard).";
      const shortTokenList = queryContext.ignoredShortTokens
        .slice(0, 3)
        .map((token) => `"${token}"`);
      const shortHint =
        queryContext.usePartialMode && shortTokenList.length > 0
          ? ` Hinweis: Kurze Suchbegriffe ignoriert (unter 3 Zeichen): ${shortTokenList.join(", ")}.${queryContext.ignoredShortTokens.length > 3 ? " (+weitere)" : ""}`
          : "";
      supportHistoryMeta.textContent = `Treffer: ${filtered.length}. ${modeText}${shortHint} Tipp: Enter startet die Suche sofort.`;
    }

    if (filtered.length === 0) {
      const empty = document.createElement("li");
      empty.textContent =
        "Kein Verlauf fuer den Filter. Naechster Schritt: Anderen Filter waehlen oder erneut versuchen.";
      supportHistoryList.appendChild(empty);
      if (supportHistoryFooterHint) {
        const modeLabel = queryContext.usePartialMode
          ? "Teilwortsuche aktiv"
          : "Ganzwortsuche aktiv";
        const bootLabel =
          layoutState.showBootDebugInSupport === true
            ? "Boot-Debug sichtbar"
            : "Boot-Debug ausgeblendet";
        const autoCompact = shouldAutoCompactSupportFooter();
        announceSupportFooterAutoCompactChange(autoCompact);
        supportHistoryFooterHint.dataset.autoCompact = autoCompact
          ? "true"
          : "false";
        if (supportHistoryFooterToggle) {
          supportHistoryFooterToggle.disabled = autoCompact;
          supportHistoryFooterToggle.title = autoCompact
            ? "Auto-Kurzmodus aktiv unter 640px. Naechster Schritt: Fenster vergroessern fuer manuelle Wahl."
            : "Footer-Hinweis manuell umschalten.";
        }
        supportHistoryFooterHint.textContent =
          autoCompact || isSupportFooterCompactEnabled()
            ? `${modeLabel}, ${bootLabel}. Auto-Kurzmodus bei kleiner Breite aktiv. Rueckweg: Fenster vergroessern oder mit Tab zu den Schaltern.`
            : `${modeLabel}, ${bootLabel}. Rueckweg: Mit Tab zu den Schaltern wechseln und mit Leertaste umstellen.`;
      }
      return true;
    }

    filtered.slice(0, 20).forEach((entry) => {
      const line = document.createElement("li");
      const when =
        typeof entry.createdAt === "string" ? entry.createdAt : "ohne Zeit";
      const label = typeof entry.kind === "string" ? entry.kind : "eintrag";
      const details = typeof entry.details === "string" ? entry.details : "";
      const keyboardHint = buildSupportKeyboardHint(details);
      const modeBadge = document.createElement("strong");
      modeBadge.className = "support-mode-badge";
      const modeIcon = document.createElement("span");
      modeIcon.className = "support-mode-badge-icon";
      modeIcon.setAttribute("aria-hidden", "true");
      modeIcon.textContent = queryContext.usePartialMode ? "🔎" : "🔍";
      const modeIconLabel = document.createElement("span");
      modeIconLabel.className = "sr-only";
      modeIconLabel.textContent = queryContext.usePartialMode
        ? "Icon fuer Teilwortsuche"
        : "Icon fuer Ganzwortsuche";
      const modeText = document.createElement("span");
      modeText.className = "support-mode-badge-text";
      const compactBadge = isVerySmallViewportForSupportBadge();
      modeText.textContent = compactBadge
        ? queryContext.usePartialMode
          ? "TW"
          : "GW"
        : queryContext.usePartialMode
          ? "Suchmodus: Teilwort"
          : "Suchmodus: Ganzwort";
      modeBadge.setAttribute(
        "aria-label",
        queryContext.usePartialMode
          ? "Suchmodus Teilwort aktiv"
          : "Suchmodus Ganzwort aktiv",
      );
      modeBadge.append(modeIcon, modeIconLabel, modeText);
      line.appendChild(modeBadge);
      line.appendChild(document.createTextNode(" "));

      appendHighlightedText(line, `${label} | ${when} | `, safeQuery);
      appendHighlightedText(line, details, safeQuery);
      appendHighlightedText(line, ` | ${keyboardHint}`, safeQuery);
      supportHistoryList.appendChild(line);
    });

    if (supportHistoryFooterHint) {
      const modeLabel = queryContext.usePartialMode
        ? "Teilwortsuche aktiv"
        : "Ganzwortsuche aktiv";
      const bootLabel =
        layoutState.showBootDebugInSupport === true
          ? "Boot-Debug sichtbar"
          : "Boot-Debug ausgeblendet";
      const autoCompact = shouldAutoCompactSupportFooter();
      announceSupportFooterAutoCompactChange(autoCompact);
      supportHistoryFooterHint.dataset.autoCompact = autoCompact
        ? "true"
        : "false";
      if (supportHistoryFooterToggle) {
        supportHistoryFooterToggle.disabled = autoCompact;
        supportHistoryFooterToggle.title = autoCompact
          ? "Auto-Kurzmodus aktiv unter 640px. Naechster Schritt: Fenster vergroessern fuer manuelle Wahl."
          : "Footer-Hinweis manuell umschalten.";
      }
      supportHistoryFooterHint.textContent =
        autoCompact || isSupportFooterCompactEnabled()
          ? `${modeLabel}, ${bootLabel}. Auto-Kurzmodus bei kleiner Breite aktiv. Rueckweg: Fenster vergroessern oder mit Tab zu den Schaltern.`
          : `${modeLabel}, ${bootLabel}. Rueckweg: Mit Tab zu den Schaltern wechseln und mit Leertaste umstellen.`;
    }

    return true;
  }

  function announceSupportFooterAutoCompactChange(autoCompact) {
    if (!(supportHistoryLive instanceof HTMLElement)) {
      return false;
    }
    const nextState = autoCompact === true;
    const lastState = supportHistoryLive.dataset.lastAutoCompact;
    const nextKey = nextState ? "true" : "false";
    if (lastState === nextKey) {
      return false;
    }
    supportHistoryLive.dataset.lastAutoCompact = nextKey;
    supportHistoryLive.textContent = nextState
      ? "Auto-Kurzmodus ist aktiv. Naechster Schritt: Fenster vergroessern fuer manuelle Wahl."
      : "Auto-Kurzmodus ist aus. Naechster Schritt: Footer-Hinweis bei Bedarf manuell umschalten.";
    return true;
  }

  async function refreshSupportHistory() {
    const events = await loadBackupEvents();
    const selectedFilter = supportHistoryFilter?.value || "all";
    const queryText = supportHistoryQuery?.value || "";
    return renderSupportHistory(events, selectedFilter, queryText);
  }

  async function loadVersionOptions() {
    if (!backupVersionSelect) {
      return false;
    }

    backupVersionSelect.innerHTML = "";
    const targetPath = backupTargetSelect?.value || "";
    const targetFileName = targetPath.split("/").pop() || "";

    if (!targetFileName || !selectedProjectDir || !window.BackupRestore) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "Keine Version gefunden";
      backupVersionSelect.appendChild(emptyOption);
      if (backupVersionHelp) {
        backupVersionHelp.textContent =
          "Versionen fehlen. Naechster Schritt: Ziel-Datei waehlen oder Projekt verbinden.";
      }
      updateVersionCompare();
      return false;
    }

    const versions = await window.BackupRestore.listVersionFilesFromDirectory(
      selectedProjectDir,
      targetFileName,
    );

    if (!Array.isArray(versions) || versions.length === 0) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "Keine Version gefunden";
      backupVersionSelect.appendChild(emptyOption);
      if (backupVersionHelp) {
        backupVersionHelp.textContent =
          "Keine Version fuer Ziel-Datei. Naechster Schritt: Normales Backup nutzen.";
      }
      updateVersionCompare();
      return false;
    }

    versions.forEach((entry, index) => {
      const option = document.createElement("option");
      option.value = entry;
      option.textContent = `${index + 1}) ${entry}`;
      backupVersionSelect.appendChild(option);
    });
    if (backupVersionHelp) {
      backupVersionHelp.textContent =
        "Version geladen. Naechster Schritt: Version wiederherstellen oder Zurueck.";
    }
    await updateVersionCompare();
    return true;
  }

  async function updateVersionCompare() {
    if (!backupVersionCompare || !backupVersionSelect || !backupTargetSelect) {
      return false;
    }

    const versionFileName = backupVersionSelect.value || "";
    const targetPath = backupTargetSelect.value || "";
    const targetFileName = targetPath.split("/").pop() || "";

    if (!versionFileName || !targetFileName) {
      backupVersionCompare.textContent =
        "Vergleich wird nach Versionswahl angezeigt.";
      if (backupCompareDetailWrap) {
        backupCompareDetailWrap.hidden = true;
      }
      return false;
    }

    if (!selectedProjectDir || !window.BackupRestore) {
      backupVersionCompare.textContent =
        "Vergleich nicht moeglich. Naechster Schritt: Projekt verbinden.";
      return false;
    }

    try {
      const summary =
        await window.BackupRestore.compareVersionWithCurrentFromDirectory(
          selectedProjectDir,
          targetFileName,
          versionFileName,
        );
      backupVersionCompare.textContent =
        summary?.text ||
        "Vergleich geladen. Naechster Schritt: Version wiederherstellen oder Zurueck.";
      if (backupCompareDetail && backupCompareDetailWrap) {
        backupCompareDetail.textContent =
          summary?.detailText ||
          "Detailmodus leer. Naechster Schritt: Andere Version waehlen.";
        backupCompareDetailWrap.hidden = false;
        backupCompareDetailWrap.open = layoutState.backupDetailOpen === true;
        updateBackupDetailStateText(backupCompareDetailWrap.open);
      }
      return true;
    } catch (error) {
      backupVersionCompare.textContent =
        "Vergleich fehlgeschlagen. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.";
      if (backupCompareDetail && backupCompareDetailWrap) {
        backupCompareDetail.textContent =
          "Detailmodus fehlt. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.";
        backupCompareDetailWrap.hidden = false;
        backupCompareDetailWrap.open = layoutState.backupDetailOpen === true;
        updateBackupDetailStateText(backupCompareDetailWrap.open);
      }
      return false;
    }
  }

  async function resetSafeMode() {
    if (!selectedProjectDir) {
      setStatus(
        "Projektordner fehlt. Naechster Schritt: Projektordner waehlen und erneut versuchen.",
      );
      return false;
    }

    const confirmText =
      "Safe-Mode wird beendet und Standard-Plugins werden gesetzt. Weiter?";
    if (!window.confirm(confirmText)) {
      setStatus(
        "Safe-Mode-Reset abgebrochen. Naechster Schritt: Erneut versuchen.",
      );
      return false;
    }

    try {
      const configDir = await selectedProjectDir.getDirectoryHandle("config", {
        create: false,
      });
      const manifestDir = await configDir.getDirectoryHandle("manifests", {
        create: false,
      });
      const manifestHandle = await manifestDir.getFileHandle(
        "plugins.manifest.json",
        { create: true },
      );

      const defaultManifest = {
        manifestType: "plugin-loader",
        version: "1.0.0",
        plugins: [
          {
            id: "plugin-a11y-assist",
            enabled: true,
            modulePath: "system-module/plugins_accessibility.js",
          },
        ],
      };

      const writable = await manifestHandle.createWritable();
      await writable.write(`${JSON.stringify(defaultManifest, null, 2)}\n`);
      await writable.close();

      let supportLogSaved = false;
      if (
        window.SafeModeSupportLog &&
        typeof window.SafeModeSupportLog.appendSafeModeSupportEvent ===
          "function"
      ) {
        try {
          const supportLogResult =
            await window.SafeModeSupportLog.appendSafeModeSupportEvent(
              selectedProjectDir,
              "Safe-Mode-Reset",
              "Standard-Manifest wurde neu gesetzt.",
            );
          supportLogSaved = supportLogResult?.ok === true;
        } catch {
          supportLogSaved = false;
        }
      }

      updateSafeModeStatus({ isSafeMode: false });
      const statusSuffix = supportLogSaved
        ? " Support-Verlauf gespeichert."
        : " Support-Verlauf nicht gespeichert.";
      setStatus(
        `Safe-Mode-Reset abgeschlossen.${statusSuffix} Naechster Schritt: Start erneut versuchen.`,
      );
      setDebug(
        "Debug: Safe-Mode-Manifest auf Standard gesetzt." +
          (supportLogSaved
            ? " Verlauf in data/backup_events.json gespeichert."
            : " Verlauf konnte nicht geschrieben werden."),
      );
      return true;
    } catch (error) {
      setStatus(
        "Safe-Mode-Reset fehlgeschlagen. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
      return false;
    }
  }

  async function restoreSelectedVersion() {
    if (!backupVersionSelect || !backupTargetSelect) {
      setStatus(
        "Versions-Auswahl fehlt. Naechster Schritt: Reparatur starten.",
      );
      return false;
    }

    const versionFileName = backupVersionSelect.value || "";
    if (!versionFileName) {
      setStatus(
        "Keine Version gewaehlt. Naechster Schritt: Version waehlen oder Backup nutzen.",
      );
      return false;
    }

    if (!selectedProjectDir || !window.BackupRestore) {
      setStatus(
        "Projekt oder Restore-Tool fehlt. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
      return false;
    }

    const targetPath = backupTargetSelect.value || "";
    const targetFileName = targetPath.split("/").pop() || "";
    try {
      const result = await window.BackupRestore.restoreVersionFromDirectory(
        selectedProjectDir,
        targetFileName,
        versionFileName,
      );
      if (!result || result.ok !== true) {
        throw new Error("Version-Restore ungueltig.");
      }

      setStatus(
        `Version wiederhergestellt (${result.versionFileName}). Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.`,
      );
      setDebug(
        `Version-Restore erfolgreich: ${result.versionFileName} -> ${result.targetFileName}`,
      );
      return true;
    } catch (error) {
      const details =
        error instanceof Error ? error.message : "Unbekannter Fehler";
      setStatus(
        "Version-Wiederherstellung fehlgeschlagen. Naechster Schritt: Reparatur starten oder Protokoll oeffnen.",
      );
      setDebug(`Version-Restore-Fehler: ${details}`);
      return false;
    }
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
      loadVersionOptions();
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
  if (backupRestoreVersion) {
    backupRestoreVersion.addEventListener("click", restoreSelectedVersion);
  }
  if (backupTargetSelect) {
    backupTargetSelect.addEventListener("change", loadVersionOptions);
  }
  if (backupVersionSelect) {
    backupVersionSelect.addEventListener("change", updateVersionCompare);
  }
  if (backupCompareDetailWrap) {
    backupCompareDetailWrap.addEventListener("toggle", () => {
      updateBackupDetailStateText(backupCompareDetailWrap.open);
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        backupDetailOpen: backupCompareDetailWrap.open === true,
      });
      persistLayoutState().catch(() => {
        setStatus(
          "Detailzustand konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
        );
      });
    });
  }
  if (supportHistoryApply) {
    supportHistoryApply.addEventListener("click", refreshSupportHistory);
  }
  if (supportHistoryFilter) {
    supportHistoryFilter.addEventListener("change", refreshSupportHistory);
  }
  if (supportHistoryBootDebugToggle) {
    supportHistoryBootDebugToggle.checked =
      layoutState.showBootDebugInSupport === true;
    supportHistoryBootDebugToggle.addEventListener("change", () => {
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        showBootDebugInSupport: supportHistoryBootDebugToggle.checked === true,
      });
      persistLayoutState()
        .then(() => refreshSupportHistory())
        .catch(() => {
          setStatus(
            "Boot-Debug-Schalter konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
          );
        });
    });
  }

  if (supportHistoryPartialToggle) {
    supportHistoryPartialToggle.checked =
      layoutState.supportHistoryPartialMode === true;
    supportHistoryPartialToggle.addEventListener("change", () => {
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        supportHistoryPartialMode: supportHistoryPartialToggle.checked === true,
      });
      persistLayoutState()
        .then(() => refreshSupportHistory())
        .catch(() => {
          setStatus(
            "Suchmodus konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
          );
        });
    });
  }
  if (supportHistoryFooterToggle) {
    supportHistoryFooterToggle.checked =
      layoutState.supportHistoryFooterCompact !== false;
    supportHistoryFooterToggle.addEventListener("change", () => {
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        supportHistoryFooterCompact:
          supportHistoryFooterToggle.checked === true,
      });
      persistLayoutState()
        .then(() => refreshSupportHistory())
        .catch(() => {
          setStatus(
            "Footer-Hinweis konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
          );
        });
    });
  }
  if (supportHistorySortShortToggle) {
    supportHistorySortShortToggle.checked =
      layoutState.supportHistorySortShortTokens === true;
    supportHistorySortShortToggle.addEventListener("change", () => {
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        supportHistorySortShortTokens:
          supportHistorySortShortToggle.checked === true,
      });
      persistLayoutState()
        .then(() => refreshSupportHistory())
        .catch(() => {
          setStatus(
            "Sortierung fuer Kurzbegriffe konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
          );
        });
    });
  }

  if (supportHistoryQuery) {
    supportHistoryQuery.addEventListener("input", refreshSupportHistory);
    supportHistoryQuery.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        refreshSupportHistory();
      }
    });
  }
  window.addEventListener("resize", () => {
    if (supportHistoryFooterHint) {
      refreshSupportHistory();
    }
  });
  if (bootFocusTarget) {
    bootFocusTarget.addEventListener("change", () => {
      const nextTarget = bootFocusTarget.value === "help" ? "help" : "module";
      layoutState = normalizeLayoutWithModel({
        ...layoutState,
        bootFocusTarget: nextTarget,
      });
      persistLayoutState().catch(() => {
        setStatus(
          "Boot-Fokusziel konnte nicht gespeichert werden. Naechster Schritt: Erneut versuchen oder Protokoll oeffnen.",
        );
      });
      setStatus(
        "Boot-Fokusziel gespeichert. Naechster Schritt: Weiter klicken und Fokus pruefen.",
      );
      syncBootGate();
    });
  }
  if (helpSafeModeReset) {
    helpSafeModeReset.addEventListener("click", resetSafeMode);
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
      randomGenreToggle: document.getElementById("lyrics-random-genre-toggle"),
      randomMoodToggle: document.getElementById("lyrics-random-mood-toggle"),
      randomStyleToggle: document.getElementById("lyrics-random-style-toggle"),
      randomCategoryHelp: document.getElementById(
        "lyrics-random-category-help",
      ),
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

  moduleWorkspace = window.createModuleWorkspace({
    catalog: document.getElementById("module-catalog"),
    grid: document.getElementById("active-modules"),
    emptyState: document.getElementById("empty-state"),
    scale: document.getElementById("grid-scale"),
    align: document.getElementById("grid-align"),
    searchInput: moduleSearch,
    slotCount: 9,
    initialModuleState: moduleLayoutState,
    defaultModuleIds: getDefaultModuleStart(),
    setStatus,
    moduleOptionsRoot: document.getElementById("module-options-region"),
    moduleOptionsHelp: document.getElementById("module-options-help"),
    onModuleStateChange: (modules) => {
      moduleLayoutState = modules.reduce((acc, entry) => {
        acc[entry.id] = {
          pinned: Boolean(entry.pinned),
        };
        return acc;
      }, {});
      activeModules = modules;
      if (modules.length > 0 && typeof modules[0].title === "string") {
        lastModuleTitle = modules[0].title;
      }
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
    [favoritesRailToggle, "Favoritenleisten-Knopf"],
    [favoritesRail, "Favoritenleiste"],
    [layoutReset, "Layout-Reset-Knopf"],
    [focusModeToggle, "Fokusmodus-Start-Knopf"],
    [focusModeRestore, "Fokusmodus-Ende-Knopf"],
    [splitterLeft, "Layout-Splitter links"],
    [splitterRight, "Layout-Splitter rechts"],
    [bootContinue, "Boot-Weiter-Knopf"],
    [bootGateHint, "Boot-Gate-Hinweis"],
    [bootFocusTarget, "Boot-Fokusziel-Auswahl"],
    [bootFocusLive, "Boot-Fokusziel-Live-Status"],
    [supportHistoryFilter, "Support-Verlauf-Filter"],
    [supportHistoryQuery, "Support-Verlauf-Suche"],
    [supportHistoryMeta, "Support-Verlauf-Treffer"],
    [supportHistoryFooterToggle, "Support-Verlauf-Footer-Schalter"],
    [supportHistoryList, "Support-Verlauf-Liste"],
    [supportHistoryFooterHint, "Support-Verlauf-Footer-Hinweis"],
    [supportHistorySortShortToggle, "Support-Verlauf-Sortier-Schalter"],
    [supportHistoryLive, "Support-Verlauf-Live-Ansage"],
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

  syncBootGate();
  updateSafeModeStatus({
    isSafeMode: false,
    reason: "kein Fehlergrund gemeldet",
  });

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

  registerBootGate();
  registerKeyboardShortcuts();
  registerFavoritesActions();
  registerZoomControls();
  registerLayoutControls();
  applyFocusModeState(false);
  renderZones();
  reconnectProjectFolder();
})();
