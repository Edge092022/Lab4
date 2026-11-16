import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router';
import PeopleLayout from './people/PeopleLayout.jsx';
import Skeleton from './people/Skeleton.jsx';
import SimpleForm from './form/SimpleForm.jsx';
import NotFound from './NotFound.jsx';
import { navLinkClass } from './navLinkClass.js';

// Tách PersonDetail thành chunk riêng; chỉ tải khi vào /people/:id lần đầu.
// Khai báo ở top-level module (KHÔNG trong component) để lazy() không bị tạo lại mỗi render.
const PersonDetail = lazy(() => import('./people/PersonDetail.jsx'));

// Layout gốc: KHÔNG bọc <main> — mỗi route tự có đúng một <main> (PeopleLayout có sẵn).
function RootLayout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Lab 4</h1>
        <nav aria-label="Điều hướng chính">
          <NavLink to="/people" className={navLinkClass}>Danh bạ</NavLink>
          <NavLink to="/form" className={navLinkClass}>Form</NavLink>
          <NavLink to="/forum/nasa" className={navLinkClass}>Forum</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<main><p>Chọn một khu vực ở thanh điều hướng.</p></main>} />
        <Route path="people" element={<PeopleLayout />}>
          <Route index element={<p>Chọn một người</p>} />
          <Route
            path=":id"
            element={
              <Suspense fallback={<Skeleton />}>
                <PersonDetail />
              </Suspense>
            }
          />
        </Route>
        <Route path="form" element={<main><SimpleForm /></main>} />
        <Route path="*" element={<main><NotFound /></main>} />
      </Route>
    </Routes>
  );
}
