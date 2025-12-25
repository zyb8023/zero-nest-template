import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as log4js from 'log4js';
import { join } from 'path';

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  // 控制台日志级别
  consoleLevel: string;
  // 文件日志级别
  fileLevel: string;
  // 错误日志级别（通常固定为 error）
  errorLevel: string;
  // 是否启用控制台输出
  enableConsole: boolean;
  // 是否启用文件输出
  enableFile: boolean;
  // 日志文件路径
  logDir: string;
  // 单个日志文件最大大小（字节）
  maxLogSize: number;
  // 保留的备份文件数量
  backups: number;
  // 是否压缩旧日志文件
  compress: boolean;
}

/**
 * 日志配置服务
 * 
 * 为什么需要日志配置服务？
 * 1. 统一管理日志配置，从环境变量读取
 * 2. 支持不同环境使用不同的日志级别
 * 3. 便于维护和扩展日志功能
 */
@Injectable()
export class LoggerConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * 获取日志配置
   * 
   * 日志级别说明：
   * - ALL: 所有日志
   * - TRACE: 跟踪日志（最详细）
   * - DEBUG: 调试日志
   * - INFO: 信息日志
   * - WARN: 警告日志
   * - ERROR: 错误日志
   * - FATAL: 致命错误日志
   * - OFF: 关闭日志
   * 
   * 级别优先级：ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
   */
  getLoggerConfig(): LoggerConfig {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    
    // 从环境变量读取日志级别，如果没有则根据环境设置默认值
    const consoleLevel = this.configService.get<string>(
      'LOG_CONSOLE_LEVEL',
      nodeEnv === 'production' ? 'info' : 'debug',
    );
    
    const fileLevel = this.configService.get<string>(
      'LOG_FILE_LEVEL',
      nodeEnv === 'production' ? 'info' : 'debug',
    );

    return {
      consoleLevel: consoleLevel.toLowerCase(),
      fileLevel: fileLevel.toLowerCase(),
      errorLevel: 'error', // 错误日志级别固定为 error
      enableConsole: this.configService.get<boolean>('LOG_ENABLE_CONSOLE', true),
      enableFile: this.configService.get<boolean>('LOG_ENABLE_FILE', true),
      logDir: this.configService.get<string>('LOG_DIR', join(process.cwd(), 'logs')),
      maxLogSize: this.configService.get<number>('LOG_MAX_SIZE', 10485760), // 10MB
      backups: this.configService.get<number>('LOG_BACKUPS', 5),
      compress: this.configService.get<boolean>('LOG_COMPRESS', true),
    };
  }

  /**
   * 创建 log4js 配置
   */
  createLog4jsConfig(): log4js.Configuration {
    const config = this.getLoggerConfig();
    const appenders: any = {};
    const appenderList: string[] = [];

    // 控制台输出
    if (config.enableConsole) {
      appenders.console = {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%[%d{yyyy-MM-dd HH:mm:ss.SSS} [%p]%] %m',
        },
      };
      // 控制台日志级别过滤器（独立控制控制台输出级别）
      appenders.consoleFilter = {
        type: 'logLevelFilter',
        level: config.consoleLevel,
        appender: 'console',
      };
      appenderList.push('consoleFilter');
    }

    // 文件输出 - 所有日志
    if (config.enableFile) {
      // 确保日志目录存在
      const fs = require('fs');
      if (!fs.existsSync(config.logDir)) {
        fs.mkdirSync(config.logDir, { recursive: true });
      }

      appenders.allFile = {
        type: 'file',
        filename: join(config.logDir, 'app.log'),
        maxLogSize: config.maxLogSize,
        backups: config.backups,
        compress: config.compress,
        layout: {
          type: 'pattern',
          pattern: '%d{yyyy-MM-dd HH:mm:ss.SSS} [%p] %m',
        },
      };
      // 文件日志级别过滤器（独立控制文件输出级别）
      appenders.fileFilter = {
        type: 'logLevelFilter',
        level: config.fileLevel,
        appender: 'allFile',
      };
      appenderList.push('fileFilter');

      // 文件输出 - 错误日志
      appenders.errorFile = {
        type: 'file',
        filename: join(config.logDir, 'error.log'),
        maxLogSize: config.maxLogSize,
        backups: config.backups,
        compress: config.compress,
        layout: {
          type: 'pattern',
          pattern: '%d{yyyy-MM-dd HH:mm:ss.SSS} [%p] %m',
        },
      };

      // 错误日志过滤器
      appenders.errors = {
        type: 'logLevelFilter',
        level: config.errorLevel,
        appender: 'errorFile',
      };
      appenderList.push('errors');
    }

    return {
      appenders,
      categories: {
        default: {
          appenders: appenderList,
          // 使用最低的日志级别，让过滤器控制实际输出
          // 这样控制台和文件可以有不同的日志级别
          level: 'all', // 设置为 all，由过滤器控制实际输出
        },
      },
    };
  }
}

