import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, smsHref } from './phone.ts';

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

test('smsHref encodes the body', () => {
  assert.equal(smsHref('+380989366151', 'Привіт & дякую'), 'sms:+380989366151?&body=%D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82%20%26%20%D0%B4%D1%8F%D0%BA%D1%83%D1%8E');
});
