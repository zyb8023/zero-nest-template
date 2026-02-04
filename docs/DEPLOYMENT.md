# 服务器部署指南

本文档详细说明如何在服务器上使用不同的环境文件部署不同环境的应用。

## ⚠️ 重要：部署前必须打包

**是的，在服务器上部署时必须先打包！**

### 为什么需要打包？

1. **NestJS 使用 TypeScript**：源代码是 `.ts` 文件，需要编译成 `.js` 文件
2. **生产环境运行编译后的代码**：`start:prod` 运行的是 `dist/main.js`，不是 `src/main.ts`
3. **性能优化**：编译后的代码已经优化，运行更快
4. **减少依赖**：生产环境不需要 TypeScript 编译器和开发依赖

### 打包流程

```bash
# 1. 安装依赖（生产环境只安装生产依赖）
npm install --production

# 2. 构建应用（将 TypeScript 编译成 JavaScript）
npm run build

# 3. 检查 dist/ 目录是否生成
ls -la dist/

# 4. 启动应用（运行编译后的代码）
npm run start:prod
```

### 打包前后对比

**打包前（开发环境）：**

- 运行 `npm run start:dev`
- 使用 `ts-node` 直接运行 TypeScript
- 需要安装所有开发依赖（TypeScript、@nestjs/cli 等）
- 支持热重载和自动编译

**打包后（生产环境）：**

- 运行 `npm run start:prod`
- 运行编译后的 `dist/main.js`
- 只需要生产依赖
- 性能更好，启动更快

## 📋 部署场景

### 典型部署架构

```
开发服务器 (dev-server)
  └── 使用 .env.development
  └── 端口: 3000

测试服务器 (test-server)
  └── 使用 .env.test
  └── 端口: 3001

生产服务器 (prod-server)
  └── 使用 .env.production
  └── 端口: 3000
```

## 🚀 部署方式

### 方式一：只传制成品（推荐，更安全）

**优势：**

- ✅ 不暴露源代码
- ✅ 传输文件更少，部署更快
- ✅ 更安全，保护知识产权
- ✅ 服务器不需要 TypeScript 编译器

#### 本地构建流程

```bash
# 1. 在本地或 CI/CD 环境中构建
npm install --production
npm run build

# 2. 准备部署包（只包含必要文件）
# 需要上传的文件：
# - dist/              # 编译后的代码（必需）
# - node_modules/      # 生产依赖（必需）
# - package.json       # 项目配置（必需）
# - package-lock.json  # 依赖锁定（推荐）
# - .env.production    # 环境配置（必需）
# - ecosystem.config.js # PM2 配置（如果使用）
# - logs/              # 日志目录（可选，会自动创建）
```

#### 使用 rsync 只传制成品

```bash
# 使用 rsync 排除不需要的文件
rsync -avz \
  --exclude 'src/' \
  --exclude '*.ts' \
  --exclude 'test/' \
  --exclude '.git/' \
  --exclude 'node_modules/.cache/' \
  --exclude '.env.local' \
  --exclude '.env.development' \
  --exclude '.env.test' \
  --include 'dist/' \
  --include 'node_modules/' \
  --include 'package.json' \
  --include '.env.production' \
  ./ user@server:/path/to/app/
```

#### 使用 scp 只传制成品

```bash
# 创建部署包
mkdir -p deploy-package
cp -r dist deploy-package/
cp -r node_modules deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/
cp .env.production deploy-package/
cp ecosystem.config.js deploy-package/ 2>/dev/null || true

# 打包
tar -czf deploy-package.tar.gz -C deploy-package .

# 上传到服务器
scp deploy-package.tar.gz user@server:/path/to/app/

# 在服务器上解压
ssh user@server
cd /path/to/app
tar -xzf deploy-package.tar.gz
rm deploy-package.tar.gz
```

#### 服务器端操作

```bash
# 1. SSH 到服务器
ssh user@server
cd /path/to/app

# 2. 验证文件（确保 dist/ 存在）
ls -la dist/main.js

# 3. 设置环境变量
export NODE_ENV=production

# 4. 启动应用（直接运行，无需构建）
npm run start:prod
# 或使用 PM2
pm2 start ecosystem.config.js --only carto-service-prod
```

### 方式二：上传源码在服务器构建（传统方式）

#### 完整部署流程

```bash
# 1. 上传代码到服务器
scp -r . user@server:/path/to/app/

# 2. SSH 到服务器
ssh user@server
cd /path/to/app

# 3. 安装依赖（只安装生产依赖）
npm install --production

# 4. 构建应用（重要！必须先打包）
npm run build

# 5. 准备环境配置文件
cp .env.example .env.production
# 编辑 .env.production，填入生产环境配置

# 6. 设置环境变量
export NODE_ENV=production

# 7. 启动应用
npm run start:prod
```

