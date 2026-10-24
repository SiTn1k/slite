import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, viberHref } from './phone.ts';

test('normalizePhone accepts common Ukrainian formats', () => {
  assert.equal(normalizePhone('098 936 61 51'), '+380989366151');
  assert.equal(normalizePhone('0989366151'), '+380989366151');
  assert.equal(normalizePhone('+38 (098) 936-61-51'), '+380989366151');
  assert.equal(normalizePhone('380989366151'), '+380989366151');
});

test('normalizePhone rejects bad input', () => {
  assert.equal(normalizePhone(''), null);
  assert.equal(normalizePhone('12345'), null);
  assert.equal(normalizePhone('098 936 61 5x'), null);
  assert.equal(normalizePhone('+1 202 555 0100'), null);
  assert.equal(normalizePhone('09893661511'), null);
});

test('viberHref: Android keeps encoded plus, others drop it', () => {
  assert.equal(viberHref('+380989366151', true), 'viber://chat?number=%2B380989366151');
  assert.equal(viberHref('+380989366151', false), 'viber://chat?number=380989366151');
});
