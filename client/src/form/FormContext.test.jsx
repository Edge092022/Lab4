import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFormContext } from './FormContext.js';
import SimpleForm from './SimpleForm.jsx';

function Orphan() {
  useFormContext();
  return null;
}

describe('FormContext', () => {
  it('useFormContext() ngoài Provider → throw lỗi rõ ràng', () => {
    // React log lỗi render ra console.error — tắt để output test sạch
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Orphan />)).toThrow('useFormContext phải được dùng bên trong <SimpleForm>');
    spy.mockRestore();
  });

  it('input là controlled qua context: gõ → values cập nhật → input hiện giá trị mới', () => {
    render(<SimpleForm />);
    const name = screen.getByLabelText('Họ tên');
    const email = screen.getByLabelText('Email');
    fireEvent.change(name, { target: { value: 'An' } });
    fireEvent.change(email, { target: { value: 'an@example.com' } });
    // đổi field này không làm mất giá trị field kia (functional updater, merge object)
    expect(name).toHaveValue('An');
    expect(email).toHaveValue('an@example.com');
    expect(screen.getByLabelText('Tuổi')).toHaveValue('');
  });
});
