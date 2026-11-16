# PROJECT RULES — Lab 4: Multi-Route SPA, Context Form Engine & Full-Stack React 19

> Môn: UIT S3T — Lab 4 (MSc. Tran Vinh Khiem).
> File này + `TASK_DECOMPOSITION.md` là **toàn bộ context** cho AI agent (Claude Code / chat mới).
> AI agent: đọc hết file này TRƯỚC khi viết bất kỳ dòng code nào. Không cần file slide gốc.

---

## 0. Triết lý của lab (bắt buộc hiểu)

- *"Generate with AI. Verify with Engineering."* — AI được dùng, nhưng **người** quyết định kiến trúc, đọc, kiểm chứng và commit.
- Brainstorm luồng làm việc, giải thuật, **xác định scale trước** → rồi mới chọn công nghệ → rồi mới code. Code là phần phụ.
- Công nghệ phải **vừa với scale**: không quá lớn (không Redux, không Next.js, không TanStack Query, không UI kit), không quá nhỏ.
- **Full-Stack Verification Contract:**
  1. Contract-first API design (định nghĩa interface trước khi code).
  2. Validation **parity**: client và server validate cùng một luật.
  3. Zero unhandled promise rejection, zero effect loop.
  4. State update xác định (deterministic) trong **một** render pass.

## 1. Luật chấm điểm (vi phạm = 0 điểm)

| Luật | Hệ quả |
|---|---|
| Git commit **< 10 lần** | 0 điểm |
| Giao AI làm từ A–Z rồi tạo WBS sau | 0 điểm |
| Làm theo logic AI hoàn toàn / copy y xì người khác | 0 điểm |
| Không dùng React 19 | Không đạt |
| Thiếu 1 trong 3 file bắt buộc | Không đạt |

**3 file bắt buộc ở root repo (đúng tên):**
- `project-rules.md` (file này)
- `TASK_DECOMPOSITION.md`
- `AI_FAILURE_AUDIT.md` (chiếm **15%** điểm lab)
- kèm `.env.example` (template biến môi trường, không chứa secret)

## 2. Quy tắc cho AI agent

1. **Làm từng task một** theo thứ tự trong `TASK_DECOMPOSITION.md`. Xong một task → **DỪNG**, báo lại: file đã đổi, cách tự kiểm tra, commit message đề xuất. **Không tự `git commit`** — người dùng review rồi tự commit.
2. Không làm trước task tiếp theo, không gộp nhiều task vào một lần.
3. Mỗi task đi theo **vòng lặp 4 bước Contract-First**:
   1. **Contract** — nêu interface/props/API shape.
   2. **Fail test** — viết test chạy ĐỎ trước.
   3. **Implement** — code tối thiểu cho test XANH.
   4. **Refactor** — dọn code, test vẫn xanh.
4. Khi người dùng sửa code AI sinh sai (API ảo, loop, cú pháp cũ...), **ghi ngay** một mục vào `AI_FAILURE_AUDIT.md` theo template.
5. Nếu slide/contract mâu thuẫn hoặc thiếu → hỏi người dùng, không tự đoán.

## 3. Tech stack (đã chốt theo scale)

**Scale:** 1 người dùng, chạy local, vài chục bản ghi mock, 3 kênh forum. → Không cần DB thật cho phần exercise.

| Tầng | Chọn | Lý do |
|---|---|---|
| Build | Vite | Nhẹ, HMR nhanh |
| UI | **React 19** + JSX | Yêu cầu bắt buộc |
| Routing | **React Router v7** (package `react-router`) | Yêu cầu; import từ `'react-router'`, KHÔNG `react-router-dom` v5/v6 |
| State | `useState` + `createContext` / `useContext` | Đủ cho scale; không Redux |
| Style | CSS thuần (CSS Grid + `@media`) | Không UI library |
| Test FE | Vitest + @testing-library/react + jsdom | Tích hợp Vite |
| Backend | Node ≥ 20 + Express + `cors` | Theo contract slide |
| Lưu trữ BE | **In-memory** (object `db` theo forum) | Đủ cho exercise; MongoDB/Mongoose 8 để dành cho homework |
| Test BE | Vitest (hoặc `node:test`) + supertest | |
| ID | `crypto.randomUUID()` | Theo contract |

