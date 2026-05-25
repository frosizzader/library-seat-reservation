require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// 压缩响应
app.use(compression());

// 简化 helmet 配置，避免 CSP 等策略干扰
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ======== 生产环境：服务前端静态文件（放在最前面） ========
const publicDir = path.join(__dirname, '..', 'public');

// 启动时检查静态文件目录
if (fs.existsSync(publicDir)) {
  console.log(`Static files directory found: ${publicDir}`);
  const files = fs.readdirSync(publicDir);
  console.log(`Contents: ${files.join(', ')}`);
} else {
  console.error(`Static files directory NOT found: ${publicDir}`);
}

app.use(express.static(publicDir, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
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
  try {
    const { Reservation } = require('./models');
    const all = await Reservation.findAll();
    res.json({ count: all.length, data: all.map(r => ({id:r.id, user_id:r.user_id, status:r.status})) });
  } catch (err) {
    res.status(500).json({ message: 'Database not available' });
  }
});

// 诊断端点，无需数据库即可检查服务状态
app.get('/diagnostic', (req, res) => {
  const indexExists = fs.existsSync(path.join(publicDir, 'index.html'));
  const assetsDir = path.join(publicDir, 'assets');
  const assetsExist = fs.existsSync(assetsDir);
  let assetFiles = [];
  try {
    if (assetsExist) assetFiles = fs.readdirSync(assetsDir);
  } catch (e) { /* ignore */ }

  res.json({
    code: 200,
    message: 'OK',
    data: {
      status: 'running',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version,
      platform: process.platform,
      public_dir_exists: fs.existsSync(publicDir),
      index_html_exists: indexExists,
      assets_exist: assetsExist,
      asset_files: assetFiles,
      api_base_url: process.env.VITE_API_BASE_URL || '/api/v1'
    }
  });
});

// SPA fallback：仅对不带扩展名的路由返回 index.html
app.get('*', (req, res, next) => {
  if (path.extname(req.path)) {
    return next();
  }
  const indexPath = path.join(publicDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`[SPA fallback] index.html not found at: ${indexPath}`);
    return res.status(500).send(`<h1>Deployment Error</h1><p>index.html not found. Check Docker build.</p><pre>Expected at: ${indexPath}</pre>`);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`[SPA fallback] Error sending index.html:`, err.message);
    }
  });
});

app.use(errorHandler);

// 全局未捕获异常处理，防止进程崩溃
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Static files from: ${publicDir}`);
});

module.exports = app;