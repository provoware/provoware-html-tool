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

const getImports = (htmlText) => {
  const matches = [...htmlText.matchAll(/import\s+(?:[^'";]+?from\s+)?['"]([^'"]+)['"]/g)];
  return matches.map((entry) => entry[1]).filter((specifier) => specifier.startsWith('./'));
};

test('alle *_start.html Modul-Imports lassen sich auflösen', async () => {
  const startFiles = await getStartFiles();
  assert.ok(startFiles.length > 0, 'Keine *_start.html Dateien gefunden.');

  for (const startFile of startFiles) {
    const fullPath = path.join(repoRoot, startFile);
    const htmlText = await readFile(fullPath, 'utf8');
    const specifiers = getImports(htmlText);

    for (const specifier of specifiers) {
      const absoluteTarget = path.resolve(path.dirname(fullPath), specifier);
      const moduleUrl = pathToFileURL(absoluteTarget).href;
      const loaded = await import(moduleUrl);
      assert.equal(typeof loaded, 'object', `Import fehlgeschlagen: ${startFile} -> ${specifier}`);
    }
  }
});
