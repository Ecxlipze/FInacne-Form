import assert from 'node:assert';
import { test, describe } from 'node:test';
import { normalizeCnic, normalizePhone, formatCnicInput, formatPhoneInput, getFriendlyErrorMessage } from '@finportal/shared';

describe('Shared Domain Validators', () => {
  test('normalizeCnic validates and canonicalizes CNIC', () => {
    assert.strictEqual(normalizeCnic('42101-1234567-8'), '42101-1234567-8');
    assert.strictEqual(normalizeCnic('4210112345678'), '42101-1234567-8');
    assert.throws(() => normalizeCnic('123'), /CNIC must be 13 digits/);
  });

  test('normalizePhone canonicalizes Pakistan mobile numbers to +923XXXXXXXXX', () => {
    assert.strictEqual(normalizePhone('03001234567'), '+923001234567');
    assert.strictEqual(normalizePhone('+923001234567'), '+923001234567');
    assert.strictEqual(normalizePhone('0092-300-1234567'), '+923001234567');
    assert.throws(() => normalizePhone('02131234567'), /Invalid Pakistan mobile number/);
  });

  test('formatCnicInput formats typing input in real-time', () => {
    assert.strictEqual(formatCnicInput('42101'), '42101');
    assert.strictEqual(formatCnicInput('421011'), '42101-1');
    assert.strictEqual(formatCnicInput('4210112345678'), '42101-1234567-8');
  });

  test('formatPhoneInput formats phone input in real-time', () => {
    assert.strictEqual(formatPhoneInput('0300'), '0300');
    assert.strictEqual(formatPhoneInput('03001234567'), '0300-1234567');
  });

  test('getFriendlyErrorMessage converts errors into user-friendly strings', () => {
    assert.strictEqual(getFriendlyErrorMessage('Direct error'), 'Direct error');
    assert.strictEqual(getFriendlyErrorMessage(new Error('CNIC must be 13 digits')), 'Please enter a valid 13-digit CNIC number.');
    assert.strictEqual(getFriendlyErrorMessage(new Error('Invalid Pakistan mobile number')), 'Please enter a valid Pakistan mobile phone number.');
  });
});
