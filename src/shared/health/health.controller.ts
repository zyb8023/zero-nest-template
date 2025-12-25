import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
      () => this.memory.checkHeap('memory_heap', 1500 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1500 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.8,
        }),
    ]);
  }
}

