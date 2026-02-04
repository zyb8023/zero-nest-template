import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health.indicator';

/**
 * 健康检查模块
 *
 * 为什么放在 shared 文件夹？
 * 1. 健康检查是共享的基础功能
 * 2. 统一管理所有共享模块
 */
@Module({
  imports: [TerminusModule, TypeOrmModule, ConfigModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
