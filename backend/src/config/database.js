require('dotenv').config();

/**
 * Railway 会将同项目的 MySQL 数据库信息通过多种方式注入：
 * 1. DATABASE_URL（如果手动添加了引用变量）
 * 2. MYSQL_URL / MYSQL_HOST 等独立变量
 * 3. 如果没有自动注入，尝试用 Railway 内部 DNS 构建连接
 */
function getDatabaseConfig() {
  let mysql2;
  try {
    mysql2 = require('mysql2');
  } catch (e) {
    console.warn('mysql2 module not available');
    mysql2 = undefined;
  }

  // 诊断：打印所有可能相关的环境变量
  const keys = Object.keys(process.env).filter(k =>
    k.includes('MYSQL') || k.includes('DB_') || k.includes('DATABASE')
  );
  console.log('[DB Config] Found env keys:', keys.join(', ') || 'NONE');

  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLPRIVATE_URL;

  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      const config = {
        username: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        host: url.hostname,
        port: url.port || 3306,
        dialect: 'mysql',
        dialectModule: mysql2,
        logging: false
      };
      console.log('[DB Config] Connected via URL - host:', config.host, 'db:', config.database);
      return config;
    } catch (e) {
      console.error('[DB Config] Failed to parse URL:', e.message);
    }
  }

  // 回退到独立环境变量
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306;
  const user = process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER || 'root';
  const pass = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || '';
  const dbName = process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'railway';

  console.log('[DB Config] Fallback - host:', host, 'db:', dbName, 'user:', user);

  return {
    username: user,
    password: pass,
    database: dbName,
    host: host,
    port: port,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false
  };
}

const dbConfig = getDatabaseConfig();

module.exports = {
  development: dbConfig,
  production: dbConfig
};

const dbConfig = getDatabaseConfig();

module.exports = {
  development: dbConfig,
  production: dbConfig
};