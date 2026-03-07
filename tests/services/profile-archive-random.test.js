import test from 'node:test';
import assert from 'node:assert/strict';

import { createDefaultArchive, createRandomMix } from '../../js/services/profile-archive.js';

test('zufallsgenerator: amount wird auf sinnvollen Bereich geklammert', () => {
  const archive = createDefaultArchive();

  const result = createRandomMix({
    archive,
    profile: 'HardTechno',
    includeCategories: ['genres'],
    amountPerCategory: { genres: 999 }
  });

  assert.equal(result.ok, true);
  assert.equal(result.code, 'MIX_CREATED');
  assert.equal(result.data.mix.genres.length, archive.profiles.HardTechno.genres.length);

  const fallback = createRandomMix({
    archive,
    profile: 'HardTechno',
    includeCategories: ['genres'],
    amountPerCategory: { genres: 0 }
  });

  assert.equal(fallback.data.mix.genres.length, 1);
});
