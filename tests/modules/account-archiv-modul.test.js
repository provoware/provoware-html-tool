import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAccountProfilePayload,
  findDuplicateProfileName,
  sanitizeCustomFields,
  validateAccountTitleInput
} from '../../modules/account_archiv_modul/logic.js';

test('account modul: leerer titel wird abgelehnt', () => {
  const result = validateAccountTitleInput({ title: '   ' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'ACCOUNT_TITLE_EMPTY');
});

test('account modul: leeres profil wird abgelehnt', () => {
  const result = buildAccountProfilePayload({ profileName: '' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'ACCOUNT_PROFILE_EMPTY');
});

test('account modul: ungültige zusatzfelder werden bereinigt', () => {
  const fields = sanitizeCustomFields([{ label: '  ', value: '1' }, { label: 'Kundennummer', value: '' }, { label: 'Kundennummer', value: '12345' }]);
  assert.deepEqual(fields, [{ label: 'Kundennummer', value: '12345' }]);
});

test('account modul: doppelter profilname im titel wird erkannt', () => {
  const duplicate = findDuplicateProfileName([{ id: 'a', profileName: 'Privat' }], 'privat');
  assert.equal(duplicate, true);
});
