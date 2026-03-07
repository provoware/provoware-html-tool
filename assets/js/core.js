(function initCore() {
  const statusText = document.getElementById('status-text');
  if (!statusText) {
    return;
  }

  statusText.textContent = 'Offline-Start aktiv. Basis geladen.';
})();
