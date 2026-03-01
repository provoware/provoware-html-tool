(function bootstrapBootStatus(globalObject) {
  function assertNode(node, name) {
    if (!node || typeof node !== "object") {
      throw new Error(
        `${name} fehlt. Reparatur starten oder Protokoll oeffnen.`,
      );
    }
    return node;
  }

  function normalizeText(text, fallback) {
    if (typeof text !== "string" || !text.trim()) {
      return fallback;
    }
    return text.trim();
  }

  function statusLabel(state) {
    if (state === "ok") {
      return "Gruen";
    }
    if (state === "warn") {
      return "Gelb";
    }
    return "Rot";
  }

  function setPhaseState(node, state, detail) {
    assertNode(node, "Phasenpunkt");
    const safeState = ["ok", "warn", "fail"].includes(state) ? state : "warn";
    const safeDetail = normalizeText(
      detail,
      "Naechster Schritt: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
    );

    node.dataset.state = safeState;
    node.textContent = `${statusLabel(safeState)}: ${safeDetail}`;
    return node.textContent;
  }

  function createBootStatusController(options = {}) {
    const root = assertNode(options.root, "Boot-Statusbereich");
    const summary = assertNode(options.summary, "Boot-Zusammenfassung");
    const phaseMap = new Map();

    for (const node of root.querySelectorAll("[data-boot-phase]")) {
      phaseMap.set(node.dataset.bootPhase, node);
    }

    function setSummary(state, text) {
      const safeState = ["ok", "warn", "fail"].includes(state) ? state : "warn";
      const safeText = normalizeText(
        text,
        "Startstatus unklar. Naechster Schritt: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
      );

      summary.dataset.state = safeState;
      summary.textContent = safeText;
      return summary.textContent;
    }

    function setPhase(phaseId, state, detail) {
      const node = phaseMap.get(phaseId);
      if (!node) {
        return setSummary(
          "warn",
          "Boot-Phase fehlt. Naechster Schritt: Reparatur starten.",
        );
      }
      return setPhaseState(node, state, detail);
    }

    function getPhaseState(phaseId) {
      const node = phaseMap.get(phaseId);
      if (!node) {
        return "warn";
      }
      return node.dataset.state || "warn";
    }

    function areAllPhasesOk() {
      if (phaseMap.size === 0) {
        return false;
      }
      for (const node of phaseMap.values()) {
        if ((node.dataset.state || "warn") !== "ok") {
          return false;
        }
      }
      return true;
    }

    return {
      setPhase,
      setSummary,
      getPhaseState,
      areAllPhasesOk,
      hasPhase: (phaseId) => phaseMap.has(phaseId),
      size: () => phaseMap.size,
    };
  }

  const api = {
    createBootStatusController,
    setPhaseState,
    statusLabel,
    normalizeText,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalObject.BootStatus = api;
})(typeof window !== "undefined" ? window : globalThis);
