# 日志系统配置指南

## 📋 概述

框架使用 Log4js 作为日志系统，支持可配置的日志级别，不同环境可以设置不同的日志输出级别。

## 🎯 日志级别

### 支持的日志级别

日志级别按优先级从低到高：

1. **ALL** - 所有日志（最低级别）
2. **TRACE** - 跟踪日志（最详细，用于详细追踪）
3. **DEBUG** - 调试日志（开发调试使用）
4. **INFO** - 信息日志（正常业务操作）
5. **WARN** - 警告日志（需要注意但不影响运行）
6. **ERROR** - 错误日志（错误和异常）
7. **FATAL** - 致命错误日志（系统级错误）
8. **OFF** - 关闭日志（最高级别，不输出任何日志）

### 日志级别说明

- **TRACE/DEBUG**: 开发环境使用，记录详细的调试信息
- **INFO**: 生产环境推荐，记录正常的业务操作
- **WARN**: 记录需要注意的问题
- **ERROR**: 记录错误和异常，生产环境必须记录

### 日志级别优先级

设置某个级别后，会输出该级别及更高级别的日志。

例如：

- 设置为 `INFO`，会输出：INFO、WARN、ERROR、FATAL
- 设置为 `ERROR`，只会输出：ERROR、FATAL
- 设置为 `DEBUG`，会输出：DEBUG、INFO、WARN、ERROR、FATAL

## ⚙️ 环境变量配置

### 日志配置项

| 环境变量             | 说明                         | 默认值            | 示例                             |
| -------------------- | ---------------------------- | ----------------- | -------------------------------- |
| `LOG_CONSOLE_LEVEL`  | 控制台日志级别               | 根据环境自动设置  | `debug`, `info`, `warn`, `error` |
| `LOG_FILE_LEVEL`     | 文件日志级别                 | 根据环境自动设置  | `debug`, `info`, `warn`, `error` |
| `LOG_ENABLE_CONSOLE` | 是否启用控制台输出           | `true`            | `true`, `false`                  |
| `LOG_ENABLE_FILE`    | 是否启用文件输出             | `true`            | `true`, `false`                  |
| `LOG_DIR`            | 日志文件目录                 | `./logs`          | `/var/log/app`                   |
| `LOG_MAX_SIZE`       | 单个日志文件最大大小（字节） | `10485760` (10MB) | `20971520` (20MB)                |
| `LOG_BACKUPS`        | 保留的备份文件数量           | `5`               | `10`                             |
| `LOG_COMPRESS`       | 是否压缩旧日志文件           | `true`            | `true`, `false`                  |

### 不同环境的默认配置

#### 开发环境（development）

```env
# 开发环境：详细日志，便于调试
LOG_CONSOLE_LEVEL=debug
LOG_FILE_LEVEL=debug
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
```

#### 生产环境（production）

```env
# 生产环境：只记录重要日志，减少日志量
LOG_CONSOLE_LEVEL=info
LOG_FILE_LEVEL=info
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
```

#### 测试环境（test）

```env
# 测试环境：中等详细度
LOG_CONSOLE_LEVEL=info
LOG_FILE_LEVEL=debug
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=false
```

## 📝 配置文件示例

### .env.development

```env
# 日志配置
LOG_CONSOLE_LEVEL=debug
LOG_FILE_LEVEL=debug
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
LOG_DIR=./logs
LOG_MAX_SIZE=10485760
LOG_BACKUPS=5
LOG_COMPRESS=true
```

### .env.production

```env
# 日志配置
LOG_CONSOLE_LEVEL=info
LOG_FILE_LEVEL=info
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=true
LOG_DIR=/var/log/carto-service
LOG_MAX_SIZE=52428800
LOG_BACKUPS=10
LOG_COMPRESS=true
```

### .env.test

```env
# 日志配置
LOG_CONSOLE_LEVEL=warn
LOG_FILE_LEVEL=info
LOG_ENABLE_CONSOLE=true
LOG_ENABLE_FILE=false
```

## 🔧 使用方式

### 在代码中使用日志

