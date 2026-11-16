import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForumMessages } from './useForumMessages.js';

// fetch giả, điều khiển tay: mỗi lần gọi trả một promise ta tự resolve/reject sau.
// CỐ Ý không tự reject khi signal abort → mô phỏng response về muộn "lọt" qua abort,
// để test bắt được trường hợp hook quên guard `signal.aborted` trước setState.
function createFetchMock() {
  const calls = [];
  const fetchMock = vi.fn((url, init = {}) => {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    calls.push({ url, init, signal: init.signal, resolve, reject });
    return promise;
  });
  return { fetchMock, calls };
}

const okJson = (body) => ({ ok: true, status: 200, json: async () => body });
const msg = (id, text) => ({ id, author: 'A', text, timestamp: '2026-01-01T00:00:00.000Z' });

const NASA = [msg('n1', 'nasa-1')];
const NOT_NASA = [msg('x1', 'not-nasa-1')];

let calls;
beforeEach(() => {
  const mock = createFetchMock();
  calls = mock.calls;
  vi.stubGlobal('fetch', mock.fetchMock);
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useForumMessages', () => {
  it('mount: loading=true, fetch đúng URL kèm AbortSignal; resolve → data, loading=false', async () => {
    const { result } = renderHook(() => useForumMessages('nasa'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe('/api/messages/nasa');
    expect(calls[0].signal).toBeInstanceOf(AbortSignal);

    await act(async () => calls[0].resolve(okJson(NASA)));
    expect(result.current.data).toEqual(NASA);
    expect(result.current.loading).toBe(false);
  });

  it('đổi forumId nhanh: request cũ bị abort VÀ data cũ về muộn KHÔNG ghi đè data mới', async () => {
    const { result, rerender } = renderHook(({ id }) => useForumMessages(id), {
      initialProps: { id: 'nasa' },
    });
    const oldReq = calls[0];

    rerender({ id: 'notNasa' });
    expect(oldReq.signal.aborted).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[1].url).toBe('/api/messages/notNasa');
    expect(calls[1].signal.aborted).toBe(false);

    // kênh mới trả về trước
    await act(async () => calls[1].resolve(okJson(NOT_NASA)));
    expect(result.current.data).toEqual(NOT_NASA);

    // response cũ về muộn → phải bị bỏ qua
    await act(async () => oldReq.resolve(okJson(NASA)));
    expect(result.current.data).toEqual(NOT_NASA);
    expect(result.current.loading).toBe(false);
  });

  it('response cũ về muộn TRƯỚC response mới: vẫn không ghi đè, loading vẫn true', async () => {
    const { result, rerender } = renderHook(({ id }) => useForumMessages(id), {
      initialProps: { id: 'nasa' },
    });
    await act(async () => calls[0].resolve(okJson(NASA)));
    rerender({ id: 'notNasa' });

    // đổi kênh → loading bật lại, data kênh cũ không còn hiển thị
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);

    // request thứ 2 (notNasa) chưa về; nếu có response "lạc" của kênh cũ thì cũng không được dùng
    rerender({ id: 'nasa' });
    const staleNotNasa = calls[1];
    await act(async () => staleNotNasa.resolve(okJson(NOT_NASA)));
    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);

    await act(async () => calls[2].resolve(okJson(NASA)));
    expect(result.current.data).toEqual(NASA);
    expect(result.current.loading).toBe(false);
  });

  it('unmount → abort request đang chạy, response về sau không gây lỗi', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = renderHook(() => useForumMessages('nasa'));
    unmount();
    expect(calls[0].signal.aborted).toBe(true);
    await act(async () => calls[0].resolve(okJson(NASA)));
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('AbortError KHÔNG bị coi là error', async () => {
    const { result, rerender } = renderHook(({ id }) => useForumMessages(id), {
      initialProps: { id: 'nasa' },
    });
    const oldReq = calls[0];
    rerender({ id: 'notNasa' });
    await act(async () => oldReq.reject(new DOMException('The operation was aborted.', 'AbortError')));
    expect(result.current.error).toBeNull();
  });

  it('HTTP lỗi (404) → error là chuỗi từ body, loading=false, data=[]', async () => {
    const { result } = renderHook(() => useForumMessages('foo'));
    await act(async () =>
      calls[0].resolve({ ok: false, status: 404, json: async () => ({ error: 'Unknown forum' }) }),
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Unknown forum');
    expect(result.current.data).toEqual([]);
  });

  it('postMessage: POST JSON đúng URL, rồi REFETCH kênh hiện tại', async () => {
    const { result } = renderHook(() => useForumMessages('nasa'));
    await act(async () => calls[0].resolve(okJson(NASA)));

    const created = msg('n2', 'mới');
    let postPromise;
    act(() => {
      postPromise = result.current.postMessage({ author: 'An', text: 'mới' });
    });
    expect(calls[1].url).toBe('/api/messages/nasa');
    expect(calls[1].init.method).toBe('POST');
    expect(calls[1].init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(JSON.parse(calls[1].init.body)).toEqual({ author: 'An', text: 'mới' });

    await act(async () => {
      calls[1].resolve({ ok: true, status: 201, json: async () => created });
      await postPromise;
    });
    expect(calls).toHaveLength(3); // refetch
    expect(calls[2].url).toBe('/api/messages/nasa');
    await act(async () => calls[2].resolve(okJson([...NASA, created])));
    expect(result.current.data).toEqual([...NASA, created]);
  });

  it('postMessage bị 400 → promise reject với message từ server, KHÔNG refetch', async () => {
    const { result } = renderHook(() => useForumMessages('nasa'));
    await act(async () => calls[0].resolve(okJson(NASA)));

    let postPromise;
    act(() => {
      postPromise = result.current.postMessage({ author: '', text: '' });
    });
    calls[1].resolve({ ok: false, status: 400, json: async () => ({ error: 'Missing required fields' }) });
    await expect(postPromise).rejects.toThrow('Missing required fields');
    expect(calls).toHaveLength(2);
    expect(result.current.data).toEqual(NASA);
  });

  it('lỗi mạng → error có nội dung, loading=false (không unhandled rejection)', async () => {
    const { result } = renderHook(() => useForumMessages('nasa'));
    await act(async () => calls[0].reject(new TypeError('Failed to fetch')));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(expect.any(String));
    expect(result.current.error).not.toBe('');
  });
});
