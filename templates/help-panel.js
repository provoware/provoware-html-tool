(function setupHelpPanel() {
  const theme = document.getElementById("theme");
  const runTest = document.getElementById("run-test");
  const showLog = document.getElementById("show-log");
  const status = document.getElementById("status");
  const logBox = document.getElementById("log-box");
  const quickGuideList = document.getElementById("quick-guide-list");

  const quickGuide = [
    "bash start.sh ausfuehren.",
    "Mit Tab zum Theme-Feld gehen und mit Enter das Thema wechseln.",
    "Bei Fehlern: Erneut versuchen, Reparatur starten oder Protokoll oeffnen.",
  ];

  function renderQuickGuide(steps) {
    if (!Array.isArray(steps) || steps.length !== 3) {
      setStatus("Leitfaden ungueltig. Reparatur starten.");
      return false;
    }

    quickGuideList.innerHTML = "";
    for (const step of steps) {
      if (typeof step !== "string" || step.trim() === "") {
        setStatus("Leitfaden ungueltig. Erneut versuchen.");
        return false;
      }
      const item = document.createElement("li");
      item.textContent = step;
      quickGuideList.appendChild(item);
    }
    return true;
  }

  function setStatus(text) {
    status.textContent = text;
  }

  if (!renderQuickGuide(quickGuide)) {
    return;
  }

  theme.addEventListener("change", () => {
    document.body.dataset.theme = theme.value;
    setStatus(`Thema aktiv: ${theme.options[theme.selectedIndex].text}.`);
  });

  runTest.addEventListener("click", () => {
    setStatus(
      'Systemtest starten: Bitte im Terminal "node tools/help_cli.js test" ausführen.',
    );
  });

  showLog.addEventListener("click", () => {
    logBox.hidden = false;
    logBox.textContent =
      'Logs anzeigen: Bitte im Terminal "node tools/help_cli.js logs" ausführen.';
    setStatus("Log-Hinweis angezeigt.");
  });
})();
