import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { people } from '../data/people.js';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

// Dùng findBy* (async) cho phần detail: task 1.4 sẽ lazy-load PersonDetail.
describe('People routes', () => {
  it('/people render danh sách link tới từng người + màn hình index', () => {
    renderAt('/people');
    const sidebar = screen.getByRole('navigation', { name: 'Danh bạ' });
    const links = within(sidebar).getAllByRole('link');
    expect(links).toHaveLength(people.length);
    expect(links[0]).toHaveAttribute('href', `/people/${people[0].id}`);
    expect(screen.getByText('Chọn một người')).toBeInTheDocument();
  });

  it('/people/1 render <dl> chứa tên người', async () => {
    renderAt('/people/1');
    const main = screen.getByRole('main');
    const name = await within(main).findByText(people[0].name);
    expect(name.closest('dl')).not.toBeNull();
    expect(within(main).getByText(people[0].email)).toBeInTheDocument();
  });

  it('/people/xyz render 404 role="alert"', async () => {
    renderAt('/people/xyz');
    expect(await screen.findByRole('alert')).toHaveTextContent(/không tìm thấy/i);
    // sidebar vẫn còn: 404 nằm trong layout, không thay cả trang
    expect(screen.getByRole('navigation', { name: 'Danh bạ' })).toBeInTheDocument();
  });

  it('NavLink đang chọn có class active-link, link khác thì không', async () => {
    renderAt('/people/2');
    const sidebar = screen.getByRole('navigation', { name: 'Danh bạ' });
    const active = within(sidebar).getByRole('link', { name: people[1].name });
    const other = within(sidebar).getByRole('link', { name: people[0].name });
    expect(active).toHaveClass('active-link');
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(other).not.toHaveClass('active-link');
  });

  it('path không tồn tại (*) render 404 role="alert"', () => {
    renderAt('/khong-co-trang-nay');
    expect(screen.getByRole('alert')).toHaveTextContent(/không tìm thấy/i);
  });
});
