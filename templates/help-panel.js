(function setupHelpPanel() {
  const theme = document.getElementById("theme");
  const runTest = document.getElementById("run-test");
  const showLog = document.getElementById("show-log");
  const status = document.getElementById("status");
  const logBox = document.getElementById("log-box");

  function setStatus(text) {
    status.textContent = text;
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
