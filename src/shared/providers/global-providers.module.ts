import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ThrottlerBehindProxyGuard } from '../../common/guards/throttler-behind-proxy.guard';

/**
 * 全局提供者模块
 * 
 * 为什么需要单独的全局提供者模块？
 * 1. 将全局拦截器、过滤器、守卫从 AppModule 中分离
 * 2. 统一管理所有全局提供者
 * 3. 便于维护和扩展
 */
@Module({
  providers: [
    // 全局拦截器 - 统一响应格式
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 全局异常过滤器 - 统一异常处理
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 全局限流守卫 - 防止恶意请求
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class GlobalProvidersModule {}

