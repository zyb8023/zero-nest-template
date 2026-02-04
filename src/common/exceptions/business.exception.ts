import { ErrorCode, ErrorMessages } from '../constants/error-codes';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 业务异常基类
 *
 * 使用示例:
 * ```ts
 * throw new BusinessException(ErrorCode.USER_NOT_FOUND);
 * throw new BusinessException(ErrorCode.USER_NOT_FOUND, '自定义错误消息');
 * ```
 */
export class BusinessException extends HttpException {
  constructor(code: ErrorCode, message?: string, statusCode: HttpStatus = HttpStatus.OK) {
    super(
      {
        success: false,
        code,
        message: message || ErrorMessages[code],
        data: null,
        timestamp: Date.now(),
      },
      statusCode,
    );
  }
}

/**
 * 未授权异常
 */
export class UnauthorizedException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
  }
}

/**
 * 禁止访问异常
 */
export class ForbiddenException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.FORBIDDEN, message, HttpStatus.FORBIDDEN);
  }
}

/**
 * 资源不存在异常
 */
export class NotFoundException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}

/**
 * 验证失败异常
 */
export class ValidationException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 用户不存在异常
 */
export class UserNotFoundException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.USER_NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}

/**
 * 用户已存在异常
 */
export class UserAlreadyExistsException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.USER_ALREADY_EXISTS, message, HttpStatus.CONFLICT);
  }
}

/**
 * 密码错误异常
 */
export class InvalidPasswordException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.INVALID_PASSWORD, message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 余额不足异常
 */
export class InsufficientBalanceException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.INSUFFICIENT_BALANCE, message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 资源不存在异常
 */
export class ResourceNotFoundException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.RESOURCE_NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}

/**
 * 资源已存在异常
 */
export class ResourceAlreadyExistsException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.RESOURCE_ALREADY_EXISTS, message, HttpStatus.CONFLICT);
  }
}

/**
 * 无效操作异常
 */
export class InvalidOperationException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.INVALID_OPERATION, message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * 外部服务错误异常
 */
export class ExternalServiceException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.EXTERNAL_SERVICE_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 数据库错误异常
 */
export class DatabaseException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.DATABASE_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * Redis错误异常
 */
export class RedisException extends BusinessException {
  constructor(message?: string) {
    super(ErrorCode.REDIS_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
