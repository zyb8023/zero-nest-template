import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * 限流守卫（支持代理）
 * 
 * 为什么需要限流？
 * 1. 防止恶意请求和 DDoS 攻击
 * 2. 保护服务器资源，避免过载
 * 3. 企业级应用必须考虑安全性
 * 4. 支持代理服务器（如 Nginx）
 */
@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Request): string {
    // 如果使用代理（如 Nginx），从 X-Forwarded-For 获取真实 IP
    // 否则使用 req.ip
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.ip ||
      req.connection.remoteAddress
    );
  }
}

