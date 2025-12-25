import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { LoggerService } from './shared/logger/logger.service';
import { setupSwagger } from './config/swagger.config';

/**
 * 应用启动入口
 * 
 * 为什么需要这个文件？
 * 1. 这是 NestJS 应用的启动入口，类似于前端的 index.js
 * 2. 在这里配置全局中间件、管道、拦截器等
 * 3. 设置应用的基本配置，如端口、CORS、全局验证等
 * 4. 企业级应用需要安全、性能、监控等配置
 */
async function bootstrap() {
  // 创建 NestJS 应用实例
  // NestFactory 是 NestJS 的核心工厂类，用于创建应用实例
  // 注意：在应用创建前，先使用默认配置创建临时日志服务
  // 应用创建后，会使用注入的 LoggerService（支持环境变量配置）
  const app = await NestFactory.create(AppModule, {
    // 暂时不使用自定义日志服务，使用 NestJS 默认日志
    // 应用启动后会使用注入的 LoggerService
    // 启用 CORS（跨域资源共享）
    cors: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // 设置全局前缀
  // 所有路由都会自动添加 /api 前缀
  // 例如：/users 会变成 /api/users
  app.setGlobalPrefix('api');

  // API 版本控制
  // 为什么需要版本控制？
  // 1. 支持 API 演进，向后兼容
  // 2. 企业级应用需要支持多版本 API
  // 3. 使用方式：/api/v1/users, /api/v2/users
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 安全头设置（Helmet）
  // 为什么需要安全头？
  // 1. 防止 XSS、点击劫持等攻击
  // 2. 设置安全相关的 HTTP 头
  // 3. 企业级应用必须考虑安全性
  app.use(helmet());

  // 响应压缩（Gzip）
  // 为什么需要压缩？
  // 1. 减少网络传输，提高性能
  // 2. 节省带宽成本
  // 3. 提升用户体验
  app.use(compression());

  // 启用全局验证管道
  // ValidationPipe 会自动验证请求数据，使用 class-validator 装饰器
  // 这类似于前端的表单验证，但发生在后端
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未定义的属性
      forbidNonWhitelisted: true, // 如果请求包含未定义的属性，返回错误
      transform: true, // 自动转换类型（如字符串转数字）
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
      // 自定义错误消息格式
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints || {}).join(', '),
        );
        return new Error(messages.join('; '));
      },
    }),
  );

  // 启用 CORS（跨域资源共享）
  // 允许前端应用访问后端 API
  const corsOrigins = configService.get<string>('CORS_ORIGINS', '*');
  app.enableCors({
    origin: corsOrigins === '*' ? true : corsOrigins.split(','),
    credentials: true, // 允许携带凭证（如 cookies）
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger API 文档（仅开发环境）
  // 为什么需要 API 文档？
  // 1. 自动生成 API 文档，减少维护成本
  // 2. 支持在线测试接口
  // 3. 企业级应用需要完整的 API 文档
  if (configService.get<string>('NODE_ENV') !== 'production') {
    setupSwagger(app);
    logger.log('📚 Swagger 文档已启用: http://localhost:3000/api-docs');
  }

  const port = configService.get<number>('PORT', 3000);
  
  // 优雅关闭
  // 为什么需要优雅关闭？
  // 1. 确保正在处理的请求完成
  // 2. 关闭数据库连接等资源
  // 3. 容器编排需要优雅关闭
  app.enableShutdownHooks();

  await app.listen(port);

  // 使用自定义日志服务记录启动信息
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  
  logger.log(`🚀 应用启动成功，运行在 http://localhost:${port}/api`);
  logger.log(`📊 健康检查: http://localhost:${port}/api/health`);
  logger.log(`🌍 环境: ${nodeEnv}`);
  
  // 显示日志配置信息（仅在非生产环境）
  if (nodeEnv !== 'production') {
    const { LoggerConfigService } = await import('./shared/logger/logger.config');
    const loggerConfig = app.get(LoggerConfigService);
    const logConfig = loggerConfig.getLoggerConfig();
    logger.debug(`📝 日志配置 - 控制台级别: ${logConfig.consoleLevel}, 文件级别: ${logConfig.fileLevel}`);
  }
}

bootstrap();

