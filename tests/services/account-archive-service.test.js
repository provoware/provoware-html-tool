import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addAccountProfile,
  addAccountTitle,
  buildAccountArchiveStats,
  createDefaultAccountArchive,
  getFavoriteAccounts,
  markAccountOpened,
  normalizeAccountArchive,
  searchAccountArchive,
  updateAccountTitle
} from '../../js/services/account-archive.js';

test('account service: defaultarchiv ist gültig', () => {
  const archive = createDefaultAccountArchive();
  assert.equal(archive.version, 1);
  assert.deepEqual(archive.items, []);
});

test('account service: normalisierung repariert kaputte daten defensiv', () => {
  const result = normalizeAccountArchive({ items: null }, { withReport: true });
  assert.equal(result.repair.applied, true);
  assert.deepEqual(result.archive.items, []);
});

test('account service: suche findet titel und profilfelder', () => {
  const archive = createDefaultAccountArchive();
  addAccountTitle({ archive, title: 'Forum A' });
  const titleId = archive.items[0].id;
  addAccountProfile({ archive, titleId, profile: { profileName: 'privat', loginEmail: 'user@test.de', notes: 'support konto' } });
  const found = searchAccountArchive(archive, 'support');
  assert.equal(found.length, 1);
});

test('account service: favoritenliste und statistik funktionieren', () => {
  const archive = createDefaultAccountArchive();
  addAccountTitle({ archive, title: 'Shop B' });
  const titleId = archive.items[0].id;
  updateAccountTitle({ archive, titleId, patch: { favorite: true } });
  const favorites = getFavoriteAccounts(archive);
  const stats = buildAccountArchiveStats(archive);
  assert.equal(favorites.length, 1);
  assert.equal(stats.favorites, 1);
});

test('account service: zugriffszähler wird nur bei echter öffnung erhöht', () => {
  const archive = createDefaultAccountArchive();
  addAccountTitle({ archive, title: 'Webseite C' });
  const titleId = archive.items[0].id;
  const before = archive.items[0].openCount;
  markAccountOpened({ archive, titleId });
  assert.equal(archive.items[0].openCount, before + 1);
});

test('account service: doppeltes profil im selben titel wird verhindert', () => {
  const archive = createDefaultAccountArchive();
  addAccountTitle({ archive, title: 'Account XY' });
  const titleId = archive.items[0].id;
  addAccountProfile({ archive, titleId, profile: { profileName: 'privat' } });
  const duplicate = addAccountProfile({ archive, titleId, profile: { profileName: 'Privat' } });
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.code, 'ACCOUNT_PROFILE_DUPLICATE');
});
