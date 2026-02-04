import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * 性能监控拦截器
 *
 * 功能:
 * 1. 监控接口响应时间
 * 2. 慢接口告警（超过1秒）
 * 3. 记录性能数据
 */
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, id } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;

        // 记录性能数据
        if (duration > 1000) {
          this.logger.warn(`[${id}] 慢接口: ${method} ${url} - ${duration}ms`);
        } else {
          this.logger.debug(`[${id}] ${method} ${url} - ${duration}ms`);
        }
      }),
    );
  }
}
