# 小聚调研服务端迁移规划文档

## 项目概述

将现有的 NestJS + MongoDB 服务端迁移到 Kotlin + Wow DDD 框架架构。

### 技术栈对比

| 维度 | 现有架构 (NestJS) | 目标架构 (Wow + Kotlin) |
|------|-------------------|------------------------|
| 语言 | TypeScript | Kotlin |
| 框架 | NestJS | Wow (Event Sourcing + CQRS) |
| 数据库 | MongoDB | MongoDB (保持不变) |
| 架构模式 | 分层架构 | DDD (领域驱动设计) |
| API 风格 | REST + Controllers | Command/Query (CQRS) |

## 领域建模与边界上下文划分

基于现有 NestJS 模块分析，划分为以下核心领域：

### 1. 认证与授权领域 (Identity & Access)
**对应模块**: `auth`, `user`

**核心职责**:
- 用户注册、���录
- JWT Token 颁发与验证
- 验证码管理
- 用户信息管理

**聚合根**:
- `User` (用户)
- `Captcha` (验证码)

**命令**:
- `RegisterUser` - 注册用户
- `LoginUser` - 用户登录
- `CreateCaptcha` - 创建验证码
- `VerifyCaptcha` - 验证验证码

**查询**:
- `UserInfoQuery` - 用户信息查询
- `UserAuthenticationQuery` - 用户认证查询

---

### 2. 工作空间领域 (Workspace)
**对应模块**: `workspace`, `workspaceMember`

**核心职责**:
- 工作空间创建与管理
- 工作空间成员管理
- 成员角色与权限控制

**聚合根**:
- `Workspace` (工作空间)
- `WorkspaceMember` (工作空间成员)

**命令**:
- `CreateWorkspace` - 创建工作空间
- `UpdateWorkspace` - 更新工作空间
- `AddWorkspaceMember` - 添加成员
- `RemoveWorkspaceMember` - 移除成员
- `UpdateMemberRole` - 更新成员角色

**查询**:
- `WorkspaceListQuery` - 工作空间列表
- `WorkspaceMemberListQuery` - 成员列表查询

---

### 3. 问卷核心领域 (Survey Core)
**对应模块**: `survey` (核心部分)

**核心职责**:
- 问卷创建与编辑
- 问卷配置管理 (SurveyMeta 协议)
- 问卷历史版本管理
- 问卷协作管理
- 问卷组管理
- 问卷会话管理

**聚合根**:
- `SurveyMeta` (问卷元数据)
- `SurveyConf` (问卷配置)
- `SurveyHistory` (问卷历史)
- `Collaborator` (协作者)
- `SurveyGroup` (问卷组)
- `Session` (会话)

**命令**:
- `CreateSurvey` - 创建问卷
- `UpdateSurvey` - 更新问卷
- `DeleteSurvey` - 删除问卷
- `CopySurvey` - 复制问卷
- `PublishSurvey` - 发布问卷
- `AddCollaborator` - 添加协作者
- `CreateSurveyGroup` - 创建问卷组
- `CreateSession` - 创建会话

**查询**:
- `SurveyListQuery` - 问卷列表
- `SurveyDetailQuery` - 问卷详情
- `SurveyHistoryQuery` - 问卷历史
- `CollaboratorListQuery` - 协作者列表

---

### 4. 问卷响应领域 (Survey Response)
**对应模块**: `surveyResponse`

**核心职责**:
- 问卷响应数据收集
- 响应 Schema 管理
- 数据加密与解密
- 响应计数

**聚合根**:
- `SurveyResponse` (问卷响应)
- `ResponseSchema` (响应 Schema)
- `ClientEncrypt` (客户端加密配置)
- `Counter` (计数器)

**命令**:
- `SubmitResponse` - 提交响应
- `UpdateResponse` - 更新响应
- `CreateResponseSchema` - 创建响应 Schema
- `IncrementCounter` - 递增计数器

**查询**:
- `ResponseListQuery` - 响应列表
- `ResponseStatisticsQuery` - 响应统计
- `ResponseDetailQuery` - 响应详情

---

### 5. 文件存储领域 (File Storage)
**对应模块**: `file`

