# 多阶段构建 Dockerfile
# 为什么使用多阶段构建？
# 1. 减小最终镜像大小
# 2. 只包含运行时需要的文件
# 3. 提高安全性（不包含构建工具）

# 第一阶段：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY tsconfig*.json ./

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm ci && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 第二阶段：依赖安装
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production && npm cache clean --force

# 第三阶段：运行阶段
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 安装 dumb-init（优雅处理信号）
RUN apk add --no-cache dumb-init

# 创建非 root 用户（安全最佳实践）
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 从依赖阶段复制 node_modules
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

# 从构建阶段复制编译后的代码和 package.json
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

# 创建日志目录
RUN mkdir -p logs && chown nestjs:nodejs logs

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 使用 dumb-init 启动应用（处理信号和僵尸进程）
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]

