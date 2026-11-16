import { useCallback, useEffect, useState } from 'react';

const messagesUrl = (forumId) => `/api/messages/${encodeURIComponent(forumId)}`;

async function readJson(res) {
  try {
    return await res.json();
  } catch {
    return null; // body rỗng / không phải JSON
  }
}

/**
 * @param {string} forumId
 * @returns {{ data: Array, loading: boolean, error: string|null, postMessage: (msg: {author: string, text: string}) => Promise<object> }}
 */
export function useForumMessages(forumId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Đổi kênh → reset NGAY TRONG RENDER (pattern "adjust state when a prop changes" của React docs),
  // không reset trong effect: nếu làm trong effect, UI sẽ commit 1 lần với tin của kênh CŨ.
  const [prevForumId, setPrevForumId] = useState(forumId);
  if (forumId !== prevForumId) {
    setPrevForumId(forumId);
    setData([]);
    setLoading(true);
    setError(null);
  }

  // Effect chỉ làm side effect thật: fetch. Mỗi lần chạy có AbortController riêng.
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const res = await fetch(messagesUrl(forumId), { signal });
        const body = await readJson(res);
        if (signal.aborted) return; // response về muộn của request đã bị huỷ → bỏ
        if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
        setData(body);
        setError(null);
      } catch (err) {
        if (signal.aborted || err.name === 'AbortError') return; // huỷ chủ động, không phải lỗi
        setError(err.message || 'Không tải được tin nhắn.');
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    })();
    // IIFE ở trên không bao giờ reject (mọi lỗi đã catch) → không có unhandled rejection.

    return () => controller.abort();
  }, [forumId, reloadKey]);

  const postMessage = useCallback(
    async ({ author, text }) => {
      const res = await fetch(messagesUrl(forumId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text }),
      });
      const body = await readJson(res);
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`); // caller phải catch
      setLoading(true);
      setReloadKey((k) => k + 1); // kích hoạt effect → refetch
      return body;
    },
    [forumId],
  );

  return { data, loading, error, postMessage };
}
