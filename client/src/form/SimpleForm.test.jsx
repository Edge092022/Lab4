import { describe, it, expect } from 'vitest';
import { Profiler } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SimpleForm from './SimpleForm.jsx';
import App from '../App.jsx';

const type = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label) => fireEvent.blur(screen.getByLabelText(label));
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Gửi' }));
const inspector = () => screen.queryByRole('heading', { name: 'Dữ liệu đã gửi' });

describe('SimpleForm', () => {
  it('route /form render form với 3 field có label', () => {
    render(
      <MemoryRouter initialEntries={['/form']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Họ tên')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Tuổi')).toBeInTheDocument();
  });

  it('chưa chạm vào field → chưa báo lỗi', () => {
    render(<SimpleForm />);
    expect(screen.getByLabelText('Họ tên')).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('gõ sai rồi rời field → aria-invalid="true" + thông báo role="alert" nối bằng aria-describedby', () => {
    render(<SimpleForm />);
    type('Họ tên', 'A');
    blur('Họ tên');

    const input = screen.getByLabelText('Họ tên');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Họ tên phải có ít nhất 2 ký tự.');
    expect(screen.getByRole('alert')).toHaveTextContent('Họ tên phải có ít nhất 2 ký tự.');
  });

  it('sửa lại cho đúng → lỗi biến mất ngay trong cùng lần gõ', () => {
    render(<SimpleForm />);
    type('Email', 'an@');
    blur('Email');
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');

    type('Email', 'an@example.com');
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('submit form trống → hiện lỗi cả 3 field, KHÔNG hiện inspector', () => {
    render(<SimpleForm />);
    submit();
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.getByLabelText('Tuổi')).toHaveAccessibleDescription('Vui lòng nhập tuổi.');
    expect(inspector()).not.toBeInTheDocument();
  });

  it('submit hợp lệ → hiện inspector <dl class="json-inspector"> với dữ liệu đã gửi', () => {
    const { container } = render(<SimpleForm />);
    type('Họ tên', 'Nguyễn Văn An');
    type('Email', 'an@example.com');
    type('Tuổi', '25');
    submit();

    expect(inspector()).toBeInTheDocument();
    const dl = container.querySelector('dl.json-inspector');
    expect(dl).not.toBeNull();
    const q = within(dl);
    expect(q.getByText('name').nextElementSibling).toHaveTextContent('Nguyễn Văn An');
    expect(q.getByText('email').nextElementSibling).toHaveTextContent('an@example.com');
    expect(q.getByText('age').nextElementSibling).toHaveTextContent('25');
  });

  it('một phím gõ = đúng MỘT commit (không chuỗi useEffect)', () => {
    let commits = 0;
    render(
      <Profiler id="form" onRender={() => { commits += 1; }}>
        <SimpleForm />
      </Profiler>,
    );
    commits = 0; // bỏ qua lần mount
    type('Họ tên', 'B');
    expect(commits).toBe(1);
  });
});
