# Production Tracking Web Application

现代化生产跟踪系统，用于集团公司各站点在制品（WIP）跟踪。

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **后端**: Node.js + Express + MySQL
- **部署**: Docker + Docker Compose

## 项目结构

```
production-tracking/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   │   ├── Login.tsx    # 登录页面
│   │   │   └── Report.tsx   # 报工页面
│   │   ├── components/      # 通用组件
│   │   ├── hooks/           # React hooks
│   │   ├── api/             # API 调用
│   │   └── lib/             # 工具函数
│   └── ...
├── backend/                 # Node.js 后端
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── controllers/     # 控制器
│   │   ├── models/         # 数据模型
│   │   └── config/          # 配置文件
│   └── ...
├── mysql/                   # MySQL 配置
│   └── init.sql             # 数据库初始化脚本
├── docker-compose.yml       # Docker Compose 配置
└── README.md                # 部署指南
```

## 快速开始

### 本地开发

1. 启动 MySQL 并初始化数据库：
```bash
docker-compose up -d mysql
```

2. 启动后端：
```bash
cd backend && npm install && npm run dev
```

3. 启动前端：
```bash
cd frontend && npm install && npm run dev
```

### Docker 部署

```bash
docker-compose up -d
```

访问 `http://your-server:3000`

## 数据库表结构

```sql
CREATE TABLE production_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    SiteRef VARCHAR(50) NOT NULL COMMENT '公司别',
    Station VARCHAR(100) NOT NULL COMMENT '站别',
    Job VARCHAR(100) NOT NULL COMMENT '工单号',
    CompleteDate DATETIME NOT NULL COMMENT '完工日期',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_site_station ON production_records(SiteRef, Station);
CREATE INDEX idx_job ON production_records(Job);
```

## 环境变量

### 后端 (.env)
```
PORT=5000
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=production_tracking
```

### 前端 (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```
