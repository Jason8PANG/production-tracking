# 部署指南 - CentOS Linux + Docker

## 前置要求

- CentOS 7/8 或 RHEL 7/8
- Docker 20.10+
- Docker Compose v2+
- 开放端口: 3000 (前端), 5000 (API)

## 快速部署

### 1. 上传代码到服务器

```bash
# 在服务器上创建项目目录
sudo mkdir -p /opt/production-tracking
cd /opt/production-tracking

# 上传整个 production-tracking 目录内容到服务器
# 使用 scp/rsync/sftp 等方式上传
```

### 2. 配置环境变量

```bash
# 创建 .env 文件
cat > /opt/production-tracking/.env << 'EOF'
MYSQL_ROOT_PASSWORD=your_secure_password_here
NODE_ENV=production
EOF
```

### 3. 启动服务

```bash
cd /opt/production-tracking

# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- 前端: `http://your-server-ip:3000`
- API: `http://your-server-ip:5000`
- API 健康检查: `http://your-server-ip:5000/api/health`

## 详细部署步骤

### 安装 Docker (如果未安装)

```bash
# CentOS 7
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker

# CentOS 8 / RHEL 8
sudo dnf install -y docker-ce
sudo systemctl start docker
sudo systemctl enable docker
```

### 安装 Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

### 配置防火墙

```bash
# CentOS 7/RHEL 7 (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# 或者关闭防火墙 (测试环境)
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

### 使用 Nginx 反向代理 (可选，生产环境推荐)

```bash
# 安装 Nginx
sudo yum install -y nginx

# 配置 Nginx
sudo cat > /etc/nginx/conf.d/production-tracking.conf << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP

    # 前端静态文件
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API 反向代理
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# 启动 Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### HTTPS 配置 (使用 Let's Encrypt)

```bash
# 安装 Certbot
sudo yum install -y epel-release
sudo yum install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 0 * * * certbot renew --quiet
```

## 数据持久化

数据库数据存储在 Docker volume 中：

```bash
# 查看 volume
docker volume ls | grep production

# 备份数据库
docker-compose exec mysql mysqldump -u root -p production_tracking > backup.sql

# 恢复数据库
docker-compose exec -i mysql mysql -u root -p production_tracking < backup.sql
```

## 更新部署

```bash
cd /opt/production-tracking

# 拉取新代码
git pull

# 重新构建并启动
docker-compose up -d --build

# 如果只更新后端
docker-compose up -d --build backend

# 如果只更新前端
docker-compose up -d --build frontend
```

## 常用运维命令

```bash
# 查看所有服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [service_name]

# 重启服务
docker-compose restart [service_name]

# 停止服务
docker-compose down

# 停止并删除数据卷 (慎用！会删除数据)
docker-compose down -v
```

## 故障排查

### 1. MySQL 连接失败

```bash
# 查看 MySQL 日志
docker-compose logs mysql

# 检查 MySQL 是否就绪
docker-compose exec mysql mysqladmin ping -h localhost
```

### 2. 后端 API 启动失败

```bash
# 查看后端日志
docker-compose logs backend

# 检查数据库连接配置
docker-compose exec backend env
```

### 3. 前端无法访问

```bash
# 检查前端容器状态
docker-compose ps frontend

# 查看前端日志
docker-compose logs frontend

# 检查 Nginx 配置
docker-compose exec frontend nginx -t
```

## 生产环境优化

### 1. 使用自定义网络

编辑 `docker-compose.yml`，确保服务在隔离网络中通信。

### 2. 资源限制

```yaml
# 在 docker-compose.yml 中添加
services:
  mysql:
    deploy:
      resources:
        limits:
          memory: 512M
  backend:
    deploy:
      resources:
        limits:
          memory: 256M
```

### 3. 日志轮转

```bash
# 编辑 /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## 目录结构

```
/opt/production-tracking/
├── docker-compose.yml      # Docker Compose 配置
├── .env                    # 环境变量
├── backend/                # 后端代码
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── frontend/               # 前端代码
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
└── mysql/                  # MySQL 配置
    └── init.sql
```
