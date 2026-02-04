import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

/**
 * 限流配置模块
 *
 * 为什么需要单独的限流模块？
 * 1. 将限流配置从 AppModule 中分离，保持代码整洁
 * 2. 便于管理和维护限流相关配置
 * 3. 可以统一配置限流策略
 */
@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60) * 1000, // 时间窗口（毫秒）
            limit: config.get<number>('THROTTLE_LIMIT', 100), // 请求限制
          },
        ],
      }),
    }),
  ],
  exports: [ThrottlerModule],
})
export class ThrottlerConfigModule {}
