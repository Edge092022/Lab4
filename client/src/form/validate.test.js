import { describe, it, expect } from 'vitest';
import { validateForm } from './validate.js';

const VALID = { name: 'An', email: 'an@example.com', age: '25' };
const withField = (patch) => ({ ...VALID, ...patch });

describe('validateForm — hàm thuần', () => {
  it('form hợp lệ → {} (không key nào)', () => {
    expect(validateForm(VALID)).toEqual({});
  });

  it('chỉ trả key của field lỗi', () => {
    expect(Object.keys(validateForm(withField({ email: 'x' })))).toEqual(['email']);
  });

  it('không mutate input', () => {
    const input = { name: ' A ', email: '', age: 'abc' };
    const copy = structuredClone(input);
    validateForm(input);
    expect(input).toEqual(copy);
  });

  it('cùng input → cùng output (deterministic)', () => {
    const input = { name: '', email: 'bad', age: '5' };
    expect(validateForm(input)).toEqual(validateForm(input));
  });
});

describe('name', () => {
  it.each([
    ['', 'Vui lòng nhập họ tên.'],
    ['   ', 'Vui lòng nhập họ tên.'],
    ['A', 'Họ tên phải có ít nhất 2 ký tự.'],
    ['  A  ', 'Họ tên phải có ít nhất 2 ký tự.'],
  ])('%j → %s', (name, message) => {
    expect(validateForm(withField({ name })).name).toBe(message);
  });

  it.each(['An', '  Bình  ', 'Nguyễn Văn An'])('%j hợp lệ', (name) => {
    expect(validateForm(withField({ name }))).not.toHaveProperty('name');
  });
});

describe('email', () => {
  it.each([
    ['', 'Vui lòng nhập email.'],
    ['  ', 'Vui lòng nhập email.'],
    ['an', 'Email không đúng định dạng.'],
    ['an@', 'Email không đúng định dạng.'],
    ['an@example', 'Email không đúng định dạng.'],
    ['an @example.com', 'Email không đúng định dạng.'],
  ])('%j → %s', (email, message) => {
    expect(validateForm(withField({ email })).email).toBe(message);
  });

  it.each(['an@example.com', '  an.nguyen@sub.example.vn  '])('%j hợp lệ', (email) => {
    expect(validateForm(withField({ email }))).not.toHaveProperty('email');
  });
});

describe('age', () => {
  it.each([
    ['', 'Vui lòng nhập tuổi.'],
    ['  ', 'Vui lòng nhập tuổi.'],
    ['abc', 'Tuổi phải là số nguyên.'],
    ['18.5', 'Tuổi phải là số nguyên.'],
    ['1e2', 'Tuổi phải là số nguyên.'],
    ['17', 'Tuổi phải từ 18 đến 100.'],
    ['101', 'Tuổi phải từ 18 đến 100.'],
    ['-20', 'Tuổi phải từ 18 đến 100.'],
  ])('%j → %s', (age, message) => {
    expect(validateForm(withField({ age })).age).toBe(message);
  });

  it.each(['18', '100', ' 42 '])('%j hợp lệ (biên + trim)', (age) => {
    expect(validateForm(withField({ age }))).not.toHaveProperty('age');
  });
});

it('form trống → đủ 3 lỗi', () => {
  expect(validateForm({ name: '', email: '', age: '' })).toEqual({
    name: 'Vui lòng nhập họ tên.',
    email: 'Vui lòng nhập email.',
    age: 'Vui lòng nhập tuổi.',
  });
});
