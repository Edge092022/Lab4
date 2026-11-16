import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Root layout', () => {
  it('render tiêu đề app', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Lab 4' })).toBeInTheDocument();
  });

  it('nav gốc có link tới /people, /form, /forum/nasa', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Điều hướng chính' });
    const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/people', '/form', '/forum/nasa']);
  });

  it('link "Danh bạ" ở nav gốc active khi đang ở route con /people/2', () => {
    renderAt('/people/2');
    const nav = screen.getByRole('navigation', { name: 'Điều hướng chính' });
    expect(within(nav).getByRole('link', { name: 'Danh bạ' })).toHaveClass('active-link');
  });

  it('mỗi trang chỉ có đúng một <main>', () => {
    renderAt('/people');
    expect(screen.getAllByRole('main')).toHaveLength(1);
  });
});
