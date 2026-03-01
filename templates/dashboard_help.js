(function exposeDashboardHelp() {
  function ensureMessage(message, fallback) {
    if (typeof message === "string" && message.trim() !== "") {
      return message;
    }
    return fallback;
  }

  function validateElement(element, name) {
    if (!element) {
      throw new Error(`${name} fehlt. Bitte Protokoll oeffnen.`);
    }
    return true;
  }

  function renderGuideSteps(target, steps) {
    validateElement(target, "Hilfe-Liste");
    if (!Array.isArray(steps) || steps.length === 0) {
      target.innerHTML = "<li>Keine Schritte gefunden. Erneut versuchen.</li>";
      return 1;
    }
    target.innerHTML = "";
    steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = ensureMessage(step, "Schritt fehlt. Erneut versuchen.");
      target.appendChild(li);
    });
    return steps.length;
  }

  function getHelpActionMessage(actionKey) {
    const actions = {
      retry: "Erneut versuchen: Letzten Schritt wiederholen.",
      repair: "Reparatur starten: Hilfetool im Terminal ausfuehren.",
      log: "Protokoll oeffnen: node tools/help_cli.js logs",
    };
    return actions[actionKey] || "Unbekannte Aktion. Erneut versuchen.";
  }

  window.DashboardHelp = {
    ensureMessage,
    validateElement,
    renderGuideSteps,
    getHelpActionMessage,
  };
})();
