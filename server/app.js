import express from 'express';
import cors from 'cors';

export const DEFAULT_CLIENT_ORIGIN = 'http://localhost:5173';

export function createApp({ clientOrigin = process.env.CLIENT_ORIGIN } = {}) {
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

  // Error middleware: Express nhận diện nhờ đủ 4 tham số, nên giữ `_next`.
  // Express 5 tự chuyển promise bị reject trong async handler tới đây.
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.expose ? err.message : 'Internal Server Error' });
  });

  return app;
}
