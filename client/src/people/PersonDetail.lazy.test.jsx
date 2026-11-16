import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { people, PERSON_FIELDS } from '../data/people.js';

// File riêng: lazy() chỉ suspend ở lần load ĐẦU TIÊN của module.
// Nếu chung file với test khác đã render PersonDetail, fallback sẽ không còn xuất hiện.
describe('PersonDetail lazy + Suspense', () => {
  it('hiện Skeleton (aria-busy, aria-live) cùng cấu trúc <dl>, rồi thay bằng detail thật', async () => {
    render(
      <MemoryRouter initialEntries={['/people/1']}>
        <App />
      </MemoryRouter>,
    );

    const skeleton = screen.getByRole('region', { name: 'Đang tải thông tin' });
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('aria-live', 'polite');
    // Cùng khung với detail thật → không layout shift
    expect(skeleton).toHaveClass('person-card');
    const dl = skeleton.querySelector('dl.person-detail');
    expect(dl).not.toBeNull();
    expect(dl.querySelectorAll('dt')).toHaveLength(PERSON_FIELDS.length);

    const main = screen.getByRole('main');
    expect(await within(main).findByText(people[0].name)).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Đang tải thông tin' })).not.toBeInTheDocument();
  });
});
