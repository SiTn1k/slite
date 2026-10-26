import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDesktop, normalizePhone, viberHref } from './phone.ts';

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

test('viberHref: Android uses intent with encoded plus, others bare digits', () => {
  assert.equal(viberHref('+380989366151', true), 'intent://add?number=%2B380989366151#Intent;scheme=viber;package=com.viber.voip;end');
  assert.equal(viberHref('+380989366151', false), 'viber://add?number=380989366151');
});

test('viberHref: desktop uses chat', () => {
  assert.equal(viberHref('+380989366151', false, true), 'viber://chat?number=380989366151');
  assert.equal(isDesktop('Mozilla/5.0 (X11; Linux x86_64)', 0), true);
  assert.equal(isDesktop('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', 5), false);
  assert.equal(isDesktop('Mozilla/5.0 (Macintosh; Intel Mac OS X)', 5), false);
});
