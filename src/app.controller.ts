import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * 应用控制器
 * 
 * 为什么需要控制器？
 * 1. 控制器负责处理 HTTP 请求，类似于前端的路由处理函数
 * 2. @Controller() 装饰器定义路由前缀
 * 3. 每个方法上的装饰器（@Get, @Post 等）定义具体的路由
 */
@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 健康检查接口
   * GET /api
   * 用于检查服务是否正常运行
   */
  @Get()
  @ApiOperation({ summary: '服务状态检查' })
  @ApiResponse({ status: 200, description: '服务正常运行' })
  getHello(): string {
    return this.appService.getHello();
  }
}
