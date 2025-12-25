# 架构设计文档

## 📐 整体架构

这是一个基于 NestJS 的通用后端服务框架，采用模块化、分层架构设计，可以快速启动新的后端项目。

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                    应用入口 (main.ts)                    │
│  - 全局中间件配置                                        │
│  - 全局验证管道                                          │
│  - CORS 配置                                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  根模块 (AppModule)                      │
│  - 配置模块 (ConfigModule)                               │
│  - 数据库模块 (TypeOrmModule)                           │
│  - 缓存模块 (CacheModule)                                │
│  - 日志模块 (LoggerModule)                              │
│  - 业务模块 (Your Modules)                              │
└─────────────────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼───┐  ┌─────▼─────┐  ┌──▼──────────┐
│  业务模块  │  │  公共模块  │  │  配置模块   │
│           │  │           │  │             │
│ Controller│  │  Logger   │  │  Database  │
│ Service   │  │  Utils    │  │  Redis     │
│ Entity    │  │  Guards   │  │            │
│ DTO       │  │  Filters  │  │            │
└───────────┘  └───────────┘  └────────────┘
```

## 🏗️ 分层架构

### 1. 控制器层 (Controller)

**职责：**
- 处理 HTTP 请求和响应
- 定义 API 路由
- 参数验证和转换
- 调用服务层处理业务逻辑

**为什么需要控制器层？**
- 分离关注点：控制器只负责 HTTP 相关，不处理业务逻辑
- 便于测试：可以单独测试 HTTP 层
- 统一接口：所有 API 都通过控制器暴露

**示例结构：**
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
```

### 2. 服务层 (Service)

**职责：**
- 实现业务逻辑
- 数据验证和处理
- 调用数据访问层
- 缓存管理

**为什么需要服务层？**
- 业务逻辑复用：多个控制器可以共享同一个服务
- 便于测试：可以单独测试业务逻辑
- 代码组织：将复杂的业务逻辑从控制器中分离

**示例结构：**
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  
  async findAll(): Promise<User[]> {
    // 业务逻辑
  }
}
```

### 3. 数据访问层 (Repository)

**职责：**
- 数据库 CRUD 操作
- 查询构建
- 事务管理

**为什么使用 TypeORM Repository？**
- 类型安全：TypeScript 类型检查
- 无需写 SQL：使用 TypeScript 方法操作数据库
- 自动映射：实体类自动映射到数据库表

**示例结构：**
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  username: string;
}
```

### 4. 数据传输对象 (DTO)

**职责：**
- 定义 API 输入输出格式
- 数据验证
- 类型安全

**为什么需要 DTO？**
- 数据验证：使用 class-validator 自动验证
- 类型安全：TypeScript 类型检查
- 文档化：DTO 本身就是接口文档

**示例结构：**
```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
```

## 🔧 核心模块说明

### 1. 配置模块 (ConfigModule)

**作用：**
- 统一管理环境变量
- 支持多环境配置（开发、测试、生产）
- 类型安全的配置访问

**为什么需要配置模块？**
- 环境隔离：不同环境使用不同配置
- 安全性：敏感信息不硬编码
- 灵活性：可以轻松切换配置

**使用方式：**
```typescript
constructor(private configService: ConfigService) {
  const dbHost = this.configService.get<string>('DB_HOST');
}
```

### 2. 数据库模块 (TypeOrmModule)

**作用：**
- 管理数据库连接
- 提供 Repository 模式
- 支持数据库迁移

**为什么使用 TypeORM？**
- ORM 优势：用对象操作数据库，无需写 SQL
- 类型安全：TypeScript 支持
- 功能强大：支持关系、事务、迁移等

**配置要点：**
- `synchronize`: 开发环境可用，生产环境应使用迁移
- `logging`: 开发环境开启，生产环境关闭
- `entities`: 实体文件路径

### 3. 缓存模块 (CacheModule)

**作用：**
- 缓存热点数据
- 减少数据库查询
- 提高应用性能

**为什么使用 Redis？**
- 高性能：内存数据库，读写速度快
- 持久化：支持数据持久化
- 功能丰富：支持多种数据结构

**使用方式：**
```typescript
// 获取缓存
const cached = await this.cacheManager.get('key');

// 设置缓存
await this.cacheManager.set('key', value, 3600);

// 删除缓存
await this.cacheManager.del('key');
```

### 4. 日志模块 (LoggerModule)

**作用：**
- 统一日志格式
- 文件输出和轮转
- 日志分级（error, warn, info, debug）

**为什么使用 Log4js？**
- 功能强大：支持多种输出方式
- 日志轮转：自动管理日志文件大小
- 性能优化：异步写入，不影响主线程

