import mysql from 'mysql2/promise';

const config = {
  host: '10.0.6.86',
  port: 33306,
  user: 'root',
  password: 'root07',
};

async function testConnection() {
  console.log('🔌 测试 MySQL 连接...\n');
  console.log(`主机: ${config.host}:${config.port}`);
  console.log(`用户: ${config.user}\n`);

  let connection;
  try {
    // 测试连接
    connection = await mysql.createConnection(config);
    console.log('✅ 连接成功！\n');

    // 创建数据库
    const dbName = 'wiptrack';
    console.log(`📦 创建数据库: ${dbName}`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 数据库 ${dbName} 就绪\n`);

    // 使用数据库
    await connection.query(`USE \`${dbName}\``);

    // 创建表
    console.log('📋 创建表: production_records');
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
    console.log('✅ 表 production_records 创建成功\n');

    // 验证表结构
    console.log('🔍 验证表结构:');
    const [rows] = await connection.query('DESCRIBE production_records');
    console.table(rows);

    // 插入测试数据
    console.log('\n📝 插入测试数据...');
    await connection.query(`
      INSERT INTO production_records (SiteRef, Station, Job, CompleteDate)
      VALUES ('NAIGROUP', 'PRD_310', 'WO-20260417-001', NOW())
    `);
    console.log('✅ 测试数据插入成功\n');

    // 查询验证
    const [records] = await connection.query('SELECT * FROM production_records');
    console.log('📊 表数据:');
    console.table(records);

    console.log('\n🎉 所有操作完成！数据库配置正确。');

  } catch (error: any) {
    console.error('❌ 连接失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → 请确认 MySQL 服务已启动且端口正确');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → 请检查用户名和密码');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → 连接超时，请检查网络和防火墙');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
