import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------
// 你原来的接口直接复制过来
// 例如：
// app.get('/api/login', (req, res) => { ... })
// app.post('/api/reserve', ...)
// ---------------------

// 必须加这个，Cloudflare 要求
export default app;