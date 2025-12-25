import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../shared/logger/logger.service';

/**
 * 请求日志中间件
 * 
 * 为什么需要请求日志中间件？
 * 1. 记录所有 API 请求，便于问题排查和性能分析
 * 2. 记录请求耗时，监控接口性能
 * 3. 企业级应用需要完整的请求追踪
 * 4. 便于生成访问统计和报表
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // 记录请求开始
    this.logger.debug(
      `[请求开始] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // 监听响应完成
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const logLevel = statusCode >= 400 ? 'warn' : 'info';

      // 记录请求完成
      this.logger[logLevel](
        `[请求完成] ${method} ${originalUrl} - ${statusCode} - ${duration}ms - IP: ${ip}`,
      );
    });

    next();
  }
}

