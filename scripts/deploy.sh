#!/bin/bash

# 部署脚本（在服务器上运行）
# 使用方法：./deploy.sh [部署包文件名]

set -e

PACKAGE_NAME=${1:-"carto-service-production-*.tar.gz"}
DEPLOY_DIR="deploy-package"
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo "🚀 开始部署..."

# 1. 检查部署包是否存在
if [ ! -f ${PACKAGE_NAME} ]; then
    echo "❌ 错误：部署包 ${PACKAGE_NAME} 不存在"
    exit 1
fi

# 2. 备份当前版本（如果存在）
if [ -d ${DEPLOY_DIR} ]; then
    echo "📦 备份当前版本..."
    mv ${DEPLOY_DIR} ${BACKUP_DIR}
    echo "✅ 已备份到 ${BACKUP_DIR}"
fi

# 3. 解压部署包
echo "📦 解压部署包..."
tar -xzf ${PACKAGE_NAME}

# 4. 进入部署目录
cd ${DEPLOY_DIR}

# 5. 检查必要文件
if [ ! -f "dist/main.js" ]; then
    echo "❌ 错误：dist/main.js 不存在"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ 错误：package.json 不存在"
    exit 1
fi

echo "✅ 文件检查通过"

# 6. 设置环境变量
export NODE_ENV=production

# 7. 停止旧应用（如果使用 PM2）
if command -v pm2 &> /dev/null; then
    echo "🛑 停止旧应用..."
    pm2 stop carto-service-prod 2>/dev/null || true
    pm2 delete carto-service-prod 2>/dev/null || true
fi

# 8. 启动应用
echo "🚀 启动应用..."

if [ -f "ecosystem.config.js" ] && command -v pm2 &> /dev/null; then
    # 使用 PM2
    pm2 start ecosystem.config.js --only carto-service-prod
    pm2 save
    echo "✅ 应用已启动（PM2）"
    echo "查看状态: pm2 status"
    echo "查看日志: pm2 logs carto-service-prod"
else
    # 直接启动
    npm run start:prod &
    echo "✅ 应用已启动（后台运行）"
fi

# 9. 等待应用启动
echo "⏳ 等待应用启动..."
sleep 5

# 10. 检查健康状态
echo "🏥 检查健康状态..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 应用健康检查通过"
else
    echo "⚠️  警告：健康检查失败，请检查日志"
fi

echo ""
echo "✅ 部署完成！"
echo "应用运行在: http://localhost:3000"

