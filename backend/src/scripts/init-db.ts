import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function migrate() {
  console.log('🚀 开始数据库迁移...\n');

  const pool = mysql.createPool({
    host: process.env.DB_HOST || '10.0.6.86',
    port: parseInt(process.env.DB_PORT || '33306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root07',
    database: process.env.DB_NAME || 'wiptrack',
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4'
  });

  try {
    const connection = await pool.getConnection();

    // 创建表
    console.log('📋 创建 production_records 表...');
    await connection.query(`
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

    console.log('✅ 表创建完成！');
    connection.release();
    await pool.end();
    console.log('🎉 迁移完成！\n');

  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

migrate();
