import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';

// "Server" giả trong bộ nhớ: trả lời ngay, đủ để test UI (race condition đã test ở hook).
function createFakeApi() {
  const db = {
    nasa: [{ id: 'n1', author: 'Houston', text: 'Chào NASA', timestamp: '2026-01-01T08:00:00.000Z' }],
    'esports-tribunal': [],
    notNasa: [{ id: 'x1', author: 'Skeptic', text: 'Không phải NASA', timestamp: '2026-01-03T12:00:00.000Z' }],
  };
  return vi.fn(async (url, init = {}) => {
    const forum = decodeURIComponent(url.split('/').pop());
    if (!Object.hasOwn(db, forum)) {
      return { ok: false, status: 404, json: async () => ({ error: 'Unknown forum' }) };
    }
    if (init.method === 'POST') {
      const { author, text } = JSON.parse(init.body);
      const created = { id: `new-${db[forum].length}`, author, text, timestamp: '2026-02-01T00:00:00.000Z' };
      db[forum].push(created);
      return { ok: true, status: 201, json: async () => created };
    }
    return { ok: true, status: 200, json: async () => [...db[forum]] };
  });
}

let fetchMock;
beforeEach(() => {
  fetchMock = createFakeApi();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const messageList = () => screen.getByRole('region', { name: /Tin nhắn/ });

describe('ForumPage', () => {
  it('/forum/nasa: hiện tin nhắn trong <dl>, nav 3 kênh, kênh hiện tại active', async () => {
    const { container } = renderAt('/forum/nasa');
    expect(await screen.findByText('Chào NASA')).toBeInTheDocument();
    expect(container.querySelector('main dl')).toContainElement(screen.getByText('Chào NASA'));

    const nav = screen.getByRole('navigation', { name: 'Kênh' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/forum/nasa',
      '/forum/esports-tribunal',
      '/forum/notNasa',
    ]);
    expect(within(nav).getByRole('link', { name: /nasa/i, current: 'page' })).toHaveClass('active-link');
  });

  it('vùng danh sách có aria-live="polite" và aria-busy khi đang tải', async () => {
    renderAt('/forum/nasa');
    const region = messageList();
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-busy', 'true');
    await screen.findByText('Chào NASA');
    expect(region).toHaveAttribute('aria-busy', 'false');
  });

  it('đổi kênh bằng NavLink → tải tin của kênh mới', async () => {
    renderAt('/forum/nasa');
    await screen.findByText('Chào NASA');
    fireEvent.click(screen.getByRole('link', { name: 'notNasa' }));
    expect(await screen.findByText('Không phải NASA')).toBeInTheDocument();
    expect(screen.queryByText('Chào NASA')).not.toBeInTheDocument();
  });

  it('kênh lạ → thông báo lỗi role="alert"', async () => {
    renderAt('/forum/foo');
    expect(await screen.findByText('Unknown forum')).toHaveAttribute('role', 'alert');
  });

  it('gửi tin trống → lỗi validate phía client, KHÔNG gọi POST', async () => {
    renderAt('/forum/nasa');
    await screen.findByText('Chào NASA');
    fireEvent.click(screen.getByRole('button', { name: 'Gửi tin' }));

    expect(screen.getByLabelText('Tên')).toHaveAccessibleDescription('Vui lòng nhập tên.');
    expect(screen.getByLabelText('Nội dung')).toHaveAccessibleDescription('Vui lòng nhập nội dung.');
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(false);
  });

  it('gửi tin hợp lệ → POST, refetch, tin mới hiện ra, ô nội dung được xoá', async () => {
    renderAt('/forum/nasa');
    await screen.findByText('Chào NASA');
    fireEvent.change(screen.getByLabelText('Tên'), { target: { value: 'An' } });
    fireEvent.change(screen.getByLabelText('Nội dung'), { target: { value: 'Tin mới' } });
    fireEvent.click(screen.getByRole('button', { name: 'Gửi tin' }));

    expect(await within(messageList()).findByText('Tin mới')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText('Nội dung')).toHaveValue(''));
    expect(screen.getByLabelText('Tên')).toHaveValue('An'); // giữ tên cho tin tiếp theo
  });
});
