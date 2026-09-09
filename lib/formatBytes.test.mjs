import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formatBytes } from './formatBytes.mjs';

test('formatBytes formats byte counts with 1024-based units', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(512), '512 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024, 2), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(1536), '1.5 KB');
  assert.equal(formatBytes(1536, 2), '1.5 KB');
  assert.equal(formatBytes(-1024), '-1 KB');
});

test('formatBytes preserves significant trailing zeroes when decimals is 0', () => {
  assert.equal(formatBytes(100, 0), '100 B');
  assert.equal(formatBytes(10240, 0), '10 KB');
});
