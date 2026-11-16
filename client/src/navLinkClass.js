// Cú pháp v7: className nhận hàm ({ isActive }) — KHÔNG dùng activeClassName (v5).
export const navLinkClass = ({ isActive }) => (isActive ? 'active-link' : undefined);
