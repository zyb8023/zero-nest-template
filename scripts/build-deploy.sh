#!/bin/bash

# 构建部署包脚本
# 使用方法：./scripts/build-deploy.sh [环境]
# 示例：./scripts/build-deploy.sh production

set -e  # 遇到错误立即退出

ENV=${1:-production}
DEPLOY_DIR="deploy-package"
PACKAGE_NAME="carto-service-${ENV}-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "🚀 开始构建部署包（环境: ${ENV}）..."

# 1. 清理旧的部署包
echo "📦 清理旧的部署包..."
rm -rf ${DEPLOY_DIR}
rm -f ${PACKAGE_NAME}

# 2. 创建部署目录
mkdir -p ${DEPLOY_DIR}

# 3. 安装生产依赖
echo "📥 安装生产依赖..."
npm ci --only=production

# 4. 构建应用
echo "🔨 构建应用..."
npm run build

# 5. 检查构建结果
if [ ! -f "dist/main.js" ]; then
    echo "❌ 构建失败：dist/main.js 不存在"
    exit 1
fi

echo "✅ 构建成功"

# 6. 复制必要文件
echo "📋 复制必要文件..."

# 必需文件
cp -r dist ${DEPLOY_DIR}/
cp -r node_modules ${DEPLOY_DIR}/
cp package.json ${DEPLOY_DIR}/
cp package-lock.json ${DEPLOY_DIR}/ 2>/dev/null || true

# 环境配置文件
if [ -f ".env.${ENV}" ]; then
    cp .env.${ENV} ${DEPLOY_DIR}/.env.production
    echo "✅ 已复制 .env.${ENV}"
else
    echo "⚠️  警告：.env.${ENV} 不存在，请手动创建"
fi

# PM2 配置（如果存在）
if [ -f "ecosystem.config.js" ]; then
    cp ecosystem.config.js ${DEPLOY_DIR}/
fi

# 7. 创建部署说明文件
cat > ${DEPLOY_DIR}/DEPLOY_README.txt << EOF
部署包说明
==========

环境: ${ENV}
构建时间: $(date)

部署步骤：
1. 解压部署包: tar -xzf ${PACKAGE_NAME}
2. 进入目录: cd ${DEPLOY_DIR}
3. 设置环境变量: export NODE_ENV=${ENV}
4. 启动应用: npm run start:prod
   或使用 PM2: pm2 start ecosystem.config.js --only carto-service-prod

包含的文件：
- dist/              # 编译后的代码
- node_modules/      # 生产依赖
- package.json       # 项目配置
- .env.production    # 环境配置
- ecosystem.config.js # PM2 配置（如果存在）
EOF

# 8. 打包
echo "📦 打包部署包..."
tar -czf ${PACKAGE_NAME} -C ${DEPLOY_DIR} .

# 9. 显示包信息
PACKAGE_SIZE=$(du -h ${PACKAGE_NAME} | cut -f1)
echo ""
echo "✅ 部署包构建完成！"
echo "📦 文件名: ${PACKAGE_NAME}"
echo "📊 大小: ${PACKAGE_SIZE}"
echo ""
echo "上传到服务器："
echo "  scp ${PACKAGE_NAME} user@server:/path/to/app/"
echo ""
echo "在服务器上解压："
echo "  tar -xzf ${PACKAGE_NAME}"
echo "  cd ${DEPLOY_DIR}"
echo "  npm run start:prod"

