import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { LoggerConfigService } from './logger.config';

/**
 * 日志模块
 * 
 * 为什么需要 @Global()？
 * 1. 标记为全局模块，所有模块都可以直接使用，无需导入
 * 2. 日志是基础功能，应该全局可用
 * 
 * 为什么放在 shared 文件夹？
 * 1. 日志是共享的基础功能
 * 2. 统一管理所有共享模块
 * 
 * 为什么需要 ConfigModule？
 * 1. 日志配置需要从环境变量读取
 * 2. 支持不同环境使用不同的日志级别
 */
@Global()
@Module({
  imports: [ConfigModule], // 导入 ConfigModule 以使用 ConfigService
  providers: [LoggerConfigService, LoggerService],
  exports: [LoggerService, LoggerConfigService],
})
export class LoggerModule {}