```typescript
import { LoggerService } from '@shared/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: LoggerService) {}

  someMethod() {
    // 信息日志
    this.logger.log('操作成功');

    // 调试日志（开发环境可见）
    this.logger.debug('调试信息', { data: someData });

    // 警告日志
    this.logger.warn('需要注意的问题');

    // 错误日志
    this.logger.error('操作失败', error.stack);
  }
}
```

### 日志输出位置

1. **控制台输出**：根据 `LOG_CONSOLE_LEVEL` 配置
2. **文件输出**：
   - `logs/app.log` - 所有日志（根据 `LOG_FILE_LEVEL`）
   - `logs/error.log` - 只记录 ERROR 及以上级别

## 📊 日志文件管理

### 日志轮转

- 当日志文件达到 `LOG_MAX_SIZE` 时，自动创建新文件
- 保留 `LOG_BACKUPS` 个备份文件
- 旧日志文件会自动压缩（如果 `LOG_COMPRESS=true`）

### 日志文件命名

```
logs/
├── app.log              # 当前日志文件
├── app.log.1            # 第一个备份
├── app.log.2.gz        # 第二个备份（已压缩）
├── error.log            # 当前错误日志
└── error.log.1.gz       # 错误日志备份（已压缩）
```

## 🎯 最佳实践

### 1. 日志级别选择

- **开发环境**：使用 `DEBUG`，记录所有详细信息
- **测试环境**：使用 `INFO`，记录正常操作和错误
- **生产环境**：使用 `INFO` 或 `WARN`，只记录重要信息

### 2. 日志内容

- **INFO**: 记录关键业务操作（创建、更新、删除等）
- **WARN**: 记录异常但不影响运行的情况
- **ERROR**: 记录所有错误和异常，包含堆栈信息

### 3. 性能考虑

- 生产环境避免使用 `DEBUG` 级别（日志量大）
- 使用文件输出时，日志是异步写入，不影响性能
- 定期清理旧日志文件

### 4. 安全考虑

- 不要在日志中记录敏感信息（密码、token 等）
- 生产环境可以关闭控制台输出，只使用文件输出

## 🔍 调试技巧

### 临时调整日志级别

```bash
# 临时设置为 DEBUG 级别（不修改配置文件）
export LOG_CONSOLE_LEVEL=debug
export LOG_FILE_LEVEL=debug
npm run start:dev
```

### 查看日志文件

```bash
# 查看所有日志
tail -f logs/app.log

# 查看错误日志
tail -f logs/error.log

# 搜索特定内容
grep "ERROR" logs/app.log

# 查看最近的日志
tail -n 100 logs/app.log
```

### 日志格式

控制台输出格式：

```
[2024-12-01 12:00:00.123 [INFO]] 操作成功
```

文件输出格式：

```
2024-12-01 12:00:00.123 [INFO] 操作成功
```

## 📚 高级配置

### 自定义日志格式

修改 `logger.config.ts` 中的 `pattern`：

```typescript
pattern: '%d{yyyy-MM-dd HH:mm:ss.SSS} [%p] [%c] %m';
// 输出：2024-12-01 12:00:00.123 [INFO] [AppService] 操作成功
```

### 按模块设置不同日志级别

可以在 `logger.config.ts` 中为不同模块设置不同的日志级别：

```typescript
categories: {
  default: {
    appenders: ['console', 'allFile'],
    level: 'info',
  },
  'UserService': {
    appenders: ['console', 'allFile'],
    level: 'debug', // UserService 使用更详细的日志
  },
}
```

## 🎯 总结

1. ✅ **可配置的日志级别**：通过环境变量控制
2. ✅ **独立控制台和文件级别**：控制台和文件可以设置不同的日志级别
3. ✅ **不同环境不同级别**：开发环境详细，生产环境精简
4. ✅ **灵活的日志输出**：支持控制台和文件，可独立启用/禁用
5. ✅ **自动日志轮转**：防止日志文件过大
6. ✅ **企业级功能**：压缩、备份、格式化

### 核心优势

- **环境自适应**：根据 `NODE_ENV` 自动设置默认日志级别
- **灵活配置**：通过环境变量轻松调整日志级别
- **性能优化**：生产环境自动使用合适的日志级别
- **易于调试**：开发环境自动启用详细日志

通过合理的日志配置，可以更好地监控和调试应用！
