import test from 'node:test';
import assert from 'node:assert/strict';

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) throw new Error(`Ungültige Hex-Farbe: ${hex}`);
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16)
  };
};

const toLinear = (channel) => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * toLinear(r)) + (0.7152 * toLinear(g)) + (0.0722 * toLinear(b));
};

const contrastRatio = (foreground, background) => {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
};

const MIN_NORMAL_TEXT_RATIO = 4.5;

const darkThemeContrastPairs = [
  { name: 'Info-Text auf Body-Hintergrund', fg: '#e4ecff', bg: '#151f30' },
  { name: 'Modul-Button-Text auf Modul-Button-Hintergrund', fg: '#f2f6ff', bg: '#23364f' },
  { name: 'Kleine Modul-Label auf Modul-Button-Hintergrund', fg: '#e2ecff', bg: '#23364f' },
  { name: 'Panel-Titel auf Utility-Card-Hintergrund', fg: '#f3f7ff', bg: '#1a2a42' },
  { name: 'Statuswert auf Utility-Card-Hintergrund', fg: '#e6eeff', bg: '#1a2a42' },
  { name: 'Statuslabel auf Utility-Card-Hintergrund', fg: '#c5d3ed', bg: '#1a2a42' }
];

test('dark-theme kontrast erreicht WCAG AA für normale texte', () => {
  darkThemeContrastPairs.forEach((pair) => {
    const ratio = contrastRatio(pair.fg, pair.bg);
    assert.equal(
      ratio >= MIN_NORMAL_TEXT_RATIO,
      true,
      `${pair.name} unterschreitet ${MIN_NORMAL_TEXT_RATIO}:1 (aktuell ${ratio.toFixed(2)}:1)`
    );
  });
});
