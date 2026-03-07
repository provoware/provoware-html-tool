function applyStartStatus() {
  const statusText = document.getElementById('status-text');
  if (!statusText) {
    return;
  }

  statusText.textContent = 'Offline-Start aktiv. Basis geladen.';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyStartStatus, { once: true });
} else {
  applyStartStatus();
}
