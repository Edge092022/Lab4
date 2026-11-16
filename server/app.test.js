import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp, DEFAULT_CLIENT_ORIGIN } from './app.js';

const ALLOWED = 'http://localhost:5173';
const FOREIGN = 'http://evil.example.com';

describe('GET /api/health (smoke test, không thuộc contract)', () => {
  it('trả 200 và { status: "ok" }', async () => {
    const res = await request(createApp({ clientOrigin: ALLOWED })).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('CORS', () => {
  it('origin hợp lệ nhận Access-Control-Allow-Origin', async () => {
    const res = await request(createApp({ clientOrigin: ALLOWED }))
      .get('/api/health')
      .set('Origin', ALLOWED);
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED);
  });

  it('origin lạ KHÔNG nhận header Access-Control-Allow-Origin', async () => {
    const res = await request(createApp({ clientOrigin: ALLOWED }))
      .get('/api/health')
      .set('Origin', FOREIGN);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('thiếu CLIENT_ORIGIN → dùng mặc định, không mở cho mọi origin', async () => {
    const app = createApp({ clientOrigin: undefined });
    const foreign = await request(app).get('/api/health').set('Origin', FOREIGN);
    expect(foreign.headers['access-control-allow-origin']).toBeUndefined();

    const def = await request(app).get('/api/health').set('Origin', DEFAULT_CLIENT_ORIGIN);
    expect(def.headers['access-control-allow-origin']).toBe(DEFAULT_CLIENT_ORIGIN);
  });
});