**核心职责**:
- 文件上传管理
- 多存储适配器 (本地、七牛云、阿里 OSS、MinIO)
- 文件访问权限控制

**聚合根**:
- `FileUpload` (文件上传记录)

**命令**:
- `UploadFile` - 上传文件
- `DeleteFile` - 删除文件
- `GetFileUrl` - 获取文件访问 URL

**查询**:
- `FileInfoQuery` - 文件信息查询

---

### 6. 数据统计与导出领域 (Analytics & Export)
**对应模块**: `dataStatistic`, `downloadTask`

**核心职责**:
- 问卷数据统计分析
- 分题统计
- 交叉分析
- 数据导出 (Excel、CSV)
- 异步导出任务管理

**聚合根**:
- `DownloadTask` (下载任务)

**命令**:
- `CreateExportTask` - 创建导出任务
- `ExecuteExportTask` - 执行导出任务
- `CancelExportTask` - 取消导出任务

**查询**:
- `DataStatisticsQuery` - 数据统计查询
- `CrossAnalysisQuery` - 交叉分析查询
- `ExportTaskStatusQuery` - 导出任务状态

---

### 7. 渠道管理领域 (Channel Management)
**对应模块**: `channel`

**核心职责**:
- 多渠道投放管理
- 渠道数据追踪

**聚合根**:
- `Channel` (渠道)

**命令**:
- `CreateChannel` - 创建渠道
- `UpdateChannel` - 更新渠道
- `DeleteChannel` - 删除渠道

**查询**:
- `ChannelListQuery` - 渠道列表
- `ChannelStatisticsQuery` - 渠道统计

---

### 8. 消息推送领域 (Message Pushing)
**对应模块**: `message`

**核心职责**:
- 消息推送任务管理
- 消息推送日志
- 推送失败重试

**聚合根**:
- `MessagePushingTask` (消息推送任务)
- `MessagePushingLog` (推送日志)

**命令**:
- `CreatePushTask` - 创建推送任务
- `ExecutePushTask` - 执行推送
- `RetryPushTask` - 重试推送

**查询**:
- `PushTaskListQuery` - 推送任务列表
- `PushLogQuery` - 推送日志查询

---

### 9. AI 生成领域 (AI Generation)
**对应模块**: `ai-generate`

**核心职责**:
- AI 对话式生成问卷
- LLM 集成
- 问卷草稿生成

**聚合根**:
- `AIGeneration` (AI 生成记录)

**命令**:
- `GenerateSurveyByAI` - AI 生成问卷
- `RefineSurveyByAI` - AI 优化问卷

**查询**:
- `AIGenerationHistoryQuery` - AI 生成历史

---

## 开发阶段规划

### 第一阶段: 基础设施搭建 (2-3 周)

#### 1.1 项目结构初始化
- [ ] 配置 Gradle 多模块项目结构
- [ ] 设置 `domain`, `api`, `server`, `client` 模块
- [ ] 配置 MongoDB 连接和 Event Store
- [ ] 配置日志系统 (Log4j2)
- [ ] 配置Swagger/OpenAPI文档

#### 1.2 通用组件开发
- [ ] 实现统一异常处理
- [ ] 实现统一响应格式
- [ ] 实现 JWT Token 工具类
- [ ] 实现加密解密工具 (AES)
- [ ] 实现文件上传抽象接口
- [ ] 实现数据库迁移脚本

#### 1.3 开发环境配置
- [ ] Docker Compose 本地开发环境
- [ ] 配置开发/测试/生产环境配置文件
- [ ] CI/CD 流水线配置
- [ ] 代码质量检查 (Detekt)

---

### 第二阶段: 认证与授权领域 (2 周)

#### 2.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/identity/`

- [ ] `IUserState` - 用户状态接口
- [ ] `ICaptchaState` - 验证码状态接口
- [ ] `RegisterUser` - 注册用户命令
- [ ] `LoginUser` - 登录命令
- [ ] `CreateCaptcha` - 创建验证码命令
- [ ] `UserRegistered` - 用户注册事件
- [ ] `UserLoggedIn` - 用户登录事件
- [ ] `CaptchaCreated` - 验证码创建事件
- [ ] `IdentityApi` - 认证 API 接口

