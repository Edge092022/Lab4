import { describe, it, expect } from 'vitest';
import { validateMessage as clientValidate, MESSAGE_LIMITS } from './validate.js';
import {
  validateMessage as serverValidate,
  AUTHOR_MAX,
  TEXT_MAX,
} from '../../../server/validate.js';

// Validation parity (project-rules §0): client và server phải CHẤP NHẬN / TỪ CHỐI cùng một input.
// (Message có thể khác ngôn ngữ — client tiếng Việt cho người dùng, server theo contract.)
describe('parity validateMessage client ↔ server', () => {
  it('cùng giới hạn độ dài', () => {
    expect(MESSAGE_LIMITS).toEqual({ author: AUTHOR_MAX, text: TEXT_MAX });
  });

  const CASES = [
    { author: 'An', text: 'Hi' },
    { author: '  An  ', text: '  Hi  ' },
    { author: '', text: 'Hi' },
    { author: 'An', text: '' },
    { author: '   ', text: 'Hi' },
    { author: 'An', text: '   ' },
    { author: 'a'.repeat(50), text: 'b'.repeat(500) },
    { author: 'a'.repeat(51), text: 'Hi' },
    { author: 'An', text: 'b'.repeat(501) },
    { author: ' '.repeat(3) + 'a'.repeat(50) + ' '.repeat(3), text: 'Hi' }, // 50 sau trim → hợp lệ
  ];

  it.each(CASES)('cùng kết luận cho %j', (input) => {
    const clientOk = Object.keys(clientValidate(input)).length === 0;
    const serverOk = !serverValidate(input).error;
    expect(clientOk).toBe(serverOk);
  });
});

describe('validateMessage (client) — message cho người dùng', () => {
  it('hợp lệ → {}', () => {
    expect(clientValidate({ author: 'An', text: 'Hi' })).toEqual({});
  });

  it('trống → lỗi cả 2 field', () => {
    expect(clientValidate({ author: ' ', text: '' })).toEqual({
      author: 'Vui lòng nhập tên.',
      text: 'Vui lòng nhập nội dung.',
    });
  });

  it('quá dài → báo giới hạn', () => {
    expect(clientValidate({ author: 'a'.repeat(51), text: 'b'.repeat(501) })).toEqual({
      author: 'Tên tối đa 50 ký tự.',
      text: 'Nội dung tối đa 500 ký tự.',
    });
  });
});
