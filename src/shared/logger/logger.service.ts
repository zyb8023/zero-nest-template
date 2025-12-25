import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as log4js from 'log4js';
import { LoggerConfigService } from './logger.config';

/**
 * 自定义日志服务
 * 
 * 为什么需要自定义日志？
 * 1. log4js 提供更强大的日志功能：文件输出、日志分级、日志轮转等
 * 2. 可以统一日志格式，便于日志分析和监控
 * 3. 生产环境需要将日志保存到文件，而不是只输出到控制台
 * 4. 支持可配置的日志级别，不同环境可以设置不同的日志级别
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: log4js.Logger;
  private configService: LoggerConfigService;

  constructor(configService: ConfigService) {
    // 创建日志配置服务
    this.configService = new LoggerConfigService(configService);
    
    // 从配置服务获取 log4js 配置
    const log4jsConfig = this.configService.createLog4jsConfig();
    
    // 配置 log4js
    // 为什么需要配置？
    // 1. 定义日志输出位置（控制台、文件）
    // 2. 定义日志格式（时间、级别、消息）
    // 3. 定义日志级别（从环境变量读取，支持不同环境不同级别）
    log4js.configure(log4jsConfig);

    this.logger = log4js.getLogger();
    
    // 记录日志配置信息（仅在非生产环境）
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    if (nodeEnv !== 'production') {
      const config = this.configService.getLoggerConfig();
      this.logger.info(`日志系统已初始化 - 控制台级别: ${config.consoleLevel}, 文件级别: ${config.fileLevel}`);
    }
  }

  /**
   * 记录信息日志
   * 用于记录正常的业务操作
   */
  log(message: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  /**
   * 记录错误日志
   * 用于记录错误和异常
   */
  error(message: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * 记录警告日志
   * 用于记录需要注意但不影响运行的问题
   */
  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  /**
   * 记录调试日志
   * 用于开发调试，生产环境通常不输出
   */
  debug(message: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  /**
   * 记录详细日志
   * 用于记录非常详细的信息
   */
  verbose(message: any, ...optionalParams: any[]): void {
    this.logger.trace(message, ...optionalParams);
  }
}

