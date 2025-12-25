import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from '../../config/redis.config';

/**
 * Redis 缓存配置模块
 * 
 * 为什么需要单独的 Redis 模块？
 * 1. 将 Redis 配置从 AppModule 中分离，保持代码整洁
 * 2. 便于管理和维护缓存相关配置
 * 3. 可以在其他模块中复用
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true, // 全局模块
      imports: [ConfigModule],
      useClass: RedisConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}

