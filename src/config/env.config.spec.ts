/**
 * 环境配置测试示例
 * 
 * 用于验证环境配置加载逻辑
 */

describe('Environment Configuration', () => {
  it('should load correct env files based on NODE_ENV', () => {
    // 测试不同环境下的配置文件加载
    const originalEnv = process.env.NODE_ENV;

    // 测试开发环境
    process.env.NODE_ENV = 'development';
    // 应该加载: .env.local, .env.development, .env

    // 测试生产环境
    process.env.NODE_ENV = 'production';
    // 应该加载: .env.local, .env.production, .env

    // 恢复原始环境
    process.env.NODE_ENV = originalEnv;
  });
});

