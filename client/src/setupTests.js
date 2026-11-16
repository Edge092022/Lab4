import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// RTL chỉ tự cleanup khi có global afterEach (vitest `globals: true`).
// Không bật globals → phải gỡ DOM thủ công, nếu không các test render cộng dồn vào document.
afterEach(() => {
  cleanup();
});
