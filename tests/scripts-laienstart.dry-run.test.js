import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SCRIPT_SOURCE = path.join(REPO_ROOT, 'scripts', 'laienstart.sh');

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

test('laienstart dry-run liest dependencies aus JSON und repariert fehlende Dateien', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'laienstart-dry-run-'));
  const scriptsDir = path.join(tempDir, 'scripts');
  const dataDir = path.join(tempDir, 'data');

  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'css'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, 'js'), { recursive: true });

  fs.copyFileSync(SCRIPT_SOURCE, path.join(scriptsDir, 'laienstart.sh'));

  fs.writeFileSync(path.join(tempDir, 'index.html'), '<!doctype html><title>test</title>', 'utf8');
  fs.writeFileSync(path.join(tempDir, 'css', 'app.css'), 'body{}', 'utf8');
  fs.writeFileSync(path.join(tempDir, 'js', 'app.js'), 'console.log("ok")', 'utf8');

  writeJson(path.join(dataDir, 'laienstart-dependency-map.json'), {
    dependencies: [
      { name: 'node', required: true },
      { name: 'python3', required: false },
      { name: 'bash', required: true }
    ]
  });

  const output = execFileSync('bash', ['scripts/laienstart.sh', '--dry-run'], {
    cwd: tempDir,
    encoding: 'utf8'
  });

  assert.match(output, /Aktive Pflicht-Abhängigkeiten: node bash/);
  assert.match(output, /Dry-Run aktiv/);

  const repairedFiles = [
    path.join(dataDir, 'laienstart-autofix-defaults.json'),
    path.join(dataDir, 'laienstart-required-files.json'),
    path.join(dataDir, 'app-config.json'),
    path.join(dataDir, 'module-registry.json')
  ];

  for (const filePath of repairedFiles) {
    assert.equal(fs.existsSync(filePath), true, `Datei fehlt nach Self-Repair: ${filePath}`);
  }
});
