require('dotenv').config();

/**
 * 解析 Railway 格式的 DATABASE_URL: mysql://user:pass@host:port/dbname
 * 如果 DATABASE_URL 存在则优先使用，否则使用独立的环境变量
 */
function getDatabaseConfig() {
  let mysql2;
  try {
    mysql2 = require('mysql2');
  } catch (e) {
    console.warn('mysql2 module not available, using default dialect');
    mysql2 = undefined;
  }

  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;

  // 诊断日志
  console.log('[DB Config] DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('[DB Config] MYSQL_URL exists:', !!process.env.MYSQL_URL);
  console.log('[DB Config] DB_HOST:', process.env.DB_HOST || 'not set');
  console.log('[DB Config] DB_NAME:', process.env.DB_NAME || 'not set');

  if (dbUrl) {
    const url = new URL(dbUrl);
    const config = {
      username: url.username,
      password: url.password ? '[SET]' : '',
      database: url.pathname.replace('/', ''),
      host: url.hostname,
      port: url.port || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,
      logging: false
    };
    console.log('[DB Config] Using URL - host:', config.host, 'db:', config.database);
    return config;
  }

  // 回退到独立环境变量
  return {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'library_seat',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
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