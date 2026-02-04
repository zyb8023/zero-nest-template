import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

/**
 * 应用根模块
 *
 * 为什么需要这个文件？
 * 1. @Module 装饰器是 NestJS 的核心，用于组织应用结构
 * 2. 这里导入所有功能模块，类似于前端的路由配置
 * 3. 保持 AppModule 简洁，只关注业务模块
 * 4. 所有配置和共享功能都在 SharedModule 中统一管理
 *
 * 模块划分：
 * - SharedModule: 所有共享的配置和基础功能（数据库、缓存、日志等）
 * - 业务模块: 具体的业务功能模块（UserModule、ProductModule 等）
 */
@Module({
  imports: [
    // 共享模块 - 包含所有配置和基础功能
    // 为什么使用 SharedModule？
    // 1. 统一管理所有共享配置（数据库、Redis、限流等）
    // 2. 保持 AppModule 简洁，只关注业务模块
    // 3. 便于维护和扩展
    SharedModule,

    // 在这里添加你的业务模块
    // 例如：UserModule, ProductModule, OrderModule 等
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
