# Verification log — Sprint 3 (Task 3.5)

> Mục tiêu: chứng minh `useForumMessages` huỷ request cũ khi đổi kênh nhanh, và response cũ không ghi đè dữ liệu kênh mới.
> Phần **A** là bằng chứng tự động (đã chạy thật). Phần **B, C** là kiểm chứng thủ công — người dùng tự làm, tự điền, tự chụp.

**Môi trường:** Node v22.23.2 · react@19.3.1 · react-router@7.18.5 · Vite 8 · Express 5
**Ngày kiểm chứng:** 16/11/2026
**Trình duyệt:** Chromium 156.0.8078.75 (browser pane của Claude desktop, chạy trên máy Windows của người làm lab)

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
| 1 | esports-tribunal | `(failed) net::ERR_ABORTED` | bị huỷ khi bấm kênh kế |
| 2 | notNasa | `(failed) net::ERR_ABORTED` | bị huỷ |
| 3 | nasa | `(failed) net::ERR_ABORTED` | bị huỷ |
| 4 | notNasa | **200 OK** | request duy nhất hoàn tất; UI hiện đúng tin của `#notNasa` |

> Lần chạy trên **không bật Slow 3G** (browser pane không có throttling): 4 cú bấm cách nhau ~5 ms, đủ nhanh để 3 request đầu bị abort trước khi server kịp trả.
>
> Quan sát thêm: khi mở thẳng `/forum/foo`, request đầu tiên cũng hiện `ERR_ABORTED` rồi request thứ hai trả 404 — do `<StrictMode>` ở dev chạy effect 2 lần (mount → cleanup → mount), cleanup gọi `abort()` đúng như thiết kế.

**Bằng chứng:** log Network ở bảng trên (đọc trực tiếp từ browser pane). Chưa có ảnh chụp Slow 3G trong Chrome DevTools.

---

## C. Log lỗi full-stack

Mỗi dòng: thao tác → kỳ vọng → thực tế (Network status + Console).

| # | Thao tác | Kỳ vọng | Thực tế (người dùng điền) |
|---|---|---|---|
| 1 | Mở `/forum/foo` | GET `/api/messages/foo` → **404**, UI hiện `Unknown forum` (role="alert"), form gửi tin ẩn | ✅ GET 404; `[role=alert]` = "Unknown forum"; 0 thẻ `<form>` |
| 2 | Bấm **Gửi tin** khi trống | **Không** có request POST; lỗi "Vui lòng nhập tên." / "Vui lòng nhập nội dung." | ✅ 0 request `/api/` mới; 2 lỗi đúng chữ, `aria-invalid="true"` trên `author` và `text` |
| 3 | Gửi tin hợp lệ | POST **201** → GET refetch **200** → tin mới hiện trong danh sách | ✅ POST 201 → GET 200; tin "Edge — Kiem chung Sprint 3" hiện cuối danh sách `#nasa` |
| 4 | Gửi bằng tay body sai (`irm ... -Method Post -Body '{}' -ContentType 'application/json'`) | **400** `{ "error": "Missing required fields" }` | ✅ 400, body `{"error":"Missing required fields"}` (gửi bằng `fetch` từ trang) |
| 5 | Tắt server rồi đổi kênh | UI hiện lỗi (role="alert"), Console **không** có `Uncaught (in promise)` | ✅ Tắt server (Ctrl+C) → đổi sang `esports-tribunal`: Vite proxy trả **502**, UI hiện `HTTP 502` (role="alert"), `aria-busy="false"`; Console chỉ có log mạng `502 (Bad Gateway)`, **không** có `Uncaught`. Ghi chú: qua proxy, server tắt ra 502 chứ không phải lỗi mạng — nhánh "lỗi mạng" của hook được phủ bằng unit test ở mục A |
| 6 | Đổi kênh nhanh lúc Slow 3G (mục B) | Console **0 warning, 0 error** | ✅ (không throttle) 0 warning; không có `Uncaught` |

**Console tổng kết:** 0 warning. 2 dòng error `Failed to load resource: 404` và `... 400` — đây là log mạng mặc định của trình duyệt cho đúng 2 request ở dòng 1 và 4 (lỗi cố ý), **không** phải lỗi JS của app; không có `Uncaught (in promise)`.

---

## D. Kết luận

`controller.abort()` (gọi trong cleanup của `useEffect` khi đổi kênh) dùng để tiết kiệm băng thông và huỷ kết nối mạng — thấy rõ ở mục B: 3 request đầu bị `ERR_ABORTED`. Còn guard `if (signal.aborted) return;` là chốt chặn cuối cùng ở tầng logic JavaScript: kể cả khi response cũ đã về tới nơi đúng lúc vừa đổi kênh (abort không còn kịp huỷ), nó vẫn đảm bảo không bao giờ gọi `setState` từ một request đã hết hiệu lực.