#### 2.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/identity/`

- [ ] `User` 聚合根
  - [ ] `onCreate()` - 创建用户逻辑
  - [ ] `validatePassword()` - 密码验证
- [ ] `Captcha` 聚合根
  - [ ] `onCreate()` - 生成验证码
  - [ ] `verify()` - 验证码校验
- [ ] `UserState` - 用户状态实现
- [ ] `CaptchaState` - 验证码状态实现
- [ ] `IdentityBoundedContext` - 边界上下文定义

#### 2.3 Server 层
**路径**: `server/src/main/kotlin/site/weixing/natty/server/identity/`

- [ ] `IdentityController` - 认证控制器
- [ ] `UserProjector` - 用户投影 (查询端)
- [ ] `CaptchaProjector` - 验证码投影
- [ ] 单元测试与集成测试

#### 2.4 对应原模块映射
```
auth.controller.ts -> IdentityController
auth.service.ts -> User Aggregate (command handlers)
captcha.service.ts -> Captcha Aggregate
user.service.ts -> UserProjector (query handlers)
```

---

### 第三阶段: 工作空间领域 (2 周)

#### 3.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/workspace/`

- [ ] `IWorkspaceState` - 工作空间状态
- [ ] `IWorkspaceMemberState` - 成员状态
- [ ] `CreateWorkspace` - 创建工作空间命令
- [ ] `AddMember` - 添加成员命令
- [ ] `RemoveMember` - 移除成员命令
- [ ] `UpdateMemberRole` - 更新角色命令
- [ ] `WorkspaceCreated` - 工作空间创建事件
- [ ] `MemberAdded` - 成员添加事件
- [ ] `WorkspaceApi` - 工作空间 API

#### 3.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/workspace/`

- [ ] `Workspace` 聚合根
  - [ ] `onCreate()` - 创建工作空间
  - [ ] `addMember()` - 添加成员
  - [ ] `removeMember()` - 移除成员
- [ ] `WorkspaceMember` 聚合根
- [ ] `WorkspaceBoundedContext`

#### 3.3 Server 层
- [ ] `WorkspaceController`
- [ ] `WorkspaceProjector`
- [ ] `WorkspaceMemberProjector`
- [ ] 测试

---

### 第四阶段: 问卷核心领域 (4 周) ⭐ 核心领域

这是最复杂的领域，建议分两期实现。

#### 4.1 期一: 问卷基础功能 (2 周)

**API 层**
**路径**: `api/src/main/kotlin/site/weixing/natty/api/survey/`

- [ ] `ISurveyMetaState` - 问卷元数据状态
- [ ] `ISurveyConfState` - 问卷配置状态
- [ ] `CreateSurvey` - 创建问卷命令
- [ ] `UpdateSurvey` - 更新问卷命令
- [ ] `DeleteSurvey` - 删除问卷命令
- [ ] `CopySurvey` - 复制问卷命令
- [ ] `PublishSurvey` - 发布问卷命令
- [ ] `SurveyCreated` - 问卷创建事件
- [ ] `SurveyUpdated` - 问卷更新事件
- [ ] `SurveyPublished` - 问卷发布事件
- [ ] `SurveyApi` - 问卷 API

