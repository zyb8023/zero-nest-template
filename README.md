# NestJS 通用后端服务框架

这是一个**通用的 NestJS 后端服务框架**，提供了完整的项目结构和核心功能集成。你可以基于这个框架快速启动新的后端项目，避免重复配置。

## 🎯 框架特点

- ✅ **开箱即用**：完整的项目结构和配置
- ✅ **企业级特性**：安全性、可观测性、性能优化
- ✅ **模块化设计**：清晰的代码组织，易于扩展
- ✅ **类型安全**：完整的 TypeScript 支持
- ✅ **最佳实践**：遵循 NestJS 官方推荐的最佳实践
- ✅ **详细文档**：每个文件都有详细的中文注释，便于学习
- ✅ **容器化支持**：Docker 和 Docker Compose 配置

## 📚 技术栈

### 核心框架
- **NestJS**: 渐进式 Node.js 框架，用于构建高效、可扩展的服务器端应用
- **TypeScript**: 类型安全的 JavaScript 超集

### 数据存储
- **MySQL**: 关系型数据库，用于持久化存储数据
- **Redis**: 内存数据库，用于缓存和会话管理
- **TypeORM**: 强大的 ORM（对象关系映射）框架，简化数据库操作

### 工具库
- **Log4js**: 强大的日志记录库，支持文件输出和日志轮转
- **Swagger**: API 文档自动生成
- **Helmet**: 安全头设置
- **Throttler**: 请求限流

### 企业级特性
- **统一响应格式**：标准化的 API 响应
- **全局异常处理**：统一的错误处理
- **请求日志**：完整的请求追踪
- **健康检查**：服务监控
- **API 版本控制**：支持多版本 API
- **Docker 支持**：容器化部署

## 🚀 快速开始

> 📖 **详细步骤请查看 [QUICKSTART.md](./QUICKSTART.md)**  
> 🌍 **多环境配置请查看 [ENVIRONMENTS.md](./ENVIRONMENTS.md)**

### 快速启动（5 分钟）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
cp .env.local.example .env.local
# 编辑 .env.local 文件，填入你的本地配置

# 3. 创建数据库（在 MySQL 中执行）
CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. 启动应用（开发环境）
npm run start:dev
```

访问 `http://localhost:3000/api` 验证服务是否启动成功。

### 多环境支持

框架支持多个环境配置：

- **local** - 本地开发（个人配置，不提交 Git）
- **development** - 开发环境
- **production** - 生产环境
- **test** - 测试环境

配置文件会自动根据 `NODE_ENV` 加载，优先级：`.env.local` > `.env.{NODE_ENV}` > `.env`

## 📁 项目结构

```
carto-service/
├── src/
│   ├── main.ts                 # 应用入口文件
│   ├── app.module.ts           # 根模块
│   ├── app.controller.ts       # 根控制器
│   ├── app.service.ts          # 根服务
│   ├── config/                 # 配置文件
│   │   ├── database.config.ts  # 数据库配置
│   │   ├── redis.config.ts     # Redis 配置
│   │   ├── swagger.config.ts   # Swagger 配置
│   │   └── env.validation.ts   # 环境变量验证
│   ├── common/                 # 公共模块
│   │   ├── logger/             # 日志模块
│   │   ├── filters/            # 异常过滤器
│   │   ├── interceptors/       # 拦截器
│   │   ├── middleware/         # 中间件
│   │   ├── guards/             # 守卫
│   │   ├── dto/                # 通用 DTO
│   │   └── utils/               # 工具类
│   ├── health/                 # 健康检查模块
│   └── modules/                 # 业务模块（在这里添加你的业务模块）
│       └── (你的业务模块)
├── logs/                       # 日志文件目录
├── .env                        # 环境变量（需要创建）
├── .env.example               # 环境变量示例
├── package.json
├── tsconfig.json
├── README.md                   # 项目说明
├── ARCHITECTURE.md            # 架构设计文档
└── DEVELOPMENT.md             # 开发指南
```

## 📖 架构说明

### 1. 模块化架构

NestJS 采用模块化架构，每个功能都是一个独立的模块：

- **AppModule**: 根模块，导入所有功能模块
- **UserModule**: 用户模块，包含用户相关的功能
- **LoggerModule**: 日志模块，提供全局日志服务

### 2. 分层架构

```
Controller (控制器层)
    ↓
Service (服务层)
    ↓
Repository (数据访问层)
    ↓
Database (数据库)
```

- **Controller**: 处理 HTTP 请求，定义 API 路由
- **Service**: 包含业务逻辑
- **Repository**: 数据库操作（由 TypeORM 提供）
- **Entity**: 数据模型，定义数据库表结构

### 3. 依赖注入

NestJS 使用依赖注入（DI）模式：

```typescript
// 在构造函数中注入依赖
constructor(
  private userService: UserService,
  private logger: LoggerService,
) {}
```

## 🔧 核心功能

### 数据库操作（TypeORM）

TypeORM 让我们可以用 TypeScript 类来操作数据库：

