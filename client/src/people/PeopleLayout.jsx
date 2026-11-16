import { NavLink, Outlet } from 'react-router';
import { people } from '../data/people.js';
import { navLinkClass } from '../navLinkClass.js';

// Master–Detail: URL là nguồn sự thật cho "người đang chọn" — không có state ở đây.
export default function PeopleLayout() {
  return (
    <div className="people-layout">
      <nav aria-label="Danh bạ" className="people-sidebar">
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              <NavLink to={person.id} className={navLinkClass}>
                {person.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main className="people-main">
        <Outlet />
      </main>
    </div>
  );
}