**Domain 层**
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/survey/`

- [ ] `SurveyMeta` 聚合根
  - [ ] `onCreate()` - 创建问卷
  - [ ] `onUpdate()` - 更新问卷
  - [ ] `onDelete()` - 删除问卷
  - [ ] `onCopy()` - 复制问卷
  - [ ] `validateSurveySchema()` - 验证问卷协议
- [ ] `SurveyConf` 聚合根
- [ ] `SurveyMetaState`
- [ ] `SurveyConfState`
- [ ] `SurveyBoundedContext`

**Server 层**
- [ ] `SurveyController`
- [ ] `SurveyMetaProjector`
- [ ] `SurveyConfProjector`
- [ ] 测试

#### 4.2 期二: 问卷高级功能 (2 周)

**API 层**
- [ ] `ISurveyHistoryState` - 历史状态
- [ ] `ICollaboratorState` - 协作者状态
- [ ] `ISurveyGroupState` - 问卷组状态
- [ ] `ISessionState` - 会话状态
- [ ] `CreateHistoryVersion` - 创建历史版本命令
- [ ] `AddCollaborator` - 添加协作者命令
- [ ] `CreateSurveyGroup` - 创建问卷组命令
- [ ] 相关事件定义

**Domain 层**
- [ ] `SurveyHistory` 聚合根
- [ ] `Collaborator` 聚合根
- [ ] `SurveyGroup` 聚合根
- [ ] `Session` 聚合根
- [ ] 状态类实现

**Server 层**
- [ ] `SurveyHistoryController`
- [ ] `CollaboratorController`
- [ ] `SurveyGroupController`
- [ ] `SessionController`
- [ ] 对应 Projector
- [ ] 测试

---

### 第五阶段: 问卷响应领域 (3 周)

#### 5.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/response/`

- [ ] `IResponseState` - 响应状态
- [ ] `IResponseSchemaState` - Schema 状态
- [ ] `SubmitResponse` - 提交响应命令
- [ ] `UpdateResponse` - 更新响应命令
- [ ] `CreateResponseSchema` - 创建 Schema 命令
- [ ] `ResponseSubmitted` - 响应提交事件
- [ ] `ResponseApi` - 响应 API

#### 5.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/response/`

- [ ] `SurveyResponse` 聚合根
  - [ ] `onSubmit()` - 提交响应
  - [ ] `validateResponse()` - 验证响应数据
  - [ ] `encryptResponse()` - 加密响应
- [ ] `ResponseSchema` 聚合根
- [ ] `Counter` 聚合根 (简单计数)
- [ ] `ResponseBoundedContext`

#### 5.3 Server 层
- [ ] `SurveyResponseController`
- [ ] `ResponseSchemaController`
- [ ] `ResponseProjector`
- [ ] 测试

#### 5.4 安全特性
- [ ] 集成响应加密插件 (复用现有 `ResponseSecurityPlugin` 逻辑)
- [ ] XSS 防护
- [ ] 敏感词过滤

---

### 第六阶段: 文件存储领域 (1.5 周)

#### 6.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/file/`

- [ ] `IFileUploadState` - 文件上传状态
- [ ] `UploadFile` - 上传文件命令
- [ ] `DeleteFile` - 删除文件命令
- [ ] `FileUploaded` - 文件上传事件
- [ ] `FileApi` - 文件 API

#### 6.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/file/`

- [ ] `FileUpload` 聚合根
- [ ] `StorageAdapter` 接口
  - [ ] `LocalStorageAdapter` - 本地存储
  - [ ] `QiniuStorageAdapter` - 七牛云
  - [ ] `AliOssStorageAdapter` - 阿里 OSS
  - [ ] `MinioStorageAdapter` - MinIO
- [ ] `FileBoundedContext`

#### 6.3 Server 层
- [ ] `FileController`
- [ ] `FileProjector`
- [ ] 多存储适配器实现
- [ ] 测试

---

### 第七阶段: 数据统计与导出领域 (2.5 周)

#### 7.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/analytics/`

- [ ] `IDownloadTaskState` - 下载任务状态
- [ ] `CreateExportTask` - 创建导出任务命令
- [ ] `ExecuteExport` - 执行导出命令
- [ ] `DataStatisticsQuery` - 数据统计查询
- [ ] `CrossAnalysisQuery` - 交叉分析查询
- [ ] `ExportTaskCreated` - 导出任务创建事件
- [ ] `AnalyticsApi` - 分析 API

#### 7.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/analytics/`

- [ ] `DownloadTask` 聚合根
  - [ ] `onCreate()` - 创建任务
  - [ ] `onExecute()` - 执行导出
  - [ ] `onCancel()` - 取消任务
- [ ] `ExportSaga` - 异步导出编排
- [ ] `AnalyticsBoundedContext`

#### 7.3 Server 层
- [ ] `DataStatisticsController`
- [ ] `DownloadTaskController`
- [ ] `StatisticsProjector` (使用 MongoDB Aggregation)
- [ ] 异步任务处理
- [ ] 测试