#### 验证打包是否成功

```bash
# 检查 dist/ 目录
ls -la dist/

# 应该看到以下文件：
# dist/
#   ├── main.js          # 应用入口
#   ├── app.module.js
#   └── ...              # 其他编译后的文件
```

### 方式二：使用 PM2 进程管理器（推荐生产环境）

#### 完整部署流程

```bash
# 1. 安装 PM2
npm install -g pm2

# 2. 安装依赖
npm install --production

# 3. 构建应用（必须先打包）
npm run build

# 4. 准备环境配置文件
cp .env.example .env.production

# 5. 启动应用（使用 PM2）
pm2 start ecosystem.config.js --only carto-service-prod

# 6. 查看状态
pm2 status

# 7. 查看日志
pm2 logs carto-service-prod

# 8. 设置开机自启
pm2 save
pm2 startup
```

**注意：** PM2 配置中的 `script: './dist/main.js'` 指向编译后的文件，所以必须先运行 `npm run build`。

### 方式三：使用 Docker 部署

#### Docker 自动打包

使用 Docker 部署时，**不需要手动打包**，Dockerfile 会自动处理：

```dockerfile
# Dockerfile 中的构建步骤
RUN npm run build  # Docker 构建时会自动执行
```

#### 部署流程

```bash
# 1. 构建镜像（Docker 会自动打包）
docker build -t carto-service:prod .

# 2. 启动容器
docker-compose --env-file .env.production up -d

# 或者直接运行
docker run -d \
  --env-file .env.production \
  -p 3000:3000 \
  carto-service:prod
```

**优势：** Docker 构建时会自动执行 `npm run build`，无需手动打包。

### 方式四：使用环境变量注入（最安全）

#### 完整部署流程

```bash
# 1. 上传代码（不包含 node_modules 和 dist）
scp -r --exclude node_modules --exclude dist . user@server:/path/to/app/

# 2. SSH 到服务器
ssh user@server
cd /path/to/app

# 3. 安装依赖
npm install --production

# 4. 构建应用（必须先打包）
npm run build

# 5. 设置环境变量（从密钥管理服务获取）
export NODE_ENV=production
export DB_PASSWORD=$(vault kv get -field=password secret/db)
export JWT_SECRET=$(vault kv get -field=secret secret/jwt)

# 6. 启动应用
npm run start:prod
```

## 📦 打包相关说明

### 打包命令

```bash
# 标准打包命令
npm run build

# 打包命令实际执行的是：
# nest build
# 会将 src/ 目录下的 TypeScript 文件编译到 dist/ 目录
```

### 打包输出

打包后会在项目根目录生成 `dist/` 目录：

```
dist/
├── main.js              # 应用入口（对应 src/main.ts）
├── app.module.js        # 根模块
├── app.controller.js
├── app.service.js
├── config/             # 配置文件
├── shared/             # 共享模块
└── ...
```

### 生产环境文件清单

生产环境需要以下文件：

```
项目根目录/
├── dist/               # 编译后的代码（必需）
├── node_modules/       # 生产依赖（必需）
├── package.json        # 项目配置（必需）
├── .env.production     # 环境配置（必需）
├── logs/               # 日志目录（自动创建）
└── ecosystem.config.js # PM2 配置（如果使用 PM2）
```

**不需要的文件：**

- `src/` - 源代码（已编译到 dist/）
- `tsconfig.json` - TypeScript 配置（生产环境不需要）
- `nest-cli.json` - NestJS CLI 配置（生产环境不需要）
- 开发依赖（已通过 `--production` 排除）

### 打包优化建议

1. **使用生产依赖**：

   ```bash
   npm install --production
   # 只安装 dependencies，不安装 devDependencies
   ```

2. **清理缓存**：

   ```bash
   npm cache clean --force
   ```

3. **检查打包结果**：

   ```bash
   # 检查 dist/ 目录大小
   du -sh dist/

   # 检查是否有遗漏的文件
   ls -la dist/
   ```

## 🔍 常见问题

### Q1: 忘记打包直接启动会怎样？

```bash
# 如果直接运行 start:prod
npm run start:prod

# 会报错：
# Error: Cannot find module '/path/to/app/dist/main'
# 因为 dist/ 目录不存在
```

**解决方法：** 先运行 `npm run build`

### Q2: 打包后还需要 TypeScript 吗？

**不需要！** 打包后：

- 生产环境只需要 Node.js 运行时
- 不需要 TypeScript 编译器
- 不需要 `@nestjs/cli`
- 只需要 `node dist/main.js`

### Q3: 如何验证打包是否成功？

