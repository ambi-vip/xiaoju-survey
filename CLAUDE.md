# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

小聚调研(XIAOJUSURVEY)是一套轻量、安全的调研系统,提供面向个人和企业的一站式产品级解决方案,用于构建各类问卷、考试、测评和复杂表单。

**技术栈:**
- **Web端**: Vue3 + ElementPlus + Vite + Pinia
- **Server端**: NestJS + MongoDB + TypeORM
- **跨端SDK**: ReactNative

## 常用开发命令

### 服务端 (Server)

```bash
cd server

# 安装依赖
npm install

# 本地开发 (使用 .env.development 配置)
npm run local

# 开发模式启动 (热重载)
npm run dev

# 生产环境启动
npm run start:prod

# 构建项目
npm run build

# 运行测试
npm test                      # 运行所有测试
npm run test:watch            # 监听模式运行测试
npm run test:cov              # 运行测试并生成覆盖率报告

# 代码检查和格式化
npm run lint                  # ESLint 检查并修复
npm run format                # Prettier 格式化
```

### 前端 (Web)

```bash
cd web

# 安装依赖
npm install

# 本地开发 (自动打开浏览器)
npm run serve                 # 或 npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码检查和格式化
npm run lint                  # ESLint 检查并修复
npm run format                # Prettier 格式化
```

### Docker 部署

```bash
# 使用 Docker Compose 启动服务 (包含 MongoDB)
docker-compose up -d

# 查看服务日志
docker-compose logs -f xiaoju-survey

# 停止服务
docker-compose down
```

## 核心架构设计

### 1. 问卷 Meta 协议 (核心)

项目定义了一套标准化的问卷 Meta 协议,是整个系统的基础和核心。问卷数据结构包含以下主要配置:

- **bannerConf**: 问卷头部配置 (标题、头图等)
- **dataConf**: 题目数据配置
- **submitConf**: 提交相关配置
- **baseConf**: 基础配置 (时间限制、语言、访问控制等)
- **skinConf**: 皮肤样式配置
- **bottomConf**: 底部配置 (Logo 等)
- **logicConf**: 逻辑配置 (显示逻辑、跳转逻辑)

相关类型定义: [server/src/interfaces/survey.ts](server/src/interfaces/survey.ts)

### 2. 题型物料化设计

系统采用物料化设计,每种题型都是可配置的组件。

**B端题目物料目录**: [web/src/materials/questions/](web/src/materials/questions/)
- `QuestionContainerB`: B端编辑器中的题目容器
- `QuestionContainerC`: C端渲染器中的题目容器
- `widgets`: 各类题型的具体实现 (单选、多选、评分、级联等)

**题目类型配置**:
- 每种题型包含字段配置 (`field`),用于数据采集
- 设置器配置 (`setter`),用于B端编辑器的配置面板
- 验证器配置 (`validator`),用于数据校验

### 3. 逻辑引擎系统

前端实现了强大的逻辑引擎,支持复杂问卷逻辑编排:

- **显示逻辑**: 控制题目/选项的显示条件
- **跳转逻辑**: 控制答题流程的跳转规则

相关代码:
- [web/src/common/logicEngine/](web/src/common/logicEngine/) - 逻辑引擎核心实现
- [web/src/management/stores/composables/useLogicEngine.ts](web/src/management/stores/composables/useLogicEngine.ts) - 逻辑引擎 Hook
- [web/src/management/pages/edit/modules/logicModule/](web/src/management/pages/edit/modules/logicModule/) - 逻辑编辑器 UI

### 4. 安全插件系统

服务端实现了可扩展的安全插件系统,通过钩子机制提供安全能力:

**插件管理器**: [server/src/securityPlugin/pluginManager.ts](server/src/securityPlugin/pluginManager.ts)

**可用钩子**:
- `encryptResponseData`: 加密响应数据
- `decryptResponseData`: 解密响应数据
- `maskData`: 数据脱敏
- `genSurveyPath`: 生成问卷路径

