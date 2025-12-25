import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

/**
 * 全局异常过滤器
 * 
 * 为什么需要全局异常过滤器？
 * 1. 统一异常响应格式
 * 2. 记录异常日志，便于问题排查
 * 3. 隐藏敏感错误信息（生产环境）
 * 4. 提供友好的错误提示
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let code = 500;

    // 处理 NestJS HTTP 异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        code = responseObj.statusCode || status;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      // 处理其他错误
      message = exception.message;
    }

    // 记录错误日志
    const errorLog = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(errorLog),
    );

    // 生产环境隐藏详细错误信息
    const isProduction = process.env.NODE_ENV === 'production';
    const errorResponse = {
      success: false,
      code,
      message: isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR 
        ? '服务器内部错误，请稍后重试' 
        : message,
      data: null,
      timestamp: Date.now(),
      path: request.url,
      ...(isProduction ? {} : { stack: exception instanceof Error ? exception.stack : undefined }),
    };

    response.status(status).json(errorResponse);
  }
}

