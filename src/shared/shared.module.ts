import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { RedisModule } from './config/redis.module';
import { ThrottlerConfigModule } from './config/throttler.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { GlobalProvidersModule } from './providers/global-providers.module';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';
import { getConfigModuleOptions } from '../config/env.config';

/**
 * 共享模块
 * 
 * 为什么需要 SharedModule？
 * 1. 统一管理所有共享的配置模块和基础功能
 * 2. 将配置从 AppModule 中分离，保持 AppModule 简洁
 * 3. 便于维护和扩展共享功能
 * 4. 企业级应用需要清晰的模块划分
 * 
 * 包含的模块：
 * - 配置模块：数据库、Redis、限流
 * - 基础功能：日志、健康检查
 * - 全局提供者：拦截器、过滤器、守卫
 */
@Module({
  imports: [
    // 配置模块 - 加载环境变量（必须在最前面）
    // 根据 NODE_ENV 自动加载对应的环境配置文件
    // 支持：local、development、production、test 等环境
    ConfigModule.forRoot(getConfigModuleOptions()),

    // 数据库配置模块
    DatabaseModule,

    // Redis 缓存配置模块
    RedisModule,

    // 限流配置模块
    ThrottlerConfigModule,

    // 日志模块（全局模块）
    LoggerModule,

    // 健康检查模块
    HealthModule,

    // 全局提供者模块（拦截器、过滤器、守卫）
    GlobalProvidersModule,
  ],
  exports: [
    // 导出配置模块，供其他模块使用
    ConfigModule,
    DatabaseModule,
    RedisModule,
    ThrottlerConfigModule,
    LoggerModule,
    HealthModule,
  ],
})
export class SharedModule implements NestModule {
  /**
   * 配置中间件
   * 为什么需要 configure 方法？
   * 1. 注册全局中间件（如请求日志）
   * 2. 可以针对特定路由应用中间件
   * 3. 企业级应用需要完整的请求追踪
   */
  configure(consumer: MiddlewareConsumer) {
    // 对所有路由应用日志中间件
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

