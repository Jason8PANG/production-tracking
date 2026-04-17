# Frontend build stage
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建
RUN npm run build

# Production stage
FROM nginx:alpine

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 6001

CMD ["nginx", "-g", "daemon off;"]
