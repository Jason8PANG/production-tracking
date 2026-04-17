import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db: Database | null = null;
const dbPath = path.join(__dirname, '..', '..', 'dev.db');

export async function initDatabase(): Promise<void> {
  if (db) return;

  const SQL = await initSqlJs();

  // 如果数据库文件存在，加载它
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log('✅ SQLite 数据库已加载:', dbPath);
  } else {
    // 创建新数据库
    db = new SQL.Database();
    console.log('✅ SQLite 数据库已创建:', dbPath);
  }

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS production_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      SiteRef TEXT NOT NULL,
      Station TEXT NOT NULL,
      Job TEXT NOT NULL,
      CompleteDate TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  saveDb();
}

export function saveDb(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

export function getDb(): Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}
