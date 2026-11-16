import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import { createDb, FORUMS } from './db.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

let app;
beforeEach(() => {
  // db mới cho mỗi test → test độc lập, không phụ thuộc thứ tự
  app = createApp({ clientOrigin: 'http://localhost:5173', db: createDb() });
});

describe('db seed', () => {
  it('có đúng 3 kênh theo contract', () => {
    expect(FORUMS).toEqual(['nasa', 'esports-tribunal', 'notNasa']);
  });
});

describe('GET /api/messages/:forum', () => {
  it.each(['nasa', 'esports-tribunal', 'notNasa'])('%s → 200 + mảng Message', async (forum) => {
    const res = await request(app).get(`/api/messages/${forum}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const msg of res.body) {
      expect(msg).toEqual({
        id: expect.any(String),
        author: expect.any(String),
        text: expect.any(String),
        timestamp: expect.any(String),
      });
    }
  });

  it('kênh lạ → 404 { error: "Unknown forum" }', async () => {
    const res = await request(app).get('/api/messages/khong-ton-tai');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Unknown forum' });
  });

  it('tên kênh phân biệt hoa thường (NASA ≠ nasa)', async () => {
    expect((await request(app).get('/api/messages/NASA')).status).toBe(404);
  });
});

describe('POST /api/messages/:forum', () => {
  it('hợp lệ → 201 + Message có id (uuid) và timestamp (ISO)', async () => {
    const res = await request(app)
      .post('/api/messages/nasa')
      .send({ author: 'An', text: 'Xin chào' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ author: 'An', text: 'Xin chào' });
    expect(res.body.id).toMatch(UUID_RE);
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });

  it('tin vừa POST xuất hiện trong GET của đúng kênh đó, không lọt sang kênh khác', async () => {
    const created = (await request(app).post('/api/messages/nasa').send({ author: 'An', text: 'Ping' })).body;
    const nasa = (await request(app).get('/api/messages/nasa')).body;
    const other = (await request(app).get('/api/messages/notNasa')).body;
    expect(nasa).toContainEqual(created);
    expect(other.map((m) => m.id)).not.toContain(created.id);
  });

  it('trim author/text trước khi lưu', async () => {
    const res = await request(app).post('/api/messages/nasa').send({ author: '  An  ', text: '  Hi  ' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ author: 'An', text: 'Hi' });
  });

  it.each([
    ['thiếu cả hai', {}],
    ['thiếu author', { text: 'Hi' }],
    ['thiếu text', { author: 'An' }],
    ['author rỗng', { author: '', text: 'Hi' }],
    ['text chỉ có khoảng trắng', { author: 'An', text: '   ' }],
    ['author không phải string', { author: 123, text: 'Hi' }],
  ])('%s → 400 { error: "Missing required fields" }', async (_label, body) => {
    const res = await request(app).post('/api/messages/nasa').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields' });
  });

  it.each([
    ['author > 50 ký tự', { author: 'a'.repeat(51), text: 'Hi' }],
    ['text > 500 ký tự', { author: 'An', text: 'a'.repeat(501) }],
  ])('%s → 400 có { error }', async (_label, body) => {
    const res = await request(app).post('/api/messages/nasa').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });

  it('biên: author 50 ký tự, text 500 ký tự → 201', async () => {
    const res = await request(app)
      .post('/api/messages/nasa')
      .send({ author: 'a'.repeat(50), text: 'b'.repeat(500) });
    expect(res.status).toBe(201);
  });

  it('kênh lạ → 404, không tạo tin', async () => {
    const res = await request(app).post('/api/messages/khong-ton-tai').send({ author: 'An', text: 'Hi' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Unknown forum' });
  });

  it('body JSON hỏng → 400 có { error }, server không crash', async () => {
    const res = await request(app)
      .post('/api/messages/nasa')
      .set('Content-Type', 'application/json')
      .send('{"author": "An",');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: expect.any(String) });
  });
});
