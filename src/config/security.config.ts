import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * 安全配置类
 *
 * 提供 Helmet 和 CORS 配置
 */
@Injectable()
export class SecurityConfig {
  constructor(private configService: ConfigService) {}

  /**
   * 获取 Helmet 配置
   */
  get helmetOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      // 内容安全策略
      contentSecurityPolicy: isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", 'data:', 'https:'],
            },
          }
        : false, // 开发环境关闭 CSP，便于调试

      // HTTP 严格传输安全
      hsts: isProduction
        ? {
            maxAge: 31536000, // 1年
            includeSubDomains: true,
            preload: true,
          }
        : false,

      // 禁用 X-Powered-By 头
      hidePoweredBy: true,

      // 防止点击劫持
      frameguard: {
        action: 'deny',
      },

      // XSS 过滤器
      xssFilter: true,

      // IE 保护
      ieNoOpen: true,

      // 禁用 MIME 类型嗅探
      noSniff: true,
    };
  }

  /**
   * 获取 CORS 配置
   */
  get corsOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const corsOrigins = this.configService.get<string>('CORS_ORIGINS', '*');

    return {
      origin: this.getAllowedOrigins(corsOrigins, isProduction),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      exposedHeaders: ['X-Request-ID'],
      maxAge: 86400, // 24小时
    };
  }

  /**
   * 获取允许的源
   */
  private getAllowedOrigins(
    corsOrigins: string,
    isProduction: boolean,
  ): string | string[] | boolean {
    if (corsOrigins === '*') {
      // 生产环境不允许所有源
      return isProduction ? false : true;
    }

    return corsOrigins.split(',').map((origin) => origin.trim());
  }

  /**
   * 获取限流配置
   */
  get throttlerOptions() {
    return {
      ttl: this.configService.get<number>('THROTTLE_TTL', 60) * 1000, // 转换为毫秒
      limit: this.configService.get<number>('THROTTLE_LIMIT', 100),
    };
  }
}
