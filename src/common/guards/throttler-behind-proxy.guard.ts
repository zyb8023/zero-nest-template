import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

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
  protected override async getTracker(req: Record<string, any>): Promise<string> {
    // 如果使用代理（如 Nginx），从 X-Forwarded-For 获取真实 IP
    // 否则使用 req.ip
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    const ip =
      forwardedFor?.split(',')[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      '0.0.0.0';
    return ip;
  }
}
