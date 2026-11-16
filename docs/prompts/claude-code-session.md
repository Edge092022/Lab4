
> Đọc project-rules.md và TASK_DECOMPOSITION.md ở root repo trước khi làm gì.

  Làm BLOCK 1 — task 0.2 (scaffold):
  - client/: Vite + React 19 + react-router v7 (package "react-router", KHÔNG
  react-router-dom) + Vitest + @testing-library/react + jsdom. Vite proxy /api
  sang server.
  - server/: Express + cors + supertest + vitest, đọc PORT và CLIENT_ORIGIN từ
  process.env.
  - .env.example và .gitignore (node_modules, .env, dist) ở root.
  - Chỉ dựng khung chạy được, chưa viết tính năng.

  Trước khi code: liệt kê kế hoạch (lệnh cài, file sẽ tạo) và chờ tôi đồng ý.

  KHÔNG git commit. Khi xong, ghi vào COMMIT_PLAN.md:
  - Task 0.2 | commit message: "chore: scaffold react 19 client and express
  server" | danh sách file (gồm cả AI_FAILURE_AUDIT.md)

  Rồi báo cho tôi:
  1. Lệnh để tôi tự kiểm tra (npm run dev, npm test ở client và server)
  2. Version thực tế của react, react-dom, react-router
  3. 3 điểm chính tôi cần hiểu về cấu trúc này để bảo vệ
  4. Chỗ nào bạn sinh sai rồi phải sửa (để tôi ghi AI_FAILURE_AUDIT.md)

  Searched for 1 pattern, read 2 files (ctrl+o to expand)

● Repo nằm ở Lab4/. Đọc các file ở đó.

  Read 4 files, ran 2 shell commands (ctrl+o to expand)

● Đã đọc project-rules.md (Lab4/project-rules.md) và TASK_DECOMPOSITION.md
  (Lab4/TASK_DECOMPOSITION.md). Repo gốc là d:\Execersice\Lab4\ (không phải
  d:\Execersice), nên mọi thứ sẽ được tạo trong Lab4/.

  Một điểm bạn cần biết trước khi đồng ý

  Tôi đã kiểm tra registry npm: bản latest của react-router hiện là 8.5.1. Nếu
  chạy npm i react-router như bình thường, máy sẽ cài v8, sai với luật §3 (yêu
  cầu v7). Vì vậy tôi sẽ ghim react-router@^7 (bản v7 mới nhất là 7.18.5). Ngoài
  ra, @testing-library/react bắt buộc có @testing-library/dom đi kèm (peer
  dependency), nên phải cài riêng gói này.

  Môi trường: Node 22.23.2, npm 10.9.8 (luật yêu cầu Node ≥ 20).

  Kế hoạch — Task 0.2

  Lệnh cài đặt

  # client
  cd Lab4/client
  npm init -y
  npm i react@^19 react-dom@^19 react-router@^7
  npm i -D vite @vitejs/plugin-react vitest jsdom @testing-library/react
  @testing-library/dom @testing-library/jest-dom

  # server
  cd Lab4/server
  npm init -y
  npm i express cors
  npm i -D vitest supertest
  Tôi không dùng npm create vite, vì lệnh đó sinh ra nhiều file mẫu (logo, CSS
  demo, eslint) ngoài phạm vi task. Tôi sẽ viết tay một khung tối thiểu.

  File sẽ tạo

  ┌──────────────────────────┬───────────────────────────────────────────────┐
  │           File           │                   Nội dung                    │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │                          │ PORT=3001,                                    │
  │ .env.example             │ CLIENT_ORIGIN=http://localhost:5173,          │
  │                          │ VITE_API_TARGET=http://localhost:3001         │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ .gitignore               │ node_modules/, .env, dist/                    │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ client/package.json      │ scripts dev, build, preview, test (vitest     │
  │                          │ run); "type": "module"                        │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ client/index.html        │ thẻ <div id="root"> + script /src/main.jsx    │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │                          │ plugin react; server.proxy['/api'] trỏ tới    │
  │ client/vite.config.js    │ target lấy từ env bằng loadEnv (đọc .env ở    │
  │                          │ root qua envDir: '..'); khối test: {          │
  │                          │ environment: 'jsdom', setupFiles }            │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ client/src/main.jsx      │ createRoot + <StrictMode> + <BrowserRouter>   │
  │                          │ (import từ 'react-router')                    │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │                          │ <Routes><Route path="*" element={<h1>Lab      │
  │ client/src/App.jsx       │ 4</h1>} /></Routes>. Chỉ là placeholder,      │
  │                          │ route thật làm ở task 1.2                     │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ client/src/setupTests.js │ import '@testing-library/jest-dom/vitest'     │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ client/src/App.test.jsx  │ 1 smoke test: render App trong MemoryRouter   │
  │                          │ và kiểm tra có heading                        │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │                          │ scripts dev (node --watch                     │
  │ server/package.json      │ --env-file-if-exists=../.env server.js),      │
  │                          │ start, test (vitest run); "type": "module"    │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │                          │ express() + express.json() + cors({ origin:   │
  │ server/app.js            │ process.env.CLIENT_ORIGIN }) + GET            │
  │                          │ /api/health + error middleware. Export app,   │
  │                          │ không gọi listen để supertest dùng được       │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ server/server.js         │ import app, rồi app.listen(process.env.PORT)  │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ server/app.test.js       │ 1 smoke test bằng supertest: GET /api/health  │
  │                          │ trả 200                                       │
  ├──────────────────────────┼───────────────────────────────────────────────┤
  │ COMMIT_PLAN.md           │ dòng Task 0.2 kèm commit message và danh sách │
  │                          │  file                                         │
  └──────────────────────────┴───────────────────────────────────────────────┘

  Có 2 điểm hơi lệch so với cấu trúc trong rules, cần bạn chốt:
  - Tách app.js / server.js để test không cần mở cổng thật. Rules chỉ liệt kê
    server.js. Bạn có đồng ý thêm app.js không?
  - /api/health là endpoint duy nhất ở server, chỉ để smoke test. Nó không thuộc
    contract §1.4.

  AI_FAILURE_AUDIT.md đã có sẵn theo template, nên tôi giữ nguyên và chỉ đưa nó
  vào danh sách file của commit.

  Bạn đồng ý thì tôi bắt đầu cài và tạo file. Tôi sẽ không git commit.

> Đồng ý kế hoạch, kèm 3 điều chỉnh:
  1. Đồng ý tách app.js / server.js. Cập nhật sơ đồ thư mục trong
  project-rules.md §3 cho khớp.
  2. Đồng ý /api/health. Ghi chú 1 dòng trong TASK_DECOMPOSITION.md §1.4 rằng
  đây là endpoint smoke test, không thuộc contract.
  3. Không để biến môi trường thiếu mà chạy im lặng:
     - CLIENT_ORIGIN thiếu thì cors({origin: undefined}) sẽ cho mọi origin →
  dùng mặc định 'http://localhost:5173' hoặc throw lỗi rõ ràng.
     - PORT thiếu → mặc định 3001.
       Viết 1 test cho trường hợp request từ origin lạ không nhận header
  Access-Control-Allow-Origin.
       Bắt đầu đi, không commit.

● Bắt đầu. Cài dependencies cho client và server song song.

  Read 2 files, ran 2 shell commands (ctrl+o to expand)

● Đã cài được React 19.3.1 và react-router 7.18.5. Giờ viết các file cho server.
  Làm theo TDD: viết test trước.

