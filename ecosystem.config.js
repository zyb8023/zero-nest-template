/**
 * PM2 进程管理器配置文件
 * 
 * 使用方法：
 * - 开发环境：pm2 start ecosystem.config.js --only carto-service-dev
 * - 生产环境：pm2 start ecosystem.config.js --only carto-service-prod
 * - 查看状态：pm2 status
 * - 查看日志：pm2 logs
 */

module.exports = {
  apps: [
    {
      // 开发环境配置
      name: 'carto-service-dev',
      script: './dist/main.js',
      instances: 1, // 开发环境单实例
      exec_mode: 'fork', // 开发环境使用 fork 模式
      env: {
        NODE_ENV: 'development',
      },
      env_file: '.env.development',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false, // 生产环境不监听文件变化
      max_memory_restart: '500M',
      // 开发环境可以设置更多调试选项
      node_args: '--inspect',
    },
    {
      // 生产环境配置
      name: 'carto-service-prod',
      script: './dist/main.js',
      instances: 'max', // 使用所有 CPU 核心
      exec_mode: 'cluster', // 集群模式，充分利用多核 CPU
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env.production',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G', // 内存超过 1G 自动重启
      min_uptime: '10s', // 最小运行时间
      max_restarts: 10, // 最大重启次数
      // 生产环境优化选项
      node_args: '--max-old-space-size=2048',
    },
    {
      // 测试环境配置
      name: 'carto-service-test',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'test',
      },
      env_file: '.env.test',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};

