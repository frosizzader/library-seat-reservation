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

// ======== 生产环境：服务前端静态文件 ========
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// SPA fallback：所有非 API 路由返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
// ========================================

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files from: ${publicDir}`);
});

module.exports = app;