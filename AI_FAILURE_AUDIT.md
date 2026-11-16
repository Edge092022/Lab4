# AI FAILURE AUDIT — Lab 4

> Chiếm 15% điểm lab. Ghi **mọi** đoạn code AI sinh ra mà chạy sai, API không tồn tại (hallucinated), effect loop, lỗ hổng bảo mật, thiếu a11y.
> Mỗi mục phải có phần **kiểm chứng thủ công**: bạn phát hiện bằng cách nào và đã sửa ra sao.

> Công cụ AI: Claude Code (agent trong VS Code). Mỗi mục ghi lại triệu chứng, cách phát hiện (kiểm chứng thủ công) và cách sửa.

## Tổng hợp

| #   | Task           | Loại lỗi                                                        | Mức độ     | Trạng thái                             |
| --- | -------------- | --------------------------------------------------------------- | ---------- | -------------------------------------- |
| 1   | 0.2            | `Khác` — CORS cấu hình sai (bảo mật)                            | Cao        | Đã sửa + có test                       |
| 2   | 0.2            | `Khác` — suýt cài sai major version (react-router v8)           | Cao        | Chặn trước khi cài                     |
| 3   | 0.2            | `Khác` — khai báo `engines` sai so với cờ Node đang dùng        | Trung bình | Đã sửa                                 |
| 4   | 0.2 → lộ ở 1.2 | `Khác` — thiếu cleanup RTL trong scaffold test                  | Trung bình | Đã sửa                                 |
| 5   | 0.2            | `Khác` — lệnh tắt tiến trình quá rộng (`taskkill /IM node.exe`) | Trung bình | Người dùng phát hiện, đã đổi quy trình |
| 6   | 3.3            | `Race condition` — test unmount không bắt được lỗi thiếu guard  | Thấp       | Đã ghi nhận, có test khác bù           |
| 7   | 1.1–1.4        | `Khác` — liệt kê file đã exclude vào kế hoạch commit            | Thấp       | Đã sửa                                 |
| 8   | 1.4            | `Khác` — lazy chunk không có Error Boundary                     | Trung bình | Phát hiện khi kiểm chứng, chưa sửa     |

Loại lỗi: `Router v5 syntax` · `useEffect loop` · `Hallucinated API` · `Hardcoded secret` · `Mongoose callback` · `Missing a11y` · `Race condition` · `Khác`

---

## Mục #1 — `cors({ origin: string })` trả header cho MỌI origin

- **Task / Commit:** 0.2 — `chore: scaffold react 19 client and express server`
- **Prompt đã dùng:** "server/: Express + cors … đọc PORT và CLIENT_ORIGIN từ process.env" + yêu cầu bổ sung: viết test "origin lạ không nhận header Access-Control-Allow-Origin".
- **AI đã sinh ra:** (đúng y cú pháp trong `project-rules.md` §4)
  ```js
  app.use(cors({ origin })); // origin = 'http://localhost:5173'
  ```
- **Triệu chứng:** test đỏ — request với `Origin: http://evil.example.com` vẫn nhận `Access-Control-Allow-Origin: http://localhost:5173`.
  ```
  FAIL app.test.js > CORS > thiếu CLIENT_ORIGIN → dùng mặc định, không mở cho mọi origin
  AssertionError: expected 'http://localhost:5173' to be undefined
  ```
- **Phát hiện bằng:** test supertest `server/app.test.js` (viết trước, chạy đỏ).
- **Cách sửa:**
  ```js
  // Mảng: cors so khớp Origin của request, chỉ gửi header khi khớp
  app.use(cors({ origin: [origin] }));
  ```
  Kèm mặc định `origin = clientOrigin || 'http://localhost:5173'` để thiếu `CLIENT_ORIGIN` không thành `cors({ origin: undefined })` (= mở cho mọi origin).

---

## Mục #2 — `npm i react-router` sẽ cài v8, không phải v7

- **Task / Commit:** 0.2 (phát hiện ở bước lập kế hoạch, trước khi cài)
- **Prompt đã dùng:** "react-router v7 (package "react-router", KHÔNG react-router-dom)"
- **AI đã sinh ra:** kế hoạch ban đầu dự định cài không ghim version:
  ```powershell
  npm i react@^19 react-dom@^19 react-router
  ```
- **Triệu chứng:** `npm view react-router version` → `8.5.1`. Cài như trên sẽ ra v8 → vi phạm §3 (Router v7).
- **Phát hiện bằng:** kiểm tra registry bằng `npm view` trước khi cài.
- **Cách sửa:**
  ```powershell
  npm i react-router@^7      # → 7.18.5
  ```

---

## Mục #3 — `engines: ">=20"` nhưng script dùng cờ chỉ có từ Node 22.9

- **Task / Commit:** 0.2
- **Prompt đã dùng:** như mục #1.
- **AI đã sinh ra:**
  ```json
  "engines": { "node": ">=20" },
  "scripts": { "dev": "node --watch --env-file-if-exists=../.env server.js" }
  ```
- **Triệu chứng:** không lỗi trên máy (Node 22.23), nhưng khai báo hứa chạy được Node 20 trong khi `--env-file-if-exists` không có ở Node 20.
- **Phát hiện bằng:** AI tự rà lại khi kiểm tra script `npm run start`; kiểm tra tài liệu Node về cờ này.
- **Cách sửa:**
  ```json
  "engines": { "node": ">=22.9" }
  ```
  (Nếu buộc chạy Node 20 → dùng gói `dotenv` thay cho cờ.)

---

## Mục #4 — Scaffold test thiếu `cleanup()` của Testing Library

