# TASK DECOMPOSITION (WBS) — Lab 4 Exercises

> Phạm vi: **Exercises + Sprint 1–3 trên lớp**. Homework (Photo Gallery, Swipe Deck, Tribunal) làm sau, sẽ bổ sung WBS riêng.
> Đọc kèm `project-rules.md`. AI agent: làm **đúng thứ tự**, mỗi task xong thì DỪNG để người dùng review và commit.

---

## 1. Brainstorm & quyết định kiến trúc (làm TRƯỚC khi code)

### 1.1 Bài toán
App SPA gồm 3 khu vực, mỗi khu chứng minh một kỹ năng:

| Route | Khu vực | Kỹ năng chính |
|---|---|---|
| `/people`, `/people/:id` | Danh bạ Master–Detail | Router v7, Outlet, useParams, 404, lazy + Suspense |
| `/form` | Form engine | Context, validation đồng bộ, useId, a11y |
| `/forum/:forumId` | Forum 3 kênh | Custom hook fetch + AbortController, Express API |
| `*` | 404 | Fallback |

### 1.2 Luồng dữ liệu (giải thuật trên giấy)
- **People:** `people` (mảng tĩnh) → `PeopleLayout` render danh sách `NavLink` → click → URL đổi `/people/:id` → `PersonDetail` đọc `id` bằng `useParams()` → `people.find(p => p.id === id)` → không thấy thì render 404 `role="alert"`. URL là nguồn sự thật, không có state chọn người.
- **Form:** `values` (useState duy nhất ở `SimpleForm`) → mỗi render tính `errors = validateForm(values)` → `isValid = Object.keys(errors).length === 0` → đưa vào Context → `InputField` đọc lỗi qua `useFormContext()`. Một phím gõ = **một** render, không effect. Submit hợp lệ → lưu `submitted` → `<ShowData data={submitted} />`.
- **Forum:** `forumId` từ URL → `useForumMessages(forumId)` → effect tạo `AbortController` → fetch `GET /api/messages/:forum` → đổi kênh → cleanup abort request cũ → chỉ request mới được `setState`. POST → server validate → 201 → hook refetch.

### 1.3 Scale → công nghệ
1 user, local, ~10 người, 3 kênh, vài chục tin nhắn → React 19 + Router v7 + Context + Express in-memory. **Không** cần DB, Redux, React Query. (Chi tiết: `project-rules.md` §3.)

### 1.4 API Contract (chốt trước khi code)
Slide có 3 cách đặt path khác nhau (`/api/channels/...`, `/api/forums/.../messages`, `/api/messages/:forum`). **Chốt dùng contract Slide 27:**

```
GET  /api/messages/:forum
  200 → Message[]
  404 → { error: "Unknown forum" }   // forum ∉ {nasa, esports-tribunal, notNasa}

POST /api/messages/:forum
  body: { author: string (1–50), text: string (1–500) }
  400 → { error: "Missing required fields" }
  201 → Message

Message = { id: string (uuid), author: string, text: string, timestamp: ISO string }
```
Validation `author`/`text` dùng **chung luật** ở `client/src/form/validate.js` và `server/validate.js` (parity).

### 1.5 Form Contract
Field: `name` (bắt buộc, ≥ 2 ký tự), `email` (bắt buộc, đúng định dạng), `age` (số nguyên 18–100).
`validateForm(values) → { [field]: message }` — hàm thuần, test được độc lập.

### 1.6 Rủi ro đã biết
- AI sinh cú pháp Router v5 → soát theo `project-rules.md` §4.
- AI dùng `useEffect` để validate → cấm.
- Race condition khi đổi kênh nhanh → AbortController + guard `signal.aborted`.

---

## 2. WBS & lịch commit (15 commit, tối thiểu 10)

### BLOCK 1 — Setup & WBS (0–40')

| # | Task | Output | Commit |
|---|---|---|---|
| 0.1 | Viết rules + WBS (2 file này) | `project-rules.md`, `TASK_DECOMPOSITION.md` | `docs: add project rules and task decomposition` |
| 0.2 | Scaffold `client/` (Vite + React 19 + react-router v7 + Vitest + RTL) và `server/` (Express + cors + supertest), `.env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md` rỗng theo template | Chạy được `npm run dev` + `npm test` ở cả 2 | `chore: scaffold react 19 client and express server` |

**Kiểm tra:** `package.json` có `react@^19`, `react-dom@^19`, `react-router@^7`.

### BLOCK 2 — Sprint 1: Router Migration (40–75') — Ex 1.1, 1.2, 1.2.1, 1.2.2

| # | Task | Chi tiết | Commit |
|---|---|---|---|
| 1.1 | Fail test cho route people | Test: `/people` render danh sách link; `/people/1` render `<dl>` có tên; `/people/xyz` render `role="alert"` 404; NavLink đang chọn có class `active-link` | `test: add failing tests for people routes` |
| 1.2 | **Router layout** (Ex 1.2, 1.2.1) | `App.jsx` dùng `<Routes>` + layout gốc có nav (`NavLink` tới /people, /form, /forum/nasa) + `<Outlet />`. `PeopleLayout.jsx` theo contract Slide 23: sidebar `NavLink` + `<main><Outlet/></main>`. Route `index` của people: "Chọn một người". Route `*` → 404 | `feat: router layout` |
| 1.3 | **Detail route handling** (Ex 1.2.2) | `PersonDetail.jsx`: `useParams`, `people.find`, 404 guard, `<dl>/<dt>/<dd>`. CSS Grid: `grid-template-columns: minmax(280px, 1fr) 2fr`, `@media (max-width: 640px)` về 1 cột | `feat: detail route handling` |
| 1.4 | **Lazy + Suspense** (Ex 1.1) | `React.lazy(() => import('./PersonDetail'))`, `<Suspense fallback={<Skeleton aria-busy="true" aria-live="polite" />}>`. Skeleton có cùng kích thước với `<dl>` thật → CLS = 0 | `perf: lazy load person detail with skeleton fallback` |

