import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowData from './ShowData.jsx';

describe('ShowData', () => {
  it('render <dl class="json-inspector"> với một cặp dt/dd cho mỗi entry, đúng thứ tự', () => {
    const { container } = render(<ShowData data={{ name: 'An', email: 'an@example.com', age: '25' }} />);
    const dl = container.querySelector('dl.json-inspector');
    expect(dl).not.toBeNull();
    expect([...dl.querySelectorAll('dt')].map((el) => el.textContent)).toEqual(['name', 'email', 'age']);
    expect([...dl.querySelectorAll('dd')].map((el) => el.textContent)).toEqual(['An', 'an@example.com', '25']);
  });

  it('có heading "Dữ liệu đã gửi" đặt tên cho vùng', () => {
    render(<ShowData data={{ a: 1 }} />);
    expect(screen.getByRole('region', { name: 'Dữ liệu đã gửi' })).toBeInTheDocument();
  });

  it('giá trị không phải string vẫn hiển thị được (number, boolean)', () => {
    const { container } = render(<ShowData data={{ count: 0, ok: false }} />);
    expect([...container.querySelectorAll('dd')].map((el) => el.textContent)).toEqual(['0', 'false']);
  });
});