**安全插件**:
- [ResponseSecurityPlugin](server/src/securityPlugin/responseSecurityPlugin.ts) - 响应数据加密/解密
- [SurveyUtilPlugin](server/src/securityPlugin/surveyUtilPlugin.ts) - 问卷工具函数

### 5. 模块化架构

**服务端模块** ([server/src/modules/](server/src/modules/)):
- `auth`: 认证模块 (登录、注册、JWT)
- `survey`: 问卷核心模块 (增删改查、历史记录、协作)
- `surveyResponse`: 响应数据模块 (数据回收、统计)
- `workspace`: 工作空间模块 (多租户、权限管理)
- `file`: 文件模块 (上传、存储)
- `message`: 消息推送模块
- `channel`: 渠道模块 (多渠道投放)
- `upgrade`: 升级模块

**前端应用**:
- **B端** ([web/src/management/](web/src/management/)): 问卷编辑、管理端
  - [pages/edit/](web/src/management/pages/edit/) - 问卷编辑器页面
  - [stores/](web/src/management/stores/) - Pinia 状态管理
  - [api/](web/src/management/api/) - API 接口封装
- **C端** ([web/src/render/](web/src/render/)): 问卷填写、渲染端
  - [components/](web/src/render/components/) - 渲染组件
  - [hooks/](web/src/render/hooks/) - 渲染逻辑 Hooks

## 关键设计模式

### 1. 问卷编辑模块化

问卷编辑器划分为五大子领域,每个子领域负责特定功能:

1. **通用模块** ([modules/generalModule/](web/src/management/pages/edit/modules/generalModule/)): 标题、导航等
2. **题目模块** ([modules/questionModule/](web/src/management/pages/edit/modules/questionModule/)): 题目编辑、题型选择
3. **逻辑模块** ([modules/logicModule/](web/src/management/pages/edit/modules/logicModule/)): 显示逻辑、跳转逻辑
4. **皮肤模块** ([modules/skinModule/](web/src/management/pages/edit/modules/skinModule/)): 样式定制
5. **结果模块** ([modules/resultModule/](web/src/management/pages/edit/modules/resultModule/)): 结果页配置

### 2. 数据库实体设计

核心实体 ([server/src/models/](server/src/models/)):
- **SurveyMeta**: 问卷元数据 (标题、状态、权限等)
- **SurveyConf**: 问卷配置 (完整的问卷配置结构)
- **SurveyHistory**: 问卷历史记录 (版本控制)
- **SurveyResponse**: 问卷响应数据 (用户填答数据)
- **ResponseSchema**: 响应 Schema (动态表单结构)
- **Workspace**: 工作空间
- **Collaborator**: 协作者
- **Channel**: 渠道

### 3. 权限和协作

- **多角色权限**: 所有者、管理者、编辑者、填写者
- **协作系统**: 支持团队协作编辑问卷
- **工作空间**: 多租户隔离
- **白名单**: 支持访问控制 (手机号、邮箱)

相关代码:
- [server/src/guards/](server/src/guards/) - NestJS 守卫 (权限控制)
- [server/src/enums/surveyPermission.ts](server/src/enums/surveyPermission.ts) - 权限枚举

### 4. AI 问卷生成

系统集成了 LLM 能力,支持 AI 对话式生成问卷:

- **服务端**: [server/src/modules/survey/services/ai-generate.service.ts](server/src/modules/survey/services/ai-generate.service.ts)
- **前端**: AI 对话界面 (在编辑器中)

**环境变量配置**:
```bash
AImodel_API_URL          # LLM API 地址
AImodel_API_KEY          # LLM API 密钥
AImodel_MODEL            # LLM 模型名称
```

## 环境配置

### 开发环境配置

