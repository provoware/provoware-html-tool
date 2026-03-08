import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const readPlaywright = async () => {
  try {
    return await import('playwright');
  } catch {
    return null;
  }
};

const startStaticServer = () => {
  const server = createServer((req, res) => {
    const reqPath = (req.url || '/').split('?')[0];
    const safePath = reqPath === '/' ? '/index.html' : reqPath;
    const filePath = path.join(projectRoot, decodeURIComponent(safePath));
    if (!filePath.startsWith(projectRoot)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    }[ext] || 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, url: `http://127.0.0.1:${address.port}` });
    });
  });
};

test('e2e-ui: browser prüft 3x3-grid-berechnung und sichtbaren theme-wechsel', async (t) => {
  const playwright = await readPlaywright();
  if (!playwright) {
    t.skip('playwright ist nicht installiert');
    return;
  }

  const { chromium } = playwright;
  const { server, url } = await startStaticServer();
  t.after(() => server.close());

  const browser = await chromium.launch();
  t.after(async () => browser.close());

  const page = await browser.newPage({ viewport: { width: 1480, height: 940 } });
  await page.goto(`${url}/index.html`, { waitUntil: 'networkidle' });

  await page.waitForSelector('#theme-select option[value="design-kontrast"]');

  const gridShape = await page.evaluate(() => {
    const grid = document.getElementById('panel-grid');
    if (!grid) return null;
    const style = getComputedStyle(grid);
    const countTracks = (value) => (value.match(/minmax\(/g) || []).length || value.split(' ').filter(Boolean).length;
    return {
      cols: countTracks(style.gridTemplateColumns),
      rows: countTracks(style.gridTemplateRows)
    };
  });

  assert.ok(gridShape, 'panel-grid wurde nicht gefunden');
  assert.equal(gridShape.cols, 3, 'grid hat nicht 3 spalten');
  assert.equal(gridShape.rows, 3, 'grid hat nicht 3 zeilen');

  const themeBefore = await page.evaluate(() => ({
    rootBg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    panelBorder: getComputedStyle(document.querySelector('.panel')).borderColor
  }));

  await page.selectOption('#theme-select', 'design-kontrast');
  await page.waitForTimeout(120);

  const themeAfter = await page.evaluate(() => ({
    rootBg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
    panelBorder: getComputedStyle(document.querySelector('.panel')).borderColor
  }));

  const visibleThemeChange = themeBefore.rootBg !== themeAfter.rootBg || themeBefore.panelBorder !== themeAfter.panelBorder;
  assert.equal(visibleThemeChange, true, 'theme-wechsel ist im browser nicht sichtbar');
});
