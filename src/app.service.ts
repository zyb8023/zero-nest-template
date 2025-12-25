import { Injectable } from '@nestjs/common';

/**
 * 应用服务
 * 
 * 为什么需要服务？
 * 1. 服务包含业务逻辑，控制器只负责处理请求
 * 2. 遵循单一职责原则：控制器处理 HTTP，服务处理业务
 * 3. 服务可以被多个控制器复用
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Carto Service API is running! 🚀';
  }
}

