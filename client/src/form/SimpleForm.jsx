import { useState } from 'react';
import { FormContext } from './FormContext.js';
import { validateForm } from './validate.js';
import InputField from './InputField.jsx';
import ShowData from './ShowData.jsx';

const INITIAL_VALUES = { name: '', email: '', age: '' };

// Một nguồn sự thật cho dữ liệu: `values`. errors / isValid là DERIVED,
// tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 render. Không effect nào.
// `touched` / `submitAttempted` chỉ quyết định KHI NÀO hiện lỗi, cũng là state thường.
export default function SimpleForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Ảnh chụp `values` tại lúc Gửi hợp lệ. `values` không bao giờ bị mutate
  // (luôn tạo object mới), nên lưu tham chiếu là đủ — không cần clone.
  const [submitted, setSubmitted] = useState(null);

  const errors = validateForm(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    // Functional updater: không phụ thuộc closure `values` cũ, merge để giữ field khác.
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    // Đã touched → trả lại object cũ: React thấy state không đổi, bỏ qua render.
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    if (!isValid) {
      // Focus là side effect do NGƯỜI DÙNG gây ra → làm ngay trong handler, không cần effect.
      const firstInvalid = Object.keys(errors)[0];
      event.currentTarget.elements.namedItem(firstInvalid)?.focus();
      return;
    }
    setSubmitted(values);
  }

  return (
    <FormContext value={{ values, errors, touched, submitAttempted, handleChange, handleBlur }}>
      {/* noValidate: tắt validation native của trình duyệt, chỉ dùng validateForm */}
      <form className="simple-form" noValidate onSubmit={handleSubmit}>
        <InputField name="name" label="Họ tên" autoComplete="name" />
        <InputField name="email" label="Email" type="email" autoComplete="email" />
        {/* type="text" + inputMode: type="number" làm trình duyệt nuốt chuỗi "abc" thành "" */}
        <InputField name="age" label="Tuổi" inputMode="numeric" />
        <button type="submit">Gửi</button>
      </form>
      {submitted && <ShowData data={submitted} />}
    </FormContext>
  );
}
