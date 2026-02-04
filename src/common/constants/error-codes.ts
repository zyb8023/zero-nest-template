/**
 * 错误码枚举
 *
 * 错误码规则:
 * - 1xxx: 通用错误
 * - 2xxx: 用户相关错误
 * - 3xxx: 资源相关错误
 * - 4xxx: 业务逻辑错误
 * - 5xxx: 外部服务错误
 */
export enum ErrorCode {
  // ========== 通用错误 1xxx ==========
  SUCCESS = 1000,
  UNKNOWN_ERROR = 1001,
  VALIDATION_ERROR = 1002,
  UNAUTHORIZED = 1003,
  FORBIDDEN = 1004,
  NOT_FOUND = 1005,
  METHOD_NOT_ALLOWED = 1006,
  REQUEST_TIMEOUT = 1007,
  CONFLICT = 1008,
  TOO_MANY_REQUESTS = 1009,
  INTERNAL_SERVER_ERROR = 1010,
  SERVICE_UNAVAILABLE = 1011,

  // ========== 用户相关 2xxx ==========
  USER_NOT_FOUND = 2001,
  USER_ALREADY_EXISTS = 2002,
  INVALID_PASSWORD = 2003,
  USER_DISABLED = 2004,
  USER_LOCKED = 2005,
  INVALID_TOKEN = 2006,
  TOKEN_EXPIRED = 2007,
  TOKEN_MISSING = 2008,
  INVALID_CREDENTIALS = 2009,
  PASSWORD_TOO_WEAK = 2010,
  PASSWORD_SAME_AS_OLD = 2011,
  EMAIL_ALREADY_VERIFIED = 2012,
  EMAIL_NOT_VERIFIED = 2013,

  // ========== 资源相关 3xxx ==========
  RESOURCE_NOT_FOUND = 3001,
  RESOURCE_ALREADY_EXISTS = 3002,
  RESOURCE_LOCKED = 3003,
  RESOURCE_DELETED = 3004,
  RESOURCE_EXPIRED = 3005,
  INSUFFICIENT_RESOURCES = 3006,
  RESOURCE_IN_USE = 3007,

  // ========== 业务逻辑错误 4xxx ==========
  BUSINESS_LOGIC_ERROR = 4001,
  INSUFFICIENT_BALANCE = 4002,
  INVALID_OPERATION = 4003,
  OPERATION_NOT_ALLOWED = 4004,
  DUPLICATE_OPERATION = 4005,
  DEPENDENCY_ERROR = 4006,
  INVALID_STATE = 4007,
  QUOTA_EXCEEDED = 4008,
  INVALID_AMOUNT = 4009,
  INVALID_QUANTITY = 4010,
  INVALID_STATUS = 4011,

  // ========== 外部服务 5xxx ==========
  EXTERNAL_SERVICE_ERROR = 5001,
  DATABASE_ERROR = 5002,
  REDIS_ERROR = 5003,
  NETWORK_ERROR = 5004,
  TIMEOUT_ERROR = 5005,
  PAYMENT_ERROR = 5006,
  SMS_ERROR = 5007,
  EMAIL_ERROR = 5008,
}

/**
 * 错误消息映射
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  // 通用错误
  [ErrorCode.SUCCESS]: '操作成功',
  [ErrorCode.UNKNOWN_ERROR]: '未知错误',
  [ErrorCode.VALIDATION_ERROR]: '参数验证失败',
  [ErrorCode.UNAUTHORIZED]: '未授权，请先登录',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [ErrorCode.REQUEST_TIMEOUT]: '请求超时',
  [ErrorCode.CONFLICT]: '资源冲突',
  [ErrorCode.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ErrorCode.SERVICE_UNAVAILABLE]: '服务暂时不可用',

  // 用户相关
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ErrorCode.INVALID_PASSWORD]: '密码错误',
  [ErrorCode.USER_DISABLED]: '用户已被禁用',
  [ErrorCode.USER_LOCKED]: '用户已被锁定',
  [ErrorCode.INVALID_TOKEN]: '无效的令牌',
  [ErrorCode.TOKEN_EXPIRED]: '令牌已过期',
  [ErrorCode.TOKEN_MISSING]: '令牌缺失',
  [ErrorCode.INVALID_CREDENTIALS]: '用户名或密码错误',
  [ErrorCode.PASSWORD_TOO_WEAK]: '密码强度不够',
  [ErrorCode.PASSWORD_SAME_AS_OLD]: '新密码不能与旧密码相同',
  [ErrorCode.EMAIL_ALREADY_VERIFIED]: '邮箱已验证',
  [ErrorCode.EMAIL_NOT_VERIFIED]: '邮箱未验证',

  // 资源相关
  [ErrorCode.RESOURCE_NOT_FOUND]: '资源不存在',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: '资源已存在',
  [ErrorCode.RESOURCE_LOCKED]: '资源已被锁定',
  [ErrorCode.RESOURCE_DELETED]: '资源已被删除',
  [ErrorCode.RESOURCE_EXPIRED]: '资源已过期',
  [ErrorCode.INSUFFICIENT_RESOURCES]: '资源不足',
  [ErrorCode.RESOURCE_IN_USE]: '资源正在使用中',

  // 业务逻辑错误
  [ErrorCode.BUSINESS_LOGIC_ERROR]: '业务逻辑错误',
  [ErrorCode.INSUFFICIENT_BALANCE]: '余额不足',
  [ErrorCode.INVALID_OPERATION]: '无效操作',
  [ErrorCode.OPERATION_NOT_ALLOWED]: '不允许的操作',
  [ErrorCode.DUPLICATE_OPERATION]: '重复操作',
  [ErrorCode.DEPENDENCY_ERROR]: '依赖错误',
  [ErrorCode.INVALID_STATE]: '状态无效',
  [ErrorCode.QUOTA_EXCEEDED]: '超出配额',
  [ErrorCode.INVALID_AMOUNT]: '金额无效',
  [ErrorCode.INVALID_QUANTITY]: '数量无效',
  [ErrorCode.INVALID_STATUS]: '状态无效',

  // 外部服务
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: '外部服务错误',
  [ErrorCode.DATABASE_ERROR]: '数据库错误',
  [ErrorCode.REDIS_ERROR]: '缓存服务错误',
  [ErrorCode.NETWORK_ERROR]: '网络错误',
  [ErrorCode.TIMEOUT_ERROR]: '请求超时',
  [ErrorCode.PAYMENT_ERROR]: '支付服务错误',
  [ErrorCode.SMS_ERROR]: '短信服务错误',
  [ErrorCode.EMAIL_ERROR]: '邮件服务错误',
};
