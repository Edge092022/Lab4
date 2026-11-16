# Verification log — Sprint 3 (Task 3.5)

> Mục tiêu: chứng minh `useForumMessages` huỷ request cũ khi đổi kênh nhanh, và response cũ không ghi đè dữ liệu kênh mới.
> Phần **A** là bằng chứng tự động (đã chạy thật). Phần **B, C** là kiểm chứng thủ công — người dùng tự làm, tự điền, tự chụp.

**Môi trường:** Node v22.23.2 · react@19.3.1 · react-router@7.18.5 · Vite 8 · Express 5
**Ngày kiểm chứng:** <điền>
**Trình duyệt:** <điền, vd Chrome 1xx>

---

## A. Bằng chứng tự động (Vitest, fetch giả điều khiển tay)

Lệnh: `cd client; npx vitest run src/forum/useForumMessages.test.jsx --reporter=verbose`

```
✓ mount: loading=true, fetch đúng URL kèm AbortSignal; resolve → data, loading=false
✓ đổi forumId nhanh: request cũ bị abort VÀ data cũ về muộn KHÔNG ghi đè data mới
✓ response cũ về muộn TRƯỚC response mới: vẫn không ghi đè, loading vẫn true
✓ unmount → abort request đang chạy, response về sau không gây lỗi
✓ AbortError KHÔNG bị coi là error
✓ HTTP lỗi (404) → error là chuỗi từ body, loading=false, data=[]
✓ postMessage: POST JSON đúng URL, rồi REFETCH kênh hiện tại
✓ postMessage bị 400 → promise reject với message từ server, KHÔNG refetch
✓ lỗi mạng → error có nội dung, loading=false (không unhandled rejection)
Tests  9 passed (9)
```

**Kiểm chứng ngược (mutation check, task 3.3):** chạy cùng bộ test với một hook có `AbortController` nhưng **thiếu** guard `if (signal.aborted) return` → 2 test race condition **đỏ**. Kết luận: test thực sự phát hiện được lỗi quên guard, không phải xanh "ăn may".

---

## B. Slow 3G — request cũ hiện `(canceled)`

### Các bước
1. Terminal 1: `cd server; npm run dev` — Terminal 2: `cd client; npm run dev`.
2. Mở `http://localhost:5173/forum/nasa`, mở DevTools → tab **Network**.
3. Lọc `Fetch/XHR`. Bật **Preserve log**.
4. Throttling: chọn **Slow 3G** (hoặc **3G**, tuỳ phiên bản Chrome).
5. Bấm liên tục, nhanh: `esports-tribunal` → `notNasa` → `nasa` → `notNasa` (trước khi request trước kịp về).
6. Quan sát cột **Status** của các request `messages/...`.

### Kỳ vọng
- Mọi request trừ request cuối hiện **(canceled)**.
- Chỉ request cuối (`notNasa`) có status **200**.
- Danh sách tin cuối cùng là của `notNasa` — không nhấp nháy tin kênh khác.
- Trong lúc tải: vùng tin có `aria-busy="true"` (tab Elements), dòng "Đang tải…".

### Kết quả quan sát (người dùng điền)
| Lần bấm | Kênh | Status trong Network | Ghi chú |
|---|---|---|---|
| 1 | esports-tribunal | | |
| 2 | notNasa | | |
| 3 | nasa | | |
| 4 | notNasa | | |

**Ảnh chụp:** `docs/img/slow3g-canceled.png` <!-- chèn: ![Slow 3G canceled](img/slow3g-canceled.png) -->

---

## C. Log lỗi full-stack

Mỗi dòng: thao tác → kỳ vọng → thực tế (Network status + Console).

| # | Thao tác | Kỳ vọng | Thực tế (người dùng điền) |
|---|---|---|---|
| 1 | Mở `/forum/foo` | GET `/api/messages/foo` → **404**, UI hiện `Unknown forum` (role="alert"), form gửi tin ẩn | |
| 2 | Bấm **Gửi tin** khi trống | **Không** có request POST; lỗi "Vui lòng nhập tên." / "Vui lòng nhập nội dung." | |
| 3 | Gửi tin hợp lệ | POST **201** → GET refetch **200** → tin mới hiện trong danh sách | |
| 4 | Gửi bằng tay body sai (`irm ... -Method Post -Body '{}' -ContentType 'application/json'`) | **400** `{ "error": "Missing required fields" }` | |
| 5 | Tắt server rồi đổi kênh | UI hiện lỗi (role="alert"), Console **không** có `Uncaught (in promise)` | |
| 6 | Đổi kênh nhanh lúc Slow 3G (mục B) | Console **0 warning, 0 error** | |

**Console tổng kết:** <điền: số warning / error>

---

## D. Kết luận (người dùng tự viết)

<Viết bằng lời của bạn: abort hoạt động ra sao, guard `signal.aborted` bảo vệ trường hợp nào mà abort một mình không đủ.>
