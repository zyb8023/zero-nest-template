/**
 * 日志配置示例
 * 
 * 此文件展示了如何在不同环境中配置日志级别
 */

// 开发环境配置示例
export const developmentLogConfig = {
  LOG_CONSOLE_LEVEL: 'debug',  // 控制台输出详细日志
  LOG_FILE_LEVEL: 'debug',     // 文件记录详细日志
  LOG_ENABLE_CONSOLE: true,
  LOG_ENABLE_FILE: true,
  LOG_DIR: './logs',
  LOG_MAX_SIZE: 10485760,      // 10MB
  LOG_BACKUPS: 5,
  LOG_COMPRESS: true,
};

// 生产环境配置示例
export const productionLogConfig = {
  LOG_CONSOLE_LEVEL: 'info',   // 控制台只输出重要日志
  LOG_FILE_LEVEL: 'info',     // 文件只记录重要日志
  LOG_ENABLE_CONSOLE: true,
  LOG_ENABLE_FILE: true,
  LOG_DIR: '/var/log/carto-service',
  LOG_MAX_SIZE: 52428800,      // 50MB
  LOG_BACKUPS: 10,
  LOG_COMPRESS: true,
};

// 测试环境配置示例
export const testLogConfig = {
  LOG_CONSOLE_LEVEL: 'warn',  // 控制台只输出警告和错误
  LOG_FILE_LEVEL: 'info',     // 文件记录信息和错误
  LOG_ENABLE_CONSOLE: true,
  LOG_ENABLE_FILE: false,      // 测试环境可以不写文件
  LOG_DIR: './logs',
  LOG_MAX_SIZE: 10485760,
  LOG_BACKUPS: 3,
  LOG_COMPRESS: false,
};

