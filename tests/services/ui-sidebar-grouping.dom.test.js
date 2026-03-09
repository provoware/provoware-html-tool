import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('css/app.css', 'utf8');

const hasRule = (needle) => css.includes(needle);

test('ui-sidebar-grouping(dom): trennt KPI/Trend von Selbsttest-Bereich sichtbar', () => {
  assert.equal(hasRule('.utility-cards > .settings-group:nth-of-type(3) {\n  margin-top: 10px;'), true);
  assert.equal(hasRule('.utility-cards > .settings-group:nth-of-type(2)::after {'), true);
});

test('ui-sidebar-grouping(dom): priorisiert Selbsttest-CTA visuell', () => {
  assert.equal(hasRule('.utility-card .settings-action-group:first-child .btn-action-check {'), true);
  assert.equal(hasRule('order: -1;'), true);
});
