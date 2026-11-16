// Hàm thuần: cùng input → cùng output, không side effect, không mutate.
// Gọi trực tiếp trong render (derived state) — KHÔNG gọi trong effect.
// Contract: TASK_DECOMPOSITION.md §1.5.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTEGER_RE = /^-?\d+$/;
export const AGE_MIN = 18;
export const AGE_MAX = 100;

function validateName(raw) {
  const value = raw.trim();
  if (!value) return 'Vui lòng nhập họ tên.';
  if (value.length < 2) return 'Họ tên phải có ít nhất 2 ký tự.';
  return null;
}

function validateEmail(raw) {
  const value = raw.trim();
  if (!value) return 'Vui lòng nhập email.';
  if (!EMAIL_RE.test(value)) return 'Email không đúng định dạng.';
  return null;
}

function validateAge(raw) {
  const value = raw.trim();
  if (!value) return 'Vui lòng nhập tuổi.';
  if (!INTEGER_RE.test(value)) return 'Tuổi phải là số nguyên.';
  const age = Number(value);
  if (age < AGE_MIN || age > AGE_MAX) return `Tuổi phải từ ${AGE_MIN} đến ${AGE_MAX}.`;
  return null;
}

const RULES = {
  name: validateName,
  email: validateEmail,
  age: validateAge,
};

/**
 * @param {{ name: string, email: string, age: string }} values
 * @returns {Partial<Record<'name'|'email'|'age', string>>} chỉ chứa field lỗi; hợp lệ → {}
 */
export function validateForm(values) {
  const errors = {};
  for (const [field, rule] of Object.entries(RULES)) {
    const message = rule(values[field] ?? '');
    if (message) errors[field] = message;
  }
  return errors;
}
