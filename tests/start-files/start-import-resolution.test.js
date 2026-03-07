import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();

const getStartFiles = async () => {
  const files = await readdir(repoRoot);
  return files
    .filter((name) => name.endsWith('_start.html'))
    .sort((a, b) => a.localeCompare(b, 'de'));
};

const getStartConfig = (htmlText, startFile) => {
  const match = htmlText.match(/<script\s+type=["']application\/json["']\s+id=["']start-file-standard["']>([\s\S]*?)<\/script>/i);
  assert.ok(match, `Standard-Block fehlt: ${startFile}`);

  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch {
    assert.fail(`Standard-Block ist kein gültiges JSON: ${startFile}`);
  }

  assert.equal(typeof parsed.modulePath, 'string', `modulePath fehlt: ${startFile}`);
  assert.ok(parsed.modulePath.startsWith('./'), `modulePath muss relativ sein: ${startFile}`);
  assert.ok(Array.isArray(parsed.expectedExports), `expectedExports fehlt: ${startFile}`);
  assert.ok(parsed.expectedExports.length > 0, `expectedExports ist leer: ${startFile}`);
  parsed.expectedExports.forEach((item) => {
    assert.equal(typeof item, 'string', `Exportname ist kein Text: ${startFile}`);
    assert.ok(item.trim().length > 0, `Leerer Exportname: ${startFile}`);
  });

  return parsed;
};

const assertStartFileA11yStatus = (htmlText, startFile) => {
  const hasStatusRole = /role=["']status["']/i.test(htmlText);
  const hasAriaLive = /aria-live=["'][^"']+["']/i.test(htmlText);
  assert.ok(hasStatusRole, `A11y-Status fehlt (role="status"): ${startFile}`);
  assert.ok(hasAriaLive, `A11y-Status fehlt (aria-live): ${startFile}`);
};

const importFromStartConfig = async (startFile, config) => {
  const fullPath = path.join(repoRoot, startFile);
  const absoluteTarget = path.resolve(path.dirname(fullPath), config.modulePath);
  const moduleUrl = pathToFileURL(absoluteTarget).href;
  return import(moduleUrl);
};

test('alle *_start.html Modul-Imports lassen sich auflösen', async () => {
  const startFiles = await getStartFiles();
  assert.ok(startFiles.length > 0, 'Keine *_start.html Dateien gefunden.');

  for (const startFile of startFiles) {
    const fullPath = path.join(repoRoot, startFile);
    const htmlText = await readFile(fullPath, 'utf8');
    const config = getStartConfig(htmlText, startFile);
    const loaded = await importFromStartConfig(startFile, config);
    assert.equal(typeof loaded, 'object', `Import fehlgeschlagen: ${startFile} -> ${config.modulePath}`);
  }
});

test('alle *_start.html prüfen erwartete Export-Funktionen', async () => {
  const startFiles = await getStartFiles();
  assert.ok(startFiles.length > 0, 'Keine *_start.html Dateien gefunden.');

  for (const startFile of startFiles) {
    const fullPath = path.join(repoRoot, startFile);
    const htmlText = await readFile(fullPath, 'utf8');
    const config = getStartConfig(htmlText, startFile);
    const loaded = await importFromStartConfig(startFile, config);

    for (const exportName of config.expectedExports) {
      assert.equal(
        typeof loaded[exportName],
        'function',
        `Export-Funktion fehlt: ${startFile} -> ${exportName}`
      );
    }
  }
});

test('alle *_start.html haben role="status" und aria-live', async () => {
  const startFiles = await getStartFiles();
  assert.ok(startFiles.length > 0, 'Keine *_start.html Dateien gefunden.');

  for (const startFile of startFiles) {
    const fullPath = path.join(repoRoot, startFile);
    const htmlText = await readFile(fullPath, 'utf8');
    assertStartFileA11yStatus(htmlText, startFile);
  }
});
