# Shared 模块说明

## 📁 目录结构

```
shared/
├── shared.module.ts          # 共享模块入口，统一管理所有共享功能
├── config/                   # 配置模块
│   ├── database.module.ts    # 数据库配置模块
│   ├── redis.module.ts       # Redis 配置模块
│   └── throttler.module.ts   # 限流配置模块
├── logger/                   # 日志模块
│   ├── logger.module.ts      # 日志模块定义
│   └── logger.service.ts     # 日志服务实现
├── health/                   # 健康检查模块
│   ├── health.module.ts      # 健康检查模块定义
│   └── health.controller.ts  # 健康检查控制器
└── providers/                # 全局提供者
    └── global-providers.module.ts  # 全局拦截器、过滤器、守卫
```

## 🎯 设计目的

### 为什么需要 SharedModule？

1. **代码组织**：将配置和基础功能从 AppModule 中分离，保持 AppModule 简洁
2. **统一管理**：所有共享的配置和功能统一在 SharedModule 中管理
3. **便于维护**：配置模块化，便于维护和扩展
4. **企业级实践**：符合企业级应用的模块划分最佳实践

## 📦 模块说明

### 1. SharedModule（主模块）

**作用**：统一导入和管理所有共享模块

**包含**：
- ConfigModule（环境变量配置）
- DatabaseModule（数据库配置）
- RedisModule（Redis 配置）
- ThrottlerConfigModule（限流配置）
- LoggerModule（日志模块）
- HealthModule（健康检查模块）
- GlobalProvidersModule（全局提供者）

**注意**：中间件（Middleware）放在 `common/middleware/` 中，与拦截器、过滤器、守卫一起，因为它们都是请求处理相关的功能。

### 2. Config 模块

#### DatabaseModule
- **作用**：配置 MySQL 数据库连接
- **导出**：TypeOrmModule（供其他模块使用）

#### RedisModule
- **作用**：配置 Redis 缓存
- **导出**：CacheModule（全局模块）

#### ThrottlerConfigModule
- **作用**：配置请求限流
- **导出**：ThrottlerModule

### 3. Logger 模块

- **作用**：提供全局日志服务
- **特性**：全局模块（@Global），所有模块可直接使用
- **功能**：文件输出、日志轮转、日志分级

### 4. Health 模块

- **作用**：提供健康检查接口
- **接口**：
  - `GET /api/health` - 基础健康检查
  - `GET /api/health/detailed` - 详细健康检查

### 5. Providers 模块

- **作用**：统一管理全局提供者
- **包含**：
  - TransformInterceptor（统一响应格式）
  - HttpExceptionFilter（全局异常处理）
  - ThrottlerBehindProxyGuard（限流守卫）

**注意**：中间件（Middleware）放在 `common/middleware/` 中，与拦截器、过滤器、守卫一起管理。

## 🔄 使用方式

### 在 AppModule 中使用

```typescript
import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule, // 导入共享模块
    // 你的业务模块...
  ],
})
export class AppModule {}
```

### 在其他模块中使用共享功能

```typescript
import { Module } from '@nestjs/common';
import { LoggerService } from '../shared/logger/logger.service';

@Module({
  providers: [YourService],
})
export class YourModule {
  constructor(private logger: LoggerService) {} // 直接使用，无需导入 LoggerModule
}
```

## 📝 最佳实践

1. **新增配置模块**：在 `shared/config/` 下创建新的配置模块
2. **新增共享功能**：在 `shared/` 下创建对应的文件夹和模块
3. **注册到 SharedModule**：在 `shared.module.ts` 中导入新模块
4. **保持 AppModule 简洁**：只导入 SharedModule 和业务模块
5. **请求处理相关**：中间件、拦截器、过滤器、守卫放在 `common/` 中

## 🎯 优势

1. ✅ **代码整洁**：AppModule 只关注业务模块
2. ✅ **统一管理**：所有配置和共享功能集中管理
3. ✅ **易于维护**：模块化设计，便于维护和扩展
4. ✅ **企业级**：符合企业级应用的代码组织规范

