FROM node:20-alpine

WORKDIR /app

# 安装 curl (用于 healthcheck)
RUN apk add --no-cache curl

# 复制 package 文件
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 6000

# 启动命令
CMD ["sh", "-c", "npm run migrate && npm start"]
