import { useId } from 'react';
import { useFormContext } from './FormContext.js';

// Không nhận value/onChange qua props — lấy từ context theo `name`.
export default function InputField({ name, label, type = 'text', ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const { values, errors, touched, submitAttempted, handleChange, handleBlur } = useFormContext();

  // Derived: chỉ hiện lỗi khi field đã được rời khỏi (blur) hoặc đã bấm Gửi.
  const error = touched[name] || submitAttempted ? errors[name] : undefined;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
