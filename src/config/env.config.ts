import { ConfigModuleOptions } from '@nestjs/config';

/**
 * 获取环境变量文件路径
 * 
 * 为什么需要这个函数？
 * 1. 根据 NODE_ENV 自动加载对应的环境变量文件
 * 2. 支持多环境配置（local、development、production、test）
 * 3. .env.local 优先级最高，用于覆盖默认配置
 * 
 * 加载顺序（优先级从高到低）：
 * 1. .env.local（本地覆盖，不提交到 Git）
 * 2. .env.{NODE_ENV}（环境特定配置）
 * 3. .env（默认配置）
 */
export function getEnvFilePath(): string[] {
  const env = process.env.NODE_ENV || 'development';
  const envFiles: string[] = [];

  // 1. 本地覆盖文件（优先级最高，不提交到 Git）
  envFiles.push('.env.local');

  // 2. 环境特定文件
  if (env === 'production') {
    envFiles.push('.env.production');
  } else if (env === 'test') {
    envFiles.push('.env.test');
  } else if (env === 'development') {
    envFiles.push('.env.development');
  } else {
    // 自定义环境
    envFiles.push(`.env.${env}`);
  }

  // 3. 默认配置文件（优先级最低）
  envFiles.push('.env');

  return envFiles;
}

/**
 * 获取 ConfigModule 配置
 * 
 * 为什么需要这个函数？
 * 1. 统一管理 ConfigModule 配置
 * 2. 根据环境自动加载对应的配置文件
 * 3. 支持环境变量验证
 */
export function getConfigModuleOptions(): ConfigModuleOptions {
  return {
    isGlobal: true, // 全局模块，所有地方都可以使用 ConfigService
    envFilePath: getEnvFilePath(), // 根据环境加载配置文件
    cache: true, // 缓存环境变量，提高性能
    expandVariables: true, // 支持变量展开，如 ${VAR}
    // validate: validate, // 启用环境变量验证（可选，根据需要启用）
  };
}

