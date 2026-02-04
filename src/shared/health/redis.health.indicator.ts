import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthIndicatorFunction } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

/**
 * Redis 健康检查指示器
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private client: ReturnType<typeof createClient>;

  constructor(private configService: ConfigService) {
    super();
    this.client = createClient({
      socket: {
        host: this.configService.get<string>('REDIS_HOST', 'localhost'),
        port: this.configService.get<number>('REDIS_PORT', 6379),
      },
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      database: this.configService.get<number>('REDIS_DB', 0),
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.client.connect();
  }

  /**
   * 检查 Redis 健康状态
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const result = await this.client.ping();
      const isHealthy = result === 'PONG';

      if (isHealthy) {
        return this.getStatus(key, isHealthy, {
          message: 'Redis is connected',
          responseTime: await this.getResponseTime(),
        });
      }

      throw new Error('Redis ping failed');
    } catch (error) {
      return this.getStatus(key, false, {
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * 获取响应时间
   */
  private async getResponseTime(): Promise<number> {
    const start = Date.now();
    await this.client.ping();
    return Date.now() - start;
  }

  /**
   * 创建健康检查函数
   */
  check(key: string): HealthIndicatorFunction {
    return () => this.isHealthy(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
