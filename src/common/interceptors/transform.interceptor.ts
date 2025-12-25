import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一响应格式拦截器
 * 
 * 为什么需要统一响应格式？
 * 1. 前端可以统一处理响应数据
 * 2. 便于错误处理和日志记录
 * 3. 符合 RESTful API 最佳实践
 * 4. 企业级应用需要标准化的 API 响应格式
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => ({
        success: true,
        code: 200,
        message: '操作成功',
        data,
        timestamp: Date.now(),
        path,
      })),
    );
  }
}