**服务端** ([server/.env.development](server/.env.development)):
```bash
# MongoDB 配置
XIAOJUSURVEY_MONGO_URL=mongodb://localhost:27017
XIAOJUSURVEY_MONGO_AUTH_SOURCE=admin
XIAOJUSURVEY_MONGO_DB_NAME=xiaoju-survey

# 加密配置
XIAOJUSURVEY_RESPONSE_AES_ENCRYPT_SECRET_KEY=your-secret-key

# 日志配置
XIAOJUSURVEY_LOGGER_FILENAME=logs/app.log

# AI 配置 (可选)
AImodel_API_URL=
AImodel_API_KEY=
AImodel_MODEL=
```

**访问地址**:
- B端管理页: http://localhost:8088/management
- C端填写页: http://localhost:8088/render/:surveyPath

### 生产环境配置

生产环境使用 `server/.env.production`,配置项与开发环境相同,但需使用生产数据库和密钥。

## 常见开发任务

### 添加新题型

1. 在 [web/src/materials/questions/widgets/](web/src/materials/questions/widgets/) 中添加题型组件
2. 定义题型的 `field` 配置 (用于数据采集)
3. 定义题型的 `setter` 配置 (用于编辑器配置面板)
4. 在 [web/src/materials/questions/questionLoader.js](web/src/materials/questions/questionLoader.js) 中注册题型
5. 在 B端和 C端分别添加对应的渲染组件

### 扩展安全插件

1. 在 [server/src/securityPlugin/](server/src/securityPlugin/) 创建新插件类
2. 实现 `SecurityPlugin` 接口,定义钩子方法
3. 在 [app.module.ts](server/src/app.module.ts#L144) 的 `onModuleInit` 中注册插件

### 添加新的 API 接口

1. 在对应模块的 `controllers/` 目录创建控制器
2. 在对应模块的 `services/` 目录创建服务
3. 在模块的 `.module.ts` 中注册控制器和服务
4. 添加必要的守卫 ([guards/](server/src/guards/)) 进行权限控制

### 修改问卷协议

修改问卷协议需要同时更新:
1. [server/src/interfaces/survey.ts](server/src/interfaces/survey.ts) - TypeScript 接口定义
2. 数据库实体 ([server/src/models/](server/src/models/)) 如果需要持久化
3. 前端类型定义 (如果有独立的类型文件)
4. 相关的验证器和业务逻辑

## 测试

**服务端测试**:
- 单元测试: 使用 Jest,测试文件需放在 `__test__` 目录下,命名为 `*.spec.ts`
- 运行特定测试: `npm test -- <test-file-pattern>`
- 覆盖率目标: 参考现有的测试覆盖率

**前端测试**:
- 目前主要依赖 ESLint 和 TypeScript 类型检查
- 手动测试: 使用 B端编辑器和 C端渲染器进行功能测试

## 代码规范

**服务端**:
- ESLint 配置: [server/.eslintrc.js](server/.eslintrc.js)
- Prettier 配置: [server/.prettierrc](server/.prettierrc)
- 使用 TypeScript 严格模式
- 遵循 NestJS 最佳实践

**前端**:
- ESLint 配置: 使用 @vue/eslint-config-typescript
- Prettier 配置: 与服务端一致
- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 使用 Pinia 进行状态管理

**Git 提交前**:
- 前端配置了 Husky 和 lint-staged,提交前自动运行 Prettier 和 ESLint
- 确保代码通过类型检查: `npm run type-check`

## 重要注意事项

1. **问卷协议兼容性**: 修改问卷协议时需考虑向后兼容性,已有问卷数据需要能够正常迁移
2. **安全性**: 用户提交的数据需经过 XSS 防护、敏感词过滤等安全检查 ([ContentSecurityService](server/src/modules/survey/services/contentSecurity.service.ts))
3. **性能优化**: 大量问卷数据的统计和导出需要注意性能,考虑使用异步任务 ([DownloadTask](server/src/models/downloadTask.entity.ts))
4. **多环境配置**: 开发、生产环境的配置文件独立,注意不要将生产环境配置提交到代码库
5. **MongoDB 版本**: 使用 MongoDB 4.x,注意兼容性
