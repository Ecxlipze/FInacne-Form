import assert from 'node:assert';
import { test, describe, before } from 'node:test';

// Set environment variables before importing modules that depend on env
process.env.FIELD_ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012').toString('base64');
process.env.BLIND_INDEX_KEY = Buffer.from('98765432109876543210987654321098').toString('base64');

import { encryptField, decryptField, blindIndex } from '../utils/crypto';

describe('Crypto Utilities', () => {
  test('encryptField and decryptField roundtrip', () => {
    const plaintext = '42101-1234567-8';
    const encrypted = encryptField(plaintext);
    
    assert.notStrictEqual(encrypted, plaintext);
    assert.strictEqual(typeof encrypted, 'string');
    
    const decrypted = decryptField(encrypted);
    assert.strictEqual(decrypted, plaintext);
  });

  test('blindIndex is deterministic and normalized', () => {
    const rawCnic1 = '42101-1234567-8';
    const rawCnic2 = '4210112345678';
    
    const index1 = blindIndex(rawCnic1);
    const index2 = blindIndex(rawCnic2);
    
    assert.strictEqual(index1, index2);
    assert.strictEqual(index1?.length, 64); // hex SHA256 string
  });
});
