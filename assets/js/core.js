const MODULE_FILES = Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic']);
const MODULE_PROFILE = Object.freeze({
  id: 'datenbank_baukasten',
  files: Object.freeze(['manifest', 'config', 'texts', 'schema', 'logic'])
});

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
function registerModules() {
  const moduleCardText = document.querySelector('.card p');
  if (!moduleCardText) {
    return;
  }

  const profileFiles = MODULE_PROFILE.files;
  const uniqueProfileFiles = [...new Set(profileFiles)];
  const missingFiles = MODULE_FILES.filter((fileKey) => !uniqueProfileFiles.includes(fileKey));
  const extraFiles = uniqueProfileFiles.filter((fileKey) => !MODULE_FILES.includes(fileKey));

  if (missingFiles.length > 0) {
    moduleCardText.textContent = `Modulprofil ${MODULE_PROFILE.id} unvollständig. Fehlend: ${missingFiles.join(', ')}.`;
    return;
  }

  if (extraFiles.length > 0) {
    moduleCardText.textContent = `Modulprofil ${MODULE_PROFILE.id} ungültig. Unerwartet: ${extraFiles.join(', ')}.`;
    return;
  }

  moduleCardText.textContent = `1 Modulprofil bereit: ${MODULE_PROFILE.id}. Mindestteile konsistent hinterlegt.`;
}

function bootstrap() {
  applyStartStatus();
  registerModules();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