```typescript
// 定义实体
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
}

// 使用 Repository 操作数据库
const user = await this.userRepository.findOne({ where: { id: 1 } });
```

### 缓存（Redis）

使用 Redis 缓存数据，提高性能：

```typescript
// 从缓存获取
const cached = await this.cacheManager.get('key');

// 存入缓存
await this.cacheManager.set('key', value, 3600);
```

### 日志（Log4js）

使用 Log4js 记录日志：

```typescript
this.logger.log('信息日志');
this.logger.error('错误日志');
this.logger.warn('警告日志');
```

### 企业级特性

#### 1. 统一响应格式

所有 API 响应使用统一格式：

```json
{
  "success": true,
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1234567890,
  "path": "/api/users"
}
```

#### 2. 全局异常处理

自动处理所有异常，提供友好的错误响应：

```typescript
throw new NotFoundException('资源不存在');
// 自动转换为统一格式的错误响应
```

#### 3. 请求限流

防止恶意请求和 DDoS 攻击：

- 默认：每个 IP 每分钟 100 个请求
- 支持代理服务器（Nginx）

#### 4. 安全头

自动设置安全相关的 HTTP 头，防止常见攻击。

#### 5. API 文档

自动生成 Swagger API 文档：

- 访问地址：`http://localhost:3000/api-docs`
- 支持在线测试接口
- JWT 认证支持

#### 6. 健康检查

监控服务运行状态：

- `GET /api/health` - 基础健康检查
- `GET /api/health/detailed` - 详细健康检查

#### 7. 分页工具

统一的分页查询方法：

```typescript
const result = await PaginationUtil.paginate(
  repository,
  { page: 1, limit: 10 }
);
```

## 📝 使用示例

### 健康检查

```bash
# 基础健康检查
curl http://localhost:3000/api/health

# 详细健康检查
curl http://localhost:3000/api/health/detailed
```

### API 文档

访问 `http://localhost:3000/api-docs` 查看完整的 API 文档。

### Docker 部署

```bash
# 使用 Docker Compose 一键启动
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

### 创建业务模块

参考 `DEVELOPMENT.md` 文档，按照步骤创建你的业务模块。

## 🛠️ 开发指南

### 快速开始

1. **阅读文档**：
   - `ARCHITECTURE.md` - 了解整体架构设计
   - `DEVELOPMENT.md` - 详细的开发指南和示例

2. **创建业务模块**：
   参考 `DEVELOPMENT.md` 中的步骤，创建你的第一个业务模块

3. **开发流程**：
   - 定义实体（Entity）
   - 创建 DTO
   - 实现服务（Service）
   - 实现控制器（Controller）
   - 注册模块

### 数据验证

使用 `class-validator` 装饰器进行数据验证：

```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
```

### 错误处理

NestJS 提供了内置的异常类：

```typescript
throw new NotFoundException('用户不存在');
throw new ConflictException('用户名已存在');
```

## 📚 学习资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)
- [Redis 文档](https://redis.io/docs/)
- [Log4js 文档](https://log4js-node.github.io/log4js-node/)

## 🎯 框架优势

### 为什么选择这个框架？

1. **零配置启动**：所有核心功能已配置好，直接使用
2. **详细注释**：每个文件都有中文注释，解释为什么这样做
3. **最佳实践**：遵循 NestJS 官方推荐的最佳实践
4. **易于扩展**：清晰的模块化设计，方便添加新功能
5. **学习友好**：适合前端开发者学习后端开发

### 适用场景

- ✅ 快速启动新项目
- ✅ 学习 NestJS 后端开发
- ✅ 作为项目模板
- ✅ 团队统一技术栈

## 📚 文档

- [README.md](./README.md) - 项目说明
- [QUICKSTART.md](./QUICKSTART.md) - 5 分钟快速开始指南 ⭐
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构设计文档
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 详细开发指南和示例
- [ENTERPRISE.md](./ENTERPRISE.md) - 企业级特性说明 ⭐
- [ENVIRONMENTS.md](./ENVIRONMENTS.md) - 多环境配置指南 ⭐
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 服务器部署指南 ⭐
- [LOGGING.md](./LOGGING.md) - 日志系统配置指南 ⭐

## 🎯 已实现的企业级特性

- ✅ 统一响应格式和全局异常处理
- ✅ 请求日志中间件和性能监控
- ✅ 健康检查接口
- ✅ Swagger API 文档
- ✅ 请求限流和安全头
- ✅ 通用工具类（分页、响应等）
- ✅ 环境变量验证
- ✅ Docker 支持

## 🚀 后续扩展建议

1. 添加身份验证（JWT）
2. 添加权限控制（RBAC）
3. 添加文件上传功能
4. 添加单元测试和 E2E 测试
5. 添加消息队列（RabbitMQ/Kafka）
6. 添加监控和性能分析（Prometheus、Grafana）
7. 添加链路追踪（Jaeger、Zipkin）

## 📄 许可证

MIT

