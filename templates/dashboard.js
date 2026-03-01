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
  const controlWhat = document.getElementById("control-what");
  const workspaceHelp = document.getElementById("workspace-help");
  const helpWhat = document.getElementById("help-what");

  let dragSourceId = null;
  let zoneModel = [
    { id: "fav", title: "⭐ Favoriten" },
    { id: "quick", title: "⚡ Schnellzugriff" },
    { id: "modules", title: "📦 Module" },
  ];

  function ensureMessage(message, fallback) {
    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
    return fallback;
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
    return safe;
  }

  function setDebug(message) {
    const safe = ensureMessage(message, "Debug-Text fehlt.");
    debugOutput.textContent = safe;
    return safe;
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
      const folders = await ensureStructure(handle);
      setStatus(`Projekt verbunden. Struktur ok (${folders.length} Ordner).`);
      setDebug(
        "Debug: Projektordner gespeichert. Bei Problem Protokoll oeffnen.",
      );
    } catch (error) {
      setStatus(`${error.message} Naechster Schritt: Reparatur starten.`);
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
      const folders = await ensureStructure(handle);
      setStatus(`Auto-Reconnect ok. ${folders.length} Ordner sind bereit.`);
    } catch (error) {
      setStatus(`${error.message} Naechster Schritt: Erneut versuchen.`);
    }
  }

  themeSelect.addEventListener("change", () => {
    document.body.dataset.theme = themeSelect.value;
    setStatus(
      `Thema aktiv: ${themeSelect.options[themeSelect.selectedIndex].text}.`,
    );
  });

  debugButton.addEventListener("click", () => {
    debugOutput.hidden = !debugOutput.hidden;
    setStatus("Debug-Ansicht umgeschaltet. Naechster Schritt: Meldung lesen.");
  });

  chooseFolder.addEventListener("click", chooseProjectFolder);
  reconnect.addEventListener("click", reconnectProjectFolder);

  window.createModuleWorkspace({
    catalog: document.getElementById("module-catalog"),
    grid: document.getElementById("active-modules"),
    emptyState: document.getElementById("empty-state"),
    scale: document.getElementById("grid-scale"),
    align: document.getElementById("grid-align"),
    setStatus,
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
    status.textContent = ensureMessage(ui.readyStatus, status.textContent);
  });

  renderZones();
  reconnectProjectFolder();
})();
