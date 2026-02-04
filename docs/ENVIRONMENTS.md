# 多环境配置指南

## 📋 环境说明

框架支持多个环境配置，可以根据 `NODE_ENV` 自动加载对应的环境变量文件。

### 支持的环境

1. **local** - 本地开发环境（个人配置）
2. **development** - 开发环境
3. **production** - 生产环境
4. **test** - 测试环境

## 🔧 配置文件

### 配置文件优先级

配置文件按以下顺序加载（优先级从高到低）：

1. `.env.local` - 本地覆盖配置（不提交到 Git）
2. `.env.{NODE_ENV}` - 环境特定配置
   - `.env.development` - 开发环境
   - `.env.production` - 生产环境
   - `.env.test` - 测试环境
3. `.env` - 默认配置（基础配置）

**注意**：后加载的配置会覆盖先加载的配置。

### 配置文件说明

#### .env.example

- 环境变量模板文件
- 包含所有可配置的变量
- 提交到 Git，作为参考

#### .env.local.example

- 本地环境配置模板
- 复制为 `.env.local` 使用
- 不提交到 Git（在 .gitignore 中）

#### .env.development

- 开发环境配置
- 提交到 Git
- 用于团队开发

#### .env.production

- 生产环境配置
- 提交到 Git（敏感信息应使用环境变量注入）
- 用于生产部署

#### .env.test

- 测试环境配置
- 提交到 Git
- 用于自动化测试

## 🚀 使用方法

### 1. 本地开发

```bash
# 1. 复制环境变量模板
cp .env.example .env
cp .env.local.example .env.local

# 2. 修改 .env.local 为你的本地配置
# .env.local 会覆盖 .env 中的配置

# 3. 启动应用（默认使用 development 环境）
npm run start:dev
```

### 2. 指定环境启动

```bash
# 开发环境
NODE_ENV=development npm run start:dev

# 生产环境
NODE_ENV=production npm run start:prod

# 测试环境
NODE_ENV=test npm run test
```

### 3. 在 package.json 中配置脚本

```json
{
  "scripts": {
    "start:dev": "NODE_ENV=development nest start --watch",
    "start:prod": "NODE_ENV=production node dist/main",
    "start:local": "NODE_ENV=local nest start --watch",
    "test": "NODE_ENV=test jest"
  }
}
```

## 🐳 Docker 环境配置

### 使用环境变量文件

```bash
# 开发环境
docker-compose --env-file .env.development up

# 生产环境
docker-compose --env-file .env.production up
```

### 在 docker-compose.yml 中指定环境

```yaml
services:
  app:
    env_file:
      - .env.production # 指定环境文件
    environment:
      - NODE_ENV=production
```

## 📝 环境变量说明

### 必需的环境变量

- `NODE_ENV` - 环境名称（local、development、production、test）
- `PORT` - 应用端口
- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_USERNAME` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_DATABASE` - 数据库名称

### 可选的环境变量

- `CORS_ORIGINS` - CORS 允许的域名
- `REDIS_HOST` - Redis 主机
- `REDIS_PORT` - Redis 端口
- `THROTTLE_TTL` - 限流时间窗口
- `THROTTLE_LIMIT` - 限流请求数

## 🔒 安全最佳实践

### 1. 敏感信息处理

**不要**在配置文件中直接写入敏感信息（如密码、密钥）：

```bash
# ❌ 错误做法
DB_PASSWORD=my_secret_password

# ✅ 正确做法（使用环境变量注入）
DB_PASSWORD=${DB_PASSWORD}
```

### 2. .gitignore 配置

确保以下文件不被提交到 Git：

```
.env.local
.env*.local
*.env.local
```

### 3. 生产环境配置

生产环境应使用以下方式注入敏感信息：

1. **环境变量**：在容器或服务器上设置环境变量
2. **密钥管理**：使用 AWS Secrets Manager、HashiCorp Vault 等
3. **CI/CD**：在部署流程中注入环境变量

## 🎯 环境差异配置

### 开发环境

- `DB_SYNCHRONIZE=true` - 自动同步数据库结构
- `DB_LOGGING=true` - 记录 SQL 日志
- `CORS_ORIGINS=*` - 允许所有来源
- `THROTTLE_LIMIT=200` - 放宽限流限制

### 生产环境

- `DB_SYNCHRONIZE=false` - 使用迁移管理数据库
- `DB_LOGGING=false` - 关闭 SQL 日志
- `CORS_ORIGINS=https://yourdomain.com` - 指定具体域名
- `THROTTLE_LIMIT=100` - 严格的限流限制

### 测试环境

- `DB_SYNCHRONIZE=true` - 自动同步测试数据库
- `DB_LOGGING=false` - 关闭日志
- `PORT=3001` - 使用不同端口避免冲突
- `REDIS_DB=1` - 使用独立的 Redis 数据库

## 📚 配置验证

框架支持环境变量验证，可以在 `src/config/env.validation.ts` 中配置验证规则。

启用验证：

```typescript
// src/shared/shared.module.ts
ConfigModule.forRoot({
  ...getConfigModuleOptions(),
  validate: validate, // 启用验证
}),
```

## 🔍 调试配置

### 查看当前加载的配置

```typescript
// 在代码中查看
console.log(process.env.NODE_ENV);
console.log(process.env.DB_HOST);
```

### 检查配置文件加载顺序

框架会自动按优先级加载配置文件，可以在启动日志中查看。

## 📖 总结

1. ✅ **多环境支持**：自动根据 NODE_ENV 加载对应配置
2. ✅ **优先级机制**：.env.local > .env.{NODE_ENV} > .env
3. ✅ **安全实践**：敏感信息不提交到 Git
4. ✅ **灵活配置**：支持环境变量覆盖
5. ✅ **Docker 支持**：支持容器化部署

通过合理的环境配置，可以轻松管理不同环境的部署！

## 🚀 服务器部署

> 📖 **详细的服务器部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)**

### 快速部署步骤

1. **准备环境文件**：在服务器上准备对应的 `.env.{NODE_ENV}` 文件
2. **设置环境变量**：`export NODE_ENV=production`
3. **启动应用**：`npm run start:prod` 或使用 PM2/Docker

### 部署方式选择

- **简单部署**：使用环境文件 + npm scripts
- **生产环境**：使用 PM2 进程管理器
- **容器化**：使用 Docker + Docker Compose
- **最安全**：使用环境变量注入 + 密钥管理服务
