import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import recordsRouter from './routes/records.js';
import { initDatabase } from './config/database.js';

// 加载 .env 文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '6000');

console.log('🔧 环境:', process.env.NODE_ENV || 'development');
console.log('🔧 数据库:', process.env.DB_HOST || 'localhost');

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    db: process.env.DB_HOST
  });
});

// Routes
app.use('/api/records', recordsRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

// Start server
async function start() {
  try {
    await initDatabase();
    console.log('✅ 数据库连接成功');
    
    app.listen(PORT, () => {
      console.log(`\n🚀 服务器运行中: http://localhost:${PORT}`);
      console.log(`📋 API 文档: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

start();
