import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../config/database.config';

/**
 * 数据库配置模块
 * 
 * 为什么需要单独的数据库模块？
 * 1. 将数据库配置从 AppModule 中分离，保持代码整洁
 * 2. 便于管理和维护数据库相关配置
 * 3. 可以在其他模块中复用
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

