import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// 扩展 Express Request 类型
declare module 'express' {
  interface Request {
    id: string;
  }
}

/**
 * 请求日志中间件
 *
 * 功能:
 * 1. 为每个请求生成唯一 ID
 * 2. 记录请求开始和完成信息
 * 3. 记录请求耗时，监控接口性能
 * 4. 慢请求告警（超过1秒）
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // 生成请求 ID
    req.id = uuidv4().replace(/-/g, '');

    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // 记录请求开始
    this.logger.log(`[${req.id}] ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`);

    // 监听响应完成
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;

      // 慢请求告警（超过1秒）
      if (duration > 1000) {
        this.logger.warn(`[${req.id}] 慢请求告警: ${method} ${originalUrl} - ${duration}ms`);
      }

      // 记录请求完成
      if (statusCode >= 400) {
        this.logger.warn(
          `[${req.id}] ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0}B - ${duration}ms`,
        );
      } else {
        this.logger.log(
          `[${req.id}] ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0}B - ${duration}ms`,
        );
      }
    });

    next();
  }
}
