import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Swagger 配置
 * 
 * 为什么需要 API 文档？
 * 1. 自动生成 API 文档，减少维护成本
 * 2. 前端开发者可以快速了解接口
 * 3. 支持在线测试接口
 * 4. 企业级应用需要完整的 API 文档
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('API 文档')
    .setDescription('NestJS 后端服务 API 文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入 JWT Token',
        in: 'header',
      },
      'JWT-auth', // 这个名称用于在控制器中使用 @ApiBearerAuth('JWT-auth')
    )
    .addTag('健康检查', '服务健康检查相关接口')
    .addTag('API', '通用 API 接口')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // 访问地址：http://localhost:3000/api-docs
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持授权状态
      tagsSorter: 'alpha', // 标签排序
      operationsSorter: 'alpha', // 操作排序
    },
  });
}

