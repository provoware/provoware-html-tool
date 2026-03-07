function applyStartStatus() {
  const statusText = document.getElementById('status-text');
  if (!statusText) {
    return;
  }

  statusText.textContent = getConnectionStatus();
}

function getConnectionStatus() {
  if (navigator.onLine) {
    return 'Start aktiv. Verbindung verfügbar.';
  }

  return 'Offline-Start aktiv. Basis geladen.';
}

window.addEventListener('online', applyStartStatus);
window.addEventListener('offline', applyStartStatus);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyStartStatus, { once: true });
} else {
  applyStartStatus();
}
