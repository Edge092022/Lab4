import { useId } from 'react';
import { useFormContext } from './FormContext.js';

// Bản tối thiểu cho task 2.2 (label + controlled input qua context).
// Hiển thị lỗi, aria-invalid/aria-describedby và touched làm ở task 2.3.
export default function InputField({ name, label, type = 'text', ...inputProps }) {
  const id = useId();
  const { values, handleChange } = useFormContext();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        {...inputProps}
      />
    </div>
  );
}