- **Task / Commit:** sinh ở 0.2, lộ ở 1.2 — sửa trong `feat: router layout`
- **Prompt đã dùng:** "client/: … Vitest + @testing-library/react + jsdom"
- **AI đã sinh ra:**
  ```js
  // client/src/setupTests.js
  import "@testing-library/jest-dom/vitest";
  // vite.config.js: test: { environment: 'jsdom', setupFiles: [...] }   (không bật globals)
  ```
- **Triệu chứng:** ở 1.2, các test sau thấy DOM của test trước:
  ```
  TestingLibraryElementError: Found multiple elements with the role "navigation" and name "Điều hướng chính"
  AssertionError: expected [ <main>, …(3) ] to have a length of 1 but got 4
  ```
  Ở 0.2 không lộ vì chỉ có 1 test.
- **Phát hiện bằng:** test đỏ "sai lý do" (không phải do thiếu tính năng) khi chạy `npm test` ở task 1.2.
- **Cách sửa:**
  ```js
  import { afterEach } from "vitest";
  import { cleanup } from "@testing-library/react";
  import "@testing-library/jest-dom/vitest";
  afterEach(() => {
    cleanup();
  });
  ```

---

## Mục #5 — Tắt dev server bằng `taskkill //F //IM node.exe`

- **Task / Commit:** 0.2 (không nằm trong code commit)
- **Prompt đã dùng:** "Chỉ dựng khung chạy được" — AI tự bật dev server để kiểm tra rồi tự tắt.
- **AI đã sinh ra:**
  ```bash
  taskkill //F //IM node.exe
  ```
- **Triệu chứng:** lệnh kill **mọi** tiến trình Node trên máy, không chỉ server AI vừa mở (có thể tắt luôn tiến trình khác của người dùng).
- **Phát hiện bằng:** người dùng đọc lại log lệnh và yêu cầu: "Không dùng taskkill //IM node.exe; chỉ tắt đúng tiến trình bạn đã mở."
- **Cách sửa:**
  ```powershell
  $p = Start-Process node -ArgumentList 'server.js' -PassThru
  # ... kiểm tra ...
  Stop-Process -Id $p.Id
  ```

---

## Mục #6 — Test "unmount" xanh cả khi hook thiếu guard `signal.aborted`

- **Task / Commit:** 3.3 — `test: add failing test for forum hook abort`
- **Prompt đã dùng:** "Mock fetch: đổi forumId nhanh → request cũ bị abort và data cũ không ghi đè data mới"
- **AI đã sinh ra:** test kỳ vọng phát hiện setState sau unmount qua `console.error`:
  ```jsx
  const { unmount } = renderHook(() => useForumMessages("nasa"));
  unmount();
  await act(async () => calls[0].resolve(okJson(NASA)));
  expect(errorSpy).not.toHaveBeenCalled();
  ```
- **Triệu chứng:** khi chạy bộ test với một hook **cố ý thiếu guard** (mutation check), test này vẫn **xanh** → nó không chứng minh được có guard.
- **Phát hiện bằng:** mutation check — tạm viết hook thiếu `if (signal.aborted) return`, chạy test: 2 test race condition đỏ, test unmount xanh.
- **Cách sửa:** giữ test unmount với vai trò kiểm tra `signal.aborted === true`; việc bắt lỗi thiếu guard do 2 test race condition đảm nhiệm (mock fetch cố ý KHÔNG reject khi abort để response "lọt" về muộn).

---

## Mục #7 — Liệt kê `COMMIT_PLAN.md` vào danh sách file commit

- **Task / Commit:** 1.1–1.4 (kế hoạch commit)
- **Prompt đã dùng:** "Sau MỖI task ghi 1 dòng vào COMMIT_PLAN.md: … danh sách file của riêng task đó"
- **AI đã sinh ra:** mỗi dòng 1.x đều có `COMMIT_PLAN.md` trong danh sách file.
- **Triệu chứng:** `git status` không hiện `COMMIT_PLAN.md` — file nằm trong `.git/info/exclude`, sẽ không bao giờ được commit.
- **Phát hiện bằng:** `git check-ignore -v COMMIT_PLAN.md` → `.git/info/exclude:7`.
- **Cách sửa:** bỏ `COMMIT_PLAN.md` khỏi danh sách file các dòng 1.x.

---

## Mục #8 — `React.lazy` + `<Suspense>` nhưng không có Error Boundary

- **Task / Commit:** 1.4 — `perf: lazy load person detail with skeleton fallback`
- **Prompt đã dùng:** "React.lazy(() => import('./PersonDetail')), <Suspense fallback={<Skeleton ... />}>" (theo WBS task 1.4)
- **AI đã sinh ra:** `<Suspense>` bọc `PersonDetail` lazy, không có `ErrorBoundary`; unit test chỉ phủ trường hợp tải thành công.
- **Triệu chứng:** khi dev server tắt đúng lúc chuyển sang `/people/2`, Console báo `Uncaught TypeError: Failed to fetch dynamically imported module: .../PersonDetail.jsx`; `#root` rỗng → toàn bộ app trắng trang.
- **Phát hiện bằng:** kiểm chứng thủ công trên trình duyệt (đọc Console + kiểm tra `document.getElementById('root').innerHTML.length === 0`). Chi tiết: `docs/checkpoints-sprint1-2.md`.
- **Cách sửa (đề xuất):** bọc `<Suspense>` bằng một `ErrorBoundary` hiển thị thông báo + nút thử lại; thêm test mô phỏng `import()` reject.

---
