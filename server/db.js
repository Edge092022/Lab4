import { randomUUID } from 'node:crypto';

// Lưu trữ in-memory theo kênh (đủ cho scale exercise — project-rules §3).
export const FORUMS = ['nasa', 'esports-tribunal', 'notNasa'];

const SEED = {
  nasa: [
    { author: 'Houston', text: 'Chào mừng tới kênh NASA.', timestamp: '2026-01-01T08:00:00.000Z' },
    { author: 'Apollo', text: 'Ai đã xem phóng tàu tuần này chưa?', timestamp: '2026-01-01T08:05:00.000Z' },
  ],
  'esports-tribunal': [
    { author: 'Judge', text: 'Phiên toà esports bắt đầu.', timestamp: '2026-01-02T10:00:00.000Z' },
  ],
  notNasa: [
    { author: 'Skeptic', text: 'Kênh này không phải NASA.', timestamp: '2026-01-03T12:00:00.000Z' },
  ],
};

// Factory: mỗi lần gọi trả db mới → test độc lập, server thật gọi 1 lần.
export function createDb() {
  const db = {};
  for (const forum of FORUMS) {
    db[forum] = SEED[forum].map((msg) => ({ id: randomUUID(), ...msg }));
  }
  return db;
}