**日志级别：**
- `error`: 错误信息，需要立即处理
- `warn`: 警告信息，需要注意但不影响运行
- `info`: 一般信息，记录正常操作
- `debug`: 调试信息，开发时使用

## 📦 模块化设计

### 模块结构

每个业务模块应包含：
```
module-name/
├── module-name.module.ts    # 模块定义
├── module-name.controller.ts # 控制器
├── module-name.service.ts    # 服务
├── module-name.entity.ts     # 实体
└── dto/                      # 数据传输对象
    ├── create-module-name.dto.ts
    └── update-module-name.dto.ts
```

### 模块注册

在 `app.module.ts` 中注册模块：
```typescript
@Module({
  imports: [
    // ... 其他模块
    YourModule,
  ],
})
```

## 🔐 依赖注入

NestJS 使用依赖注入（DI）模式管理依赖关系。

**为什么使用依赖注入？**
- 解耦：模块之间不直接依赖，通过接口依赖
- 测试：可以轻松替换依赖进行测试
- 管理：框架自动管理对象的创建和生命周期

**使用方式：**
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
}
```

## 🚀 性能优化

### 1. 数据库优化

- 使用连接池：复用数据库连接
- 索引优化：为常用查询字段添加索引
- 查询优化：避免 N+1 查询问题

### 2. 缓存策略

- 热点数据缓存：频繁查询的数据放入缓存
- 缓存失效：数据更新时清除相关缓存
- 缓存预热：应用启动时预加载常用数据

### 3. 日志优化

- 异步写入：使用异步日志，不阻塞主线程
- 日志轮转：限制日志文件大小
- 生产环境：只记录必要的日志

## 📝 最佳实践

### 1. 错误处理

使用 NestJS 内置异常：
```typescript
throw new NotFoundException('资源不存在');
throw new BadRequestException('请求参数错误');
throw new ConflictException('资源冲突');
```

### 2. 数据验证

使用 class-validator：
```typescript
@IsNotEmpty()
@IsString()
@MinLength(3)
username: string;
```

### 3. 代码组织

- 一个模块一个功能
- 服务层处理业务逻辑
- 控制器层只处理 HTTP

### 4. 命名规范

- 模块：`xxx.module.ts`
- 控制器：`xxx.controller.ts`
- 服务：`xxx.service.ts`
- 实体：`xxx.entity.ts`
- DTO：`xxx.dto.ts`

## 🔄 数据流

```
客户端请求
    ↓
Controller (参数验证)
    ↓
Service (业务逻辑)
    ↓
Repository (数据库操作)
    ↓
Database (MySQL)
    ↓
返回数据
    ↓
Service (数据处理)
    ↓
Controller (HTTP 响应)
    ↓
客户端
```

## 🎯 扩展指南

### 添加新功能模块

1. 创建模块目录结构
2. 定义实体（Entity）
3. 创建 DTO
4. 实现服务（Service）
5. 实现控制器（Controller）
6. 注册模块到 AppModule

### 添加中间件

在 `main.ts` 中添加：
```typescript
app.use(yourMiddleware);
```

### 添加全局守卫

在 `main.ts` 中添加：
```typescript
app.useGlobalGuards(new YourGuard());
```

### 添加拦截器

在 `main.ts` 中添加：
```typescript
app.useGlobalInterceptors(new YourInterceptor());
```

## 📚 技术选型说明

### NestJS

**为什么选择 NestJS？**
- TypeScript 原生支持
- 模块化架构
- 依赖注入
- 丰富的生态系统
- 类似 Angular 的架构（前端开发者友好）

### TypeORM

**为什么选择 TypeORM？**
- TypeScript 支持
- 装饰器语法
- 自动迁移
- 关系管理

### Redis

**为什么选择 Redis？**
- 高性能
- 丰富的数据结构
- 持久化支持
- 广泛使用

### Log4js

**为什么选择 Log4js？**
- 功能强大
- 日志轮转
- 多种输出方式
- 性能优秀

## 🔍 调试技巧

### 1. 查看日志

日志文件位置：`logs/`
- `app.log`: 所有日志
- `error.log`: 错误日志

### 2. 数据库查询日志

开发环境开启 `DB_LOGGING=true`，可以在控制台看到 SQL 查询。

### 3. 使用调试器

```bash
npm run start:debug
```

然后在 VS Code 中附加调试器。

## 📖 总结

这个框架提供了：
- ✅ 完整的项目结构
- ✅ 数据库集成（MySQL + TypeORM）
- ✅ 缓存集成（Redis）
- ✅ 日志系统（Log4js）
- ✅ 配置管理
- ✅ 模块化架构
- ✅ 类型安全
- ✅ 最佳实践

基于这个框架，你可以快速开发任何后端服务项目！

