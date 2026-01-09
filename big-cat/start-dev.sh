#!/bin/bash

# 小聚调研 - Kotlin 服务端开发环境启动脚本

echo "🚀 启动小聚调研 Kotlin 服务端开发环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi

# 启动基础服务 (MongoDB, Redis, MinIO)
echo "📦 启动基础服务 (MongoDB, Redis, MinIO)..."
docker-compose -f docker-compose.dev.yml up -d

# 等待 MongoDB 启动
echo "⏳ 等待 MongoDB 启动..."
sleep 10

# 构建项目
echo "🔨 构建 Kotlin 项目..."
cd server && ../gradlew clean build -x test --no-daemon

# 启动应用
echo "▶️  启动应用..."
cd server && ../gradlew run --no-daemon

echo "✅ 开发环境启动完成！"
echo ""
echo "📖 Swagger UI: http://localhost:8088/swagger-ui.html"
echo "📊 Actuator: http://localhost:8088/actuator"
echo "💡 MongoDB: mongodb://localhost:27017"
echo "🔴 Redis: redis://localhost:6379"
echo "📁 MinIO: http://localhost:9001"
echo ""
