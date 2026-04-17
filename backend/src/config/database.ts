import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 强制加载 .env 文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || '10.0.6.86',
  port: parseInt(process.env.DB_PORT || '33306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root07',
  database: process.env.DB_NAME || 'wiptrack',
};

console.log('🔍 环境变量检查:');
console.log('   DB_HOST:', process.env.DB_HOST);
console.log('   DB_PORT:', process.env.DB_PORT);
console.log('   DB_USER:', process.env.DB_USER);
console.log('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(空)');
console.log('   DB_NAME:', process.env.DB_NAME);
console.log('\n📦 使用配置:', dbConfig);

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 15000,
  // 增加超时时间
});

export async function initDatabase(): Promise<void> {
  console.log('⏳ 正在连接数据库...');
  
  try {
    console.log('   连接参数:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
    });
    
    // 先测试连接
    console.log('   测试连接中...');
    const connection = await pool.getConnection();
    console.log('   ✅ 连接成功!');
    
    // 测试查询
    const [result] = await connection.query('SELECT NOW() as now');
    console.log('   ✅ 查询测试:', result);
    
    // 创建表
    console.log('   创建/检查表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS production_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        SiteRef VARCHAR(50) NOT NULL COMMENT '公司别',
        Station VARCHAR(100) NOT NULL COMMENT '站别',
        Job VARCHAR(100) NOT NULL COMMENT '工单号',
        CompleteDate DATETIME NOT NULL COMMENT '完工日期',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_site_station (SiteRef, Station),
        INDEX idx_job (Job),
        INDEX idx_complete_date (CompleteDate)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ 表检查完成!');
    
    connection.release();
    console.log('🎉 数据库初始化完成!\n');
  } catch (error: any) {
    console.error('\n❌ 数据库连接失败!');
    console.error('   错误类型:', error.code);
    console.error('   错误信息:', error.message);
    console.error('   完整错误:', error);
    throw error;
  }
}

export { pool };
