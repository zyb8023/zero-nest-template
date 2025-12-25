# 快速开始指南

## 🚀 5 分钟快速启动

### 步骤 1：安装依赖

```bash
npm install
```

**这一步做什么？**
- 安装所有必需的 npm 包（NestJS、TypeORM、Redis、Log4js 等）
- 安装开发工具（TypeScript、ESLint、Prettier 等）
- 大约需要 1-2 分钟

### 步骤 2：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env
```

然后编辑 `.env` 文件，修改以下配置：

```env
# MySQL 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=你的MySQL密码
DB_DATABASE=你的数据库名

# Redis 配置（如果使用默认配置可以不改）
REDIS_HOST=localhost
REDIS_PORT=6379
```

**为什么需要配置？**
- 数据库连接信息
- Redis 连接信息
- 不同环境使用不同配置

### 步骤 3：启动 MySQL 和 Redis

确保以下服务已启动：

```bash
# 检查 MySQL 是否运行
mysql -u root -p

# 检查 Redis 是否运行
redis-cli ping
# 应该返回 PONG
```

如果未启动，请先启动服务。

### 步骤 4：创建数据库

在 MySQL 中创建数据库：

```sql
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**为什么需要创建数据库？**
- TypeORM 需要连接到已存在的数据库
- 数据库名称要与 `.env` 中的 `DB_DATABASE` 一致

### 步骤 5：启动应用

```bash
npm run start:dev
```

**这一步做什么？**
- 编译 TypeScript 代码
- 启动 NestJS 应用
- 连接到 MySQL 和 Redis
- 开启热重载（代码修改后自动重启）

### 步骤 6：验证服务

打开浏览器访问：`http://localhost:3000/api`

应该看到：
```
Carto Service API is running! 🚀
```

## ✅ 成功标志

如果看到以下内容，说明启动成功：

1. **控制台输出**：
   ```
   🚀 应用启动成功，运行在 http://localhost:3000/api
   ```

2. **日志文件**：
   - `logs/app.log` - 应用日志
   - `logs/error.log` - 错误日志（如果有错误）

3. **API 响应**：
   - 访问 `http://localhost:3000/api` 返回成功消息

## ❌ 常见问题

### 问题 1：找不到模块错误

**错误信息**：
```
找不到模块"@nestjs/common"或其相应的类型声明
```

**解决方法**：
```bash
npm install
```

### 问题 2：数据库连接失败

**错误信息**：
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**解决方法**：
1. 检查 MySQL 服务是否启动
2. 检查 `.env` 中的数据库配置是否正确
3. 检查数据库是否存在

### 问题 3：Redis 连接失败

**错误信息**：
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**解决方法**：
1. 检查 Redis 服务是否启动
2. 检查 `.env` 中的 Redis 配置是否正确

### 问题 4：端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方法**：
1. 修改 `.env` 中的 `PORT=3001`（或其他端口）
2. 或关闭占用 3000 端口的程序

## 📚 下一步

启动成功后，你可以：

1. **阅读文档**：
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - 了解架构设计
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - 学习如何开发

2. **创建第一个模块**：
   参考 `DEVELOPMENT.md` 中的示例，创建你的业务模块

3. **开始开发**：
   基于这个框架，专注于业务逻辑开发

## 🎯 开发命令

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod

# 代码格式化
npm run format

# 代码检查
npm run lint

# 运行测试
npm run test
```

## 💡 提示

- **开发时**：使用 `npm run start:dev`，代码修改后自动重启
- **生产时**：使用 `npm run build` 构建，然后 `npm run start:prod` 启动
- **调试时**：使用 `npm run start:debug`，然后在 VS Code 中附加调试器

祝你开发愉快！🚀

