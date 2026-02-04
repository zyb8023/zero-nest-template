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
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const db = this.configService.get<number>('REDIS_DB', 0);
    const ttl = this.configService.get<number>('REDIS_TTL', 3600);

    // 构建 Redis URL
    const auth = password ? `:${password}@` : '';
    const url = `redis://${auth}${host}:${port}/${db}`;

    const store = await redisStore({
      url,
      ttl,
    });

    return {
      store: store as any,
    };
  }
}
