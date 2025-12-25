# 日志模块说明

## 📋 概述

日志模块提供统一的日志服务，支持可配置的日志级别，不同环境可以设置不同的日志输出级别。

## 🎯 核心功能

1. **可配置的日志级别**：通过环境变量控制
2. **独立控制台和文件级别**：控制台和文件可以设置不同的日志级别
3. **自动日志轮转**：防止日志文件过大
4. **多环境支持**：不同环境自动使用不同的默认日志级别

## 📦 模块结构

```
logger/
├── logger.module.ts      # 日志模块定义
├── logger.service.ts     # 日志服务实现
├── logger.config.ts      # 日志配置服务
└── README.md            # 说明文档
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `LOG_CONSOLE_LEVEL` | 控制台日志级别 | 开发环境: `debug`, 生产环境: `info` |
| `LOG_FILE_LEVEL` | 文件日志级别 | 开发环境: `debug`, 生产环境: `info` |
| `LOG_ENABLE_CONSOLE` | 是否启用控制台输出 | `true` |
| `LOG_ENABLE_FILE` | 是否启用文件输出 | `true` |
| `LOG_DIR` | 日志文件目录 | `./logs` |
| `LOG_MAX_SIZE` | 单个日志文件最大大小（字节） | `10485760` (10MB) |
| `LOG_BACKUPS` | 保留的备份文件数量 | `5` |
| `LOG_COMPRESS` | 是否压缩旧日志文件 | `true` |

### 日志级别

支持的日志级别（从低到高）：
- `ALL` - 所有日志
- `TRACE` - 跟踪日志
- `DEBUG` - 调试日志
- `INFO` - 信息日志
- `WARN` - 警告日志
- `ERROR` - 错误日志
- `FATAL` - 致命错误
- `OFF` - 关闭日志

## 🔧 使用方式

### 在服务中使用

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@shared/logger/logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: LoggerService) {}

  someMethod() {
    this.logger.log('信息日志');
    this.logger.debug('调试日志');
    this.logger.warn('警告日志');
    this.logger.error('错误日志', error.stack);
  }
}
```

### 配置示例

#### 开发环境

```env
LOG_CONSOLE_LEVEL=debug
LOG_FILE_LEVEL=debug
```

#### 生产环境

```env
LOG_CONSOLE_LEVEL=info
LOG_FILE_LEVEL=info
```

#### 测试环境

```env
LOG_CONSOLE_LEVEL=warn
LOG_FILE_LEVEL=info
LOG_ENABLE_FILE=false
```

## 📝 日志输出

### 控制台输出

格式：`[2024-12-01 12:00:00.123 [INFO]] 消息内容`

### 文件输出

- `logs/app.log` - 所有日志（根据 `LOG_FILE_LEVEL`）
- `logs/error.log` - 只记录 ERROR 及以上级别

格式：`2024-12-01 12:00:00.123 [INFO] 消息内容`

## 🎯 最佳实践

1. **开发环境**：使用 `DEBUG` 级别，记录所有详细信息
2. **生产环境**：使用 `INFO` 级别，只记录重要信息
3. **错误处理**：始终使用 `error()` 记录错误，包含堆栈信息
4. **性能考虑**：避免在生产环境使用 `DEBUG` 级别

