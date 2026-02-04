import { join } from 'path';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

/**
 * 数据库配置类
 *
 * 为什么需要这个配置类？
 * 1. 集中管理数据库连接配置，便于维护
 * 2. 使用环境变量，不同环境（开发/生产）使用不同配置
 * 3. TypeOrmOptionsFactory 接口确保配置格式正确
 */
@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql', // 数据库类型
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 3306),
      username: this.configService.get<string>('DB_USERNAME', 'root'),
      password: this.configService.get<string>('DB_PASSWORD', ''),
      database: this.configService.get<string>('DB_DATABASE', 'carto_db'),

      // 实体文件路径
      // entities 告诉 TypeORM 在哪里找到我们的数据模型
      // 类似于前端的组件导入路径
      entities: [join(__dirname, '../**/*.entity{.ts,.js}')],

      // 自动同步数据库结构
      // synchronize: true 会在应用启动时自动创建/更新表结构
      // ⚠️ 生产环境应设为 false，使用迁移（migration）来管理数据库结构
      synchronize: this.configService.get<string>('DB_SYNCHRONIZE', 'false') === 'true',

      // 是否记录 SQL 查询日志
      // 开发环境开启，方便调试；生产环境关闭，提高性能
      logging: this.configService.get<string>('DB_LOGGING', 'false') === 'true',

      // 连接池配置
      // 连接池可以复用数据库连接，提高性能
      extra: {
        connectionLimit: 10, // 最大连接数
        acquireTimeout: 60000, // 获取连接超时时间（毫秒）
        timeout: 60000, // 查询超时时间（毫秒）
      },

      // 字符集
      charset: 'utf8mb4',

      // 时区
      timezone: '+08:00', // 中国时区
    };
  }
}
