# 企业级特性说明

本文档详细说明框架的企业级特性和最佳实践。

## 🛡️ 安全性

### 1. 安全头（Helmet）

**功能：** 自动设置安全相关的 HTTP 头，防止常见攻击。

**防护内容：**

- XSS（跨站脚本攻击）
- 点击劫持
- MIME 类型嗅探
- 强制 HTTPS

**实现位置：** `src/main.ts`

```typescript
app.use(helmet());
```

### 2. 请求限流（Throttler）

**功能：** 防止恶意请求和 DDoS 攻击。

**配置：**

- 默认：每个 IP 每分钟 100 个请求
- 可配置：通过环境变量 `THROTTLE_TTL` 和 `THROTTLE_LIMIT`

**实现位置：** `src/app.module.ts` 和 `src/common/guards/throttler-behind-proxy.guard.ts`

**支持代理：** 自动识别代理服务器后的真实 IP（如 Nginx）

### 3. CORS 配置

**功能：** 控制跨域请求，保护 API。

**配置：** 通过环境变量 `CORS_ORIGINS` 配置允许的域名。

**最佳实践：**

- 开发环境：`CORS_ORIGINS=*`
- 生产环境：`CORS_ORIGINS=https://yourdomain.com`

### 4. 数据验证

**功能：** 自动验证请求数据，防止无效数据。

**实现：** 使用 `class-validator` 装饰器

**特性：**

- 自动类型转换
- 移除未定义属性
- 友好的错误消息

## 📊 可观测性

### 1. 统一响应格式

**功能：** 所有 API 响应使用统一格式。

**响应格式：**

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

**实现位置：** `src/common/interceptors/transform.interceptor.ts`

### 2. 全局异常处理

**功能：** 统一处理所有异常，提供友好的错误响应。

**特性：**

- 自动记录错误日志
- 生产环境隐藏敏感信息
- 统一的错误格式

**实现位置：** `src/common/filters/http-exception.filter.ts`

### 3. 请求日志中间件

**功能：** 记录所有 API 请求，便于问题排查和性能分析。

**记录内容：**

- 请求方法、路径、IP
- 响应状态码
- 请求耗时
- User-Agent

**实现位置：** `src/common/middleware/logger.middleware.ts`

### 4. 健康检查

**功能：** 监控服务运行状态。

**检查项：**

- 数据库连接
- 内存使用
- 磁盘使用

**接口：**

- `GET /api/health` - 基础健康检查
- `GET /api/health/detailed` - 详细健康检查

**实现位置：** `src/health/health.controller.ts`

**用途：**

- 负载均衡器健康检查
- 容器编排（Kubernetes）探针
- 监控系统集成

## 📚 API 文档

### Swagger 集成

**功能：** 自动生成 API 文档，支持在线测试。

**访问地址：** `http://localhost:3000/api-docs`

**特性：**

- 自动生成文档
- 在线测试接口
- JWT 认证支持
- 标签和操作排序

**实现位置：** `src/config/swagger.config.ts`

**使用方式：**

```typescript
@ApiTags('用户管理')
@ApiOperation({ summary: '创建用户' })
@ApiResponse({ status: 201, description: '创建成功' })
```

## 🚀 性能优化

### 1. 响应压缩（Gzip）

**功能：** 自动压缩响应数据，减少网络传输。

**实现位置：** `src/main.ts`

```typescript
app.use(compression());
```

### 2. 缓存策略

**功能：** 使用 Redis 缓存热点数据。

**最佳实践：**

- 缓存频繁查询的数据
- 数据更新时清除相关缓存
- 设置合理的 TTL

### 3. 数据库连接池

**功能：** 复用数据库连接，提高性能。

**配置：** `src/config/database.config.ts`

## 🔧 开发效率

### 1. 分页工具

**功能：** 统一的分页查询方法。

**使用方式：**

```typescript
const result = await PaginationUtil.paginate(
  repository,
  { page: 1, limit: 10 },
  { where: { status: 'active' } },
);
```

**实现位置：** `src/common/utils/pagination.util.ts`

### 2. API 版本控制

**功能：** 支持多版本 API。

**使用方式：**

- `GET /api/v1/users` - 版本 1
- `GET /api/v2/users` - 版本 2

**实现位置：** `src/main.ts`

### 3. 环境变量验证

**功能：** 启动时验证环境变量。

**实现位置：** `src/config/env.validation.ts`

**使用方式：** 在 `app.module.ts` 中启用验证

## 🐳 容器化支持

### Docker 支持

**功能：** 完整的 Docker 和 Docker Compose 配置。

**文件：**

- `Dockerfile` - 多阶段构建
- `docker-compose.yml` - 一键启动所有服务
- `.dockerignore` - 排除不需要的文件

**特性：**

- 多阶段构建（减小镜像大小）
- 非 root 用户运行（安全）
- 健康检查
- 自动重启

**使用方式：**

```bash
# 构建镜像
docker build -t nestjs-app .

# 启动所有服务
docker-compose up -d
```

## 📝 最佳实践

### 1. 错误处理

```typescript
// 使用 NestJS 内置异常
throw new NotFoundException('资源不存在');
throw new BadRequestException('请求参数错误');
throw new ConflictException('资源冲突');
```

### 2. 数据验证

```typescript
export class CreateUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  @MinLength(3)
  username: string;
}
```

### 3. 日志记录

```typescript
// 信息日志
this.logger.log('操作成功');

// 错误日志
this.logger.error('操作失败', error.stack);

// 警告日志
this.logger.warn('需要注意的问题');
```

### 4. 缓存使用

```typescript
// 获取缓存
const cached = await this.cacheManager.get('key');

// 设置缓存
await this.cacheManager.set('key', value, 3600);

// 清除缓存
await this.cacheManager.del('key');
```

## 🔒 生产环境配置

### 必需配置

1. **环境变量：**
   - `NODE_ENV=production`
   - `DB_SYNCHRONIZE=false`（使用迁移）
   - `DB_LOGGING=false`（关闭 SQL 日志）
   - `CORS_ORIGINS`（指定允许的域名）

2. **安全：**
   - 使用 HTTPS
   - 配置防火墙
   - 定期更新依赖

3. **监控：**
   - 配置日志收集
   - 设置告警
   - 性能监控

4. **备份：**
   - 数据库定期备份
   - 配置文件备份

## 📈 扩展建议

### 可选功能

1. **身份认证：** JWT、OAuth2
2. **权限控制：** RBAC、ACL
3. **消息队列：** RabbitMQ、Kafka
4. **搜索引擎：** Elasticsearch
5. **文件存储：** AWS S3、阿里云 OSS
6. **监控：** Prometheus、Grafana
7. **链路追踪：** Jaeger、Zipkin

## 🎯 总结

这个框架提供了企业级应用所需的核心功能：

- ✅ **安全性**：安全头、限流、CORS
- ✅ **可观测性**：日志、监控、健康检查
- ✅ **性能**：压缩、缓存、连接池
- ✅ **开发效率**：工具类、文档、版本控制
- ✅ **容器化**：Docker 支持
- ✅ **最佳实践**：统一的代码规范

基于这个框架，你可以快速构建企业级后端服务！
