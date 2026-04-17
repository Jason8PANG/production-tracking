import { Router } from 'express';
import { 
  getSites, 
  getStations, 
  getRecords, 
  addRecord, 
  deleteRecord 
} from '../controllers/recordController.js';

const router = Router();

// Site & Station 路由
router.get('/sites', getSites);                              // GET /api/records/sites - 获取所有公司别
router.get('/sites/:siteRef/stations', getStations);        // GET /api/records/sites/:siteRef/stations - 获取某公司别的站别

// 生产记录路由
router.get('/', getRecords);                                  // GET /api/records
router.post('/', addRecord);                                  // POST /api/records
router.delete('/:id', deleteRecord);                          // DELETE /api/records/:id

export default router;