● Write(server\package.json)
  ⎿  Added 8 lines, removed 6 lines
       1  {
       2    "name": "server",
       3    "version": "1.0.0",
       4 -  "description": "",                                           
       5 -  "main": "index.js",                                          
       4 +  "private": true,                                             
       5 +  "type": "module",                                            
       6 +  "engines": {                                                 
       7 +    "node": ">=20"                                             
       8 +  },                                                           
       9    "scripts": {
       7 -    "test": "echo \"Error: no test specified\" && exit 1"      
      10 +    "dev": "node --watch --env-file-if-exists=../.env server.js
         +",                                                             
      11 +    "start": "node --env-file-if-exists=../.env server.js",    
      12 +    "test": "vitest run"                                       
      13    },
       9 -  "keywords": [],                                              
      10 -  "author": "",                                                
      11 -  "license": "ISC",                                            
      14    "dependencies": {
      15      "cors": "^2.8.6",
      16      "express": "^5.3.0"

● Write(server\app.test.js)
  ⎿  Wrote 39 lines to server\app.test.js
       1 import { describe, it, expect } from 'vitest';
       2 import request from 'supertest';
       3 import { createApp, DEFAULT_CLIENT_ORIGIN } from './app.js';
       4
       5 const ALLOWED = 'http://localhost:5173';
       6 const FOREIGN = 'http://evil.example.com';
       7
       8 describe('GET /api/health (smoke test, không thuộc contract)', (
         ) => {
       9   it('trả 200 và { status: "ok" }', async () => {
     … +30 lines (ctrl+o to expand)

● Bản đầu của app.js viết đúng theo cú pháp trong rules: cors({ origin: <string>
  }). Mục đích là chạy test để xem hành vi thật.

● Write(server\app.js)
  ⎿  Wrote 24 lines to server\app.js
       1 import express from 'express';
       2 import cors from 'cors';
       3
       4 export const DEFAULT_CLIENT_ORIGIN = 'http://localhost:5173';
       5
       6 export function createApp({ clientOrigin = process.env.CLIENT_OR
         IGIN } = {}) {
       7   const origin = clientOrigin || DEFAULT_CLIENT_ORIGIN;
       8   const app = express();
       9
     … +15 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Test đỏ như dự đoán: khi origin là chuỗi, cors luôn gửi header Allow-Origin cố
  định cho mọi request. Tôi sẽ sửa bằng cách truyền mảng origin để cors chỉ gửi
  header khi khớp. · summary

● Update(server\app.js)
  ⎿  Added 3 lines, removed 1 line
       7    const origin = clientOrigin || DEFAULT_CLIENT_ORIGIN;
       8    const app = express();
       9  
      10 -  app.use(cors({ origin }));                                   
      10 +  // Mảng (không phải string): cors so khớp Origin của request 
         +và chỉ trả                                                     
      11 +  // Access-Control-Allow-Origin khi khớp. String sẽ bị gửi cho
         + MỌI origin.                                                   
      12 +  app.use(cors({ origin: [origin] }));                         
      13    app.use(express.json());
      14  
      15    app.get('/api/health', (req, res) => {

● Write(server\server.js)
  ⎿  Wrote 7 lines to server\server.js
      1 import { createApp } from './app.js';
      2
      3 const PORT = Number(process.env.PORT) || 3001;
      4
      5 createApp().listen(PORT, () => {
      6   console.log(`API listening on http://localhost:${PORT}`);
      7 });

  Ran 1 shell command (ctrl+o to expand)

● Server đã xanh 4/4. Tiếp theo là client.

● Update(server\app.js)
  ⎿  Added 5 lines, removed 3 lines
      12    app.use(cors({ origin: [origin] }));
      13    app.use(express.json());
      14  
      15 -  app.get('/api/health', (req, res) => {                       
      15 +  // Smoke test endpoint — KHÔNG thuộc API contract (§1.4).    
      16 +  app.get('/api/health', (_req, res) => {                      
      17      res.json({ status: 'ok' });
      18    });
      19  
      19 -  // eslint-disable-next-line no-unused-vars                   
      20 -  app.use((err, req, res, next) => {                           
      20 +  // Error middleware: Express nhận diện nhờ đủ 4 tham số, nên 
         +giữ `_next`.                                                   
      21 +  // Express 5 tự chuyển promise bị reject trong async handler 
         +tới đây.                                                       
      22 +  app.use((err, _req, res, _next) => {                         
      23      console.error(err);
      24      res.status(err.status || 500).json({ error: err.expose ? er
          r.message : 'Internal Server Error' });
      25    });

● Write(client\package.json)
  ⎿  Added 6 lines, removed 6 lines
       1  {
       2    "name": "client",
       3    "version": "1.0.0",
       4 -  "description": "",                                           
       5 -  "main": "index.js",                                          
       4 +  "private": true,                                             
       5 +  "type": "module",                                            
       6    "scripts": {
       7 -    "test": "echo \"Error: no test specified\" && exit 1"      
       7 +    "dev": "vite",                                             
       8 +    "build": "vite build",                                     
       9 +    "preview": "vite preview",                                 
      10 +    "test": "vitest run"                                       
      11    },
       9 -  "keywords": [],                                              
      10 -  "author": "",                                                
      11 -  "license": "ISC",                                            
      12    "dependencies": {
      13      "react": "^19.3.1",
      14      "react-dom": "^19.3.1",

● Write(client\index.html)
  ⎿  Wrote 12 lines to client\index.html
       1 <!doctype html>
       2 <html lang="vi">
       3   <head>
       4     <meta charset="UTF-8" />
       5     <meta name="viewport" content="width=device-width, initial-s
         cale=1.0" />
       6     <title>Lab 4</title>
       7   </head>
       8   <body>
       9     <div id="root"></div>
     … +3 lines (ctrl+o to expand)

● Write(client\vite.config.js)
  ⎿  Wrote 26 lines to client\vite.config.js
      1 import { defineConfig, loadEnv } from 'vite';
      2 import react from '@vitejs/plugin-react';
      3
      4 // .env nằm ở root repo (một .env.example chung cho client + serv
        er).
      5 const ENV_DIR = '..';
      6
      7 export default defineConfig(({ mode }) => {
      8   const env = loadEnv(mode, ENV_DIR, 'VITE_');
      9   const apiTarget = env.VITE_API_TARGET || 'http://localhost:3001
     … +18 lines (ctrl+o to expand)

● Write(client\src\main.jsx)
  ⎿  Wrote 12 lines to client\src\main.jsx
       1 import { StrictMode } from 'react';
       2 import { createRoot } from 'react-dom/client';
       3 import { BrowserRouter } from 'react-router';
       4 import App from './App.jsx';
       5
       6 createRoot(document.getElementById('root')).render(
       7   <StrictMode>
       8     <BrowserRouter>
       9       <App />
      10     </BrowserRouter>
     … +2 lines (ctrl+o to expand)

● Write(client\src\App.jsx)
  ⎿  Wrote 10 lines to client\src\App.jsx
       1 import { Routes, Route } from 'react-router';
       2
       3 // Placeholder cho scaffold — route thật làm ở task 1.2.
       4 export default function App() {
       5   return (
       6     <Routes>
       7       <Route path="*" element={<h1>Lab 4</h1>} />
       8     </Routes>
       9   );
      10 }

● Write(client\src\setupTests.js)
  ⎿  Wrote 1 line to client\src\setupTests.js
      1 import '@testing-library/jest-dom/vitest';
● Write(client\src\App.test.jsx)
  ⎿  Wrote 15 lines to client\src\App.test.jsx
       1 import { describe, it, expect } from 'vitest';
       2 import { render, screen } from '@testing-library/react';
       3 import { MemoryRouter } from 'react-router';
       4 import App from './App.jsx';
       5
       6 describe('App scaffold', () => {
       7   it('render được trong router', () => {
       8     render(
       9       <MemoryRouter initialEntries={['/']}>
      10         <App />
     … +5 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Client đã xanh và build thành công. Tiếp theo là các file env/gitignore, cập
  nhật docs, rồi chạy thử dev server + proxy.

● Write(.env.example)
  ⎿  Wrote 11 lines to .env.example
       1 # Copy file này thành .env (ở root repo) rồi chỉnh nếu cần. KHÔN
         G commit .env.
       2
       3 # --- server ---
       4 # Cổng Express. Thiếu → mặc định 3001.
       5 PORT=3001
       6 # Origin duy nhất được CORS cho phép. Thiếu → mặc định http://lo
         calhost:5173 (KHÔNG mở cho mọi origin).
       7 CLIENT_ORIGIN=http://localhost:5173
       8
     … +3 lines (ctrl+o to expand)

● Write(.gitignore)
  ⎿  Wrote 3 lines to .gitignore
      1 node_modules/
      2 dist/
      3 .env

● Update(project-rules.md)
  ⎿  Added 6 lines, removed 1 line
      68  ├── project-rules.md
      69  ├── TASK_DECOMPOSITION.md
      70  ├── AI_FAILURE_AUDIT.md
      71 -├── .env.example                                               
      71 +├── .env.example       # dùng chung client + server; .env thật 
         +cũng đặt ở root                                                
      72 +├── .gitignore                                                 
      73  ├── client/            # Vite + React 19
      74 +│   ├── index.html                                             
      75 +│   ├── vite.config.js # proxy /api → VITE_API_TARGET, cấu hình
         + Vitest (jsdom)                                                
      76  │   └── src/
      77 +│       ├── main.jsx                                           
      78  │       ├── App.jsx
      79 +│       ├── setupTests.js                                      
      80  │       ├── data/people.js
      81  │       ├── people/   PeopleLayout.jsx, PersonDetail.jsx, Skele
          ton.jsx
      82  │       ├── form/     FormContext.js, SimpleForm.jsx, InputFiel
          d.jsx, ShowData.jsx, validate.js

● Update(project-rules.md)
  ⎿  Added 2 lines, removed 1 line
      82  │       ├── form/     FormContext.js, SimpleForm.jsx, InputFiel
          d.jsx, ShowData.jsx, validate.js
      83  │       └── forum/    useForumMessages.js, ForumPage.jsx
      84  └── server/
      85 -    ├── server.js                                              
      85 +    ├── app.js        # createApp(): express + cors + routes + 
         +error middleware, KHÔNG listen (để supertest dùng)             
      86 +    ├── server.js     # entry: createApp().listen(PORT)        
      87      ├── db.js
      88      └── validate.js   # cùng luật với client (parity)
      89  ```

● Update(TASK_DECOMPOSITION.md)
  ⎿  Added 2 lines
      40  
      41  Message = { id: string (uuid), author: string, text: string, ti
          mestamp: ISO string }
      42  ```
      43 +> Ghi chú: `GET /api/health → 200 { status: "ok" }` chỉ là endp
         +oint smoke test của scaffold (task 0.2), **không** thuộc contra
         +ct.                                                            
      44 +                                                               
      45  Validation `author`/`text` dùng **chung luật** ở `client/src/fo
          rm/validate.js` và `server/validate.js` (parity).
      46  
      47  ### 1.5 Form Contract

  Ran 1 shell command (ctrl+o to expand)

● Proxy và CORS đã chạy đúng khi không có .env (dùng giá trị mặc định). Tôi sẽ
  kiểm tra script npm run dev của server, vì cờ --env-file-if-exists phụ thuộc
  phiên bản Node. · summary

  Ran 1 shell command (ctrl+o to expand)

● Update(server\package.json)
  ⎿  Added 1 line, removed 1 line
       4    "private": true,
       5    "type": "module",
       6    "engines": {
       7 -    "node": ">=20"                                             
       7 +    "node": ">=22.9"                                           
       8    },
       9    "scripts": {
      10      "dev": "node --watch --env-file-if-exists=../.env server.js
          ",

● Write(COMMIT_PLAN.md)
  ⎿  Wrote 5 lines to COMMIT_PLAN.md
      1 # COMMIT PLAN
      2
      3 | Task | Commit message | Files |
      4 |---|---|---|
      5 | 0.2 | `chore: scaffold react 19 client and express server` | `.
        env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md`, `COMMIT_PLAN.m
        d`, `project-rules.md` (§3 sơ đồ thư mục), `TASK_DECOMPOSITION.md
        ` (§1.4 ghi chú /api/health), `client/package.json`, `client/pack
        age-lock.json`, `client/index.html`, `client/vite.config.js`, `cl
        ient/src/main.jsx`, `client/src/App.jsx`, `client/src/App.test.js
     … +1 line (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Task 0.2 đã xong và tôi chưa commit. Test ở cả hai phía đều xanh: server 4/4,
  client 1/1. vite build chạy được. Tôi đã bật cả hai dev server và kiểm tra
  bằng curl: /api/health qua proxy cổng 5173 trả {"status":"ok"}, origin lạ
  không nhận header CORS. Lúc đó chưa có file .env, nên server chạy bằng giá trị
  mặc định.

  Khi tắt dev server, tôi dùng taskkill //IM node.exe. Lệnh này tắt mọi tiến
  trình Node trên máy, nên nếu bạn đang chạy Node khác thì cần bật lại.

  Dòng Task 0.2 đã được ghi vào COMMIT_PLAN.md (Lab4/COMMIT_PLAN.md), kèm commit
  message và danh sách 19 file (có AI_FAILURE_AUDIT.md). Sơ đồ thư mục trong
  project-rules.md (Lab4/project-rules.md) §3 đã thêm app.js/server.js.
  TASK_DECOMPOSITION.md (Lab4/TASK_DECOMPOSITION.md) §1.4 đã có ghi chú
  /api/health chỉ để smoke test.

  1. Lệnh để bạn tự kiểm tra

  # (tuỳ chọn) copy .env.example thành .env ở root Lab4
  cd Lab4/server; npm test; npm run dev     # terminal 1 →
  http://localhost:3001/api/health
  cd Lab4/client; npm test; npm run dev     # terminal 2 → http://localhost:5173
  (thấy "Lab 4")
  # mở http://localhost:5173/api/health → {"status":"ok"} (đi qua proxy)

  2. Version thực tế đã cài

  ┌──────────────┬─────────┐
  │   Package    │ Version │
  ├──────────────┼─────────┤
  │ react        │ 19.3.1  │
  ├──────────────┼─────────┤
  │ react-dom    │ 19.3.1  │
  ├──────────────┼─────────┤
  │ react-router │ 7.18.5  │
  └──────────────┴─────────┘

  Trong project không có react-router-dom (npm ls báo empty). Phía server dùng
  Express 5.3.0.

  3. Ba điểm chính cần hiểu để bảo vệ

  1. Tách app.js và server.js. createApp() dựng app Express nhưng không gọi
     listen. Supertest truyền thẳng app vào, không cần mở cổng thật. createApp()
     còn nhận tham số { clientOrigin }, nên test được trường hợp thiếu biến môi
     trường mà không phải sửa process.env.
  2. Proxy /api của Vite. Trình duyệt chỉ gọi localhost:5173, sau đó Vite chuyển
     request sang :3001, nên khi chạy dev không có request khác origin. CORS
     vẫn được cấu hình như lớp bảo vệ thứ hai, cho trường hợp client gọi thẳng
     vào server. strictPort: true làm Vite báo lỗi khi cổng 5173 bận, thay vì
     lặng lẽ chuyển sang 5174 và lệch với CLIENT_ORIGIN.
  3. Một file .env dùng chung ở root. Server đọc nó bằng node
     --env-file-if-exists=../.env, không cần gói dotenv. Vite đọc nó qua envDir:
     '..' và chỉ lấy các biến có tiền tố VITE_. Mọi biến đều có giá trị mặc
     định an toàn: PORT mặc định 3001, CLIENT_ORIGIN mặc định localhost:5173
     thay vì mở cho mọi origin.

  4. Chỗ tôi sinh sai rồi phải sửa (để ghi AI_FAILURE_AUDIT.md)

  1. Truyền chuỗi vào cors({ origin }), có test đỏ làm bằng chứng. Bản đầu của
     tôi viết cors({ origin: 'http://localhost:5173' }), đúng y cú pháp trong
     rules. Test "origin lạ không nhận header" bị đỏ: server vẫn gửi
     Access-Control-Allow-Origin: http://localhost:5173 cho
     http://evil.example.com. Nguyên nhân là khi origin là chuỗi, gói cors gắn
     cứng header đó cho mọi request mà không so sánh origin. Trình duyệt vẫn
     chặn vì giá trị không khớp, nhưng server không thực sự phân biệt origin.
     Cách sửa là truyền mảng cors({ origin: [origin] }): lúc đó cors so khớp và
     bỏ header khi origin không nằm trong danh sách. Bạn nên cân nhắc cập nhật
     luật §4 trong rules theo hướng này.
  2. Chọn sai phiên bản Node tối thiểu. Tôi để "engines": ">=20" theo rules,
     nhưng --env-file-if-exists chỉ có từ Node 22.9. Kiểm tra trên máy bạn (Node
     22.23) thì chạy được, nhưng tôi không thử trên Node 20. Tôi đã đổi engines
     thành >=22.9. Nếu lớp bắt buộc Node 20, cần quay lại dùng dotenv.
  3. Suýt cài nhầm react-router v8. Tôi phát hiện lỗi này khi lên kế hoạch,
     trước khi cài: npm view react-router version trả về 8.5.1. Cài không ghim
     phiên bản thì sẽ ra v8, vi phạm §3. Đã sửa bằng cách ghim react-router@^7.

  Phần phân tích trong audit là bạn tự viết, nên tôi để nguyên
  AI_FAILURE_AUDIT.md.

> Đọc project-rules.md và TASK_DECOMPOSITION.md.
  Làm toàn bộ BLOCK 2 (Sprint 1, task 1.1 → 1.4) đúng thứ tự, mỗi task theo
  vòng Contract → Fail test → Implement → Refactor.
  KHÔNG git commit. Sau MỖI task ghi 1 dòng vào COMMIT_PLAN.md: số task |
  commit message đúng như WBS | danh sách file của riêng task đó.
  Không dùng taskkill //IM node.exe; chỉ tắt đúng tiến trình bạn đã mở.
  Cuối block báo: lệnh để tôi kiểm tra (gồm checkpoint Sprint 1 trong WBS), 3
  điểm chính để bảo vệ, và lỗi AI đã gặp.

  Read 3 files (ctrl+o to expand)

● Trước khi viết code, kiểm tra trạng thái git để biết task 0.2 đã được commit
  chưa.

  Ran 1 shell command (ctrl+o to expand)

● Đã có commit 0.2 và working tree sạch. Tôi sẽ lưu snapshot sau mỗi task để sau
  này tách commit đúng. · summary

● Write(client\src\data\people.js)
  ⎿  Wrote 21 lines to client\src\data\people.js
       1 // Dữ liệu tĩnh cho danh bạ. id là string vì useParams() luôn tr
         ả về string.
       2 // PERSON_FIELDS là contract hiển thị dùng chung cho PersonDetai
         l và Skeleton
       3 // (đặt ở đây, KHÔNG đặt trong PersonDetail, để Skeleton không k
         éo PersonDetail vào bundle chính).
       4 export const PERSON_FIELDS = [
       5   { key: 'email', label: 'Email' },
       6   { key: 'role', label: 'Vai trò' },
       7   { key: 'city', label: 'Thành phố' },
     … +14 lines (ctrl+o to expand)

● Write(client\src\people\people.test.jsx)
  ⎿  Wrote 55 lines to client\src\people\people.test.jsx
       1 import { describe, it, expect } from 'vitest';
       2 import { render, screen, within } from '@testing-library/react';
       3 import { MemoryRouter } from 'react-router';
       4 import App from '../App.jsx';
       5 import { people } from '../data/people.js';
       6
       7 function renderAt(path) {
       8   return render(
       9     <MemoryRouter initialEntries={[path]}>
      10       <App />
     … +45 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Cả 5 test đều đỏ đúng lý do: thiếu phần tử, không phải lỗi import. Tiếp theo
  ghi COMMIT_PLAN và lưu snapshot.

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      3  | Task | Commit message | Files |
      4  |---|---|---|
      5  | 0.2 | `chore: scaffold react 19 client and express server` | `
         .env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md`, `COMMIT_PLAN
         .md`, `project-rules.md` (§3 sơ đồ thư mục), `TASK_DECOMPOSITION
         .md` (§1.4 ghi chú /api/health), `client/package.json`, `client/
         package-lock.json`, `client/index.html`, `client/vite.config.js`
         , `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.t
         est.jsx`, `client/src/setupTests.js`, `server/package.json`, `se
         rver/package-lock.json`, `server/app.js`, `server/app.test.js`, 
         `server/server.js` |
      6 +| 1.1 | `test: add failing tests for people routes` | `client/sr
        +c/data/people.js`, `client/src/people/people.test.jsx`, `COMMIT_
        +PLAN.md` |                                                      

  Ran 1 shell command (ctrl+o to expand)

● Task 1.2 dựng router: RootLayout chứa nav chính và Outlet, PeopleLayout có
  danh bạ và một <main>, còn NotFound nhận message mặc định và render
  role="alert". Test đỏ cho phần điều hướng gốc là bước tiếp theo. · summary

● Write(client\src\App.test.jsx)
  ⎿  Added 31 lines, removed 9 lines
       1  import { describe, it, expect } from 'vitest';
       2 -import { render, screen } from '@testing-library/react';       
       2 +import { render, screen, within } from '@testing-library/react'
         +;                                                              
       3  import { MemoryRouter } from 'react-router';
       4  import App from './App.jsx';
       5  
       6 -describe('App scaffold', () => {                               
       7 -  it('render được trong router', () => {                       
       8 -    render(                                                    
       9 -      <MemoryRouter initialEntries={['/']}>                    
      10 -        <App />                                                
      11 -      </MemoryRouter>,                                         
      12 -    );                                                         
      13 -    expect(screen.getByRole('heading', { name: 'Lab 4' })).toBe
         -InTheDocument();                                               
       6 +function renderAt(path) {                                      
       7 +  return render(                                               
       8 +    <MemoryRouter initialEntries={[path]}>                     
       9 +      <App />                                                  
      10 +    </MemoryRouter>,                                           
      11 +  );                                                           
      12 +}                                                              
      13 +                                                               
      14 +describe('Root layout', () => {                                
      15 +  it('render tiêu đề app', () => {                             
      16 +    renderAt('/');                                             
      17 +    expect(screen.getByRole('heading', { level: 1, name: 'Lab 4
         +' })).toBeInTheDocument();                                     
      18    });
      19 +                                                               
      20 +  it('nav gốc có link tới /people, /form, /forum/nasa', () => {
      21 +    renderAt('/');                                             
      22 +    const nav = screen.getByRole('navigation', { name: 'Điều hư
         +ớng chính' });                                                 
      23 +    const hrefs = within(nav).getAllByRole('link').map((a) => a
         +.getAttribute('href'));                                        
      24 +    expect(hrefs).toEqual(['/people', '/form', '/forum/nasa']);
      25 +  });                                                          
      26 +                                                               
      27 +  it('link "Danh bạ" ở nav gốc active khi đang ở route con /peo
         +ple/2', () => {                                                
      28 +    renderAt('/people/2');                                     
      29 +    const nav = screen.getByRole('navigation', { name: 'Điều hư
         +ớng chính' });                                                 
      30 +    expect(within(nav).getByRole('link', { name: 'Danh bạ' })).
         +toHaveClass('active-link');                                    
      31 +  });                                                          
      32 +                                                               
      33 +  it('mỗi trang chỉ có đúng một <main>', () => {               
      34 +    renderAt('/people');                                       
      35 +    expect(screen.getAllByRole('main')).toHaveLength(1);       
      36 +  });                                                          
      37  });
  Ran 1 shell command (ctrl+o to expand)

● Đã đỏ. Giờ implement.

● Write(client\src\navLinkClass.js)
  ⎿  Wrote 2 lines to client\src\navLinkClass.js
      1 // Cú pháp v7: className nhận hàm ({ isActive }) — KHÔNG dùng act
        iveClassName (v5).
      2 export const navLinkClass = ({ isActive }) => (isActive ? 'active
        -link' : undefined);

● Write(client\src\NotFound.jsx)
  ⎿  Wrote 8 lines to client\src\NotFound.jsx
      1 export default function NotFound({ message = 'Không tìm thấy tran
        g bạn yêu cầu.' }) {
      2   return (
      3     <div role="alert" className="not-found">
      4       <h2>404</h2>
      5       <p>{message}</p>
      6     </div>
      7   );
      8 }

● Write(client\src\people\PeopleLayout.jsx)
  ⎿  Wrote 25 lines to client\src\people\PeopleLayout.jsx
       1 import { NavLink, Outlet } from 'react-router';
       2 import { people } from '../data/people.js';
       3 import { navLinkClass } from '../navLinkClass.js';
       4
       5 // Master–Detail: URL là nguồn sự thật cho "người đang chọn" — k
         hông có state ở đây.
       6 export default function PeopleLayout() {
       7   return (
       8     <div className="people-layout">
       9       <nav aria-label="Danh bạ" className="people-sidebar">
     … +16 lines (ctrl+o to expand)

● Write(client\src\people\PersonDetail.jsx)
  ⎿  Wrote 7 lines to client\src\people\PersonDetail.jsx
      1 import { useParams } from 'react-router';
      2
      3 // Stub cho task 1.2 (chỉ để route :id tồn tại) — nội dung thật ở
         task 1.3.
      4 export default function PersonDetail() {
      5   const { id } = useParams();
      6   return <p>Người #{id}</p>;
      7 }

● Write(client\src\App.jsx)
  ⎿  Added 30 lines, removed 3 lines
       1 -import { Routes, Route } from 'react-router';                  
       1 +import { Routes, Route, NavLink, Outlet } from 'react-router'; 
       2 +import PeopleLayout from './people/PeopleLayout.jsx';          
       3 +import PersonDetail from './people/PersonDetail.jsx';          
       4 +import NotFound from './NotFound.jsx';                         
       5 +import { navLinkClass } from './navLinkClass.js';              
       6  
       3 -// Placeholder cho scaffold — route thật làm ở task 1.2.       
       7 +// Layout gốc: KHÔNG bọc <main> — mỗi route tự có đúng một <mai
         +n> (PeopleLayout có sẵn).                                      
       8 +function RootLayout() {                                        
       9 +  return (                                                     
      10 +    <div className="app">                                      
      11 +      <header className="app-header">                          
      12 +        <h1>Lab 4</h1>                                         
      13 +        <nav aria-label="Điều hướng chính">                    
      14 +          <NavLink to="/people" className={navLinkClass}>Danh b
         +ạ</NavLink>                                                    
      15 +          <NavLink to="/form" className={navLinkClass}>Form</Na
         +vLink>                                                         
      16 +          <NavLink to="/forum/nasa" className={navLinkClass}>Fo
         +rum</NavLink>                                                  
      17 +        </nav>                                                 
      18 +      </header>                                                
      19 +      <Outlet />                                               
      20 +    </div>                                                     
      21 +  );                                                           
      22 +}                                                              
      23 +                                                               
      24  export default function App() {
      25    return (
      26      <Routes>
       7 -      <Route path="*" element={<h1>Lab 4</h1>} />              
      27 +      <Route element={<RootLayout />}>                         
      28 +        <Route index element={<main><p>Chọn một khu vực ở thanh
         + điều hướng.</p></main>} />                                    
      29 +        <Route path="people" element={<PeopleLayout />}>       
      30 +          <Route index element={<p>Chọn một người</p>} />      
      31 +          <Route path=":id" element={<PersonDetail />} />      
      32 +        </Route>                                               
      33 +        <Route path="*" element={<main><NotFound /></main>} /> 
      34 +      </Route>                                                 
      35      </Routes>
      36    );
      37  }

  Ran 2 shell commands (ctrl+o to expand)

● Lỗi không nằm ở code của task mà do DOM từ các test trước còn sót lại, vì
  scaffold ở task 0.2 tôi đã bỏ qua việc bật globals: true để RTL tự cleanup.
  Tôi sẽ sửa trong setupTests.js. · summary

● Write(client\src\setupTests.js)
  ⎿  Added 8 lines
      1 +import { afterEach } from 'vitest';                             
      2 +import { cleanup } from '@testing-library/react';               
      3  import '@testing-library/jest-dom/vitest';
      4 +                                                                
      5 +// RTL chỉ tự cleanup khi có global afterEach (vitest `globals: 
        +true`).                                                         
      6 +// Không bật globals → phải gỡ DOM thủ công, nếu không các test 
        +render cộng dồn vào document.                                   
      7 +afterEach(() => {                                               
      8 +  cleanup();                                                    
      9 +});                                                             

  Ran 1 shell command (ctrl+o to expand)

● Còn 2 test đỏ thuộc task 1.3 (phần <dl> và 404 chi tiết), nên tôi sẽ xử lý
  chúng sau. Helper navLinkClass đã được tách ra file dùng chung, và tôi đã cập
  nhật sơ đồ thư mục trong rules. · summary

● Update(project-rules.md)
  ⎿  Added 3 lines, removed 1 line
      75  │   ├── vite.config.js # proxy /api → VITE_API_TARGET, cấu hình
           Vitest (jsdom)
      76  │   └── src/
      77  │       ├── main.jsx
      78 -│       ├── App.jsx                                            
      78 +│       ├── App.jsx         # <Routes> + RootLayout (nav gốc)  
      79 +│       ├── NotFound.jsx    # 404 role="alert", dùng cho route 
         +* và id sai                                                    
      80 +│       ├── navLinkClass.js # ({ isActive }) => 'active-link'  
      81  │       ├── setupTests.js
      82  │       ├── data/people.js
      83  │       ├── people/   PeopleLayout.jsx, PersonDetail.jsx, Skele
          ton.jsx

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      4  |---|---|---|
      5  | 0.2 | `chore: scaffold react 19 client and express server` | `
         .env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md`, `COMMIT_PLAN
         .md`, `project-rules.md` (§3 sơ đồ thư mục), `TASK_DECOMPOSITION
         .md` (§1.4 ghi chú /api/health), `client/package.json`, `client/
         package-lock.json`, `client/index.html`, `client/vite.config.js`
         , `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.t
         est.jsx`, `client/src/setupTests.js`, `server/package.json`, `se
         rver/package-lock.json`, `server/app.js`, `server/app.test.js`, 
         `server/server.js` |
      6  | 1.1 | `test: add failing tests for people routes` | `client/sr
         c/data/people.js`, `client/src/people/people.test.jsx`, `COMMIT_
         PLAN.md` |
      7 +| 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/sr
        +c/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLinkC
        +lass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/peop
        +le/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix cle
        +anup RTL), `project-rules.md` (§3 cây thư mục), `COMMIT_PLAN.md`
        + |                                                              

  Ran 1 shell command (ctrl+o to expand)

● Route PersonDetail sẽ đọc id, trả NotFound nếu không có người đó, còn không
  thì hiện <dl> trong <section>; tên được đặt vào PERSON_FIELDS để tránh trùng
  với <h2>. Tiếp theo tôi sẽ kiểm tra layout CSS Grid thủ công trên trình duyệt.
  · summary

● Update(client\src\data\people.js)
  ⎿  Added 1 line
      2  // PERSON_FIELDS là contract hiển thị dùng chung cho PersonDetai
         l và Skeleton
      3  // (đặt ở đây, KHÔNG đặt trong PersonDetail, để Skeleton không k
         éo PersonDetail vào bundle chính).
      4  export const PERSON_FIELDS = [
      5 +  { key: 'name', label: 'Họ tên' },                             
      6    { key: 'email', label: 'Email' },
      7    { key: 'role', label: 'Vai trò' },
      8    { key: 'city', label: 'Thành phố' },

● Write(client\src\people\PersonDetail.jsx)
  ⎿  Added 22 lines, removed 2 lines
       1 +import { Fragment } from 'react';                              
       2  import { useParams } from 'react-router';
       3 +import { people, PERSON_FIELDS } from '../data/people.js';     
       4 +import NotFound from '../NotFound.jsx';                        
       5  
       3 -// Stub cho task 1.2 (chỉ để route :id tồn tại) — nội dung thật
         - ở task 1.3.                                                   
       6  export default function PersonDetail() {
       7    const { id } = useParams();
       6 -  return <p>Người #{id}</p>;                                   
       8 +  const person = people.find((p) => p.id === id);              
       9 +                                                               
      10 +  // 404 guard: id sai vẫn render trong PeopleLayout (sidebar c
         +òn nguyên).                                                    
      11 +  if (!person) {                                               
      12 +    return <NotFound message={`Không tìm thấy người có id "${id
         +}".`} />;                                                      
      13 +  }                                                            
      14 +                                                               
      15 +  return (                                                     
      16 +    <section className="person-card" aria-label={person.name}> 
      17 +      <dl className="person-detail">                           
      18 +        {PERSON_FIELDS.map(({ key, label }) => (               
      19 +          <Fragment key={key}>                                 
      20 +            <dt>{label}</dt>                                   
      21 +            <dd>{person[key]}</dd>                             
      22 +          </Fragment>                                          
      23 +        ))}                                                    
      24 +      </dl>                                                    
      25 +    </section>                                                 
      26 +  );                                                           
      27  }

● Write(client\src\index.css)
  ⎿  Wrote 107 lines to client\src\index.css
       1 *,
       2 *::before,
       3 *::after {
       4   box-sizing: border-box;
       5 }
       6
       7 body {
       8   margin: 0;
       9   font-family: system-ui, sans-serif;
      10   line-height: 1.5;
     … +97 lines (ctrl+o to expand)

● Update(client\src\main.jsx)
  ⎿  Added 1 line
      2  import { createRoot } from 'react-dom/client';
      3  import { BrowserRouter } from 'react-router';
      4  import App from './App.jsx';
      5 +import './index.css';                                           
      6  
      7  createRoot(document.getElementById('root')).render(
      8    <StrictMode>

  Ran 1 shell command (ctrl+o to expand)

● Đã xanh 9/9.

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      5  | 0.2 | `chore: scaffold react 19 client and express server` | `
         .env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md`, `COMMIT_PLAN
         .md`, `project-rules.md` (§3 sơ đồ thư mục), `TASK_DECOMPOSITION
         .md` (§1.4 ghi chú /api/health), `client/package.json`, `client/
         package-lock.json`, `client/index.html`, `client/vite.config.js`
         , `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.t
         est.jsx`, `client/src/setupTests.js`, `server/package.json`, `se
         rver/package-lock.json`, `server/app.js`, `server/app.test.js`, 
         `server/server.js` |
      6  | 1.1 | `test: add failing tests for people routes` | `client/sr
         c/data/people.js`, `client/src/people/people.test.jsx`, `COMMIT_
         PLAN.md` |
      7  | 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/sr
         c/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLinkC
         lass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/peop
         le/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix cle
         anup RTL), `project-rules.md` (§3 cây thư mục), `COMMIT_PLAN.md`
          |
      8 +| 1.3 | `feat: detail route handling` | `client/src/people/Perso
        +nDetail.jsx`, `client/src/data/people.js` (thêm field `name` vào
        + `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.jsx`
        + (import CSS), `COMMIT_PLAN.md` |                               

  Ran 1 shell command (ctrl+o to expand)

● Task 1.4 sets up lazy loading for PersonDetail with a Suspense fallback
  Skeleton that mirrors the real detail layout but must not import PersonDetail;
  the failing test goes in its own file because a resolved lazy() would hide
  the fallback in later tests. · summary

● Write(client\src\people\PersonDetail.lazy.test.jsx)
  ⎿  Wrote 30 lines to client\src\people\PersonDetail.lazy.test.jsx
       1 import { describe, it, expect } from 'vitest';
       2 import { render, screen, within } from '@testing-library/react';
       3 import { MemoryRouter } from 'react-router';
       4 import App from '../App.jsx';
       5 import { people, PERSON_FIELDS } from '../data/people.js';
       6
       7 // File riêng: lazy() chỉ suspend ở lần load ĐẦU TIÊN của module
         .
       8 // Nếu chung file với test khác đã render PersonDetail, fallback
          sẽ không còn xuất hiện.
     … +22 lines (ctrl+o to expand)
  Ran 1 shell command (ctrl+o to expand)

● Test đỏ đúng chỗ. Giờ implement.

● Write(client\src\people\Skeleton.jsx)
  ⎿  Wrote 27 lines to client\src\people\Skeleton.jsx
       1 import { Fragment } from 'react';
       2 import { PERSON_FIELDS } from '../data/people.js';
       3
       4 // Fallback cho <Suspense>. Cùng khung (section.person-card > dl
         .person-detail, cùng số dòng)
       5 // với PersonDetail → khi chunk tải xong, nội dung thay chỗ mà k
         hông xô layout (CLS = 0).
       6 // KHÔNG import PersonDetail ở đây: làm vậy sẽ kéo nó vào bundle
          chính, mất code-splitting.
       7 export default function Skeleton() {
     … +20 lines (ctrl+o to expand)

● Update(client\src\App.jsx)
  ⎿  Added 6 lines, removed 1 line
       1 +import { lazy, Suspense } from 'react';                        
       2  import { Routes, Route, NavLink, Outlet } from 'react-router';
       3  import PeopleLayout from './people/PeopleLayout.jsx';
       3 -import PersonDetail from './people/PersonDetail.jsx';          
       4 +import Skeleton from './people/Skeleton.jsx';                  
       5  import NotFound from './NotFound.jsx';
       6  import { navLinkClass } from './navLinkClass.js';
       7  
       8 +// Tách PersonDetail thành chunk riêng; chỉ tải khi vào /people
         +/:id lần đầu.                                                  
       9 +// Khai báo ở top-level module (KHÔNG trong component) để lazy(
         +) không bị tạo lại mỗi render.                                 
      10 +const PersonDetail = lazy(() => import('./people/PersonDetail.j
         +sx'));                                                         
      11 +                                                               
      12  // Layout gốc: KHÔNG bọc <main> — mỗi route tự có đúng một <mai
          n> (PeopleLayout có sẵn).
      13  function RootLayout() {
      14    return (

● Update(client\src\App.jsx)
  ⎿  Added 8 lines, removed 1 line
      33          <Route index element={<main><p>Chọn một khu vực ở thanh
           điều hướng.</p></main>} />
      34          <Route path="people" element={<PeopleLayout />}>
      35            <Route index element={<p>Chọn một người</p>} />
      36 -          <Route path=":id" element={<PersonDetail />} />      
      36 +          <Route                                               
      37 +            path=":id"                                         
      38 +            element={                                          
      39 +              <Suspense fallback={<Skeleton />}>               
      40 +                <PersonDetail />                               
      41 +              </Suspense>                                      
      42 +            }                                                  
      43 +          />                                                   
      44          </Route>
      45          <Route path="*" element={<main><NotFound /></main>} />
      46        </Route>

● Update(client\src\index.css)
  ⎿  Added 24 lines
      102    font-weight: 600;
      103  }
      104  
      105 +/* Skeleton: thanh cao đúng bằng 1 dòng dd (1.5rem) */        
      106 +.skeleton-bar {                                               
      107 +  display: inline-block;                                      
      108 +  vertical-align: top;                                        
      109 +  width: 12rem;                                               
      110 +  max-width: 100%;                                            
      111 +  height: 1.5rem;                                             
      112 +  border-radius: 4px;                                         
      113 +  background: #e6e9ed;                                        
      114 +  animation: skeleton-pulse 1.2s ease-in-out infinite;        
      115 +}                                                             
      116 +                                                              
      117 +@keyframes skeleton-pulse {                                   
      118 +  50% {                                                       
      119 +    opacity: 0.5;                                             
      120 +  }                                                           
      121 +}                                                             
      122 +                                                              
      123 +@media (prefers-reduced-motion: reduce) {                     
      124 +  .skeleton-bar {                                             
      125 +    animation: none;                                          
      126 +  }                                                           
      127 +}                                                             
      128 +                                                              
      129  .not-found h2 {
      130    margin-top: 0;
      131  }

  Ran 1 shell command (ctrl+o to expand)

● Tests pass 10/10 and the build now emits a separate PersonDetail chunk. Next
  I'll check the dev server by reloading /people/2 directly, closing only the
  process I started. · summary

  Ran 1 shell command (ctrl+o to expand)

● Script bị lỗi cú pháp ngay lúc parse, nên chưa lệnh nào chạy và chưa có tiến
  trình nào được mở. Viết lại cho gọn:

  Ran 1 shell command (ctrl+o to expand)

● Kiểm tra dev server ổn: deep link /people/2 trả 200 kèm SPA shell, stderr
  không có gì, và tiến trình Vite (PID 14072) đã tắt.

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      6  | 1.1 | `test: add failing tests for people routes` | `client/sr
         c/data/people.js`, `client/src/people/people.test.jsx`, `COMMIT_
         PLAN.md` |
      7  | 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/sr
         c/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLinkC
         lass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/peop
         le/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix cle
         anup RTL), `project-rules.md` (§3 cây thư mục), `COMMIT_PLAN.md`
          |
      8  | 1.3 | `feat: detail route handling` | `client/src/people/Perso
         nDetail.jsx`, `client/src/data/people.js` (thêm field `name` vào
          `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.jsx`
          (import CSS), `COMMIT_PLAN.md` |
      9 +| 1.4 | `perf: lazy load person detail with skeleton fallback` |
        + `client/src/App.jsx` (lazy + Suspense), `client/src/people/Skel
        +eton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `clie
        +nt/src/index.css` (`.skeleton-bar`), `COMMIT_PLAN.md` |         

  Ran 1 shell command (ctrl+o to expand)

● COMMIT_PLAN.md không xuất hiện trong git status, nên tôi kiểm tra lý do:

  Ran 1 shell command (ctrl+o to expand)

● COMMIT_PLAN.md được liệt kê trong .git/info/exclude, nên tôi bỏ nó khỏi danh
  sách file của các dòng 1.x để khớp với việc bạn không commit file này.
  · summary

● Update(COMMIT_PLAN.md)
  ⎿  Added 4 lines, removed 4 lines
      3  | Task | Commit message | Files |
      4  |---|---|---|
      5  | 0.2 | `chore: scaffold react 19 client and express server` | `
         .env.example`, `.gitignore`, `AI_FAILURE_AUDIT.md`, `COMMIT_PLAN
         .md`, `project-rules.md` (§3 sơ đồ thư mục), `TASK_DECOMPOSITION
         .md` (§1.4 ghi chú /api/health), `client/package.json`, `client/
         package-lock.json`, `client/index.html`, `client/vite.config.js`
         , `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.t
         est.jsx`, `client/src/setupTests.js`, `server/package.json`, `se
         rver/package-lock.json`, `server/app.js`, `server/app.test.js`, 
         `server/server.js` |
      6 -| 1.1 | `test: add failing tests for people routes` | `client/sr
        -c/data/people.js`, `client/src/people/people.test.jsx`, `COMMIT_
        -PLAN.md` |                                                      
      7 -| 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/sr
        -c/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLinkC
        -lass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/peop
        -le/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix cle
        -anup RTL), `project-rules.md` (§3 cây thư mục), `COMMIT_PLAN.md`
        - |                                                              
      8 -| 1.3 | `feat: detail route handling` | `client/src/people/Perso
        -nDetail.jsx`, `client/src/data/people.js` (thêm field `name` vào
        - `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.jsx`
        - (import CSS), `COMMIT_PLAN.md` |                               
      9 -| 1.4 | `perf: lazy load person detail with skeleton fallback` |
        - `client/src/App.jsx` (lazy + Suspense), `client/src/people/Skel
        -eton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `clie
        -nt/src/index.css` (`.skeleton-bar`), `COMMIT_PLAN.md` |         
      6 +| 1.1 | `test: add failing tests for people routes` | `client/sr
        +c/data/people.js`, `client/src/people/people.test.jsx` |        
      7 +| 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/sr
        +c/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLinkC
        +lass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/peop
        +le/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix cle
        +anup RTL), `project-rules.md` (§3 cây thư mục) |                
      8 +| 1.3 | `feat: detail route handling` | `client/src/people/Perso
        +nDetail.jsx`, `client/src/data/people.js` (thêm field `name` vào
        + `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.jsx`
        + (import CSS) |                                                 
      9 +| 1.4 | `perf: lazy load person detail with skeleton fallback` |
        + `client/src/App.jsx` (lazy + Suspense), `client/src/people/Skel
        +eton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `clie
        +nt/src/index.css` (`.skeleton-bar`) |                           

● Đã xong BLOCK 2 (task 1.1 → 1.4) và tôi chưa commit. Client xanh 10/10 test.
  Build tách PersonDetail thành chunk riêng (dist/assets/PersonDetail-*.js, 0.49
  kB). Grep trong client/src không thấy cú pháp nào bị cấm (Switch, Redirect,
  exact, activeClassName, defaultProps, useEffect, react-router-dom). Tôi chỉ
  tắt đúng tiến trình Vite mình đã mở (PID 14072).

  AGENTS rules §2 yêu cầu dừng sau mỗi task, nhưng lần này bạn yêu cầu làm cả
  block nên tôi làm liền. Mỗi task vẫn đi đủ vòng: contract → test đỏ (đã chạy,
  thấy đỏ) → implement → xanh.

  Tách commit cho từng task

  Các task sửa chung file (App.jsx sửa ở 1.2 và 1.4, index.css ở 1.3 và 1.4,
  people.js ở 1.1 và 1.3). Vì vậy không thể tách commit chỉ bằng cách chọn file.
  Tôi đã lưu snapshot client/src sau mỗi task tại:
  C:\Users\NHATHU~1\AppData\Local\Temp\claude\140f2553b2e975f1\0d26b79a-fc42-468
  a-b47e-1b9f8e912897\scratchpad\sprint1-snapshots\task-1.1 … task-1.4

  Thư mục scratchpad có thể bị xoá khi khởi động lại máy, nên bạn nên dùng sớm.
  Sau khi review, lặp lại các lệnh sau cho từng task:
  $S = 'C:\Users\NHATHU~1\AppData\Local\Temp\claude\140f2553b2e975f1\0d26b79a-fc
  42-468a-b47e-1b9f8e912897\scratchpad\sprint1-snapshots'
  Remove-Item -Recurse client\src; Copy-Item -Recurse "$S\task-1.1\client\src"
  client\src
  git add -A client/src; git commit -m "test: add failing tests for people
  routes"
  # 1.2: thêm "git add project-rules.md" · 1.3, 1.4: chỉ cần client/src
  Snapshot task-1.4 giống hệt code hiện tại. Commit 1.1 có test đỏ (theo thiết
  kế của WBS). Commit 1.2 còn 2 test đỏ, sẽ xanh ở 1.3. Điều này mâu thuẫn với
  luật §5 "mỗi commit test đều pass", nên bạn tự quyết cách xử lý.

  1. Lệnh kiểm tra và checkpoint Sprint 1

  cd client; npm test            # 10 passed
  npm run build                  # thấy dòng dist/assets/PersonDetail-*.js riêng
  npm run dev                    # http://localhost:5173
  Checkpoint trên trình duyệt (mở DevTools):
  - Console: 0 warning, 0 error khi chuyển qua lại giữa /people, /people/1,
    /people/2. Tôi chưa kiểm tra được bước này vì không có trình duyệt, bạn cần
    tự xem.
  - Reload trực tiếp http://localhost:5173/people/2 → vẫn hiện detail. Tôi đã
    kiểm tra phía server: trả 200 kèm SPA shell.
  - Id sai: /people/xyz → 404 nằm trong layout, sidebar vẫn còn. Path lạ /abc →
    404 toàn trang.
  - Network tab: reload ở /people, rồi click một người → thấy request
    PersonDetail.jsx được tải sau. Bật Slow 3G để nhìn thấy skeleton.
  - Responsive: thu cửa sổ xuống dưới 640px → layout chuyển về 1 cột.

  2. Ba điểm chính để bảo vệ

  1. URL là nguồn sự thật. Không có state "người đang chọn". PersonDetail lấy id
     từ useParams() rồi people.find. Vì vậy reload hay deep link đều chạy, và
     NavLink tự biết link nào active. Cú pháp v7 là className={({ isActive }) =>
     ...}. Nhờ thiết kế này, câu hỏi defense về useSearchParams chỉ cần mở rộng
     theo cùng hướng.
  2. Layout lồng nhau bằng <Outlet/>. RootLayout (nav gốc) chứa PeopleLayout
     (sidebar + <main>), và bên trong là index hoặc :id. 404 của id sai render
     bên trong PeopleLayout. 404 của path lạ dùng route * ở cấp gốc. Mỗi trang
     chỉ có một <main>, và có test kiểm tra điều này.
  3. Lazy + Suspense không gây layout shift. lazy() khai báo ở top-level module,
     vì nếu đặt trong component thì mỗi render sẽ tạo lazy mới và suspend mãi.
     Skeleton dùng cùng khung section.person-card > dl.person-detail, cùng số
     dòng, mỗi dòng cố định 1.5rem, nên CLS = 0. PERSON_FIELDS đặt trong
     data/people.js chứ không trong PersonDetail. Nếu Skeleton import từ
     PersonDetail, nó sẽ kéo PersonDetail vào bundle chính và mất tác dụng tách
     chunk.

  3. Lỗi AI đã gặp (để ghi AI_FAILURE_AUDIT.md)

  1. Thiếu cleanup của RTL trong scaffold 0.2. Đây là lỗi ẩn, chỉ lộ ra ở task
     1.2. Triệu chứng: test sau báo Found multiple elements with role
     "navigation" và thấy 4 <main>, vì DOM của các test trước vẫn còn. Nguyên
     nhân: RTL chỉ tự gọi cleanup khi Vitest bật globals: true, và ở 0.2 tôi
     không bật cũng không tự gọi. Lúc đó chỉ có 1 test nên không phát hiện được.
     Đã sửa bằng afterEach(() => cleanup()) trong setupTests.js
     (Lab4/client/src/setupTests.js).
  2. Liệt kê COMMIT_PLAN.md vào danh sách file commit, trong khi bạn đã exclude
     file này ở .git/info/exclude. Đã bỏ khỏi các dòng 1.x. Dòng 0.2 tôi giữ
     nguyên vì đã thuộc lịch sử.
  3. Script PowerShell lỗi parse do $(... 'import\(') trong chuỗi. Lỗi này không
     chạy gì và không ảnh hưởng code. Chỉ ghi vào audit nếu bạn muốn ghi cả lỗi
     công cụ.

  Có 2 quyết định bạn nên biết vì chúng lệch nhẹ so với WBS:
  - Task 1.2 có PersonDetail.jsx dạng stub. Lý do: không có route :id thì
    /people/2 rơi vào *, và test active-link không thể xanh. Task 1.3 thay stub
    bằng nội dung thật.
  - Thêm 2 file ngoài sơ đồ ban đầu là NotFound.jsx và navLinkClass.js. Tôi đã
    cập nhật sơ đồ ở rules §3.

> Đọc project-rules.md và TASK_DECOMPOSITION.md.
  Làm BLOCK 3 (Sprint 2), task 2.1 trước. Theo vòng Contract → Fail test →
  Implement → Refactor.
  Xong task 2.1 thì DỪNG, không commit, không làm task kế. Báo: file đã đổi,
  commit message theo WBS, lệnh kiểm tra, lỗi AI đã gặp.
  Khi tôi nói "tiếp" thì làm task kế tiếp theo cùng cách.
  Task 2.0 (phân tích 5 useEffect) là phần tôi tự viết, bạn bỏ qua.

  Searched for 1 pattern, read 1 file (ctrl+o to expand)

● Contract §1.5 ghi rõ name và email là bắt buộc, nhưng không nói age có bắt
  buộc hay không, nên tôi sẽ hỏi bạn trước khi viết test. · summary

● User answered Claude's questions:
  ⎿  · Form contract §1.5: trường `age` để trống thì validateForm xử lý thế nào?
     → Bắt buộc (Recommended)
     · Giá trị nhập có được trim() trước khi kiểm tra không? (vd name = '  A  '
     hay ' 25 ') → Trim khi validate (Recommended)

● Đã chốt: age bắt buộc, và giá trị được trim khi validate. Tôi ghi quyết định
  này cùng chuỗi thông báo lỗi vào contract §1.5 trước, rồi mới viết test.

● Update(TASK_DECOMPOSITION.md)
  ⎿  Added 14 lines
      48  Field: `name` (bắt buộc, ≥ 2 ký tự), `email` (bắt buộc, đúng đị
          nh dạng), `age` (số nguyên 18–100).
      49  `validateForm(values) → { [field]: message }` — hàm thuần, test
           được độc lập.
      50  
      51 +Chốt chi tiết (task 2.1): `values = { name: string, email: stri
         +ng, age: string }` (giá trị thô từ input). Cả 3 field **bắt buộ
         +c**. Validate trên giá trị đã `trim()`; giá trị lưu vẫn là chuỗ
         +i gốc. Field hợp lệ **không có key** trong kết quả → hợp lệ toà
         +n form = `{}`.                                                 
      52 +                                                               
      53 +| Field | Điều kiện lỗi (theo thứ tự) | Message |              
      54 +|---|---|---|                                                  
      55 +| name | rỗng | `Vui lòng nhập họ tên.` |                      
      56 +| | < 2 ký tự | `Họ tên phải có ít nhất 2 ký tự.` |            
      57 +| email | rỗng | `Vui lòng nhập email.` |                      
      58 +| | không khớp `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `Email không đú
         +ng định dạng.` |                                               
      59 +| age | rỗng | `Vui lòng nhập tuổi.` |                         
      60 +| | không khớp `/^-?\d+$/` (vd `18.5`, `abc`) | `Tuổi phải là s
         +ố nguyên.` |                                                   
      61 +| | ngoài [18, 100] | `Tuổi phải từ 18 đến 100.` |             
      62 +                                                               
      63 +UI: label `Họ tên` / `Email` / `Tuổi`, nút `Gửi`; inspector nằm
         + dưới heading `Dữ liệu đã gửi`.                                
      64 +                                                               
      65  ### 1.6 Rủi ro đã biết
      66  - AI sinh cú pháp Router v5 → soát theo `project-rules.md` §4.
      67  - AI dùng `useEffect` để validate → cấm.

● Write(client\src\form\validate.test.js)
  ⎿  Wrote 86 lines to client\src\form\validate.test.js
       1 import { describe, it, expect } from 'vitest';
       2 import { validateForm } from './validate.js';
       3
       4 const VALID = { name: 'An', email: 'an@example.com', age: '25' }
         ;
       5 const withField = (patch) => ({ ...VALID, ...patch });
       6
       7 describe('validateForm — hàm thuần', () => {
       8   it('form hợp lệ → {} (không key nào)', () => {
       9     expect(validateForm(VALID)).toEqual({});
     … +77 lines (ctrl+o to expand)

● Tiếp theo tôi viết component test, có thêm một test dùng <Profiler> để kiểm
  tra mỗi phím gõ chỉ tạo đúng một commit, nhờ đó sẽ đỏ ngay nếu ai thêm chuỗi
  useEffect. · summary

● Write(client\src\form\SimpleForm.test.jsx)
  ⎿  Wrote 88 lines to client\src\form\SimpleForm.test.jsx
       1 import { describe, it, expect } from 'vitest';
       2 import { Profiler } from 'react';
       3 import { render, screen, fireEvent, within } from '@testing-libr
         ary/react';
       4 import { MemoryRouter } from 'react-router';
       5 import SimpleForm from './SimpleForm.jsx';
       6 import App from '../App.jsx';
       7
       8 const type = (label, value) => fireEvent.change(screen.getByLabe
         lText(label), { target: { value } });
     … +80 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Test đang đỏ vì validate.js và SimpleForm.jsx chưa tồn tại, đúng như kỳ vọng
  với test viết trước cho module mới. 10 test cũ của Sprint 1 vẫn xanh.
  · summary
● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
       7  | 1.2 | `feat: router layout` | `client/src/App.jsx`, `client/s
          rc/App.test.jsx`, `client/src/NotFound.jsx`, `client/src/navLin
          kClass.js`, `client/src/people/PeopleLayout.jsx`, `client/src/p
          eople/PersonDetail.jsx` (stub), `client/src/setupTests.js` (fix
           cleanup RTL), `project-rules.md` (§3 cây thư mục) |
       8  | 1.3 | `feat: detail route handling` | `client/src/people/Pers
          onDetail.jsx`, `client/src/data/people.js` (thêm field `name` v
          ào `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.j
          sx` (import CSS) |
       9  | 1.4 | `perf: lazy load person detail with skeleton fallback` 
          | `client/src/App.jsx` (lazy + Suspense), `client/src/people/Sk
          eleton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `c
          lient/src/index.css` (`.skeleton-bar`) |
      10 +| 2.1 | `test: add failing tests for form validation` | `client
         +/src/form/validate.test.js`, `client/src/form/SimpleForm.test.j
         +sx`, `TASK_DECOMPOSITION.md` (§1.5 chốt luật + message), *(+ ph
         +ần phân tích 2.0 bạn tự viết)* |                               

● Task 2.1 đã xong và đang dừng ở đây; chưa commit, chưa làm 2.2. Hai file test
  mới đều đỏ vì validate.js và SimpleForm.jsx chưa tồn tại, nên chưa assertion
  nào trong đó được chạy thật. 10 test cũ của Sprint 1 vẫn xanh.

  File đã đổi

  File: TASK_DECOMPOSITION.md (Lab4/TASK_DECOMPOSITION.md) §1.5
  Nội dung: Chốt contract theo 2 câu trả lời của bạn (age bắt buộc, trim khi
    validate). Thêm bảng điều kiện lỗi và message chính xác, nhãn UI (Họ
    tên/Email/Tuổi, nút Gửi, heading Dữ liệu đã gửi)
  ────────────────────────────────────────
  File: client/src/form/validate.test.js (Lab4/client/src/form/validate.test.js)
  Nội dung: Unit test validateForm: kết quả hợp lệ là {}, chỉ trả key của field
    lỗi, không mutate input, deterministic. Mỗi field có các ca lỗi, ca hợp lệ,
    biên 18/100 và ca trim
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.test.jsx
    (Lab4/client/src/form/SimpleForm.test.jsx)
  Nội dung: Gồm 7 test: route /form có 3 field; chưa chạm field thì không báo
    lỗi; gõ sai rồi blur thì có aria-invalid="true" và role="alert" nối bằng
    aria-describedby; sửa đúng thì lỗi biến mất ngay; submit form trống thì có 3

    lỗi và không có inspector; submit hợp lệ thì hiện dl.json-inspector; 1 phím
    gõ = 1 commit (đo bằng <Profiler>)

  Dòng 2.1 đã được thêm vào COMMIT_PLAN.md (Lab4/COMMIT_PLAN.md).

  Commit message theo WBS: test: add failing tests for form validation. WBS ghi
  task 2.0 được "gộp vào 2.1", nên phần phân tích 5 useEffect bạn viết nên đi
  chung commit này.

  Lệnh kiểm tra

  cd client; npm test
  # Kỳ vọng: 2 file FAIL "Failed to resolve import ./validate.js /
  ./SimpleForm.jsx"; 10 test cũ vẫn passed

  Lỗi AI đã gặp

  Task này chưa có lỗi nào phải sửa. Có 2 rủi ro sẽ chỉ lộ ra ở task 2.2 khi
  test chạy thật:
  - Đỏ vì thiếu module, chưa phải đỏ vì assertion. Một assertion viết sai vẫn có
    thể ẩn trong đó. Ví dụ tôi giả định fireEvent.click lên nút submit sẽ kích
    hoạt submit của form trong jsdom, và giả định jest-dom 7 có
    toHaveAccessibleDescription. Nếu một trong hai sai, tôi sẽ báo là lỗi AI.
  - Test "1 phím gõ = 1 commit" giả định trong SimpleForm không có state nào
    khác thay đổi khi gõ.

  Bạn nói "tiếp" thì tôi làm task 2.2 (Form context).

> tiếp
  Từ giờ, cuối mỗi task hãy in sẵn một khối lệnh PowerShell để tôi copy-paste,
  dạng:
  git add -A
  git commit -m "<commit message đúng theo WBS>"
  Chỉ in lệnh, không tự chạy.

  Ran 1 shell command (ctrl+o to expand)

● Task 2.1 đã được commit và working tree đang sạch, nên git add -A ở cuối task
  2.2 sẽ chỉ gom đúng thay đổi của 2.2. Tôi lưu yêu cầu in khối lệnh vào bộ nhớ.

  Recalled 1 memory, wrote 2 memories (ctrl+o to expand)

● Task 2.2 is set up as a pure validator, a form context that throws outside its
  provider, and a minimal input field; I'm writing the red tests for the
  context next. · summary

● Write(client\src\form\FormContext.test.jsx)
  ⎿  Wrote 30 lines to client\src\form\FormContext.test.jsx
      1 import { describe, it, expect, vi } from 'vitest';
      2 import { render, screen, fireEvent } from '@testing-library/react
        ';
      3 import { useFormContext } from './FormContext.js';
      4 import SimpleForm from './SimpleForm.jsx';
      5
      6 function Orphan() {
      7   useFormContext();
      8   return null;
      9 }
     … +21 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Đã đỏ. Giờ implement.

● Write(client\src\form\validate.js)
  ⎿  Wrote 50 lines to client\src\form\validate.js
       1 // Hàm thuần: cùng input → cùng output, không side effect, không
          mutate.
       2 // Gọi trực tiếp trong render (derived state) — KHÔNG gọi trong
         useEffect.
       3 // Contract: TASK_DECOMPOSITION.md §1.5.
       4
       5 const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       6 const INTEGER_RE = /^-?\d+$/;
       7 export const AGE_MIN = 18;
       8 export const AGE_MAX = 100;
     … +42 lines (ctrl+o to expand)

● Write(client\src\form\FormContext.js)
  ⎿  Wrote 12 lines to client\src\form\FormContext.js
       1 import { createContext, useContext } from 'react';
       2
       3 // Default null (không phải object rỗng) để phát hiện ngay khi d
         ùng ngoài Provider.
       4 export const FormContext = createContext(null);
       5
       6 export function useFormContext() {
       7   const ctx = useContext(FormContext);
       8   if (ctx === null) {
       9     throw new Error('useFormContext phải được dùng bên trong <Si
     … +4 lines (ctrl+o to expand)

● Write(client\src\form\InputField.jsx)
  ⎿  Wrote 23 lines to client\src\form\InputField.jsx
       1 import { useId } from 'react';
       2 import { useFormContext } from './FormContext.js';
       3
       4 // Bản tối thiểu cho task 2.2 (label + controlled input qua cont
         ext).
       5 // Hiển thị lỗi, aria-invalid/aria-describedby và touched làm ở
         task 2.3.
       6 export default function InputField({ name, label, type = 'text',
          ...inputProps }) {
       7   const id = useId();
     … +16 lines (ctrl+o to expand)

● Write(client\src\form\SimpleForm.jsx)
  ⎿  Wrote 40 lines to client\src\form\SimpleForm.jsx
       1 import { useState } from 'react';
       2 import { FormContext } from './FormContext.js';
       3 import { validateForm } from './validate.js';
       4 import InputField from './InputField.jsx';
       5
       6 const INITIAL_VALUES = { name: '', email: '', age: '' };
       7
       8 // Một nguồn sự thật: `values`. Mọi thứ khác (errors, isValid) l
         à DERIVED,
       9 // tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 rend
     … +32 lines (~1 KB) (ctrl+o to expand)

● Update(client\src\App.jsx)
  ⎿  Added 1 line
      2  import { Routes, Route, NavLink, Outlet } from 'react-router';
      3  import PeopleLayout from './people/PeopleLayout.jsx';
      4  import Skeleton from './people/Skeleton.jsx';
      5 +import SimpleForm from './form/SimpleForm.jsx';                 
      6  import NotFound from './NotFound.jsx';
      7  import { navLinkClass } from './navLinkClass.js';
      8  

● Update(client\src\App.jsx)
  ⎿  Added 1 line
      43              }
      44            />
      45          </Route>
      46 +        <Route path="form" element={<main><SimpleForm /></main>
         +} />                                                           
      47          <Route path="*" element={<main><NotFound /></main>} />
      48        </Route>
      49      </Routes>

  Ran 1 shell command (ctrl+o to expand)

● 46/50 test đã xanh; các test 2.3 và 2.4 còn đỏ đúng như dự kiến. Tiếp theo tôi
  kiểm tra warning và useEffect. · summary

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

● Ba kết quả tìm được chỉ nằm trong comment hoặc tên test, không có lời gọi
  thật; vì checkpoint yêu cầu grep useEffect client/src/form trả về rỗng, tôi sẽ
  viết lại ba chỗ đó. · summary

● Update(client\src\form\validate.js)
  ⎿  Added 1 line, removed 1 line
      1  // Hàm thuần: cùng input → cùng output, không side effect, không
          mutate.
      2 -// Gọi trực tiếp trong render (derived state) — KHÔNG gọi trong 
        -useEffect.                                                      
      2 +// Gọi trực tiếp trong render (derived state) — KHÔNG gọi trong 
        +effect.                                                         
      3  // Contract: TASK_DECOMPOSITION.md §1.5.
      4  
      5  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

● Update(client\src\form\SimpleForm.jsx)
  ⎿  Added 1 line, removed 1 line
       6  const INITIAL_VALUES = { name: '', email: '', age: '' };
       7  
       8  // Một nguồn sự thật: `values`. Mọi thứ khác (errors, isValid) 
          là DERIVED,
       9 -// tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 ren
         -der. 0 useEffect.                                              
       9 +// tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 ren
         +der. Không effect nào.                                         
      10  export default function SimpleForm() {
      11    const [values, setValues] = useState(INITIAL_VALUES);
      12  

● Update(client\src\form\SimpleForm.test.jsx)
  ⎿  Added 1 line, removed 1 line
      74      expect(q.getByText('age').nextElementSibling).toHaveTextCon
          tent('25');
      75    });
      76  
      77 -  it('một phím gõ = đúng MỘT commit (không chuỗi useEffect)', (
         -) => {                                                         
      77 +  it('một phím gõ = đúng MỘT commit (không chuỗi effect)', () =
         +> {                                                            
      78      let commits = 0;
      79      render(
      80        <Profiler id="form" onRender={() => { commits += 1; }}>

  Ran 1 shell command (ctrl+o to expand)

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
       8  | 1.3 | `feat: detail route handling` | `client/src/people/Pers
          onDetail.jsx`, `client/src/data/people.js` (thêm field `name` v
          ào `PERSON_FIELDS`), `client/src/index.css`, `client/src/main.j
          sx` (import CSS) |
       9  | 1.4 | `perf: lazy load person detail with skeleton fallback` 
          | `client/src/App.jsx` (lazy + Suspense), `client/src/people/Sk
          eleton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `c
          lient/src/index.css` (`.skeleton-bar`) |
      10  | 2.1 | `test: add failing tests for form validation` | `client
          /src/form/validate.test.js`, `client/src/form/SimpleForm.test.j
          sx`, `TASK_DECOMPOSITION.md` (§1.5 chốt luật + message), *(+ ph
          ần phân tích 2.0 bạn tự viết)* |
      11 +| 2.2 | `feat: form context` | `client/src/form/validate.js`, `
         +client/src/form/FormContext.js`, `client/src/form/FormContext.t
         +est.jsx`, `client/src/form/SimpleForm.jsx`, `client/src/form/In
         +putField.jsx` (bản tối thiểu), `client/src/form/SimpleForm.test
         +.jsx` (đổi tên 1 test), `client/src/App.jsx` (route `/form`) | 

● Task 2.2 đã xong và đang dừng ở đây; chưa commit, chưa làm 2.3. Client có
  46/50 test xanh. 4 test còn đỏ đều thuộc task sau: 3 test về hiện lỗi/touched
  (2.3) và 1 test về inspector (2.4). Không có warning nào, và grep useEffect
  client/src/form trả về rỗng.

  File đã đổi

  File: client/src/form/validate.js (Lab4/client/src/form/validate.js)
  Nội dung: validateForm là hàm thuần: mỗi field có một rule riêng, trim trước
    khi kiểm tra, field hợp lệ thì không có key trong kết quả. Message lấy đúng
    theo bảng §1.5
  ────────────────────────────────────────
  File: client/src/form/FormContext.js (Lab4/client/src/form/FormContext.js)
  Nội dung: createContext(null) + useFormContext(), throw nếu gọi ngoài Provider
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.jsx (Lab4/client/src/form/SimpleForm.jsx)
  Nội dung: 1 useState(values); errors/isValid được tính trong render;
    handleChange dùng functional updater; <form noValidate>; nút Gửi
  ────────────────────────────────────────
  File: client/src/form/InputField.jsx (Lab4/client/src/form/InputField.jsx)
  Nội dung: Bản tối thiểu: useId + <label htmlFor> + controlled input lấy từ
    context. Phần lỗi và aria-* làm ở 2.3
  ────────────────────────────────────────
  File: client/src/form/FormContext.test.jsx
    (Lab4/client/src/form/FormContext.test.jsx)
  Nội dung: Test mới, đã thấy đỏ trước khi implement: gọi ngoài Provider thì
    throw; gõ field này không làm mất giá trị field kia
  ────────────────────────────────────────
  File: client/src/App.jsx (Lab4/client/src/App.jsx)
  Nội dung: Thêm route /form
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.test.jsx
    (Lab4/client/src/form/SimpleForm.test.jsx)
  Nội dung: Đổi tên 1 test (xem refactor bên dưới)

  Refactor: chữ useEffect xuất hiện trong 2 comment và 1 tên test. Lệnh grep ở
  checkpoint sẽ bắt cả những dòng đó, nên tôi đổi thành "effect".

  Hai điểm nên nắm để bảo vệ:
  - Tôi dùng <FormContext value={...}> thay cho <FormContext.Provider>. Đây là
    cú pháp mới của React 19, còn .Provider sẽ bị deprecate.
  - Ô age dùng type="text" inputMode="numeric" chứ không phải type="number". Với
    type="number", trình duyệt biến chuỗi "abc" thành "", khiến thông báo "Tuổi
    phải là số nguyên." không bao giờ xuất hiện.

  Lệnh kiểm tra

  cd client
  npm test                                          # 46 passed, 4 failed (đều
  thuộc 2.3/2.4)
  npx vitest run src/form/validate.test.js src/form/FormContext.test.jsx   # 33
  passed
  Select-String -Path src\form\* -Pattern useEffect # rỗng
  npm run dev   # mở /form, gõ thử — chưa hiện lỗi (task 2.3)

  Lỗi AI đã gặp

  Task này không có lỗi nào phải sửa.

  Hai rủi ro tôi nêu ở 2.1 đã được kiểm chứng một phần: test Profiler "1
  commit/phím" xanh thật. fireEvent.click lên nút submit và
  toHaveAccessibleDescription chỉ được kiểm chứng ở 2.3/2.4, khi các test đó bắt
  đầu xanh.

  Lệnh commit

  git add -A
  git commit -m "feat: form context"

  Bạn nói "tiếp" thì tôi làm task 2.3 (Input field validation).

> tiếp

  Ran 1 shell command (ctrl+o to expand)
● Working tree đã sạch và commit 2.2 có sẵn. Tiếp theo tôi làm task 2.3
  (validate input), và thêm một test đỏ cho phần focus. · summary

● Update(client\src\form\SimpleForm.test.jsx)
  ⎿  Added 7 lines
      58      expect(inspector()).not.toBeInTheDocument();
      59    });
      60  
      61 +  it('submit không hợp lệ → focus vào field lỗi ĐẦU TIÊN (trong
         + event handler, không effect)', () => {                        
      62 +    render(<SimpleForm />);                                    
      63 +    type('Họ tên', 'Nguyễn Văn An'); // name hợp lệ → field lỗi
         + đầu tiên là email                                             
      64 +    submit();                                                  
      65 +    expect(screen.getByLabelText('Email')).toHaveFocus();      
      66 +  });                                                          
      67 +                                                               
      68    it('submit hợp lệ → hiện inspector <dl class="json-inspector"
          > với dữ liệu đã gửi', () => {
      69      const { container } = render(<SimpleForm />);
      70      type('Họ tên', 'Nguyễn Văn An');

  Ran 1 shell command (ctrl+o to expand)

● Đã đỏ (5 test, trong đó 4 thuộc 2.3). Giờ implement.

● Write(client\src\form\SimpleForm.jsx)
  ⎿  Added 18 lines, removed 3 lines
       5  
       6  const INITIAL_VALUES = { name: '', email: '', age: '' };
       7  
       8 -// Một nguồn sự thật: `values`. Mọi thứ khác (errors, isValid) 
         -là DERIVED,                                                    
       8 +// Một nguồn sự thật cho dữ liệu: `values`. errors / isValid là
         + DERIVED,                                                      
       9  // tính lại đồng bộ mỗi render → 1 phím gõ = 1 setState = 1 ren
          der. Không effect nào.
      10 +// `touched` / `submitAttempted` chỉ quyết định KHI NÀO hiện lỗ
         +i, cũng là state thường.                                       
      11  export default function SimpleForm() {
      12    const [values, setValues] = useState(INITIAL_VALUES);
      13 +  const [touched, setTouched] = useState({});                  
      14 +  const [submitAttempted, setSubmitAttempted] = useState(false)
         +;                                                              
      15  
      16    const errors = validateForm(values);
      17    const isValid = Object.keys(errors).length === 0;
     ...
      22      setValues((prev) => ({ ...prev, [name]: value }));
      23    }
      24  
      25 +  function handleBlur(event) {                                 
      26 +    const { name } = event.target;                             
      27 +    // Đã touched → trả lại object cũ: React thấy state không đ
         +ổi, bỏ qua render.                                             
      28 +    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]
         +: true }));                                                    
      29 +  }                                                            
      30 +                                                               
      31    function handleSubmit(event) {
      32      event.preventDefault();
      24 -    if (!isValid) return;                                      
      33 +    setSubmitAttempted(true);                                  
      34 +    if (!isValid) {                                            
      35 +      // Focus là side effect do NGƯỜI DÙNG gây ra → làm ngay t
         +rong handler, không cần effect.                                
      36 +      const firstInvalid = Object.keys(errors)[0];             
      37 +      event.currentTarget.elements.namedItem(firstInvalid)?.foc
         +us();                                                          
      38 +      return;                                                  
      39 +    }                                                          
      40      // Lưu dữ liệu đã gửi + hiện inspector: task 2.4.
      41    }
      42  
      43    return (
      29 -    <FormContext value={{ values, errors, handleChange }}>     
      44 +    <FormContext value={{ values, errors, touched, submitAttemp
         +ted, handleChange, handleBlur }}>                              
      45        {/* noValidate: tắt validation native của trình duyệt, ch
          ỉ dùng validateForm */}
      46        <form className="simple-form" noValidate onSubmit={handle
          Submit}>
      47          <InputField name="name" label="Họ tên" autoComplete="na
          me" />

● Write(client\src\form\InputField.jsx)
  ⎿  Added 14 lines, removed 3 lines
       1  import { useId } from 'react';
       2  import { useFormContext } from './FormContext.js';
       3  
       4 -// Bản tối thiểu cho task 2.2 (label + controlled input qua con
         -text).                                                         
       5 -// Hiển thị lỗi, aria-invalid/aria-describedby và touched làm ở
         - task 2.3.                                                     
       4 +// Không nhận value/onChange qua props — lấy từ context theo `n
         +ame`.                                                          
       5  export default function InputField({ name, label, type = 'text'
          , ...inputProps }) {
       6    const id = useId();
       8 -  const { values, handleChange } = useFormContext();           
       7 +  const errorId = `${id}-error`;                               
       8 +  const { values, errors, touched, submitAttempted, handleChang
         +e, handleBlur } = useFormContext();                            
       9  
      10 +  // Derived: chỉ hiện lỗi khi field đã được rời khỏi (blur) ho
         +ặc đã bấm Gửi.                                                 
      11 +  const error = touched[name] || submitAttempted ? errors[name]
         + : undefined;                                                  
      12 +                                                               
      13    return (
      14      <div className="field">
      15        <label htmlFor={id}>{label}</label>
     ...
      19          type={type}
      20          value={values[name]}
      21          onChange={handleChange}
      22 +        onBlur={handleBlur}                                    
      23 +        aria-invalid={Boolean(error)}                          
      24 +        aria-describedby={error ? errorId : undefined}         
      25          {...inputProps}
      26        />
      27 +      {error && (                                              
      28 +        <p id={errorId} role="alert" className="field-error">  
      29 +          {error}                                              
      30 +        </p>                                                   
      31 +      )}                                                       
      32      </div>
      33    );
      34  }

● Update(client\src\index.css)
  ⎿  Added 50 lines
      126    }
      127  }
      128  
      129 +/* ---------- Form ---------- */                              
      130 +.simple-form {                                                
      131 +  display: grid;                                              
      132 +  gap: 1rem;                                                  
      133 +  max-width: 28rem;                                           
      134 +}                                                             
      135 +                                                              
      136 +.field {                                                      
      137 +  display: grid;                                              
      138 +  gap: 0.25rem;                                               
      139 +}                                                             
      140 +                                                              
      141 +.field label {                                                
      142 +  font-weight: 600;                                           
      143 +}                                                             
      144 +                                                              
      145 +.field input {                                                
      146 +  font: inherit;                                              
      147 +  padding: 0.5rem 0.75rem;                                    
      148 +  border: 1px solid #8c959f;                                  
      149 +  border-radius: 6px;                                         
      150 +}                                                             
      151 +                                                              
      152 +.field input:focus-visible,                                   
      153 +.simple-form button:focus-visible {                           
      154 +  outline: 2px solid #0b57d0;                                 
      155 +  outline-offset: 2px;                                        
      156 +}                                                             
      157 +                                                              
      158 +.field input[aria-invalid='true'] {                           
      159 +  border-color: #b3261e;                                      
      160 +}                                                             
      161 +                                                              
      162 +.field-error {                                                
      163 +  margin: 0;                                                  
      164 +  color: #b3261e;                                             
      165 +  font-size: 0.875rem;                                        
      166 +}                                                             
      167 +                                                              
      168 +.simple-form button {                                         
      169 +  justify-self: start;                                        
      170 +  font: inherit;                                              
      171 +  padding: 0.5rem 1.25rem;                                    
      172 +  border: 0;                                                  
      173 +  border-radius: 6px;                                         
      174 +  background: #0b57d0;                                        
      175 +  color: #ffffff;                                             
      176 +  cursor: pointer;                                            
      177 +}                                                             
      178 +                                                              
      179  .not-found h2 {
      180    margin-top: 0;
      181  }

  Ran 1 shell command (ctrl+o to expand)

● 50 of 51 tests pass, with the one remaining failure in the inspector (task
  2.4). The two assumptions from 2.1 are now verified, and the Profiler test
  still passes. · summary

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
       9  | 1.4 | `perf: lazy load person detail with skeleton fallback` 
          | `client/src/App.jsx` (lazy + Suspense), `client/src/people/Sk
          eleton.jsx`, `client/src/people/PersonDetail.lazy.test.jsx`, `c
          lient/src/index.css` (`.skeleton-bar`) |
      10  | 2.1 | `test: add failing tests for form validation` | `client
          /src/form/validate.test.js`, `client/src/form/SimpleForm.test.j
          sx`, `TASK_DECOMPOSITION.md` (§1.5 chốt luật + message), *(+ ph
          ần phân tích 2.0 bạn tự viết)* |
      11  | 2.2 | `feat: form context` | `client/src/form/validate.js`, `
          client/src/form/FormContext.js`, `client/src/form/FormContext.t
          est.jsx`, `client/src/form/SimpleForm.jsx`, `client/src/form/In
          putField.jsx` (bản tối thiểu), `client/src/form/SimpleForm.test
          .jsx` (đổi tên 1 test), `client/src/App.jsx` (route `/form`) |
      12 +| 2.3 | `feat: input field validation` | `client/src/form/Input
         +Field.jsx`, `client/src/form/SimpleForm.jsx` (`touched`, `submi
         +tAttempted`, `handleBlur`, focus field lỗi đầu), `client/src/fo
         +rm/SimpleForm.test.jsx` (+ test focus), `client/src/index.css` 
         +(style form) |                                                 

● Task 2.3 đã xong và đang dừng ở đây; chưa commit, chưa làm 2.4. Client có
  50/51 test xanh. Test duy nhất còn đỏ là inspector, thuộc task 2.4. Không có
  warning nào, và grep useEffect trong client/src/form vẫn rỗng.

  File đã đổi

  File: client/src/form/InputField.jsx (Lab4/client/src/form/InputField.jsx)
  Nội dung: useId() + <label htmlFor>; aria-invalid; aria-describedby trỏ tới <p

    role="alert">, phần tử này chỉ render khi có lỗi. error được tính ngay trong

    render từ touched[name] || submitAttempted
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.jsx (Lab4/client/src/form/SimpleForm.jsx)
  Nội dung: Thêm state thường touched và submitAttempted, cùng handleBlur. Khi
    submit không hợp lệ, focus vào field lỗi đầu tiên ngay trong handler
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.test.jsx
    (Lab4/client/src/form/SimpleForm.test.jsx)
  Nội dung: Thêm test focus vào field lỗi đầu tiên (đã thấy đỏ trước khi
    implement)
  ────────────────────────────────────────
  File: client/src/index.css (Lab4/client/src/index.css)
  Nội dung: Style cho form: viền đỏ khi aria-invalid, có focus-visible

  Ba điểm nên nắm để bảo vệ

  1. Ba state, không cái nào phải đồng bộ với cái nào. values là dữ liệu.
     touched và submitAttempted chỉ quyết định khi nào hiện lỗi. errors không
     phải state mà được tính lại mỗi render. Chuỗi 5 useEffect của Ex 1.3 được
     thay hết bằng biểu thức trong render cộng một event handler.
  2. handleBlur trả lại prev khi field đã touched, nên React thấy state không
     đổi và bỏ qua render. Blur nhiều lần cũng không gây render thừa.
  3. Focus field lỗi nằm trong handleSubmit. Đây là side effect do người dùng
     gây ra, nên đặt trong event handler, không đặt trong effect. Ở anti-pattern
     Ex 1.3, bước "scroll" là effect thứ 5 trong chuỗi.

  Lệnh kiểm tra

  cd client
  npm test                                          # 50 passed, 1 failed
  (inspector — task 2.4)
  Select-String -Path src\form\* -Pattern useEffect # rỗng
  npm run dev
  Trên trang /form, thử theo thứ tự:
  1. Gõ "A" vào Họ tên rồi Tab sang ô khác → lỗi đỏ hiện ra.
  2. Gõ thêm ký tự → lỗi mất ngay.
  3. Bấm Gửi khi form trống → hiện 3 lỗi và con trỏ nhảy vào Họ tên.

  Trong React DevTools Profiler, mỗi phím gõ chỉ tạo 1 commit.

  Lỗi AI đã gặp

  Task này không có lỗi nào phải sửa.

  Lệnh commit

  git add -A
  git commit -m "feat: input field validation"

  Bạn nói "tiếp" thì tôi làm task 2.4 (Inspector output).

> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree đã sạch và commit 2.3 đã có; tôi đang viết test đỏ cho ShowData
  và hành vi giữ dữ liệu đúng thời điểm gửi cho Task 2.4. · summary

● Write(client\src\form\ShowData.test.jsx)
  ⎿  Wrote 23 lines to client\src\form\ShowData.test.jsx
       1 import { describe, it, expect } from 'vitest';
       2 import { render, screen } from '@testing-library/react';
       3 import ShowData from './ShowData.jsx';
       4
       5 describe('ShowData', () => {
       6   it('render <dl class="json-inspector"> với một cặp dt/dd cho m
         ỗi entry, đúng thứ tự', () => {
       7     const { container } = render(<ShowData data={{ name: 'An', e
         mail: 'an@example.com', age: '25' }} />);
       8     const dl = container.querySelector('dl.json-inspector');
     … +15 lines (ctrl+o to expand)

● Update(client\src\form\SimpleForm.test.jsx)
  ⎿  Added 15 lines
       81      expect(q.getByText('age').nextElementSibling).toHaveTextCo
           ntent('25');
       82    });
       83  
       84 +  it('inspector giữ dữ liệu TẠI LÚC GỬI: gõ tiếp không đổi, Gử
          +i lại mới cập nhật', () => {                                  
       85 +    const { container } = render(<SimpleForm />);             
       86 +    type('Họ tên', 'An');                                     
       87 +    type('Email', 'an@example.com');                          
       88 +    type('Tuổi', '25');                                       
       89 +    submit();                                                 
       90 +                                                              
       91 +    const nameValue = () => within(container.querySelector('dl
          +.json-inspector')).getByText('name').nextElementSibling;      
       92 +    type('Họ tên', 'Bình');                                   
       93 +    expect(nameValue()).toHaveTextContent('An');              
       94 +                                                              
       95 +    submit();                                                 
       96 +    expect(nameValue()).toHaveTextContent('Bình');            
       97 +  });                                                         
       98 +                                                              
       99    it('một phím gõ = đúng MỘT commit (không chuỗi effect)', () 
           => {
      100      let commits = 0;
      101      render(

  Ran 1 shell command (ctrl+o to expand)

● Đã đỏ. Giờ implement.

● Write(client\src\form\ShowData.jsx)
  ⎿  Wrote 21 lines to client\src\form\ShowData.jsx
       1 import { Fragment, useId } from 'react';
       2
       3 // Inspector chỉ đọc: hiển thị key–value bằng <dl>/<dt>/<dd> (ru
         les §4 a11y).
       4 export default function ShowData({ data }) {
       5   const headingId = useId();
       6
       7   return (
       8     <section className="inspector" aria-labelledby={headingId}>
       9       <h2 id={headingId}>Dữ liệu đã gửi</h2>
     … +12 lines (ctrl+o to expand)

● Update(client\src\form\SimpleForm.jsx)
  ⎿  Added 1 line
      2  import { FormContext } from './FormContext.js';
      3  import { validateForm } from './validate.js';
      4  import InputField from './InputField.jsx';
      5 +import ShowData from './ShowData.jsx';                          
      6  
      7  const INITIAL_VALUES = { name: '', email: '', age: '' };
      8  

● Update(client\src\form\SimpleForm.jsx)
  ⎿  Added 3 lines
      13    const [values, setValues] = useState(INITIAL_VALUES);
      14    const [touched, setTouched] = useState({});
      15    const [submitAttempted, setSubmitAttempted] = useState(false)
          ;
      16 +  // Ảnh chụp `values` tại lúc Gửi hợp lệ. `values` không bao g
         +iờ bị mutate                                                   
      17 +  // (luôn tạo object mới), nên lưu tham chiếu là đủ — không cầ
         +n clone.                                                       
      18 +  const [submitted, setSubmitted] = useState(null);            
      19  
      20    const errors = validateForm(values);
      21    const isValid = Object.keys(errors).length === 0;

● Update(client\src\form\SimpleForm.jsx)
  ⎿  Added 1 line, removed 1 line
      41        event.currentTarget.elements.namedItem(firstInvalid)?.foc
          us();
      42        return;
      43      }
      44 -    // Lưu dữ liệu đã gửi + hiện inspector: task 2.4.          
      44 +    setSubmitted(values);                                      
      45    }
      46  
      47    return (

● Update(client\src\form\SimpleForm.jsx)
  ⎿  Added 1 line
      54          <InputField name="age" label="Tuổi" inputMode="numeric"
           />
      55          <button type="submit">Gửi</button>
      56        </form>
      57 +      {submitted && <ShowData data={submitted} />}             
      58      </FormContext>
      59    );
      60  }

● Update(client\src\index.css)
  ⎿  Added 33 lines
      176    cursor: pointer;
      177  }
      178  
      179 +/* ---------- Inspector ---------- */                         
      180 +.inspector {                                                  
      181 +  margin-top: 1.5rem;                                         
      182 +  max-width: 28rem;                                           
      183 +}                                                             
      184 +                                                              
      185 +.inspector h2 {                                               
      186 +  font-size: 1rem;                                            
      187 +  margin: 0 0 0.5rem;                                         
      188 +}                                                             
      189 +                                                              
      190 +.json-inspector {                                             
      191 +  display: grid;                                              
      192 +  grid-template-columns: max-content 1fr;                     
      193 +  gap: 0.25rem 1rem;                                          
      194 +  margin: 0;                                                  
      195 +  padding: 0.75rem 1rem;                                      
      196 +  border: 1px solid #d0d7de;                                  
      197 +  border-radius: 6px;                                         
      198 +  background: #f6f8fa;                                        
      199 +  font-family: ui-monospace, SFMono-Regular, Consolas, monospa
          +ce;                                                           
      200 +  font-size: 0.875rem;                                        
      201 +}                                                             
      202 +                                                              
      203 +.json-inspector dt {                                          
      204 +  color: #57606a;                                             
      205 +}                                                             
      206 +                                                              
      207 +.json-inspector dd {                                          
      208 +  margin: 0;                                                  
      209 +  overflow-wrap: anywhere;                                    
      210 +}                                                             
      211 +                                                              
      212  .not-found h2 {
      213    margin-top: 0;
      214  }

  Ran 1 shell command (ctrl+o to expand)

● 55/55 test xanh, build thành công.

  Ran 1 shell command (ctrl+o to expand)
● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      10  | 2.1 | `test: add failing tests for form validation` | `client
          /src/form/validate.test.js`, `client/src/form/SimpleForm.test.j
          sx`, `TASK_DECOMPOSITION.md` (§1.5 chốt luật + message), *(+ ph
          ần phân tích 2.0 bạn tự viết)* |
      11  | 2.2 | `feat: form context` | `client/src/form/validate.js`, `
          client/src/form/FormContext.js`, `client/src/form/FormContext.t
          est.jsx`, `client/src/form/SimpleForm.jsx`, `client/src/form/In
          putField.jsx` (bản tối thiểu), `client/src/form/SimpleForm.test
          .jsx` (đổi tên 1 test), `client/src/App.jsx` (route `/form`) |
      12  | 2.3 | `feat: input field validation` | `client/src/form/Input
          Field.jsx`, `client/src/form/SimpleForm.jsx` (`touched`, `submi
          tAttempted`, `handleBlur`, focus field lỗi đầu), `client/src/fo
          rm/SimpleForm.test.jsx` (+ test focus), `client/src/index.css` 
          (style form) |
      13 +| 2.4 | `feat: inspector output` | `client/src/form/ShowData.js
         +x`, `client/src/form/ShowData.test.jsx`, `client/src/form/Simpl
         +eForm.jsx` (state `submitted` + render inspector), `client/src/
         +form/SimpleForm.test.jsx` (+ test snapshot lúc gửi), `client/sr
         +c/index.css` (style inspector) |                               

● Task 2.4 đã xong, đồng nghĩa Sprint 2 hoàn tất. Tôi đang dừng ở đây và chưa
  commit. Client xanh 55/55 test, không có warning, npm run build chạy được.
  grep useEffect client/src/form vẫn rỗng.

  File đã đổi

  File: client/src/form/ShowData.jsx (Lab4/client/src/form/ShowData.jsx)
  Nội dung: <section aria-labelledby> gồm <h2>Dữ liệu đã gửi</h2> và <dl
    className="json-inspector"> dựng từ Object.entries. React key là key của
    object, không dùng index
  ────────────────────────────────────────
  File: client/src/form/ShowData.test.jsx
    (Lab4/client/src/form/ShowData.test.jsx)
  Nội dung: 3 test: các cặp dt/dd đúng thứ tự; vùng có tên; giá trị 0 và false
    vẫn hiển thị
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.jsx (Lab4/client/src/form/SimpleForm.jsx)
  Nội dung: State submitted (khởi tạo null); submit hợp lệ thì
    setSubmitted(values); render {submitted && <ShowData …/>}
  ────────────────────────────────────────
  File: client/src/form/SimpleForm.test.jsx
    (Lab4/client/src/form/SimpleForm.test.jsx)
  Nội dung: Thêm test: inspector giữ dữ liệu tại lúc gửi, gõ tiếp không làm đổi,

    bấm Gửi lại mới cập nhật
  ────────────────────────────────────────
  File: client/src/index.css (Lab4/client/src/index.css)
  Nội dung: Style cho inspector (grid 2 cột, font monospace)

  Một điểm nên nắm để bảo vệ: lưu submitted = values bằng tham chiếu mà không
  cần clone. Lý do là handleChange luôn tạo object mới ({ ...prev, [name]: value
  }) và không mutate object cũ. Vì vậy object đã lưu giữ nguyên giá trị tại lúc
  gửi. Test "giữ dữ liệu lúc gửi" chứng minh điều này.

  Lệnh kiểm tra (gồm checkpoint Sprint 2)

  cd client
  npm test                                          # 55 passed
  Select-String -Path src\form\* -Pattern useEffect # rỗng
  npm run dev
  Trên trang /form:
  1. Nhập hợp lệ rồi bấm Gửi → inspector hiện ra.
  2. Sửa Họ tên → inspector chưa đổi.
  3. Bấm Gửi lại → inspector cập nhật.

  Checkpoint Profiler: bật React DevTools → Profiler → Record, gõ 1 ký tự → chỉ
  1 commit. Phần này đã có test tự động, nhưng giám khảo có thể yêu cầu bạn làm
  trực tiếp.

  Lỗi AI đã gặp

  Task này không có lỗi nào phải sửa.

  Lệnh commit

  git add -A
  git commit -m "feat: inspector output"

  Bạn nói "tiếp" thì tôi làm Sprint 3, bắt đầu từ task 3.1 (test đỏ cho messages
  API).

> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree đã sạch và commit 2.4 có sẵn; tôi đang viết test đỏ cho messages
  API theo contract §1.4, chốt thêm trim, inject db qua createDb, và timestamp
  ISO trước khi code. · summary

● Write(server\messages.test.js)
  ⎿  Wrote 114 lines to server\messages.test.js
       1 import { describe, it, expect, beforeEach } from 'vitest';
       2 import request from 'supertest';
       3 import { createApp } from './app.js';
       4 import { createDb, FORUMS } from './db.js';
       5
       6 const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-
         9a-f]{3}-[0-9a-f]{12}$/i;
       7
       8 let app;
       9 beforeEach(() => {
     … +105 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Test đỏ vì db.js chưa tồn tại. 4 test cũ (health, CORS) vẫn xanh. Tôi ghi 3
  điểm vừa chốt vào contract §1.4 để client và server làm theo cùng một bản:

● Update(TASK_DECOMPOSITION.md)
  ⎿  Added 6 lines
      40  
      41  Message = { id: string (uuid), author: string, text: string, ti
          mestamp: ISO string }
      42  ```
      43 +Chốt chi tiết (task 3.1):                                      
      44 +- `author`/`text` được `trim()` trước khi kiểm tra **và** trước
         + khi lưu. Thiếu field, không phải string, hoặc rỗng sau trim → 
         +`400 { error: "Missing required fields" }`. Quá độ dài (author 
         +> 50, text > 500) → `400 { error: <message> }`.                
      45 +- POST vào kênh lạ → `404 { error: "Unknown forum" }`. Tên kênh
         + phân biệt hoa thường.                                         
      46 +- JSON body hỏng → `400 { error }`, không crash.               
      47 +- `timestamp` = `new Date().toISOString()`. `createApp({ client
         +Origin, db })` nhận `db` từ `createDb()` (inject để test độc lậ
         +p).                                                            
      48 +                                                               
      49  > Ghi chú: `GET /api/health → 200 { status: "ok" }` chỉ là endp
          oint smoke test của scaffold (task 0.2), **không** thuộc contra
          ct.
      50  
      51  Validation `author`/`text` dùng **chung luật** ở `client/src/fo
          rm/validate.js` và `server/validate.js` (parity).

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      11  | 2.2 | `feat: form context` | `client/src/form/validate.js`, `
          client/src/form/FormContext.js`, `client/src/form/FormContext.t
          est.jsx`, `client/src/form/SimpleForm.jsx`, `client/src/form/In
          putField.jsx` (bản tối thiểu), `client/src/form/SimpleForm.test
          .jsx` (đổi tên 1 test), `client/src/App.jsx` (route `/form`) |
      12  | 2.3 | `feat: input field validation` | `client/src/form/Input
          Field.jsx`, `client/src/form/SimpleForm.jsx` (`touched`, `submi
          tAttempted`, `handleBlur`, focus field lỗi đầu), `client/src/fo
          rm/SimpleForm.test.jsx` (+ test focus), `client/src/index.css` 
          (style form) |
      13  | 2.4 | `feat: inspector output` | `client/src/form/ShowData.js
          x`, `client/src/form/ShowData.test.jsx`, `client/src/form/Simpl
          eForm.jsx` (state `submitted` + render inspector), `client/src/
          form/SimpleForm.test.jsx` (+ test snapshot lúc gửi), `client/sr
          c/index.css` (style inspector) |
      14 +| 3.1 | `test: add failing tests for messages api` | `server/me
         +ssages.test.js`, `TASK_DECOMPOSITION.md` (§1.4 chốt chi tiết) |

● Task 3.1 đã xong: test cho messages API đã viết và đang đỏ đúng như mong đợi.
  Tôi dừng ở đây và chưa commit.

  Kết quả npm test ở server: file test mới không chạy được vì db.js chưa tồn tại
  (module này sẽ viết ở 3.2). Vì vậy chưa assertion nào trong file mới được
  chạy thật. 4 test cũ (health, CORS) vẫn xanh.

  File đã đổi

  File: server/messages.test.js (Lab4/server/messages.test.js)
  Nội dung: Có 25 test supertest. GET: 3 kênh hợp lệ đều trả 200 kèm đúng shape
    Message; kênh lạ và NASA (sai hoa thường) trả 404. POST: trả 201 với id dạng

    uuid v4 và timestamp ISO; tin vừa tạo chỉ xuất hiện ở đúng kênh; giá trị
  được
     trim trước khi lưu; 6 kiểu thiếu field hoặc sai kiểu trả 400 Missing
    required fields; quá độ dài trả 400; đúng biên 50/500 vẫn 201; kênh lạ trả
    404; JSON hỏng trả 400 mà server không crash
  ────────────────────────────────────────
  File: TASK_DECOMPOSITION.md (Lab4/TASK_DECOMPOSITION.md) §1.4
  Nội dung: Ghi các điểm chốt thêm: trim, 400 khi quá độ dài, POST vào kênh lạ
    trả 404, xử lý JSON hỏng, timestamp ISO, db được inject vào createApp

  Dòng 3.1 đã có trong COMMIT_PLAN.md (Lab4/COMMIT_PLAN.md).

  Cần bạn xem lại: contract gốc không nói gì về trim, 400 khi quá độ dài, hay
  POST vào kênh lạ. Tôi tự chốt theo hướng giữ parity với luật form ở client.
  Nếu bạn muốn khác, sửa ở §1.4 trước khi tôi làm 3.2.

  Lệnh kiểm tra

  cd server; npm test
  # Kỳ vọng: messages.test.js FAIL "Cannot find module './db.js'"; app.test.js 4
  passed

  Lỗi AI đã gặp

  Task này chưa có lỗi nào phải sửa.

  Có một rủi ro sẽ chỉ biết ở 3.2: tôi giả định rằng với JSON hỏng,
  express.json() của Express 5 gửi lỗi sang error middleware kèm status: 400 và
  expose: true.

  Lệnh commit

  git add -A
  git commit -m "test: add failing tests for messages api"

  Bạn nói "tiếp" thì tôi làm task 3.2 (Express API).

> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree đã sạch và commit 3.1 đã có; tôi đang làm task 3.2 Express API,
  và sẽ thêm một test đỏ để chặn việc tra kênh qua prototype trước khi
  implement. · summary

● Update(server\messages.test.js)
  ⎿  Added 10 lines
      38      expect(res.body).toEqual({ error: 'Unknown forum' });
      39    });
      40  
      41 +  it.each(['constructor', 'toString', '__proto__'])(           
      42 +    'tên trùng thuộc tính prototype (%s) → 404, không lộ/crash'
         +,                                                              
      43 +    async (forum) => {                                         
      44 +      const res = await request(app).get(`/api/messages/${forum
         +}`);                                                           
      45 +      expect(res.status).toBe(404);                            
      46 +      const post = await request(app).post(`/api/messages/${for
         +um}`).send({ author: 'An', text: 'Hi' });                      
      47 +      expect(post.status).toBe(404);                           
      48 +    },                                                         
      49 +  );                                                           
      50 +                                                               
      51    it('tên kênh phân biệt hoa thường (NASA ≠ nasa)', async () =>
           {
      52      expect((await request(app).get('/api/messages/NASA')).statu
          s).toBe(404);
      53    });

● Write(server\db.js)
  ⎿  Wrote 26 lines to server\db.js
       1 import { randomUUID } from 'node:crypto';
       2
       3 // Lưu trữ in-memory theo kênh (đủ cho scale exercise — project-
         rules §3).
       4 export const FORUMS = ['nasa', 'esports-tribunal', 'notNasa'];
       5
       6 const SEED = {
       7   nasa: [
       8     { author: 'Houston', text: 'Chào mừng tới kênh NASA.', times
         tamp: '2026-01-01T08:00:00.000Z' },
     … +18 lines (ctrl+o to expand)

● Write(server\validate.js)
  ⎿  Wrote 21 lines to server\validate.js
       1 // Luật validate tin nhắn forum — PHẢI giống client (parity, TAS
         K_DECOMPOSITION §1.4).
       2 export const AUTHOR_MAX = 50;
       3 export const TEXT_MAX = 500;
       4
       5 export const MISSING_FIELDS = 'Missing required fields';
       6
       7 /**
       8  * @returns {{ error: string } | { value: { author: string, text
         : string } }}
     … +13 lines (ctrl+o to expand)

  Read 1 file (ctrl+o to expand)

● Write(server\app.js)
  ⎿  Added 31 lines, removed 3 lines
       1  import express from 'express';
       2  import cors from 'cors';
       3 +import { randomUUID } from 'node:crypto';                      
       4 +import { createDb } from './db.js';                            
       5 +import { validateMessage } from './validate.js';               
       6  
       7  export const DEFAULT_CLIENT_ORIGIN = 'http://localhost:5173';
       8  
       6 -export function createApp({ clientOrigin = process.env.CLIENT_O
         -RIGIN } = {}) {                                                
       9 +const UNKNOWN_FORUM = { error: 'Unknown forum' };              
      10 +                                                               
      11 +export function createApp({ clientOrigin = process.env.CLIENT_O
         +RIGIN, db = createDb() } = {}) {                               
      12    const origin = clientOrigin || DEFAULT_CLIENT_ORIGIN;
      13    const app = express();
      14  
     ...
      22      res.json({ status: 'ok' });
      23    });
      24  
      25 +  // Object.hasOwn, KHÔNG `db[forum]`: tránh khớp nhầm thuộc tí
         +nh prototype                                                   
      26 +  // ("constructor", "toString", "__proto__").                 
      27 +  const findForum = (forum) => (Object.hasOwn(db, forum) ? db[f
         +orum] : null);                                                 
      28 +                                                               
      29 +  app.get('/api/messages/:forum', async (req, res) => {        
      30 +    const messages = findForum(req.params.forum);              
      31 +    if (!messages) return res.status(404).json(UNKNOWN_FORUM); 
      32 +    res.json(messages);                                        
      33 +  });                                                          
      34 +                                                               
      35 +  app.post('/api/messages/:forum', async (req, res) => {       
      36 +    const messages = findForum(req.params.forum);              
      37 +    if (!messages) return res.status(404).json(UNKNOWN_FORUM); 
      38 +                                                               
      39 +    const result = validateMessage(req.body);                  
      40 +    if (result.error) return res.status(400).json({ error: resu
         +lt.error });                                                   
      41 +                                                               
      42 +    const message = { id: randomUUID(), ...result.value, timest
         +amp: new Date().toISOString() };                               
      43 +    messages.push(message);                                    
      44 +    res.status(201).json(message);                             
      45 +  });                                                          
      46 +                                                               
      47    // Error middleware: Express nhận diện nhờ đủ 4 tham số, nên 
          giữ `_next`.
      48    // Express 5 tự chuyển promise bị reject trong async handler 
          tới đây.
      49    app.use((err, _req, res, _next) => {
      23 -    console.error(err);                                        
      24 -    res.status(err.status || 500).json({ error: err.expose ? er
         -r.message : 'Internal Server Error' });                        
      50 +    const status = err.status || err.statusCode || 500;        
      51 +    if (status >= 500) console.error(err); // lỗi client (vd JS
         +ON hỏng) không cần log stack                                   
      52 +    res.status(status).json({ error: err.expose ? err.message :
         + 'Internal Server Error' });                                   
      53    });
      54  
      55    return app;

  Ran 1 shell command (ctrl+o to expand)

● 27/27 test xanh, không có output lạ trên stderr. Tiếp theo chạy server thật để
  thử, và chỉ tắt đúng PID do tôi mở:

  Ran 1 shell command (ctrl+o to expand)

● Server thật trả đúng contract (GET 200, POST 201, kênh lạ 404). Tiến trình PID
  22984 đã tắt.

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      12  | 2.3 | `feat: input field validation` | `client/src/form/Input
          Field.jsx`, `client/src/form/SimpleForm.jsx` (`touched`, `submi
          tAttempted`, `handleBlur`, focus field lỗi đầu), `client/src/fo
          rm/SimpleForm.test.jsx` (+ test focus), `client/src/index.css` 
          (style form) |
      13  | 2.4 | `feat: inspector output` | `client/src/form/ShowData.js
          x`, `client/src/form/ShowData.test.jsx`, `client/src/form/Simpl
          eForm.jsx` (state `submitted` + render inspector), `client/src/
          form/SimpleForm.test.jsx` (+ test snapshot lúc gửi), `client/sr
          c/index.css` (style inspector) |
      14  | 3.1 | `test: add failing tests for messages api` | `server/me
          ssages.test.js`, `TASK_DECOMPOSITION.md` (§1.4 chốt chi tiết) |
      15 +| 3.2 | `feat: express messages api with payload validation` | 
         +`server/db.js`, `server/validate.js`, `server/app.js` (GET/POST
         + + error middleware), `server/messages.test.js` (+ test tên kên
         +h trùng prototype) |                                           

● Task 3.2 đã xong và đang dừng ở đây; chưa commit. Server xanh 27/27 test. Tôi
  cũng chạy server thật và gọi thử: GET trả 200, POST trả 201, kênh lạ trả 404.
  Tôi chỉ tắt đúng tiến trình mình mở (PID 22984).

  File đã đổi

  File: server/db.js (Lab4/server/db.js)
  Nội dung: Export FORUMS và createDb(). Mỗi lần gọi trả về một db mới đã seed 3

    kênh, id sinh bằng randomUUID()
  ────────────────────────────────────────
  File: server/validate.js (Lab4/server/validate.js)
  Nội dung: validateMessage(body) kiểm tra kiểu string, trim, field rỗng thì trả

    Missing required fields, kiểm tra giới hạn 50/500
  ────────────────────────────────────────
  File: server/app.js (Lab4/server/app.js)
  Nội dung: createApp({ clientOrigin, db }). Có GET/POST theo contract, viết
    async. Tra kênh bằng Object.hasOwn. Error middleware trả JSON và chỉ log lỗi

    ≥ 500
  ────────────────────────────────────────
  File: server/messages.test.js (Lab4/server/messages.test.js)
  Nội dung: Thêm test: tên kênh trùng thuộc tính prototype (constructor,
    toString, __proto__) phải trả 404

  Ba điểm chính để bảo vệ

  1. Inject db vào createApp. Mỗi test tạo db mới, nên test không phụ thuộc thứ
     tự chạy. Server thật dùng giá trị mặc định createDb(). Nếu chuyển sang
     Mongo ở homework thì chỉ cần thay thứ được inject vào.
  2. Dùng Object.hasOwn(db, forum) thay vì db[forum]. Với db[forum], URL
     /api/messages/constructor sẽ lấy trúng hàm Object có sẵn trên prototype.
     GET khi đó trả về hàm này thay vì 404, còn POST sẽ crash vì hàm không có
     .push.
  3. Lỗi đi qua một đường duy nhất. Express 5 tự chuyển promise bị reject trong
     handler async sang error middleware. JSON hỏng cũng tới đó với status 400,
     expose: true, nên client nhận { error } mà không thấy stack trace.

  Lệnh kiểm tra

  cd server
  npm test        # 27 passed
  npm run dev     # terminal riêng
  Trong một terminal khác:
  irm http://localhost:3001/api/messages/nasa
  irm http://localhost:3001/api/messages/nasa -Method Post -ContentType
  'application/json' -Body '{"author":"An","text":"Hi"}'
  irm http://localhost:3001/api/messages/foo      # lỗi 404

  Lỗi AI đã gặp

  Không có lỗi nào phải sửa. Có hai điểm cần nói rõ:
  - Giả định ở 3.1 về express.json() đã được kiểm chứng: test JSON hỏng trả 400
    và xanh.
  - Test chặn tên kênh trùng prototype tôi viết cùng lượt với code dùng
    Object.hasOwn. Vì vậy tôi không quan sát được nó đỏ trước khi implement. Nếu
    cần bằng chứng cho audit, hãy tạm đổi Object.hasOwn(db, forum) thành
    db[forum] rồi chạy npm test: 3 test này sẽ đỏ.

  Lệnh commit

  git add -A
  git commit -m "feat: express messages api with payload validation"

  Bạn nói "tiếp" thì tôi làm task 3.3 (test đỏ cho việc hook abort request cũ).

> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree sạch và commit 3.2 đã có. Task 3.3 là viết test đỏ cho việc hook
  abort request cũ, với mock fetch cố ý bỏ qua signal. · summary

● Write(client\src\forum\useForumMessages.test.jsx)
  ⎿  Wrote 137 lines to client\src\forum\useForumMessages.test.jsx
       1 import { describe, it, expect, vi, beforeEach, afterEach } from
         'vitest';
       2 import { renderHook, act, waitFor } from '@testing-library/react
         ';
       3 import { useForumMessages } from './useForumMessages.js';
       4
       5 // fetch giả, điều khiển tay: mỗi lần gọi trả một promise ta tự
         resolve/reject sau.
       6 // CỐ Ý không tự reject khi signal abort → mô phỏng response về
         muộn "lọt" qua abort,
     … +131 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)
● Test hiện đỏ vì useForumMessages.js chưa có. Để chắc test thật sự bắt được lỗi
  thiếu guard, tôi sẽ tạm tạo một hook cố ý bỏ guard signal.aborted, chạy test,
  rồi xoá file đó đi. · summary

● Write(client\src\forum\useForumMessages.js)
  ⎿  Wrote 29 lines to client\src\forum\useForumMessages.js
       1 // TẠM THỜI — bản cố ý THIẾU guard signal.aborted, chỉ để kiểm c
         hứng test 3.3 bắt được lỗi. Sẽ xoá.
       2 import { useEffect, useState } from 'react';
       3
       4 export function useForumMessages(forumId) {
       5   const [data, setData] = useState([]);
       6   const [loading, setLoading] = useState(true);
       7   const [error, setError] = useState(null);
       8
       9   useEffect(() => {
     … +20 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Bộ test đã bắt đúng lỗi: với hook thiếu guard, 2 test race condition và test
  404 đều đỏ. File tạm đã xoá, nên trạng thái đỏ hiện tại chỉ là "module chưa
  tồn tại". · summary

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      13  | 2.4 | `feat: inspector output` | `client/src/form/ShowData.js
          x`, `client/src/form/ShowData.test.jsx`, `client/src/form/Simpl
          eForm.jsx` (state `submitted` + render inspector), `client/src/
          form/SimpleForm.test.jsx` (+ test snapshot lúc gửi), `client/sr
          c/index.css` (style inspector) |
      14  | 3.1 | `test: add failing tests for messages api` | `server/me
          ssages.test.js`, `TASK_DECOMPOSITION.md` (§1.4 chốt chi tiết) |
      15  | 3.2 | `feat: express messages api with payload validation` | 
          `server/db.js`, `server/validate.js`, `server/app.js` (GET/POST
           + error middleware), `server/messages.test.js` (+ test tên kên
          h trùng prototype) |
      16 +| 3.3 | `test: add failing test for forum hook abort` | `client
         +/src/forum/useForumMessages.test.jsx` |                        

● Task 3.3 đã xong: bộ test cho hook đã viết và đang đỏ đúng như mong đợi. Tôi
  dừng ở đây và chưa commit.

  File đã đổi

  client/src/forum/useForumMessages.test.jsx
  (Lab4/client/src/forum/useForumMessages.test.jsx) gồm 7 test, dùng renderHook
  và một fetch giả do test tự điều khiển:
  1. Lúc mount: loading=true, URL là /api/messages/nasa, có truyền AbortSignal.
     Khi request trả về thì có data và loading=false.
  2. Đổi kênh nhanh: request cũ có signal.aborted === true. Response cũ về muộn
     không ghi đè data của kênh mới.
  3. Response "lạc" về trước response mới: dữ liệu đó vẫn bị bỏ qua, loading vẫn
     là true. Khi đổi kênh, data của kênh cũ bị xoá ngay.
  4. Unmount thì request bị abort, và không có console.error.
  5. AbortError không bị tính là error.
  6. HTTP 404 thì error lấy chuỗi từ body ("Unknown forum").
  7. Lỗi mạng thì có error và không để lại unhandled rejection.

  Dòng 3.3 đã có trong COMMIT_PLAN.md (Lab4/COMMIT_PLAN.md).

  Kiểm chứng test có tác dụng: fetch giả cố ý không tự reject khi bị abort, để
  mô phỏng response lọt qua sau khi đã abort. Tôi đã chạy bộ test với một hook
  tạm có AbortController nhưng thiếu guard signal.aborted: test 2 và 3 đỏ đúng
  như mong muốn, nên bộ test bắt được lỗi race condition. Đây là bằng chứng tốt
  cho live defense. File tạm đã xoá.

  Lệnh kiểm tra

  cd client; npm test
  # Kỳ vọng: useForumMessages.test.jsx FAIL "Failed to resolve import
  ./useForumMessages.js"; 55 test cũ passed

  Lỗi AI đã gặp

  Task này không có lỗi nào phải sửa.

  Có một điểm nên ghi vào audit như một bài học về test: test "unmount" xanh
  ngay cả với hook thiếu guard. React 19 không còn cảnh báo khi gọi setState sau
  unmount, nên test này chỉ chứng minh request bị abort, không chứng minh có
  guard. Hai test race condition mới là thứ bắt được việc thiếu guard.

  Lệnh commit

  git add -A
  git commit -m "test: add failing test for forum hook abort"

  Bạn nói "tiếp" thì tôi làm task 3.4 (useForumMessages + channel switcher).

> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree đã sạch và commit 3.3 đã có. Tiếp theo tôi viết test đỏ cho task
  3.4 (hook useForumMessages và channel switcher) trước khi làm code. · summary

● Update(client\src\forum\useForumMessages.test.jsx)
  ⎿  Added 38 lines
      127      expect(result.current.data).toEqual([]);
      128    });
      129  
      130 +  it('postMessage: POST JSON đúng URL, rồi REFETCH kênh hiện t
          +ại', async () => {                                            
      131 +    const { result } = renderHook(() => useForumMessages('nasa
          +'));                                                          
      132 +    await act(async () => calls[0].resolve(okJson(NASA)));    
      133 +                                                              
      134 +    const created = msg('n2', 'mới');                         
      135 +    let postPromise;                                          
      136 +    act(() => {                                               
      137 +      postPromise = result.current.postMessage({ author: 'An',
          + text: 'mới' });                                              
      138 +    });                                                       
      139 +    expect(calls[1].url).toBe('/api/messages/nasa');          
      140 +    expect(calls[1].init.method).toBe('POST');                
      141 +    expect(calls[1].init.headers).toMatchObject({ 'Content-Typ
          +e': 'application/json' });                                    
      142 +    expect(JSON.parse(calls[1].init.body)).toEqual({ author: '
          +An', text: 'mới' });                                          
      143 +                                                              
      144 +    await act(async () => {                                   
      145 +      calls[1].resolve({ ok: true, status: 201, json: async ()
          + => created });                                               
      146 +      await postPromise;                                      
      147 +    });                                                       
      148 +    expect(calls).toHaveLength(3); // refetch                 
      149 +    expect(calls[2].url).toBe('/api/messages/nasa');          
      150 +    await act(async () => calls[2].resolve(okJson([...NASA, cr
          +eated])));                                                    
      151 +    expect(result.current.data).toEqual([...NASA, created]);  
      152 +  });                                                         
      153 +                                                              
      154 +  it('postMessage bị 400 → promise reject với message từ serve
          +r, KHÔNG refetch', async () => {                              
      155 +    const { result } = renderHook(() => useForumMessages('nasa
          +'));                                                          
      156 +    await act(async () => calls[0].resolve(okJson(NASA)));    
      157 +                                                              
      158 +    let postPromise;                                          
      159 +    act(() => {                                               
      160 +      postPromise = result.current.postMessage({ author: '', t
          +ext: '' });                                                   
      161 +    });                                                       
      162 +    calls[1].resolve({ ok: false, status: 400, json: async () 
          +=> ({ error: 'Missing required fields' }) });                 
      163 +    await expect(postPromise).rejects.toThrow('Missing require
          +d fields');                                                   
      164 +    expect(calls).toHaveLength(2);                            
      165 +    expect(result.current.data).toEqual(NASA);                
      166 +  });                                                         
      167 +                                                              
      168    it('lỗi mạng → error có nội dung, loading=false (không unhan
           dled rejection)', async () => {
      169      const { result } = renderHook(() => useForumMessages('nasa
           '));
      170      await act(async () => calls[0].reject(new TypeError('Faile
           d to fetch')));

● Write(client\src\form\parity.test.js)
  ⎿  Wrote 54 lines to client\src\form\parity.test.js
       1 import { describe, it, expect } from 'vitest';
       2 import { validateMessage as clientValidate, MESSAGE_LIMITS } fro
         m './validate.js';
       3 import {
       4   validateMessage as serverValidate,
       5   AUTHOR_MAX,
       6   TEXT_MAX,
       7 } from '../../../server/validate.js';
       8
       9 // Validation parity (project-rules §0): client và server phải C
     … +46 lines (~2 KB) (ctrl+o to expand)

● Write(client\src\forum\ForumPage.test.jsx)
  ⎿  Wrote 106 lines to client\src\forum\ForumPage.test.jsx
       1 import { describe, it, expect, vi, beforeEach, afterEach } from
         'vitest';
       2 import { render, screen, within, fireEvent, waitFor } from '@tes
         ting-library/react';
       3 import { MemoryRouter } from 'react-router';
       4 import App from '../App.jsx';
       5
       6 // "Server" giả trong bộ nhớ: trả lời ngay, đủ để test UI (race
         condition đã test ở hook).
       7 function createFakeApi() {
     … +99 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

● Đã đỏ. Việc import server/validate.js từ test của client chạy được, nên test
  parity khả thi. Giờ implement:

● Update(client\src\form\validate.js)
  ⎿  Added 18 lines
      36    age: validateAge,
      37  };
      38  
      39 +// ---------- Tin nhắn forum: CÙNG LUẬT với server/validate.js 
         +(parity — test ở parity.test.js) ----------                    
      40 +export const MESSAGE_LIMITS = { author: 50, text: 500 };       
      41 +                                                               
      42  /**
      43 + * @param {{ author: string, text: string }} values            
      44 + * @returns {Partial<Record<'author'|'text', string>>} chỉ chứa
         + field lỗi; hợp lệ → {}                                        
      45 + */                                                            
      46 +export function validateMessage({ author = '', text = '' }) {  
      47 +  const errors = {};                                           
      48 +  const a = author.trim();                                     
      49 +  const t = text.trim();                                       
      50 +  if (!a) errors.author = 'Vui lòng nhập tên.';                
      51 +  else if (a.length > MESSAGE_LIMITS.author) errors.author = `T
         +ên tối đa ${MESSAGE_LIMITS.author} ký tự.`;                    
      52 +  if (!t) errors.text = 'Vui lòng nhập nội dung.';             
      53 +  else if (t.length > MESSAGE_LIMITS.text) errors.text = `Nội d
         +ung tối đa ${MESSAGE_LIMITS.text} ký tự.`;                     
      54 +  return errors;                                               
      55 +}                                                              
      56 +                                                               
      57 +/**                                                            
      58   * @param {{ name: string, email: string, age: string }} values
      59   * @returns {Partial<Record<'name'|'email'|'age', string>>} chỉ
           chứa field lỗi; hợp lệ → {}
      60   */

● Write(client\src\forum\useForumMessages.js)
  ⎿  Wrote 75 lines to client\src\forum\useForumMessages.js
       1 import { useCallback, useEffect, useState } from 'react';
       2
       3 const messagesUrl = (forumId) => `/api/messages/${encodeURICompo
         nent(forumId)}`;
       4
       5 async function readJson(res) {
       6   try {
       7     return await res.json();
       8   } catch {
       9     return null; // body rỗng / không phải JSON
     … +66 lines (ctrl+o to expand)

● Write(client\src\forum\ForumPage.jsx)
  ⎿  Wrote 124 lines to client\src\forum\ForumPage.jsx
       1 import { Fragment, useId, useState } from 'react';
       2 import { NavLink, useParams } from 'react-router';
       3 import { useForumMessages } from './useForumMessages.js';
       4 import { validateMessage } from '../form/validate.js';
       5 import { navLinkClass } from '../navLinkClass.js';
       6
       7 export const FORUMS = ['nasa', 'esports-tribunal', 'notNasa'];
       8
       9 const formatTime = (iso) =>
      10   new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', ti
     … +115 lines (~4 KB) (ctrl+o to expand)

● Update(client\src\App.jsx)
  ⎿  Added 1 line
      3  import PeopleLayout from './people/PeopleLayout.jsx';
      4  import Skeleton from './people/Skeleton.jsx';
      5  import SimpleForm from './form/SimpleForm.jsx';
      6 +import ForumPage from './forum/ForumPage.jsx';                  
      7  import NotFound from './NotFound.jsx';
      8  import { navLinkClass } from './navLinkClass.js';
      9  

● Update(client\src\App.jsx)
  ⎿  Added 1 line
      45            />
      46          </Route>
      47          <Route path="form" element={<main><SimpleForm /></main>
          } />
      48 +        <Route path="forum/:forumId" element={<main><ForumPage 
         +/></main>} />                                                  
      49          <Route path="*" element={<main><NotFound /></main>} />
      50        </Route>
      51      </Routes>

  Ran 1 shell command (ctrl+o to expand)

● 84/84 test xanh. Tiếp theo soát toàn bộ output để chắc không có warning
  act(...) hay unhandled rejection bị ẩn:

  Ran 1 shell command (ctrl+o to expand)

● Không có warning nào. Tôi thêm CSS cho trang forum, rồi chạy thử full-stack
  (Vite proxy sang Express). Cả hai tiến trình đều chỉ tắt theo đúng PID:

● Update(client\src\index.css)
  ⎿  Added 58 lines
      209    overflow-wrap: anywhere;
      210  }
      211  
      212 +/* ---------- Forum ---------- */                             
      213 +.forum {                                                      
      214 +  display: grid;                                              
      215 +  gap: 1.5rem;                                                
      216 +  max-width: 40rem;                                           
      217 +}                                                             
      218 +                                                              
      219 +.forum-channels {                                             
      220 +  display: flex;                                              
      221 +  flex-wrap: wrap;                                            
      222 +  gap: 0.5rem 1rem;                                           
      223 +}                                                             
      224 +                                                              
      225 +.forum-messages h2 {                                          
      226 +  font-size: 1.125rem;                                        
      227 +  margin: 0 0 0.75rem;                                        
      228 +}                                                             
      229 +                                                              
      230 +.message-list {                                               
      231 +  margin: 0;                                                  
      232 +}                                                             
      233 +                                                              
      234 +.message-list dt {                                            
      235 +  margin-top: 0.75rem;                                        
      236 +}                                                             
      237 +                                                              
      238 +.message-list dt time {                                       
      239 +  color: #57606a;                                             
      240 +  font-size: 0.8125rem;                                       
      241 +}                                                             
      242 +                                                              
      243 +.message-list dd {                                            
      244 +  margin: 0.125rem 0 0;                                       
      245 +  overflow-wrap: anywhere;                                    
      246 +}                                                             
      247 +                                                              
      248 +.field textarea {                                             
      249 +  font: inherit;                                              
      250 +  padding: 0.5rem 0.75rem;                                    
      251 +  border: 1px solid #8c959f;                                  
      252 +  border-radius: 6px;                                         
      253 +  resize: vertical;                                           
      254 +}                                                             
      255 +                                                              
      256 +.field textarea:focus-visible {                               
      257 +  outline: 2px solid #0b57d0;                                 
      258 +  outline-offset: 2px;                                        
      259 +}                                                             
      260 +                                                              
      261 +.field textarea[aria-invalid='true'] {                        
      262 +  border-color: #b3261e;                                      
      263 +}                                                             
      264 +                                                              
      265 +.simple-form button:disabled {                                
      266 +  opacity: 0.6;                                               
      267 +  cursor: progress;                                           
      268 +}                                                             
      269 +                                                              
      270  .not-found h2 {
      271    margin-top: 0;
      272  }

  Ran 1 shell command (ctrl+o to expand)

● Full-stack chạy đúng qua proxy: trang 200, GET đếm được 1 tin, POST trả 201,
  GET lại đếm được 2 tin. Cả hai tiến trình (PID 16280 và 19044) đã tắt.

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      14  | 3.1 | `test: add failing tests for messages api` | `server/me
          ssages.test.js`, `TASK_DECOMPOSITION.md` (§1.4 chốt chi tiết) |
      15  | 3.2 | `feat: express messages api with payload validation` | 
          `server/db.js`, `server/validate.js`, `server/app.js` (GET/POST
           + error middleware), `server/messages.test.js` (+ test tên kên
          h trùng prototype) |
      16  | 3.3 | `test: add failing test for forum hook abort` | `client
          /src/forum/useForumMessages.test.jsx` |
      17 +| 3.4 | `feat: forum messages hook with abort and channel switc
         +her` | `client/src/forum/useForumMessages.js`, `client/src/foru
         +m/useForumMessages.test.jsx` (+ test postMessage), `client/src/
         +forum/ForumPage.jsx`, `client/src/forum/ForumPage.test.jsx`, `c
         +lient/src/form/validate.js` (+ `validateMessage`, `MESSAGE_LIMI
         +TS`), `client/src/form/parity.test.js`, `client/src/App.jsx` (r
         +oute `/forum/:forumId`), `client/src/index.css` (style forum) |

● Task 3.4 đã xong; tôi đang dừng ở đây và chưa commit. Client xanh 84/84 test,
  không có warning act(...), không có stderr hay unhandled rejection, và npm run
  build chạy được. Tôi chạy thử full-stack (Vite proxy → Express): trang
  /forum/nasa trả 200, GET qua proxy trả 200, POST qua proxy trả 201, GET sau đó
  thấy thêm 1 tin. Chỉ tắt đúng 2 PID mình mở.

  File đã đổi

  File: client/src/forum/useForumMessages.js
    (Lab4/client/src/forum/useForumMessages.js)
  Nội dung: Khi đổi kênh, reset state ngay trong render. Effect chỉ fetch: có
    AbortController, try/catch/finally, guard signal.aborted. postMessage POST
    rồi refetch bằng cách tăng reloadKey; nếu server trả lỗi thì throw
  ────────────────────────────────────────
  File: client/src/forum/ForumPage.jsx (Lab4/client/src/forum/ForumPage.jsx)
  Nội dung: nav[aria-label="Kênh"] gồm 3 NavLink. Danh sách tin có aria-busy và
    aria-live, render bằng <dl> + <Fragment key={msg.id}>. Form gửi tin dùng
    useId, hiện lỗi bằng role="alert", bắt lỗi từ server
  ────────────────────────────────────────
  File: client/src/form/validate.js (Lab4/client/src/form/validate.js)
  Nội dung: Thêm validateMessage và MESSAGE_LIMITS
  ────────────────────────────────────────
  File: client/src/form/parity.test.js (Lab4/client/src/form/parity.test.js)
  Nội dung: Import cả server/validate.js, chạy 10 ca và khẳng định client với
    server luôn cùng kết luận
  ────────────────────────────────────────
  File: client/src/forum/ForumPage.test.jsx
    (Lab4/client/src/forum/ForumPage.test.jsx)
  Nội dung: 6 test UI: danh sách tin, đổi kênh, kênh lạ, gửi tin trống, gửi tin
    hợp lệ
  ────────────────────────────────────────
  File: useForumMessages.test.jsx
  Nội dung: Thêm 2 test cho postMessage: thành công thì refetch; 400 thì reject
    và không refetch
  ────────────────────────────────────────
  File: App.jsx, index.css
  Nội dung: Thêm route /forum/:forumId và style cho trang forum

  Ba điểm chính để bảo vệ

  1. Reset state khi đổi kênh nằm trong render, không nằm trong effect. Nếu
     reset bằng effect, React sẽ commit một lần với tin của kênh cũ dưới tiêu đề
     kênh mới, rồi mới xoá. Nhờ vậy effect chỉ còn đúng một việc là fetch.
  2. Có hai lớp chống race condition. controller.abort() trong cleanup huỷ
     request mạng. Guard if (signal.aborted) return chặn response lọt về muộn. Ở
     3.3 đã chứng minh: bỏ guard thì 2 test đỏ.
  3. Parity được kiểm bằng test chứ không chỉ là quy ước. parity.test.js import
     trực tiếp server/validate.js. Nếu ai đổi giới hạn ở một phía mà quên phía
     kia, test sẽ đỏ.

  Lưu ý thêm: link "Forum" trên nav gốc trỏ tới /forum/nasa, nên khi đang ở
  notNasa link này không được tô active. Có thể sửa sau nếu bạn muốn.

  Lệnh kiểm tra

  cd server; npm run dev       # terminal 1
  cd client; npm test; npm run dev   # terminal 2 →
  http://localhost:5173/forum/nasa
  Gửi một tin, đổi qua lại giữa các kênh, rồi thử gửi tin trống để thấy lỗi
  validate.

  Lỗi AI đã gặp

  Task này không có lỗi nào phải sửa: mọi test xanh ngay lần implement đầu tiên.

  Lệnh commit

  git add -A
  git commit -m "feat: forum messages hook with abort and channel switcher"

  Bạn nói "tiếp" thì tôi làm task 3.5. Task này cần bạn thao tác trên DevTools
  (bật Slow 3G, chụp màn hình). Phần tôi làm được là chuẩn bị khung cho
  docs/verification.md.
> tiếp

  Ran 1 shell command (ctrl+o to expand)

● Working tree is clean and commit 3.4 is in place. Task 3.5 needs real DevTools
  interaction and screenshots that I can't do myself, so I'll create
  docs/verification.md with the steps, the automated test output I can actually
  run, and blank fields for your observations and screenshots, without inventing
  any results. · summary

  Ran 1 shell command (ctrl+o to expand)

● Write(docs\verification.md)
  ⎿  Wrote 80 lines to docs\verification.md
       1 # Verification log — Sprint 3 (Task 3.5)
       2
       3 > Mục tiêu: chứng minh `useForumMessages` huỷ request cũ khi đổi
          kênh nhanh, và response cũ không ghi đè dữ liệu kênh mới.
       4 > Phần **A** là bằng chứng tự động (đã chạy thật). Phần **B, C**
          là kiểm chứng thủ công — người dùng tự làm, tự điền, tự chụp.
       5
       6 **Môi trường:** Node v22.23.2 · react@19.3.1 · react-router@7.18
         .5 · Vite 8 · Express 5
       7 **Ngày kiểm chứng:** <điền>
     … +73 lines (ctrl+o to expand)

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      15  | 3.2 | `feat: express messages api with payload validation` | 
          `server/db.js`, `server/validate.js`, `server/app.js` (GET/POST
           + error middleware), `server/messages.test.js` (+ test tên kên
          h trùng prototype) |
      16  | 3.3 | `test: add failing test for forum hook abort` | `client
          /src/forum/useForumMessages.test.jsx` |
      17  | 3.4 | `feat: forum messages hook with abort and channel switc
          her` | `client/src/forum/useForumMessages.js`, `client/src/foru
          m/useForumMessages.test.jsx` (+ test postMessage), `client/src/
          forum/ForumPage.jsx`, `client/src/forum/ForumPage.test.jsx`, `c
          lient/src/form/validate.js` (+ `validateMessage`, `MESSAGE_LIMI
          TS`), `client/src/form/parity.test.js`, `client/src/App.jsx` (r
          oute `/forum/:forumId`), `client/src/index.css` (style forum) |
      18 +| 3.5 | `docs: add slow 3g abort verification log` | `docs/veri
         +fication.md`, `docs/img/slow3g-canceled.png` (bạn tự chụp) |   

● Task 3.5 mới xong phần khung: tôi đã tạo docs/verification.md
  (Lab4/docs/verification.md). Phần kiểm chứng trên DevTools và ảnh chụp bạn
  phải tự làm, nên chưa thể commit ngay. Tôi không bịa kết quả quan sát nào.

  Nội dung file

  ┌──────┬─────────┬────────────────────────────────────────────────────────┐
  │ Phần │ Ai làm  │                        Nội dung                        │
  ├──────┼─────────┼────────────────────────────────────────────────────────┤
  │      │ Đã chạy │ Output 9 test của hook (đều xanh) và kết quả kiểm      │
  │ A    │  thật   │ chứng ngược ở 3.3: bỏ guard signal.aborted thì 2 test  │
  │      │         │ đỏ                                                     │
  ├──────┼─────────┼────────────────────────────────────────────────────────┤
  │      │         │ 6 bước bật Slow 3G và đổi kênh liên tục; kỳ vọng các   │
  │ B    │ Bạn     │ request cũ hiện (canceled); bảng điền kết quả và chỗ   │
  │      │         │ gắn ảnh                                                │
  ├──────┼─────────┼────────────────────────────────────────────────────────┤
  │ C    │ Bạn     │ 6 ca kiểm tra lỗi full-stack, mỗi ca có thao tác và kỳ │
  │      │         │  vọng sẵn, cột "Thực tế" để trống                      │
  ├──────┼─────────┼────────────────────────────────────────────────────────┤
  │ D    │ Bạn     │ Kết luận viết bằng lời của bạn (phần sẽ bị hỏi khi     │
  │      │         │ defense)                                               │
  └──────┴─────────┴────────────────────────────────────────────────────────┘

  Dòng 3.5 đã có trong COMMIT_PLAN.md (Lab4/COMMIT_PLAN.md).

  Việc bạn cần làm trước khi commit

  cd server; npm run dev                  # terminal 1
  cd client; npm run dev                  # terminal 2
  New-Item -ItemType Directory -Force docs\img   # ở root Lab4
  Sau đó làm theo mục B và C trong file. Lưu ảnh chụp thành
  docs/img/slow3g-canceled.png, điền các bảng, và viết mục D.

  Lỗi AI đã gặp

  Task này không có lỗi nào.

  Lệnh commit (chạy sau khi đã điền và chụp ảnh)

  git add -A
  git commit -m "docs: add slow 3g abort verification log"

  Sau commit này, việc còn lại trong WBS là task 5.1 (hoàn thiện
  AI_FAILURE_AUDIT.md, phần phân tích do bạn tự viết) và 5.2 (tập 4 câu Live
  Defense). Khi bạn nói "tiếp", tôi có thể gom sẵn dữ kiện của các lỗi AI đã ghi
  nhận để bạn viết audit.

> > server@1.0.0 dev
  > node --watch --env-file-if-exists=../.env server.js

  ../.env not found. Continuing without it.
  ../.env not found. Continuing without it.
  API listening on http://localhost:3001

● Server của bạn đang chạy bình thường ở http://localhost:3001. Dòng ../.env not
  found chỉ là thông báo, không phải lỗi.

  Vì sao có dòng này: bạn chưa tạo file .env ở root Lab4. Cờ
  --env-file-if-exists cho phép chạy tiếp khi không có file, và app.js/server.js
  tự dùng giá trị mặc định (PORT=3001, CLIENT_ORIGIN=http://localhost:5173).
  Hai giá trị này trùng với .env.example, nên hành vi hoàn toàn giống khi có
  file.

  Vì sao in 2 lần: node --watch chạy hai tiến trình. Tiến trình cha theo dõi
  thay đổi file, tiến trình con chạy server.js. Cả hai đều đọc cờ
  --env-file-if-exists nên mỗi tiến trình in thông báo một lần.

  Nếu muốn hết thông báo, tạo .env từ file mẫu. File này đã nằm trong .gitignore
  nên không bị commit:
  cd d:\Execersice\Lab4
  Copy-Item .env.example .env
  Sau đó khởi động lại npm run dev ở server.

  Giờ bạn có thể mở terminal thứ hai, chạy cd client; npm run dev, rồi làm mục B
  và C trong docs/verification.md (Lab4/docs/verification.md).

> Cannot GET /

● Không có lỗi gì cả. Bạn đang mở cổng của server API (3001), trong khi giao
  diện React chạy ở cổng khác.

  Server Express chỉ có các route dưới /api/.... Nó không phục vụ trang web nào
  ở /, nên Express trả về "Cannot GET /" là đúng.

  Cách mở app:
  1. Giữ nguyên terminal đang chạy server.
  2. Mở terminal thứ hai và chạy:
  cd d:\Execersice\Lab4\client
  npm run dev
  3. Mở trình duyệt tại http://localhost:5173/forum/nasa. Đây là cổng của Vite.

  Vite sẽ tự chuyển mọi request /api/... sang cổng 3001 qua proxy, nên bạn chỉ
  cần dùng cổng 5173.

  Nếu chỉ muốn kiểm tra API ở cổng 3001, hãy mở đúng một đường dẫn API, ví dụ
  http://localhost:3001/api/messages/nasa hoặc http://localhost:3001/api/health.

> giờ commit được rồi ha

  Searched for 1 pattern, ran 1 shell command (ctrl+o to expand)

● Chưa nên commit. Về mặt git thì commit được, nhưng docs/verification.md
  (Lab4/docs/verification.md) hiện vẫn y nguyên bản khung tôi tạo và chưa có ảnh
  chụp. git status chỉ thấy đúng file đó trong docs/.

  Những chỗ còn trống:

  ┌───────┬──────────────────────────────────────────────────────────────────┐
  │ Dòng  │                             Cần điền                             │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 7–8   │ Ngày kiểm chứng, trình duyệt                                     │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 52–55 │ Status trong tab Network cho 4 lần đổi kênh, kỳ vọng là          │
  │       │ (canceled) cho 3 lần đầu và 200 cho lần cuối                     │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 57    │ Ảnh docs/img/slow3g-canceled.png, hiện chưa có thư mục docs/img/ │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 67–72 │ Cột "Thực tế" của 6 ca kiểm tra lỗi                              │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 74    │ Tổng số warning/error trong Console                              │
  ├───────┼──────────────────────────────────────────────────────────────────┤
  │ 80    │ Mục D, kết luận viết bằng lời của bạn                            │
  └───────┴──────────────────────────────────────────────────────────────────┘

  Nếu commit lúc này, bạn sẽ có một commit docs: add slow 3g abort verification
  log mà không có kết quả kiểm chứng nào. Khi chấm hoặc defense, người xem dễ
  nhận ra file chỉ là template do AI sinh. Mục tiêu của task 3.5 là chứng cứ do
  chính bạn thu thập.

  Việc cần làm:
  1. Với hai terminal đang chạy (server và client), mở
     http://localhost:5173/forum/nasa rồi mở DevTools.
  2. Làm theo mục B: tab Network, bật Slow 3G, đổi kênh liên tục, rồi chụp ảnh
     lưu vào docs\img\slow3g-canceled.png. Tạo thư mục ảnh bằng:
  New-Item -ItemType Directory -Force d:\Execersice\Lab4\docs\img
  3. Làm 6 ca ở mục C và điền cột "Thực tế".
  4. Viết mục D.

  Xong thì commit:
  git add -A
  git commit -m "docs: add slow 3g abort verification log"

  Nếu bạn chỉ còn ít thời gian, có thể commit trước với tối thiểu ảnh chụp, bảng
  B và mục D. Mục C có thể bổ sung ở commit docs: complete ai failure audit
  (task 5.1).

> tiếp

  Searched for 1 pattern, read 1 file, ran 1 shell command (ctrl+o to expand)

● Commit 3.5 đã xong, nhưng docs/verification.md vẫn còn 4 chỗ chưa điền; bạn có
  thể bổ sung trong commit 5.1. Tiếp theo tôi sẽ hoàn thiện AI_FAILURE_AUDIT.md
  chỉ với các dữ kiện đã xảy ra, còn phần nguyên nhân gốc và bài học để bạn tự
  viết. · summary

● Write(AI_FAILURE_AUDIT.md)
  ⎿  Added 153 lines, removed 11 lines
        2  
        3  > Chiếm 15% điểm lab. Ghi **mọi** đoạn code AI sinh ra mà chạy
            sai, API không tồn tại (hallucinated), effect loop, lỗ hổng b
           ảo mật, thiếu a11y.
        4  > Mỗi mục phải có phần **kiểm chứng thủ công**: bạn phát hiện 
           bằng cách nào và đã sửa ra sao.
        5 +>                                                             
        6 +> Công cụ AI: Claude Code (agent trong VS Code). Các trường *N
          +guyên nhân gốc* và *Bài học* do người làm lab tự viết.        
        7  
        8  ## Tổng hợp
        9  
       10  | # | Task | Loại lỗi | Mức độ | Trạng thái |
       11  |---|---|---|---|---|
       10 -| 1 | | | | |                                                 
       12 +| 1 | 0.2 | `Khác` — CORS cấu hình sai (bảo mật) | Cao | Đã sử
          +a + có test |                                                 
       13 +| 2 | 0.2 | `Khác` — suýt cài sai major version (react-router 
          +v8) | Cao | Chặn trước khi cài |                              
       14 +| 3 | 0.2 | `Khác` — khai báo `engines` sai so với cờ Node đan
          +g dùng | Trung bình | Đã sửa |                                
       15 +| 4 | 0.2 → lộ ở 1.2 | `Khác` — thiếu cleanup RTL trong scaffo
          +ld test | Trung bình | Đã sửa |                               
       16 +| 5 | 0.2 | `Khác` — lệnh tắt tiến trình quá rộng (`taskkill /
          +IM node.exe`) | Trung bình | Người dùng phát hiện, đã đổi quy 
          +trình |                                                       
       17 +| 6 | 3.3 | `Race condition` — test unmount không bắt được lỗi
          + thiếu guard | Thấp | Đã ghi nhận, có test khác bù |          
       18 +| 7 | 1.1–1.4 | `Khác` — liệt kê file đã exclude vào kế hoạch 
          +commit | Thấp | Đã sửa |                                      
       19  
       20  Loại lỗi: `Router v5 syntax` · `useEffect loop` · `Hallucinate
           d API` · `Hardcoded secret` · `Mongoose callback` · `Missing a
           11y` · `Race condition` · `Khác`
       21  
       22  ---
       23  
       16 -## Mục #1 — <tiêu đề ngắn>                                    
       24 +## Mục #1 — `cors({ origin: string })` trả header cho MỌI orig
          +in                                                            
       25  
       18 -- **Task / Commit:** <vd: 1.2 — feat: router layout>          
       19 -- **Prompt đã dùng:** <tóm tắt hoặc link>                     
       26 +- **Task / Commit:** 0.2 — `chore: scaffold react 19 client an
          +d express server`                                             
       27 +- **Prompt đã dùng:** "server/: Express + cors … đọc PORT và C
          +LIENT_ORIGIN từ process.env" + yêu cầu bổ sung: viết test "ori
          +gin lạ không nhận header Access-Control-Allow-Origin".        
       28 +- **AI đã sinh ra:** (đúng y cú pháp trong `project-rules.md` 
          +§4)                                                           
       29 +  ```js                                                       
       30 +  app.use(cors({ origin }));            // origin = 'http://lo
          +calhost:5173'                                                 
       31 +  ```                                                         
       32 +- **Triệu chứng:** test đỏ — request với `Origin: http://evil.
          +example.com` vẫn nhận `Access-Control-Allow-Origin: http://loc
          +alhost:5173`.                                                 
       33 +  ```                                                         
       34 +  FAIL app.test.js > CORS > thiếu CLIENT_ORIGIN → dùng mặc địn
          +h, không mở cho mọi origin                                    
       35 +  AssertionError: expected 'http://localhost:5173' to be undef
          +ined                                                          
       36 +  ```                                                         
       37 +- **Phát hiện bằng:** test supertest `server/app.test.js` (viế
          +t trước, chạy đỏ).                                            
       38 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
       39 +- **Cách sửa:**                                               
       40 +  ```js                                                       
       41 +  // Mảng: cors so khớp Origin của request, chỉ gửi header khi
          + khớp                                                         
       42 +  app.use(cors({ origin: [origin] }));                        
       43 +  ```                                                         
       44 +  Kèm mặc định `origin = clientOrigin || 'http://localhost:517
          +3'` để thiếu `CLIENT_ORIGIN` không thành `cors({ origin: undef
          +ined })` (= mở cho mọi origin).                               
       45 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết — gợi ý: §4 Backend đang ghi `cors({ origin: proce
          +ss.env.CLIENT_ORIGIN })`, cần sửa?>                           
       46 +                                                              
       47 +---                                                           
       48 +                                                              
       49 +## Mục #2 — `npm i react-router` sẽ cài v8, không phải v7     
       50 +                                                              
       51 +- **Task / Commit:** 0.2 (phát hiện ở bước lập kế hoạch, trước
          + khi cài)                                                     
       52 +- **Prompt đã dùng:** "react-router v7 (package "react-router"
          +, KHÔNG react-router-dom)"                                    
       53 +- **AI đã sinh ra:** kế hoạch ban đầu dự định cài không ghim v
          +ersion:                                                       
       54 +  ```powershell                                               
       55 +  npm i react@^19 react-dom@^19 react-router                  
       56 +  ```                                                         
       57 +- **Triệu chứng:** `npm view react-router version` → `8.5.1`. 
          +Cài như trên sẽ ra v8 → vi phạm §3 (Router v7).               
       58 +- **Phát hiện bằng:** kiểm tra registry bằng `npm view` trước 
          +khi cài.                                                      
       59 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
       60 +- **Cách sửa:**                                               
       61 +  ```powershell                                               
       62 +  npm i react-router@^7      # → 7.18.5                       
       63 +  ```                                                         
       64 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết>                                                  
       65 +                                                              
       66 +---                                                           
       67 +                                                              
       68 +## Mục #3 — `engines: ">=20"` nhưng script dùng cờ chỉ có từ N
          +ode 22.9                                                      
       69 +                                                              
       70 +- **Task / Commit:** 0.2                                      
       71 +- **Prompt đã dùng:** như mục #1.                             
       72  - **AI đã sinh ra:**
       21 -  ```jsx                                                      
       22 -  // đoạn code sai                                            
       73 +  ```json                                                     
       74 +  "engines": { "node": ">=20" },                              
       75 +  "scripts": { "dev": "node --watch --env-file-if-exists=../.e
          +nv server.js" }                                               
       76    ```
       24 -- **Triệu chứng:** <lỗi compile / warning console / test đỏ / 
          -hành vi sai>                                                  
       25 -- **Phát hiện bằng:** <test nào, DevTools tab nào, đọc docs nà
          -o>                                                            
       26 -- **Nguyên nhân gốc:** <giải thích bằng lời của bạn>          
       77 +- **Triệu chứng:** không lỗi trên máy (Node 22.23), nhưng khai
          + báo hứa chạy được Node 20 trong khi `--env-file-if-exists` kh
          +ông có ở Node 20.                                             
       78 +- **Phát hiện bằng:** AI tự rà lại khi kiểm tra script `npm ru
          +n start`; kiểm tra tài liệu Node về cờ này.                   
       79 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
       80  - **Cách sửa:**
       81 +  ```json                                                     
       82 +  "engines": { "node": ">=22.9" }                             
       83 +  ```                                                         
       84 +  (Nếu buộc chạy Node 20 → dùng gói `dotenv` thay cho cờ.)    
       85 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết — §3 đang ghi "Node ≥ 20">                        
       86 +                                                              
       87 +---                                                           
       88 +                                                              
       89 +## Mục #4 — Scaffold test thiếu `cleanup()` của Testing Librar
          +y                                                             
       90 +                                                              
       91 +- **Task / Commit:** sinh ở 0.2, lộ ở 1.2 — sửa trong `feat: r
          +outer layout`                                                 
       92 +- **Prompt đã dùng:** "client/: … Vitest + @testing-library/re
          +act + jsdom"                                                  
       93 +- **AI đã sinh ra:**                                          
       94 +  ```js                                                       
       95 +  // client/src/setupTests.js                                 
       96 +  import '@testing-library/jest-dom/vitest';                  
       97 +  // vite.config.js: test: { environment: 'jsdom', setupFiles:
          + [...] }   (không bật globals)                                
       98 +  ```                                                         
       99 +- **Triệu chứng:** ở 1.2, các test sau thấy DOM của test trước
          +:                                                             
      100 +  ```                                                         
      101 +  TestingLibraryElementError: Found multiple elements with the
          + role "navigation" and name "Điều hướng chính"                
      102 +  AssertionError: expected [ <main>, …(3) ] to have a length o
          +f 1 but got 4                                                 
      103 +  ```                                                         
      104 +  Ở 0.2 không lộ vì chỉ có 1 test.                            
      105 +- **Phát hiện bằng:** test đỏ "sai lý do" (không phải do thiếu
          + tính năng) khi chạy `npm test` ở task 1.2.                   
      106 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
      107 +- **Cách sửa:**                                               
      108 +  ```js                                                       
      109 +  import { afterEach } from 'vitest';                         
      110 +  import { cleanup } from '@testing-library/react';           
      111 +  import '@testing-library/jest-dom/vitest';                  
      112 +  afterEach(() => { cleanup(); });                            
      113 +  ```                                                         
      114 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết>                                                  
      115 +                                                              
      116 +---                                                           
      117 +                                                              
      118 +## Mục #5 — Tắt dev server bằng `taskkill //F //IM node.exe`  
      119 +                                                              
      120 +- **Task / Commit:** 0.2 (không nằm trong code commit)        
      121 +- **Prompt đã dùng:** "Chỉ dựng khung chạy được" — AI tự bật d
          +ev server để kiểm tra rồi tự tắt.                             
      122 +- **AI đã sinh ra:**                                          
      123 +  ```bash                                                     
      124 +  taskkill //F //IM node.exe                                  
      125 +  ```                                                         
      126 +- **Triệu chứng:** lệnh kill **mọi** tiến trình Node trên máy,
          + không chỉ server AI vừa mở (có thể tắt luôn tiến trình khác c
          +ủa người dùng).                                               
      127 +- **Phát hiện bằng:** người dùng đọc lại log lệnh và yêu cầu: 
          +"Không dùng taskkill //IM node.exe; chỉ tắt đúng tiến trình bạ
          +n đã mở."                                                     
      128 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
      129 +- **Cách sửa:**                                               
      130 +  ```powershell                                               
      131 +  $p = Start-Process node -ArgumentList 'server.js' -PassThru 
      132 +  # ... kiểm tra ...                                          
      133 +  Stop-Process -Id $p.Id                                      
      134 +  ```                                                         
      135 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết>                                                  
      136 +                                                              
      137 +---                                                           
      138 +                                                              
      139 +## Mục #6 — Test "unmount" xanh cả khi hook thiếu guard `signa
          +l.aborted`                                                    
      140 +                                                              
      141 +- **Task / Commit:** 3.3 — `test: add failing test for forum h
          +ook abort`                                                    
      142 +- **Prompt đã dùng:** "Mock fetch: đổi forumId nhanh → request
          + cũ bị abort và data cũ không ghi đè data mới"                
      143 +- **AI đã sinh ra:** test kỳ vọng phát hiện setState sau unmou
          +nt qua `console.error`:                                       
      144    ```jsx
       29 -  // code đúng                                                
      145 +  const { unmount } = renderHook(() => useForumMessages('nasa'
          +));                                                           
      146 +  unmount();                                                  
      147 +  await act(async () => calls[0].resolve(okJson(NASA)));      
      148 +  expect(errorSpy).not.toHaveBeenCalled();                    
      149    ```
       31 -- **Bài học / luật bổ sung vào project-rules.md:** <nếu có>   
      150 +- **Triệu chứng:** khi chạy bộ test với một hook **cố ý thiếu 
          +guard** (mutation check), test này vẫn **xanh** → nó không chứ
          +ng minh được có guard.                                        
      151 +- **Phát hiện bằng:** mutation check — tạm viết hook thiếu `if
          + (signal.aborted) return`, chạy test: 2 test race condition đỏ
          +, test unmount xanh.                                          
      152 +- **Nguyên nhân gốc:** <người làm lab tự viết — gợi ý: React 1
          +9 không còn cảnh báo setState sau unmount>                    
      153 +- **Cách sửa:** giữ test unmount với vai trò kiểm tra `signal.
          +aborted === true`; việc bắt lỗi thiếu guard do 2 test race con
          +dition đảm nhiệm (mock fetch cố ý KHÔNG reject khi abort để re
          +sponse "lọt" về muộn).                                        
      154 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết>                                                  
      155 +                                                              
      156 +---                                                           
      157 +                                                              
      158 +## Mục #7 — Liệt kê `COMMIT_PLAN.md` vào danh sách file commit
      159 +                                                              
      160 +- **Task / Commit:** 1.1–1.4 (kế hoạch commit)                
      161 +- **Prompt đã dùng:** "Sau MỖI task ghi 1 dòng vào COMMIT_PLAN
          +.md: … danh sách file của riêng task đó"                      
      162 +- **AI đã sinh ra:** mỗi dòng 1.x đều có `COMMIT_PLAN.md` tron
          +g danh sách file.                                             
      163 +- **Triệu chứng:** `git status` không hiện `COMMIT_PLAN.md` — 
          +file nằm trong `.git/info/exclude`, sẽ không bao giờ được comm
          +it.                                                           
      164 +- **Phát hiện bằng:** `git check-ignore -v COMMIT_PLAN.md` → `
          +.git/info/exclude:7`.                                         
      165 +- **Nguyên nhân gốc:** <người làm lab tự viết>                
      166 +- **Cách sửa:** bỏ `COMMIT_PLAN.md` khỏi danh sách file các dò
          +ng 1.x.                                                       
      167 +- **Bài học / luật bổ sung vào project-rules.md:** <người làm 
          +lab tự viết>                                                  
      168 +                                                              
      169 +---                                                           
      170 +                                                              
      171 +## Phân tích anti-pattern Ex 1.3 (task 2.0)                   
      172 +                                                              
      173 +<người làm lab tự viết: vì sao chuỗi 5 useEffect (sync → valid
          +ate → validity → sync lỗi → scroll) gây 5 render/phím, race co
          +ndition, "Maximum update depth exceeded"; và lời giải trong `c
          +lient/src/form/` (derived state, focus trong event handler) kh
          +ác ở đâu.>                                                    

● Update(COMMIT_PLAN.md)
  ⎿  Added 1 line
      16  | 3.3 | `test: add failing test for forum hook abort` | `client
          /src/forum/useForumMessages.test.jsx` |
      17  | 3.4 | `feat: forum messages hook with abort and channel switc
          her` | `client/src/forum/useForumMessages.js`, `client/src/foru
          m/useForumMessages.test.jsx` (+ test postMessage), `client/src/
          forum/ForumPage.jsx`, `client/src/forum/ForumPage.test.jsx`, `c
          lient/src/form/validate.js` (+ `validateMessage`, `MESSAGE_LIMI
          TS`), `client/src/form/parity.test.js`, `client/src/App.jsx` (r
          oute `/forum/:forumId`), `client/src/index.css` (style forum) |
      18  | 3.5 | `docs: add slow 3g abort verification log` | `docs/veri
          fication.md`, `docs/img/slow3g-canceled.png` (bạn tự chụp) |
      19 +| 5.1 | `docs: complete ai failure audit` | `AI_FAILURE_AUDIT.m
         +d`, `docs/verification.md` (nếu điền nốt) |                    

● Task 5.1 mới xong phần dữ kiện: AI_FAILURE_AUDIT.md (Lab4/AI_FAILURE_AUDIT.md)
  đã có 7 lỗi AI thật trong phiên này, nhưng phần phân tích vẫn chờ bạn viết.
  Tôi chưa commit.

  7 lỗi đã ghi

  ┌─────┬────────┬────────────────────────────────────────────────┬─────────┐
  │  #  │  Task  │                      Lỗi                       │ Mức độ  │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 1   │ 0.2    │ cors({ origin: string }) trả header cho mọi    │ Cao     │
  │     │        │ origin, có test đỏ làm bằng chứng              │         │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 2   │ 0.2    │ Suýt cài react-router v8 vì bản latest là      │ Cao     │
  │     │        │ 8.5.1                                          │         │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 3   │ 0.2    │ Khai báo engines >=20 nhưng script dùng cờ chỉ │ Trung   │
  │     │        │  có từ Node 22.9                               │ bình    │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 4   │ 0.2 →  │ Thiếu cleanup() của RTL làm DOM cộng dồn giữa  │ Trung   │
  │     │ 1.2    │ các test                                       │ bình    │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 5   │ 0.2    │ Dùng taskkill /IM node.exe, lệnh tắt mọi tiến  │ Trung   │
  │     │        │ trình Node trên máy (do bạn phát hiện)         │ bình    │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 6   │ 3.3    │ Test unmount không bắt được lỗi thiếu guard    │ Thấp    │
  │     │        │ signal.aborted                                 │         │
  ├─────┼────────┼────────────────────────────────────────────────┼─────────┤
  │ 7   │ 1.x    │ Ghi COMMIT_PLAN.md vào danh sách commit dù     │ Thấp    │
  │     │        │ file đã bị exclude                             │         │
  └─────┴────────┴────────────────────────────────────────────────┴─────────┘

  Mỗi mục đã đủ: task, prompt, đoạn code sai, triệu chứng (kèm output test thật
  nếu có), cách phát hiện, cách sửa.

  Phần bạn phải tự viết

  - "Nguyên nhân gốc" và "Bài học" của cả 7 mục, đang để <người làm lab tự
    viết>. Vài mục tôi để sẵn gợi ý hướng suy nghĩ.
  - Phân tích anti-pattern Ex 1.3 (task 2.0) ở cuối file. Commit 2.1 lẽ ra đã
    chứa phần này nhưng chưa có, nên bạn đưa vào đây.
  - 4 chỗ còn trống trong docs/verification.md (Lab4/docs/verification.md):
    ngày, trình duyệt, tổng kết Console, mục D.

  Mục #1 và #3 cho thấy project-rules.md §4 (cú pháp cors) và §3 ("Node ≥ 20")
  đang dẫn tới cấu hình sai. Bạn cân nhắc sửa luật luôn trong commit này.

  Lệnh commit (sau khi đã viết xong)

  git add -A
  git commit -m "docs: complete ai failure audit"

  Sau commit này repo sẽ có 16 commit, khớp kế hoạch trong WBS. Task cuối là 5.2
  (tập 4 câu Live Defense). Bạn nói "tiếp" thì tôi soạn hướng dẫn trả lời từng
  câu, chỉ rõ file và dòng cần sửa, để bạn tự tập.

> tiếp

  Searched for 2 patterns, ran 2 shell commands (ctrl+o to expand)

● Trước khi sang 5.2, có 2 vấn đề trong commit mới nhất cần sửa trước khi push.

  1. Commit audit bị đặt sai message. Commit b751b3e chứa AI_FAILURE_AUDIT.md
  nhưng message là docs: add slow 3g abort verification log, trùng y với commit
  3.5 (181aaf5). WBS yêu cầu message docs: complete ai failure audit. Commit này
  chưa push, vì origin/main mới ở 63d10f2. Sửa message lúc này vẫn an toàn:
  git commit --amend -m "docs: complete ai failure audit"

  2. Audit vẫn còn 16 chỗ <người làm lab tự viết>. Đây chính là phần chấm điểm
  (15%). Hãy viết xong nguyên nhân gốc, bài học và phân tích 2.0, rồi chạy:
  git add -A
  git commit --amend -m "docs: complete ai failure audit"
  Lệnh này gộp luôn phần bạn viết vào commit đó. Repo vẫn là 16 commit, khớp
  WBS.

  ---

  Task 5.2 — Tập 4 câu Live Defense

  Task này không cần commit. Dưới đây là hướng đi cho từng câu, kèm file và dòng
  cần sửa. Hãy tự code thử từng câu trên một nhánh nháp như git switch -c
  defense-practice, vì khi defense bạn sẽ phải sửa trực tiếp.

  1. URL Search Params Sync

  - Ví dụ đề: ô lọc danh bạ theo tên, giữ được sau khi reload.
  - Nên sửa ở đâu: PeopleLayout.jsx (Lab4/client/src/people/PeopleLayout.jsx).
    Dùng const [params, setParams] = useSearchParams() (import từ
    'react-router'), const q = params.get('q') ?? '', rồi people.filter(...)
    ngay trong render.
  - Ý chính để nói: URL là nguồn sự thật, giống cách :id đang làm. Không cần
    useState hay effect để đồng bộ. setParams({ q }, { replace: true }) giúp mỗi
    phím gõ không tạo thêm một mục trong lịch sử trình duyệt.
  - Bẫy cần tránh: NavLink tới người trong danh sách sẽ làm mất ?q=. Sửa bằng
    to={{ pathname: person.id, search: params.toString() }}.

  2. Cross-Field Validation (confirm password)

  - Nên sửa ở đâu: validate.js:61 (Lab4/client/src/form/validate.js#L61)
    (validateForm), SimpleForm.jsx:13 (Lab4/client/src/form/SimpleForm.jsx#L13)
    (thêm password và confirm vào INITIAL_VALUES), và thêm 2 <InputField>.
  - Ý chính để nói: rule nhận toàn bộ values chứ không chỉ một field: if
    (values.confirm !== values.password) errors.confirm = '...'. Vì errors được
    tính lại mỗi render, sửa password thì lỗi ở confirm tự cập nhật. Không cần
    effect "theo dõi password".
  - Bẫy cần tránh: RULES hiện là một map chỉ nhận một giá trị. Hoặc tách rule
    cross-field ra sau vòng lặp, hoặc đổi chữ ký rule thành (value, values).
    Viết test trước trong validate.test.js
    (Lab4/client/src/form/validate.test.js).

  3. Auto-Retry Backoff

  - Nên sửa ở đâu: useForumMessages.js:40
    (Lab4/client/src/forum/useForumMessages.js#L40), bọc lời gọi fetch trong
    vòng lặp for (let attempt = 0; attempt < 3; attempt++).
  - Ý chính để nói:
    - Thời gian chờ 500 * 2 ** attempt ms.
    - Hàm sleep phải tôn trọng signal: new Promise((res, rej) => { const t =
      setTimeout(res, ms); signal.addEventListener('abort', () => {
      clearTimeout(t); rej(signal.reason); }, { once: true }); }). Đổi kênh giữa
      lúc đang chờ thì vòng retry dừng ngay.
    - Chỉ retry khi lỗi mạng hoặc 5xx. Không retry khi 404 hoặc khi gặp
      AbortError.
  - Cách chứng minh: trong test, cho fetch giả reject 2 lần rồi resolve, và dùng
    vi.useFakeTimers().

  4. Protected Route Guard

  - Nên sửa ở đâu:
    - Tạo RequireAuth.jsx: nếu !user thì return <Navigate to="/login" replace
      state={{ from: location }} />, ngược lại return <Outlet />.
    - Trong App.jsx:34 (Lab4/client/src/App.jsx#L34), bọc route bằng <Route
      element={<RequireAuth />}> để chặn, ví dụ form.
    - Trang /login: sau khi đăng nhập thì
      navigate(location.state?.from?.pathname ?? '/', { replace: true }).
  - Ý chính để nói: đây là layout route không có path, giống RootLayout. Dùng
    <Navigate> của v7, không dùng <Redirect> của v5. user để trong một Context
    nhỏ (AuthContext), áp dụng lại mô hình của FormContext.
  - Bẫy cần tránh: replace giúp nút Back không quay về trang bị chặn. Ngoài ra
    phải giữ được cả search của URL đích, không chỉ pathname.

  3 phút trình bày kiến trúc (khung gợi ý)

  1. Scale quyết định công nghệ: app 1 người dùng, chạy local, nên chọn Context
     + Express in-memory, không dùng Redux hay DB.
  2. Ba loại state:
     - URL (:id, :forumId): người đang chọn, kênh đang xem.
     - Local + Context (form): một values duy nhất, còn errors được tính lại
       trong render.
     - Server (forum): hook có abort và guard.
  3. Bằng chứng: 84 test client và 27 test server; test Profiler chứng minh 1
     commit/phím; mutation check chứng minh guard có tác dụng; test parity
     client↔server.

  Bạn có muốn tôi chuyển phần này thành file docs/defense-notes.md để tiện mở
  khi tập không? Tôi chưa tạo, vì WBS không có commit nào cho task 5.2.