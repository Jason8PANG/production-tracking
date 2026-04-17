import { Request, Response } from 'express';
import { getDb, saveDb } from '../config/sqlite.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// MySQL 连接池（仅生产环境）
let mysqlPool: mysql.Pool | null = null;

async function getMysqlPool(): Promise<mysql.Pool> {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || '10.0.6.86',
      port: parseInt(process.env.DB_PORT || '33306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root07',
      database: process.env.DB_NAME || 'wiptrack',
      waitForConnections: true,
      connectionLimit: 5,
      charset: 'utf8mb4'
    });
  }
  return mysqlPool;
}

// ==================== Site & Station API ====================

// 获取所有公司别列表
export async function getSites(req: Request, res: Response) {
  try {
    const pool = await getMysqlPool();
    const [rows] = await pool.query('SELECT DISTINCT SiteRef FROM site_station ORDER BY SiteRef');
    res.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Get sites error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// 根据公司别获取站别列表（按Id排序）
export async function getStations(req: Request, res: Response) {
  try {
    const { siteRef } = req.params;
    const pool = await getMysqlPool();
    const [rows] = await pool.query(
      'SELECT Station FROM site_station WHERE SiteRef = ? ORDER BY Id',
      [siteRef]
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('Get stations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// ==================== Production Records API ====================

// 获取所有记录（分页 + 筛选）
export async function getRecords(req: Request, res: Response) {
  try {
    const { SiteRef, Station, Job, startDate, endDate, page = 1, pageSize = 10 } = req.query;

    const pool = await getMysqlPool();
    const conditions: string[] = [];
    const params: any[] = [];

    if (SiteRef) {
      conditions.push('SiteRef = ?');
      params.push(SiteRef);
    }
    if (Station) {
      conditions.push('Station = ?');
      params.push(Station);
    }
    if (Job) {
      conditions.push('Job LIKE ?');
      params.push(`%${Job}%`);
    }
    if (startDate) {
      conditions.push('CompleteDate >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('CompleteDate <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

    // 获取总数
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM production_records${whereClause}`,
      params
    );
    const total = (countResult as any[])[0].total;

    // 分页查询
    const pageNum = parseInt(page as string) || 1;
    const size = parseInt(pageSize as string) || 10;
    const offset = (pageNum - 1) * size;

    const [rows] = await pool.query(
      `SELECT * FROM production_records${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    return res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(total / size)
      }
    });
  } catch (error: any) {
    console.error('Get records error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// 添加新记录（自动补漏报）
export async function addRecord(req: Request, res: Response) {
  try {
    const { SiteRef, Station, Job, CompleteDate } = req.body;

    if (!SiteRef || !Station || !Job || !CompleteDate) {
      return res.status(400).json({
        success: false,
        error: 'SiteRef, Station, Job, CompleteDate 均为必填项'
      });
    }

    const pool = await getMysqlPool();

    // 检查是否重复报工（当前站别）
    const [existing] = await pool.query(
      'SELECT id FROM production_records WHERE SiteRef = ? AND Station = ? AND Job = ?',
      [SiteRef, Station, Job]
    ) as [any[], any];

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: '请勿重复提交！该工单已报工。'
      });
    }

    // 获取当前站别在 site_station 中的序号
    const [currentStation] = await pool.query(
      'SELECT Id FROM site_station WHERE SiteRef = ? AND Station = ?',
      [SiteRef, Station]
    ) as [any[], any];

    if (currentStation.length === 0) {
      return res.status(400).json({
        success: false,
        error: '站别不存在，请检查配置'
      });
    }

    const currentId = currentStation[0].Id;
    // 保留完整的日期时间（格式：YYYY-MM-DD HH:mm:ss）
    const completedAt = CompleteDate;

    // 查找需要补漏的站别（Id 小于当前 Id 且未报工的）
    const [priorStations] = await pool.query(`
      SELECT s.Station 
      FROM site_station s
      LEFT JOIN production_records p ON s.SiteRef = p.SiteRef 
        AND s.Station = p.Station AND p.Job = ?
      WHERE s.SiteRef = ? AND s.Id < ? AND p.id IS NULL
      ORDER BY s.Id
    `, [Job, SiteRef, currentId]) as [any[], any];

    // 自动补漏报（保留与当前报工相同的时间戳）
    const autoFilled: string[] = [];
    for (const prior of priorStations) {
      await pool.query(
        'INSERT INTO production_records (SiteRef, Station, Job, CompleteDate) VALUES (?, ?, ?, ?)',
        [SiteRef, prior.Station, Job, completedAt]
      );
      autoFilled.push(prior.Station);
    }

    // 插入当前站别报工
    await pool.query(
      'INSERT INTO production_records (SiteRef, Station, Job, CompleteDate) VALUES (?, ?, ?, ?)',
      [SiteRef, Station, Job, CompleteDate]
    );

    // 返回结果
    if (autoFilled.length > 0) {
      res.json({
        success: true,
        message: `报工成功！已自动补漏：${autoFilled.join('、')}`,
        autoFilled
      });
    } else {
      res.json({ success: true, message: '报工成功' });
    }
  } catch (error: any) {
    console.error('Add record error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// 删除记录
export async function deleteRecord(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const pool = await getMysqlPool();
    await pool.query('DELETE FROM production_records WHERE id = ?', [id]);

    res.json({ success: true, message: '记录删除成功' });
  } catch (error: any) {
    console.error('Delete record error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
