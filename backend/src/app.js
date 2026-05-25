require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 300;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ======== 生产环境：服务前端静态文件（放在最前面） ========
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir, {
  setHeaders: (res, filePath) => {
    // 确保 JS 模块文件有正确的 MIME 类型
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));
// =========================================================

// API 路由
app.use('/api/v1', routes);

app.get('/health', (req, res) => {
  res.json({ code: 200, message: 'OK', data: { status: 'running' } });
});

app.get('/admin-test-reservations', async (req, res) => {
  const { Reservation, User, Seat, Area } = require('./models');
  const all = await Reservation.findAll();
  res.json({ count: all.length, data: all.map(r => ({id:r.id, user_id:r.user_id, status:r.status})) });
});

// SPA fallback：仅对不带扩展名的路由返回 index.html
app.get('*', (req, res, next) => {
  // 如果路径看起来像静态资源（有文件扩展名），跳过返回 404
  if (path.extname(req.path)) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files from: ${publicDir}`);
});

module.exports = app;