**Checkpoint Sprint 1:** Console không warning; reload trực tiếp `/people/2` vẫn chạy; id sai → 404; Network tab thấy chunk PersonDetail tách riêng.

### BLOCK 3 — Sprint 2: Context Form Engine (75–120') — Ex 1.3

| # | Task | Chi tiết | Commit |
|---|---|---|---|
| 2.0 | Phân tích anti-pattern Ex 1.3 | Ghi vào audit/README ngắn: vì sao chuỗi 5 `useEffect` (sync → validate → validity → sync lỗi → scroll) gây 5 render/phím, race condition, "Maximum update depth exceeded". Đây là phần **người dùng tự viết** | (gộp vào 2.1) |
| 2.1 | Fail test validation | Unit test `validateForm` (từng field, cả trường hợp hợp lệ); component test: gõ sai → `aria-invalid="true"` + thông báo; submit hợp lệ → hiện inspector | `test: add failing tests for form validation` |
| 2.2 | **Form context** | `validate.js` (hàm thuần). `FormContext.js`: `createContext(null)` + `useFormContext()` (throw nếu dùng ngoài Provider). `SimpleForm.jsx`: 1 `useState(values)`, `errors = validateForm(values)` trong render, `isValid` derived, Provider value `{ values, errors, handleChange }`. **0 useEffect** | `feat: form context` |
| 2.3 | **Input field validation** | `InputField.jsx` theo Slide 25: `useId()`, `<label htmlFor>`, `aria-invalid`, `aria-describedby`, lỗi `role="alert"`. Lấy value/error/onChange từ context theo `name`. Chỉ hiện lỗi sau khi field đã touched hoặc đã bấm submit (state `touched` cũng là state thường, không effect) | `feat: input field validation` |
| 2.4 | **Inspector output** | `ShowData.jsx`: `<dl className="json-inspector">` từ `Object.entries(data)`. Render khi submit hợp lệ | `feat: inspector output` |

**Checkpoint Sprint 2:** React DevTools Profiler: 1 commit/phím gõ; `grep useEffect client/src/form` → rỗng.

### BLOCK 4 — Sprint 3: Full-Stack Hook & Express API (120–155') — Ex 1.7.1

| # | Task | Chi tiết | Commit |
|---|---|---|---|
| 3.1 | Fail test API | supertest: GET kênh hợp lệ → 200 mảng; kênh lạ → 404; POST thiếu field → 400; POST đúng → 201 có `id`, `timestamp` | `test: add failing tests for messages api` |
| 3.2 | **Express API** | `db.js` in-memory seed 3 kênh `nasa`, `esports-tribunal`, `notNasa`. `server.js`: `express.json()`, `cors({ origin: process.env.CLIENT_ORIGIN })`, GET/POST theo contract §1.4, `crypto.randomUUID()`, error middleware. Port từ `process.env.PORT`. Biến khai báo trong `.env.example` | `feat: express messages api with payload validation` |
| 3.3 | Fail test hook | Mock `fetch`: đổi `forumId` nhanh → request cũ bị abort (`signal.aborted === true`) và data cũ **không** ghi đè data mới | `test: add failing test for forum hook abort` |
| 3.4 | **useForumMessages + channel switcher** | Hook theo Slide 26: `AbortController` trong effect, try/catch/finally có guard `signal.aborted`, set `loading` lại `true` khi đổi kênh, trả `{ data, loading, error, postMessage }`. `postMessage` POST rồi refetch. `ForumPage.jsx`: `NavLink` 3 kênh, list tin dùng `<dl>` + `<React.Fragment key={msg.id}>`, form gửi tin (dùng lại luật validate client). Vite proxy `/api` → server | `feat: forum messages hook with abort and channel switcher` |
| 3.5 | Kiểm chứng Slow 3G | DevTools → Network → Slow 3G → đổi kênh liên tục → request cũ hiện **(canceled)**. Chụp màn hình + ghi log lỗi full-stack vào `docs/verification.md` | `docs: add slow 3g abort verification log` |

### BLOCK 5 — Defense & Audit (155–180')

| # | Task | Commit |
|---|---|---|
| 5.1 | Hoàn thiện `AI_FAILURE_AUDIT.md` từ các lỗi thật đã gặp (người dùng tự viết phần phân tích) | `docs: complete ai failure audit` |
| 5.2 | Tập 4 câu Live Defense (`project-rules.md` §7) | — |

---

## 3. Tổng kết commit

| Block | Số commit |
|---|---|
| Setup | 2 |
| Sprint 1 | 4 |
| Sprint 2 | 4 |
| Sprint 3 | 5 |
| Audit | 1 |
| **Tổng** | **16** (≥ 10 ✔) |

## 4. Prompt mẫu cho AI agent

```
Đọc project-rules.md và TASK_DECOMPOSITION.md ở root repo.
Làm task <số task> theo vòng lặp Contract → Fail test → Implement → Refactor.
Xong thì DỪNG, không commit. Báo: file đã đổi, lệnh để tôi tự kiểm tra,
commit message đề xuất, và mọi chỗ bạn không chắc chắn.
```
