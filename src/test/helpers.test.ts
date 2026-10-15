import { describe, it, expect } from 'vitest';
import {
  formatDate,
  generateReferenceNumber,
  formatFileSize,
  truncate,
  isValidEmail,
  isValidPhone,
  stripHtml,
} from '../utils/helpers';

describe('formatDate', () => {
  it('formats a date correctly', () => {
    const d = new Date('2026-10-14T00:00:00');
    const result = formatDate(d);
    expect(result).toContain('2026');
    expect(result).toContain('October');
    expect(result).toContain('14');
  });

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('generateReferenceNumber', () => {
  it('starts with BES', () => {
    const ref = generateReferenceNumber();
    expect(ref).toMatch(/^BES\d{10}$/);
  });

  it('includes current year', () => {
    const ref = generateReferenceNumber();
    expect(ref).toContain(String(new Date().getFullYear()));
  });

  it('generates unique values', () => {
    const refs = new Set(Array.from({ length: 50 }, generateReferenceNumber));
    expect(refs.size).toBeGreaterThan(40);
  });
});

describe('formatFileSize', () => {
  it('formats bytes',  () => { expect(formatFileSize(512)).toBe('512 B'); });
  it('formats KB',    () => { expect(formatFileSize(2048)).toBe('2.0 KB'); });
  it('formats MB',    () => { expect(formatFileSize(2097152)).toBe('2.0 MB'); });
});

describe('truncate', () => {
  it('does not truncate short strings', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates long strings with ellipsis', () => {
    const result = truncate('hello world this is a long string', 10);
    expect(result).toHaveLength(10);
    expect(result[result.length - 1]).toBe('…');
  });
});

describe('isValidEmail', () => {
  it('accepts valid emails',   () => { expect(isValidEmail('test@example.com')).toBe(true); });
  it('accepts subdomain',      () => { expect(isValidEmail('a@b.co.in')).toBe(true); });
  it('rejects no @',           () => { expect(isValidEmail('notanemail')).toBe(false); });
  it('rejects missing domain', () => { expect(isValidEmail('a@')).toBe(false); });
  it('rejects spaces',         () => { expect(isValidEmail('a b@c.com')).toBe(false); });
});

describe('isValidPhone', () => {
  it('accepts valid 10-digit mobile', () => { expect(isValidPhone('9810497750')).toBe(true); });
  it('accepts with +91 prefix',       () => { expect(isValidPhone('+919810497750')).toBe(true); });
  it('rejects short number',          () => { expect(isValidPhone('12345')).toBe(false); });
  it('rejects starts with 1',         () => { expect(isValidPhone('1234567890')).toBe(false); });
});

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });
  it('returns plain text unchanged', () => {
    expect(stripHtml('plain text')).toBe('plain text');
  });
});
