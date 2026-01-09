# 小聚调研 - Kotlin 服务端

基于 [Wow 框架](https://github.com/Ahoo-Wang/Wow) 的 DDD (领域驱动设计) 架构实现。

## 技术栈

- **语言**: Kotlin 2.2.21
- **框架**: Spring Boot 3.5.9 + Wow 6.9.5
- **数据库**: MongoDB 4 (Event Store + Read Models)
- **缓存**: Redis 7
- **对象存储**: MinIO / 七牛云 / 阿里 OSS
- **API 文档**: SpringDoc OpenAPI (Swagger)
- **认证**: JWT
- **加密**: AES

## 项目结构

```
big-cat/
├── api/              # API 层 (Command/Event/Query 定义)
├── domain/           # 领域层 (Aggregate Root, Business Logic)
├── server/           # 服务层 (Controllers, Config, Infrastructure)
├── client/           # TypeScript 客户端 (自动生成)
├── dependencies/     # 依赖管理
├── bom/             # Bill of Materials
└── docker-compose.dev.yml  # 开发环境配置
```

## 快速开始

### 1. 前置要求

- JDK 17+
- Docker & Docker Compose
- Gradle 8.x

### 2. 启动基础服务

```bash
# 启动 MongoDB, Redis, MinIO
docker-compose -f docker-compose.dev.yml up -d
```

### 3. 启动应用

```bash
# 方式一：使用启动脚本
./start-dev.sh

# 方式二：手动启动
./gradlew :server:run
```

### 4. 访问服务

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Actuator**: http://localhost:8080/actuator/health
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379
- **MinIO Console**: http://localhost:9001

## 开发指南

### 运行测试

```bash
# 运行所有测试
./gradlew test

# 运行领域层测试
./gradlew :domain:test

# 运行单个测试类
./gradlew :domain:test --tests "DemoSpec"

# 查看测试覆盖率
./gradlew :domain:jacocoTestReport
open :domain/build/reports/jacoco/test/html/index.html
```

### 代码检查

```bash
# 运行 Detekt (Kotlin 代码风格检查)
./gradlew detekt

# 自动修复代码风格问题
./gradlew detekt --auto-fix
```

### 构建

```bash
# 构建 JAR 包
./gradlew :server:installDist

# 构建结果
# server/build/install/xiaoju-survey-server/bin/xiaoju-survey-server
```

## 架构说明

### DDD 分层架构

```
┌─────────────────────────────────────────┐
│           Server Layer                  │
│  (Controllers, Projectors, Config)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            API Layer                    │
│  (Commands, Events, Queries)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Domain Layer                   │
│  (Aggregates, Sagas, Domain Logic)     │
└─────────────────────────────────────────┘
```

### 核心概念

- **Bounded Context (限界上下文)**: 领域边界，对应业务模块
- **Aggregate Root (聚合根)**: 领域模型的核心实体
- **Command (命令)**: 改变系统状态的意图
- **Event (事件)**: 已发生的事实
- **Query (查询)**: 读取数据
- **CQRS**: 命令查询职责分离
- **Event Sourcing**: 事件溯源，所有状态变化存储为事件流

### 领域划分

1. **Identity** - 认证与授权
2. **Workspace** - 工作空间
3. **Survey** - 问卷核心
4. **Response** - 问卷响应
5. **File** - 文件存储
6. **Analytics** - 数据统计与导出
7. **Channel** - 渠道管理
8. **Message** - 消息推送
9. **AI** - AI 生成

详细规划见: [MIGRATION_PLAN.md](../MIGRATION_PLAN.md)

## 配置说明

### 开发环境配置

配置文件: `server/src/main/resources/application-dev.yml`

主要配置项:
- JWT 密钥和过期时间
- AES 加密密钥
- MongoDB 连接
- Redis 连接
- 文件存储配置

### 环境变量

```bash
# JWT 配置
APP_JWT_SECRET=your-secret-key
APP_JWT_EXPIRATION=604800000

# AES 加密
APP_CRYPTO_AES_SECRET=your-aes-secret-key-32-bytes

# MongoDB
SPRING_DATA_MONGODB_HOST=localhost
SPRING_DATA_MONGODB_PORT=27017
SPRING_DATA_MONGODB_DATABASE=xiaoju_survey_dev

# 文件存储
APP_FILE_STORAGE_PROVIDER=LOCAL # LOCAL, QINIU, ALI_OSS, MINIO
```

## 常用命令

### Gradle

```bash
# 查看依赖树
./gradlew :server:dependencies

# 查看项目属性
./gradlew properties

# 清理构建
./gradlew clean

# 干运行（不执行任务）
./gradlew build --dry-run
```

### Docker

```bash
# 查看服务日志
docker-compose -f docker-compose.dev.yml logs -f mongo

# 停止所有服务
docker-compose -f docker-compose.dev.yml down

# 重启服务
docker-compose -f docker-compose.dev.yml restart mongo
```

## 开发规范

### 命名约定

- **类名**: PascalCase (例: `UserService`)
- **函数/变量**: camelCase (例: `getUserById`)
- **常量**: UPPER_SNAKE_CASE (例: `MAX_RETRY_COUNT`)
- **包名**: 全小写 (例: `site.weixing.natty.domain.identity`)

### 代码风格

项目使用 [Detekt](https://detekt.dev/) 进行 Kotlin 代码风格检查。

配置文件: `config/detekt/detekt.yml`

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: 添加用户注册功能
fix: 修复 JWT Token 解析错误
docs: 更新 API 文档
refactor: 重构文件存储模块
test: 添加用户认证测试
```

## 故障排查

### 应用启动失败

1. 检查 Docker 服务是否运行: `docker ps`
2. 检查端口占用: `lsof -i :8080`
3. 查看日志: `tail -f logs/xiaoju-survey-dev.log`

### MongoDB 连接失败

1. 检查 MongoDB 容器: `docker-compose -f docker-compose.dev.yml ps`
2. 查看 MongoDB 日志: `docker-compose -f docker-compose.dev.yml logs mongo`
3. 测试连接: `mongosh "mongodb://admin:admin123@localhost:27017"`

### 测试失败

1. 清理并重新构建: `./gradlew clean build`
2. 跳过测试: `./gradlew build -x test`
3. 运行单个测试并查看详细输出:
   ```bash
   ./gradlew :domain:test --tests "DemoSpec" --info
   ```

## 贡献指南

1. Fork 项目
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'feat: add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

## 许可证

Apache License 2.0

## 联系方式

- GitHub: https://github.com/didi/xiaoju-survey
- 文档: https://xiaojusurvey.didi.cn

---

## 从 NestJS 迁移说明

本文档描述从 NestJS 服务端迁移到 Kotlin + Wow 架构的详细计划。

**当前进度**: ✅ 第一阶段（基础设施）已完成

- [x] Gradle 多模块项目结构
- [x] MongoDB 连接和 Event Store
- [x] 统一异常处理
- [x] 统一响应格式
- [x] JWT 工具类
- [x] AES 加密解密工具
- [x] 文件上传抽象接口
- [x] Docker Compose 开发环境
- [x] Swagger/OpenAPI 文档

**下一步**: 开始实现第二阶段 - 认证与授权领域
