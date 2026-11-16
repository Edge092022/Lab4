import { useState } from 'react';
import { FormContext } from './FormContext.js';
import { validateForm } from './validate.js';
import InputField from './InputField.jsx';

const INITIAL_VALUES = { name: '', email: '', age: '' };

// Một nguồn sự thật: `values`. Mọi thứ khác (errors, isValid) là DERIVED,
// tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 render. Không effect nào.
export default function SimpleForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    // Functional updater: không phụ thuộc closure `values` cũ, merge để giữ field khác.
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    // Lưu dữ liệu đã gửi + hiện inspector: task 2.4.
  }

  return (
    <FormContext value={{ values, errors, handleChange }}>
      {/* noValidate: tắt validation native của trình duyệt, chỉ dùng validateForm */}
      <form className="simple-form" noValidate onSubmit={handleSubmit}>
        <InputField name="name" label="Họ tên" autoComplete="name" />
        <InputField name="email" label="Email" type="email" autoComplete="email" />
        {/* type="text" + inputMode: type="number" làm trình duyệt nuốt chuỗi "abc" thành "" */}
        <InputField name="age" label="Tuổi" inputMode="numeric" />
        <button type="submit">Gửi</button>
      </form>
    </FormContext>
  );
}