---

### 第八阶段: 渠道管理领域 (1 周)

#### 8.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/channel/`

- [ ] `IChannelState` - 渠道状态
- [ ] `CreateChannel` - 创建渠道命令
- [ ] `UpdateChannel` - 更新渠道命令
- [ ] `ChannelCreated` - 渠道创建事件
- [ ] `ChannelApi` - 渠道 API

#### 8.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/channel/`

- [ ] `Channel` 聚合根
- [ ] `ChannelBoundedContext`

#### 8.3 Server 层
- [ ] `ChannelController`
- [ ] `ChannelProjector`
- [ ] 测试

---

### 第九阶段: 消息推送领域 (1.5 周)

#### 9.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/message/`

- [ ] `IMessageTaskState` - 消息任务状态
- [ ] `IMessageLogState` - 日志状态
- [ ] `CreatePushTask` - 创建推送任务命令
- [ ] `RetryPush` - 重试推送命令
- [ ] `MessageApi` - 消息 API

#### 9.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/message/`

- [ ] `MessagePushingTask` 聚合根
- [ ] `MessagePushingLog` 聚合根
- [ ] `MessagePushingSaga` - 推送编排
- [ ] `MessageBoundedContext`

#### 9.3 Server 层
- [ ] `MessagePushingTaskController`
- [ ] `MessageProjector`
- [ ] 消息队列集成
- [ ] 测试

---

### 第十阶段: AI 生成领域 (1.5 周)

#### 10.1 API 层
**路径**: `api/src/main/kotlin/site/weixing/natty/api/ai/`

- [ ] `IAIGenerationState` - AI 生成状态
- [ ] `GenerateSurvey` - 生成问卷命令
- [ ] `RefineSurvey` - 优化问卷命令
- [ ] `SurveyGenerated` - 问卷生成事件
- [ ] `AIApi` - AI API

#### 10.2 Domain 层
**路径**: `domain/src/main/kotlin/site/weixing/natty/domain/ai/`

- [ ] `AIGeneration` 聚合根
- [ ] `LLMClient` 接口
  - [ ] `OpenAIAdapter`
  - [ ] `其他 LLM 适配器`
- [ ] `AIBoundedContext`

#### 10.3 Server 层
- [ ] `AIGenerateController`
- [ ] `AIProjector`
- [ ] LLM 客户端实现
- [ ] 测试

---

### 第十一阶段: 前端集成与联调 (2 周)

#### 11.1 客户端生成
- [ ] 配置 `fetcher-generator`
- [ ] 生成 TypeScript 客户端库
- [ ] 发布客户端包到 npm

#### 11.2 前端适配
**路径**: `web/src/`

- [ ] 更新 API 调用层 (使用生成的客户端)
- [ ] 更新请求拦截器 (JWT 处理)
- [ ] 更新错误处理
- [ ] 更新类型定义

#### 11.3 联调测试
- [ ] 用户注册登录流程
- [ ] 工作空间管理流程
- [ ] 问卷编辑流程
- [ ] 问卷发布与填写流程
- [ ] 数据统计与导出流程
- [ ] 文件上传流程
- [ ] AI 生成问卷流程

---

### 第十二阶段: 性能优化与部署 (2 周)

#### 12.1 性能优化
- [ ] 数据库查询优化
- [ ] 添加索引
- [ ] 缓存层实现 (Redis)
- [ ] Event Sourcing 快照策略
- [ ] 异步任务优化

#### 12.2 部署准备
- [ ] Docker 镜像构建
- [ ] Kubernetes 部署文件
- [ ] 数据迁移脚本
- [ ] 监控与日志配置
- [ ] 灰度发布方案

#### 12.3 测试
- [ ] 压力测试
- [ ] 安全测试
- [ ] 用户验收测试

---

## 数据迁移策略

### 迁移原则
1. **双写模式**: 初期 NestJS 和 Kotlin 服务同时写入，保证数据一致性
2. **灰度切换**: 逐步将读流量切换到 Kotlin 服务
3. **数据验证**: 对比两个服务的数据，确保一致性
4. **回滚预案**: 保留 NestJS 服务，随时可以回滚

