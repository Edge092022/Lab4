import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { createDb } from './db.js';
import { validateMessage } from './validate.js';

export const DEFAULT_CLIENT_ORIGIN = 'http://localhost:5173';

const UNKNOWN_FORUM = { error: 'Unknown forum' };

export function createApp({ clientOrigin = process.env.CLIENT_ORIGIN, db = createDb() } = {}) {
  const origin = clientOrigin || DEFAULT_CLIENT_ORIGIN;
  const app = express();

  // Mảng (không phải string): cors so khớp Origin của request và chỉ trả
  // Access-Control-Allow-Origin khi khớp. String sẽ bị gửi cho MỌI origin.
  app.use(cors({ origin: [origin] }));
  app.use(express.json());

  // Smoke test endpoint — KHÔNG thuộc API contract (§1.4).
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Object.hasOwn, KHÔNG `db[forum]`: tránh khớp nhầm thuộc tính prototype
  // ("constructor", "toString", "__proto__").
  const findForum = (forum) => (Object.hasOwn(db, forum) ? db[forum] : null);

  app.get('/api/messages/:forum', async (req, res) => {
    const messages = findForum(req.params.forum);
    if (!messages) return res.status(404).json(UNKNOWN_FORUM);
    res.json(messages);
  });

  app.post('/api/messages/:forum', async (req, res) => {
    const messages = findForum(req.params.forum);
    if (!messages) return res.status(404).json(UNKNOWN_FORUM);

    const result = validateMessage(req.body);
    if (result.error) return res.status(400).json({ error: result.error });

    const message = { id: randomUUID(), ...result.value, timestamp: new Date().toISOString() };
    messages.push(message);
    res.status(201).json(message);
  });

  // Error middleware: Express nhận diện nhờ đủ 4 tham số, nên giữ `_next`.
  // Express 5 tự chuyển promise bị reject trong async handler tới đây.
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(err); // lỗi client (vd JSON hỏng) không cần log stack
    res.status(status).json({ error: err.expose ? err.message : 'Internal Server Error' });
  });

  return app;
}
