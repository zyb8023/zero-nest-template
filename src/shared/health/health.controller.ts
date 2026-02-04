import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RedisHealthIndicator } from './redis.health.indicator';

/**
 * 健康检查控制器
 *
 * 为什么需要健康检查？
 * 1. 监控服务运行状态
 * 2. 负载均衡器可以检查服务是否可用
 * 3. 容器编排（如 Kubernetes）需要健康检查
 * 4. 企业级应用必须提供健康检查接口
 */
@ApiTags('健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  /**
   * 基础健康检查
   * GET /api/health
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '基础健康检查' })
  @ApiResponse({ status: 200, description: '服务正常' })
  @ApiResponse({ status: 503, description: '服务异常' })
  check() {
    return this.health.check([
      // 检查数据库连接
      () => this.db.pingCheck('database'),
      // 检查 Redis 连接
      this.redis.check('redis'),
      // 检查内存使用（如果超过 1.5GB 则报警）
      () => this.memory.checkHeap('memory_heap', 1500 * 1024 * 1024),
      // 检查磁盘使用（如果超过 80% 则报警）
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.8,
        }),
    ]);
  }

  /**
   * 详细健康检查
   * GET /api/health/detailed
   */
  @Get('detailed')
  @HealthCheck()
  @ApiOperation({ summary: '详细健康检查' })
  @ApiResponse({ status: 200, description: '详细健康信息' })
  detailed() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      this.redis.check('redis'),
      () => this.memory.checkHeap('memory_heap', 1500 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1500 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.8,
        }),
    ]);
  }

  /**
   * 存活检查（用于 Kubernetes liveness probe）
   * GET /api/health/live
   */
  @Get('live')
  @HealthCheck()
  @ApiOperation({ summary: '存活检查' })
  @ApiResponse({ status: 200, description: '服务存活' })
  @ApiResponse({ status: 503, description: '服务不可用' })
  live() {
    return this.health.check([
      // 只检查关键服务
      () => this.db.pingCheck('database'),
      this.redis.check('redis'),
    ]);
  }

  /**
   * 就绪检查（用于 Kubernetes readiness probe）
   * GET /api/health/ready
   */
  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: '就绪检查' })
  @ApiResponse({ status: 200, description: '服务就绪' })
  @ApiResponse({ status: 503, description: '服务未就绪' })
  ready() {
    return this.health.check([
      // 检查所有依赖服务
      () => this.db.pingCheck('database'),
      this.redis.check('redis'),
    ]);
  }
}