### 迁移步骤

#### Phase 1: 数据库映射
```kotlin
// MongoDB 集合命名约定
NestJS: surveyMeta -> Kotlin: survey_meta (保持兼容)
```

#### Phase 2: 事件迁移
将现有的数据库记录转换为 Event Sourcing 事件：
```kotlin
// 伪代码
fun migrateSurvey(surveyMeta: SurveyMeta): List<DomainEvent> {
    return listOf(
        SurveyCreated(
            surveyId = surveyMeta.id,
            title = surveyMeta.title,
            // ...
        ),
        SurveyPublished(
            surveyId = surveyMeta.id,
            publishedAt = surveyMeta.curStatus.date
        )
    )
}
```

#### Phase 3: 迁移脚本
- [ ] 编写数据迁移脚本
- [ ] 在测试环境验证
- [ ] 在生产环境小规模测试
- [ ] 全量迁移

---

## 风险与挑战

### 技术风险
1. **Event Sourcing 学习曲线**: 团队需要熟悉 CQRS 和 Event Sourcing 模式
2. **数据一致性**: 双写模式下的数据一致性保证
3. **性能问题**: Event Store 的读写性能优化
4. **调试复杂度**: 分布式式架构的调试难度增加

### 业务风险
1. **功能缺失**: 迁移过程中可能遗漏边缘功能
2. **兼容性问题**: 前端与新的 API 不兼容
3. **数据丢失**: 数据迁移过程中的数据丢失风险

### 缓解措施
1. 充分的测试覆盖
2. 保留原有 NestJS 服务作为备份
3. 灰度发布策略
4. 详细的回滚预案

---

## 成功标准

### 功能完整性
- [ ] 所有现有功能在 Kotlin 服务中实现
- [ ] 前端无需感知后端变化
- [ ] API 响应格式保持兼容

### 性能指标
- [ ] API 响应时间 ≤ 200ms (P95)
- [ ] 吞吐量 ≥ 1000 req/s
- [ ] 数据库查询优化

### 质量标准
- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 集成测试覆盖核心流程
- [ ] 通过安全审计

---

## 关键里程碑

| 里程碑 | 时间 | 交付物 |
|--------|------|--------|
| M1: 基础设施完成 | Week 3 | 可运行的基础框架 |
| M2: 认证与工作空间完成 | Week 7 | 用户可登录并管理工作空间 |
| M3: 问卷核心功能完成 | Week 11 | 用户可创建和管理问卷 |
| M4: 响应收集完成 | Week 14 | 用户可填写问卷 |
| M5: 全功能完成 | Week 20 | 所有功能迁移完成 |
| M6: 前端集成完成 | Week 22 | 前后端联调通过 |
| M7: 生产上线 | Week 24 | 完成灰度发布 |

---

## 参考资料

- [Wow 框架文档](https://github.com/Ahoo-Wang/Wow)
- [DDD 领域驱动设计](https://www.domainlanguage.com/ddd/)
- [CQRS 模式](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- 现有项目文档: [CLAUDE.md](CLAUDE.md)
- 问卷协议定义: [server/src/interfaces/survey.ts](server/src/interfaces/survey.ts)

---

## 附录: 模块映射表

| NestJS 模块 | Kotlin 限界上下文 | 优先级 |
|-------------|-------------------|-------|
| auth | Identity | P0 |
| user | Identity | P0 |
| workspace | Workspace | P0 |
| workspaceMember | Workspace | P0 |
| surveyMeta | Survey Core | P0 |
| surveyConf | Survey Core | P0 |
| surveyResponse | Response | P1 |
| responseSchema | Response | P1 |
| file | File Storage | P1 |
| dataStatistic | Analytics | P1 |
| downloadTask | Analytics | P1 |
| channel | Channel | P2 |
| messagePushing | Message | P2 |
| ai-generate | AI Generation | P2 |
| surveyHistory | Survey Core | P2 |
| collaborator | Survey Core | P2 |
| surveyGroup | Survey Core | P2 |
| session | Survey Core | P2 |
| upgrade | (基础设施) | P3 |
| appManager | (基础设施) | P3 |