**Cấu trúc repo:**
```
repo-root/
├── project-rules.md
├── TASK_DECOMPOSITION.md
├── AI_FAILURE_AUDIT.md
├── .env.example
├── client/            # Vite + React 19
│   └── src/
│       ├── App.jsx
│       ├── data/people.js
│       ├── people/   PeopleLayout.jsx, PersonDetail.jsx, Skeleton.jsx
│       ├── form/     FormContext.js, SimpleForm.jsx, InputField.jsx, ShowData.jsx, validate.js
│       └── forum/    useForumMessages.js, ForumPage.jsx
└── server/
    ├── server.js
    ├── db.js
    └── validate.js   # cùng luật với client (parity)
```

## 4. Coding standards

### React
- **Cấm** `<Switch>`, `<Redirect>`, `exact`, `component={...}`, `activeClassName` (React Router v5).
- Dùng `<Routes>`, `<Route element={<X />}>`, `<Outlet />`, `useParams`, `NavLink className={({ isActive }) => ...}`.
- **Cấm** `Component.defaultProps` → dùng default parameter `function C({ x = 1 })`.
- **Cấm** dùng `useEffect` để validate form hoặc đồng bộ state cha–con. Validation là **derived state** tính đồng bộ trong render (`const errors = validateForm(values)`, hoặc `useMemo` nếu tốn kém).
- `useEffect` chỉ dùng cho side effect thật (fetch, subscription, DOM API). Luôn đủ dependency array.
- Fetch trong effect: **bắt buộc** `AbortController` + cleanup `return () => controller.abort()`. Guard `if (!controller.signal.aborted)` trước mọi `setState`. **Cấm** cờ `didCancel`.
- List render: `key` ổn định (id), không dùng index.

### Accessibility (WCAG 2.2 AA)
- Mọi input có `<label htmlFor>` gắn với id từ `useId()`.
- Lỗi: `aria-invalid`, `aria-describedby` trỏ tới phần tử lỗi có `role="alert"`.
- Loading: `aria-busy="true"`, `aria-live="polite"`.
- Nút chỉ có icon **phải** có `aria-label`.
- Dữ liệu key–value dùng `<dl>/<dt>/<dd>`.

### Backend
- Mọi route handler `async/await`, có xử lý lỗi (try/catch hoặc error middleware), không để promise bị reject mà không bắt.
- `cors({ origin: process.env.CLIENT_ORIGIN })` — không dùng `cors()` mở toàn bộ.
- POST validate payload → `400` + `{ error }` nếu thiếu field; tạo mới → `201`.
- **Cấm** hardcode secret/URI. Mọi cấu hình qua `process.env`, khai báo trong `.env.example`. `.env` nằm trong `.gitignore`.
- (Khi dùng Mongoose 8 ở homework: chỉ async/await, cấm callback, cấm cờ `useNewUrlParser`/`useUnifiedTopology`.)

### Top 5 lỗi AI hay mắc (soát mỗi lần nhận code AI)
1. Cú pháp React Router v5 (`<Switch>`, `component=`) trong project v7.
2. `useEffect` để validate form → loop / lag.
3. Hardcode MongoDB URI / mật khẩu.
4. Callback Mongoose 5 (`.exec((err, doc) => ...)`) — đã bị bỏ ở Mongoose 8.
5. Icon button thiếu `aria-label`.

## 5. Git

- **Conventional Commits**: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`, `perf:`.
- **Atomic**: 1 commit = 1 thay đổi có ý nghĩa, build và test đều pass.
- Commit message bắt buộc theo sprint đã ghi trong `TASK_DECOMPOSITION.md`.
- Tối thiểu 10 commit; kế hoạch có 16.
- Commit đầu tiên là **docs** (rules + WBS) — chứng minh WBS có trước code.

## 6. Definition of Done (mỗi task)

- [ ] Test liên quan xanh (`npm test`).
- [ ] DevTools Console: **0 warning, 0 error**.
- [ ] Không vi phạm mục 4.
- [ ] Người dùng đã đọc hiểu và **tự giải thích được** code (sẽ bị hỏi ở live defense).
- [ ] Nếu có lỗi AI → đã ghi `AI_FAILURE_AUDIT.md`.

## 7. Live Defense (Block 5) — chuẩn bị

3 phút: trình bày kiến trúc, bảo vệ lựa chọn state (local / context / server), sửa bug được cài vào trực tiếp.
Câu hỏi có thể gặp (code phải dễ mở rộng cho các hướng này):
1. **URL Search Params Sync** — chuyển state local sang `useSearchParams` (deep link, giữ sau reload).
2. **Cross-Field Validation** — ví dụ confirm password; mở rộng `validateForm`, vẫn không `useEffect`.
3. **Auto-Retry Backoff** — retry có exponential backoff trong `useForumMessages`, tôn trọng `signal`.
4. **Protected Route Guard** — wrapper chặn route, redirect `/login` và giữ URL đích (`state.from`).
