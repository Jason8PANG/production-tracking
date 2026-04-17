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

---

## 🚀 从 GitHub 拉取并部署

### 方式一：SSH 方式（推荐）

```bash
# 1. 确保已配置 SSH Key
# 查看是否已有 SSH Key
ls -la ~/.ssh/

# 如没有，生成新的 SSH Key
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519 -N ""

# 2. 将公钥添加到 GitHub
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# 访问 https://github.com/settings/keys 添加

# 3. 克隆仓库
git clone git@github.com:Jason8PANG/production-tracking.git
cd production-tracking
```

### 方式二：HTTPS 方式

```bash
# 1. 克隆仓库
git clone https://github.com/Jason8PANG/production-tracking.git
cd production-tracking
```

### 方式三：已有本地代码，更新远程仓库

```bash
cd production-tracking
git remote add origin git@github.com:Jason8PANG/production-tracking.git
# 或
git remote set-url origin git@github.com:Jason8PANG/production-tracking.git

git branch -M main
git push -u origin main
```

---

## 🐳 Docker 安装指南

### CentOS 7 / RHEL 7

```bash
# 1. 安装依赖
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 2. 添加 Docker 仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. 安装 Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 5. 验证安装
docker --version
docker compose version
```

### CentOS 8 / RHEL 8 / AlmaLinux / Rocky Linux

```bash
# 1. 安装 Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 3. 验证安装
docker --version
docker compose version
```

### Ubuntu / Debian

```bash
# 1. 更新包索引
sudo apt-get update

# 2. 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 3. 添加 Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. 添加 Docker 仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 安装 Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

---

## ⚙️ Docker Compose 安装（单独安装）

如果上面的 Docker 安装命令没有自带 docker-compose：

```bash
# 下载 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 验证
docker-compose --version
```

---

## 🔥 防火墙配置

```bash
# CentOS 7 / RHEL 7 (firewalld)
sudo firewall-cmd --permanent --add-port=6001/tcp   # 前端
sudo firewall-cmd --permanent --add-port=6000/tcp   # API
sudo firewall-cmd --reload

# 或关闭防火墙（测试环境）
sudo systemctl stop firewalld
sudo systemctl disable firewalld

# Ubuntu / Debian (ufw)
sudo ufw allow 6001/tcp
sudo ufw allow 6000/tcp
sudo ufw reload
```

---

## 🚀 Docker 部署步骤

### 1. 拉取代码

```bash
cd /opt
sudo mkdir -p production-tracking
cd production-tracking
sudo git clone git@github.com:Jason8PANG/production-tracking.git .
# 或 HTTPS:
# sudo git clone https://github.com/Jason8PANG/production-tracking.git .
```

### 2. 配置数据库连接

docker-compose.yml 中已配置默认数据库连接：

```yaml
environment:
  - DB_HOST=0.0.0.0      # MySQL 主机地址
  - DB_PORT=33306           # MySQL 端口
  - DB_USER=root            # 数据库用户名
  - DB_PASSWORD=xxxx      # 数据库密码
  - DB_NAME=wiptrack       # 数据库名
  - PORT=6000              # API 服务端口
```

如需修改，编辑 `docker-compose.yml` 中的对应配置。

### 3. 构建并启动服务

```bash
cd /opt/production-tracking

# 构建并启动所有服务
sudo docker compose up -d --build

# 查看服务状态
sudo docker compose ps

# 查看日志
sudo docker compose logs -f
```

### 4. 验证部署

```bash
# API 健康检查
curl http://localhost:6000/api/health

# 访问前端
curl http://localhost:6001
```

### 5. 访问应用

| 服务 | 地址 |
|------|------|
| 前端 | `http://服务器IP:6001` |
| API | `http://服务器IP:6000` |
| 健康检查 | `http://服务器IP:6000/api/health` |

---

## 🔧 常用运维命令

```bash
# 查看所有服务状态
sudo docker compose ps

# 查看服务日志
sudo docker compose logs -f backend    # 后端日志
sudo docker compose logs -f frontend   # 前端日志

# 重启服务
sudo docker compose restart

# 停止服务
sudo docker compose down

# 更新代码后重新部署
cd /opt/production-tracking
sudo git pull
sudo docker compose up -d --build

# 单独更新某个服务
sudo docker compose up -d --build backend
sudo docker compose up -d --build frontend
```

---

## 📊 数据库表结构

### production_records 表

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
CREATE INDEX idx_complete_date ON production_records(CompleteDate);
```

### site_station 表（站点配置）

```sql
CREATE TABLE site_station (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SiteRef VARCHAR(50) NOT NULL COMMENT '公司别',
    Station VARCHAR(100) NOT NULL COMMENT '站别名'
);

CREATE INDEX idx_siteref ON site_station(SiteRef);
```

---

## 🔐 安全建议

1. **修改默认密码**：生产环境中修改 `DB_PASSWORD`
2. **使用 .env 文件**：不要将敏感信息硬编码在配置中
3. **配置 HTTPS**：使用 Nginx + SSL 证书
4. **限制端口访问**：通过防火墙限制只有内网可以访问

---

## 🆘 故障排查

### 1. Docker 服务未启动

```bash
sudo systemctl status docker
sudo systemctl start docker
```

### 2. 端口被占用

```bash
# 查看端口占用
sudo netstat -tlnp | grep 6000
sudo netstat -tlnp | grep 6001

# 停止占用端口的进程或修改 docker-compose.yml 中的端口映射
```

### 3. MySQL 连接失败

```bash
# 检查 MySQL 服务是否可用
telnet 10.0.6.86 33306

# 检查数据库配置
sudo docker compose exec backend env
```

### 4. 查看容器日志

```bash
sudo docker compose logs -f [service_name]
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
```

---

## 📝 环境变量

### 后端 (.env)

```
PORT=6000
DB_HOST=10.0.6.86
DB_PORT=33306
DB_USER=root
DB_PASSWORD=root07
DB_NAME=wiptrack
NODE_ENV=production
```

### 前端 (.env)

```
VITE_API_BASE_URL=http://localhost:6000/api
```
