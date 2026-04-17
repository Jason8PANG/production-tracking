# Production Tracking Backend API

## 技术栈
- Node.js 20+
- Express.js
- MySQL 8.0
- TypeScript

## API 接口

### 健康检查
```
GET /api/health
```

### 创建生产记录
```
POST /api/records
Content-Type: application/json

{
    "SiteRef": "NAIGROUP",
    "Station": "PRD_310",
    "Job": "WO-2026-001",
    "CompleteDate": "2026-04-17 17:30:00"
}
```

### 获取生产记录列表
```
GET /api/records?SiteRef=NAIGROUP&Station=PRD_310
```

### 按工单号查询
```
GET /api/records/job/:job
```

### 删除记录
```
DELETE /api/records/:id
```

## 响应格式

### 成功
```json
{
    "success": true,
    "data": { ... },
    "message": "操作成功"
}
```

### 错误
```json
{
    "success": false,
    "error": "错误信息"
}
```
