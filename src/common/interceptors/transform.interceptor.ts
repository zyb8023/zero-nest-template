import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: number;
  path: string;
  requestId?: string;
}

/**
 * 统一响应格式拦截器
 *
 * 功能:
 * 1. 统一 API 响应格式
 * 2. 自动添加请求 ID
 * 3. 使用实际的 HTTP 状态码
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const path = request.url;
    const requestId = request.id;

    return next.handle().pipe(
      map((data) => {
        // 支持自定义响应格式
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            requestId,
          };
        }

        // 默认响应格式
        return {
          success: true,
          code: response.statusCode,
          message: data?.message || '操作成功',
          data: data?.data !== undefined ? data.data : data,
          timestamp: Date.now(),
          path,
          requestId,
        };
      }),
    );
  }
}
