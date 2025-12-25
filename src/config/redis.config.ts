import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

/**
 * Redis 配置类
 * 
 * 为什么需要 Redis？
 * 1. 缓存热点数据，减少数据库查询，提高性能
 * 2. 存储会话信息（Session）
 * 3. 实现分布式锁
 * 4. 消息队列
 * 
 * 为什么需要这个配置类？
 * 1. 统一管理 Redis 连接配置
 * 2. 支持不同环境的配置切换
 */
@Injectable()
export class RedisConfig implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    // 使用 redisStore 创建 Redis 存储
    // redisStore 是 cache-manager-redis-store 提供的工厂函数
    const store = await redisStore({
      socket: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      database: this.configService.get<number>('REDIS_DB', 0),
    });

    return {
      store: () => store,
      ttl: this.configService.get<number>('REDIS_TTL', 3600), // 默认缓存 1 小时
      max: 1000, // 最大缓存条目数
    };
  }
}

