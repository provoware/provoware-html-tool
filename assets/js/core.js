const MODULE_FILES = ['manifest', 'config', 'texts', 'schema', 'logic'];

function applyStartStatus() {
  const statusText = document.getElementById('status-text');
  if (!statusText) {
    return;
  }

  statusText.textContent = 'Offline-Start aktiv. Basis geladen.';
}

function registerModules() {
  const moduleCardText = document.querySelector('.card p');
  if (!moduleCardText) {
    return;
  }

  const module = {
    id: 'datenbank_baukasten',
    files: ['manifest', 'config', 'texts', 'schema', 'logic']
  };

  const missingFiles = MODULE_FILES.filter((fileKey) => !module.files.includes(fileKey));
  if (missingFiles.length > 0) {
    moduleCardText.textContent = `Modul ${module.id} unvollständig. Fehlend: ${missingFiles.join(', ')}.`;
    return;
  }

  moduleCardText.textContent = `1 Modul bereit: ${module.id}. Mindestteile vollständig.`;
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