```bash
# 1. 检查 dist/ 目录是否存在
ls -la dist/

# 2. 检查 main.js 是否存在
ls -la dist/main.js

# 3. 尝试运行编译后的代码
node dist/main.js

# 4. 检查是否有编译错误
npm run build
# 如果有错误，会显示在控制台
```

### Q4: 打包后如何更新代码？

```bash
# 1. 更新代码（通过 Git 或其他方式）
git pull

# 2. 重新安装依赖（如果有新的依赖）
npm install --production

# 3. 重新打包
npm run build

# 4. 重启应用
pm2 restart carto-service-prod
# 或
npm run start:prod
```

### Q5: Docker 部署需要手动打包吗？

**不需要！** Dockerfile 会自动打包：

```dockerfile
# Dockerfile 中已经包含构建步骤
RUN npm run build
```

只需要：

```bash
docker build -t carto-service:prod .
```

## 📝 完整部署检查清单

### 部署前

- [ ] 代码已上传到服务器
- [ ] 环境配置文件已准备（.env.production）
- [ ] 已安装 Node.js（版本 >= 18）
- [ ] 已安装 npm 或 yarn

### 打包步骤

- [ ] 运行 `npm install --production` 安装依赖
- [ ] 运行 `npm run build` 构建应用
- [ ] 检查 `dist/` 目录是否生成
- [ ] 检查 `dist/main.js` 是否存在

### 启动步骤

- [ ] 设置 `NODE_ENV=production`
- [ ] 运行 `npm run start:prod` 或使用 PM2
- [ ] 检查应用是否启动成功
- [ ] 检查健康检查接口是否正常

### 部署后

- [ ] 应用正常运行
- [ ] 数据库连接正常
- [ ] Redis 连接正常
- [ ] API 接口正常响应
- [ ] 日志正常输出

## 📦 只传制成品 vs 上传源码

### 对比

| 项目           | 只传制成品                      | 上传源码                  |
| -------------- | ------------------------------- | ------------------------- |
| **传输文件**   | 少（只有 dist/、node_modules/） | 多（包含 src/、test/ 等） |
| **传输速度**   | 快                              | 慢                        |
| **安全性**     | 高（不暴露源码）                | 低（暴露源码）            |
| **服务器要求** | 只需 Node.js 运行时             | 需要 TypeScript 编译器    |
| **部署时间**   | 快（无需构建）                  | 慢（需要构建）            |
| **适用场景**   | 生产环境（推荐）                | 开发/测试环境             |

### 推荐方案

**生产环境：只传制成品**

- ✅ 更安全，不暴露源代码
- ✅ 部署更快
- ✅ 服务器不需要构建工具

**开发/测试环境：可以上传源码**

- ✅ 便于调试
- ✅ 可以修改代码

### 只传制成品的文件清单

生产环境只需要以下文件：

```
部署包/
├── dist/              # 编译后的代码（必需）
├── node_modules/      # 生产依赖（必需）
├── package.json       # 项目配置（必需）
├── package-lock.json  # 依赖锁定（推荐）
├── .env.production    # 环境配置（必需）
├── ecosystem.config.js # PM2 配置（如果使用）
└── logs/              # 日志目录（可选，会自动创建）
```

**不需要的文件：**

- `src/` - 源代码
- `test/` - 测试文件
- `*.ts` - TypeScript 源文件
- `tsconfig.json` - TypeScript 配置
- `.git/` - Git 仓库

### 自动化部署脚本

项目已提供自动化脚本：

```bash
# 构建生产环境部署包
npm run build:deploy

# 构建开发环境部署包
npm run build:deploy:dev

# 或直接使用脚本
bash scripts/build-deploy.sh production
```

脚本会自动：

1. 安装生产依赖
2. 构建应用
3. 打包必要文件
4. 生成部署包（.tar.gz）

### 服务器端部署脚本

```bash
# 上传部署包到服务器
scp carto-service-production-*.tar.gz user@server:/path/to/app/

# 在服务器上运行部署脚本
ssh user@server
cd /path/to/app
bash deploy.sh carto-service-production-*.tar.gz
```

## 🎯 总结

1. ✅ **必须打包**：生产环境必须先运行 `npm run build`
2. ✅ **推荐只传制成品**：更安全、更快、不暴露源码
3. ✅ **打包命令**：`npm run build` 生成 `dist/` 目录
4. ✅ **启动命令**：`npm run start:prod` 运行 `dist/main.js`
5. ✅ **Docker 例外**：Docker 构建时会自动打包，无需手动操作
6. ✅ **自动化脚本**：使用 `npm run build:deploy` 自动构建部署包

记住：**生产环境推荐只传制成品，不传源码！**
