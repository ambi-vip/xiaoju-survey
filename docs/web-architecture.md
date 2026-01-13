# 小聚调研 Web 前端架构文档

> 本文档基于知识图谱自动生成，描述了小聚调研 Web 端的整体架构、核心模块和开发指南

**文档生成日期:** 2026-01-12

---

## 📋 目录

- [技术栈](#技术栈)
- [整体架构](#整体架构)
- [核心模块详解](#核心模块详解)
  - [B端管理端应用](#b端管理端应用)
  - [C端渲染端应用](#c端渲染端应用)
  - [物料化组件系统](#物料化组件系统)
  - [逻辑引擎系统](#逻辑引擎系统)
  - [问卷编辑器](#问卷编辑器)
- [模块关系图](#模块关系图)
- [开发指南](#开发指南)

---

## 🛠 技术栈

- **框架:** Vue 3 (Composition API)
- **构建工具:** Vite
- **状态管理:** Pinia
- **UI 组件库:** Element Plus
- **路由:** Vue Router
- **HTTP 客户端:** Axios
- **架构模式:** MPA (多页面应用)

### 核心依赖

- `@logicflow/core` & `@logicflow/extension` - 逻辑流程图
- `@wangeditor/editor` - 富文本编辑器
- `echarts` - 数据可视化
- `vuedraggable` - 拖拽排序
- `async-validator` - 表单验证
- `lodash-es` - 工具函数库

---

## 🏗 整体架构

小聚调研 Web 端采用 **MPA (多页面应用)** 架构，通过 `vite-plugin-virtual-mpa` 插件实现多个独立应用的共存。

### 应用入口

| 应用 | 访问地址 | 入口文件 | 功能描述 |
|------|----------|----------|----------|
| **B端管理端** | `/management` | `src/management/main.js` | 问卷创建、编辑、发布、数据分析 |
| **C端渲染端** | `/render/:surveyPath` | `src/render/main.js` | 问卷填写和提交 |

### 特性

- ✅ 支持移动端和 PC 端自适应
- ✅ B端和C端代码分离，独立构建
- ✅ 共享物料化组件系统
- ✅ 统一的逻辑引擎

### 目录结构

```
web/src/
├── management/          # B端管理端应用
│   ├── pages/          # 页面
│   ├── stores/         # 状态管理
│   ├── api/            # API封装
│   ├── components/     # 组件
│   ├── router/         # 路由
│   └── utils/          # 工具函数
│
├── render/             # C端渲染端应用
│   ├── pages/          # 页面
│   ├── stores/         # 状态管理
│   ├── adapter/        # 数据适配器
│   ├── components/     # 组件
│   └── hooks/          # Hooks
│
├── materials/          # 物料化组件系统
│   ├── questions/      # 题目物料
│   ├── setters/        # 设置器
│   └── communals/      # 公共物料
│
└── common/             # 公共模块
    ├── logicEngine/    # 逻辑引擎
    └── Editor/         # 编辑器公共组件
```

---

## 📦 核心模块详解

### B端管理端应用

**位置:** `web/src/management`

**职责:** 负责问卷的创建、编辑、发布、数据分析等管理功能

#### 主要页面 (7个)

| 页面 | 路径 | 功能 |
|------|------|------|
| 列表页 | `/management/list` | 问卷列表管理 |
| 创建页 | `/management/create` | 创建新问卷 |
| 编辑页 | `/management/edit/:id` | 编辑问卷内容 |
| 发布页 | `/management/publish/:id` | 问卷发布设置 |
| 分析页 | `/management/analysis/:id` | 数据统计分析 |
| 登录页 | `/management/login` | 用户登录 |
| 下载页 | `/management/download` | 数据下载 |

#### 核心 Store (Pinia)

| Store | 文件 | 功能 |
|-------|------|------|
| `edit` | `stores/edit.ts` | 编辑器状态管理（最核心） |
| `surveyList` | `stores/surveyList.ts` | 问卷列表状态 |
| `workSpace` | `stores/workSpace.ts` | 工作空间管理 |
| `channel` | `stores/channel.ts` | 渠道管理 |
| `user` | `stores/user.ts` | 用户信息 |

#### API 接口封装

**位置:** `web/src/management/api`

- 使用 axios 进行 HTTP 请求
- 封装问卷、用户、工作空间、渠道、数据分析等模块的接口
- 统一的错误处理和响应拦截

#### 工具函数库

**位置:** `web/src/management/utils`

- `getQuestionByType()` - 根据类型获取题目模板
- `SurveyPermissions` - 工作空间权限相关工具

---

### C端渲染端应用

**位置:** `web/src/render`

**职责:** 负责问卷的填写和提交功能

#### 核心页面 (5个)

| 页面 | 组件名 | 功能 |
|------|--------|------|
| 首页 | `IndexPage.vue` | 问卷入口页 |
| 渲染页 | `RenderPage.vue` | 问卷填写主页面 |
| 成功页 | `SuccessPage.vue` | 提交成功提示 |
| 错误页 | `ErrorPage.vue` | 错误提示 |
| 空白页 | `EmptyPage.vue` | 空白占位页 |

#### 核心 Store (Pinia)

| Store | 文件 | 功能 |
|-------|------|------|
| `survey` | `stores/survey.js` | 问卷数据管理 |
| `question` | `stores/question.js` | 题目状态管理 |
| `errorInfo` | `stores/errorInfo.js` | 错误信息管理 |

#### 安全功能

- ✅ 白名单验证（手机号、邮箱）
- ✅ 时间限制（开始时间、结束时间）
- ✅ 答题时间段控制（每日可答题时间）
- ✅ 问卷加密
- ✅ XSS 防护

#### 数据适配器层

**位置:** `web/src/render/adapter`

- 处理服务端返回的问卷数据
- 进行数据格式转换和适配
- 为渲染层提供统一的数据接口

---

### 物料化组件系统

**位置:** `web/src/materials`

**核心设计理念:** 每种题型都是可配置的独立组件，通过物料化设计实现高度可扩展性。

#### 三大子系统

```
materials/
├── questions/      # 题目物料 - 题型的核心实现
├── setters/        # 设置器 - B端配置面板组件
└── communals/      # 公共物料 - 页面布局组件
```

---

#### 1. 题目物料 (Questions)

**位置:** `web/src/materials/questions`

##### 核心容器

| 容器 | 用途 | 位置 |
|------|------|------|
| `QuestionContainerB` | B端编辑器题目容器 | `questions/QuestionContainerB/` |
| `QuestionContainerC` | C端渲染器题目容器 | `questions/QuestionContainerC/` |
| `QuestionRuleContainer` | 题目规则验证容器 | `questions/QuestionRuleContainer/` |

##### 支持的题型 (17种)

| 题型 | 模块名 | 说明 |
|------|--------|------|
| 单选题 | `RadioModule` | 单项选择 |
| 多选题 | `CheckboxModule` | 多项选择 |
| 单行文本 | `InputModule` | 单行输入框 |
| 多行文本 | `TextareaModule` | 多行文本域 |
| 评分题 | `BaseRate` | 评分组件 |
| 星级评价 | `StarModule` | 星级打分 |
| NPS评分 | `NpsModule` | 净推荐值 |
| 二元选择 | `BinaryChoiceModule` | 是/否选择 |
| 级联选择 | `CascaderModule` | 多级联动 |
| 日期时间 | `DateTimeModule` | 日期时间选择器 |
| 投票 | `VoteModule` | 投票题型 |
| 矩阵多选 | `matrix-checkbox` | 矩阵题型 |
| 下拉多选 | `SelectMoreModule` | 下拉多选框 |
| 基础选项 | `BaseChoice` | 基础选择组件 |
| 基础输入 | `BaseInput` | 基础输入组件 |
| 多级题组 | `MultilevelModule` | 多级分组 |
| 选项编辑 | `EditOptions` | 选项编辑器 |

##### 题型结构

每个题型包含：

```
widgets/RadioModule/
├── index.jsx          # 组件实现
└── meta.js           # 元数据配置
```

**meta.js 包含三大配置:**

1. **field** - 字段配置（用于数据采集）
2. **setter** - 设置器配置（用于B端编辑器配置面板）
3. **validator** - 验证器配置（用于数据校验）

##### 动态加载机制

- **加载器:** `questionLoader.js` - 使用 `MaterialLoader` 类动态加载题型
- **映射表:** `moduleList.js` - 维护题型 type 与模块的映射关系

```javascript
// moduleList.js 示例
export default {
  text: 'InputModule',
  radio: 'RadioModule',
  checkbox: 'CheckboxModule',
  // ...
}
```

---

#### 2. 设置器 (Setters)

**位置:** `web/src/materials/setters/widgets`

**用途:** 为 B端编辑器提供各类配置面板组件

##### 设置器组件列表 (25+)

| 组件 | 功能 |
|------|------|
| `CheckBox.vue` | 复选框设置器 |
| `CheckboxGroup.vue` | 复选框组设置器 |
| `RadioGroup.vue` | 单选框组设置器 |
| `InputSetter.vue` | 输入框设置器 |
| `SelectSetter.vue` | 下拉选择设置器 |
| `SwitchSetter.vue` | 开关设置器 |
| `ColorPicker.vue` | 颜色选择器 |
| `ColorInput.vue` | 颜色输入框 |
| `RangeSetter.vue` | 范围设置器 |
| `SliderSetter.vue` | 滑块设置器 |
| `InputNumber.vue` | 数字输入框 |
| `InputPercent.vue` | 百分比输入框 |
| `MultiInput.vue` | 多项输入 |
| `MultiSelect.vue` | 多选下拉框 |
| `TabsSetter.vue` | 标签页设置器 |
| `QuestionTime.vue` | 时间设置器 |
| `QuestionTimeHour.vue` | 小时设置器 |
| `QuotaConfig.vue` | 配额配置 |
| `RichText.vue` | 富文本编辑器 |
| `UploadSingleFile.vue` | 单文件上传 |
| `FormdataBackFill.vue` | 数据回填设置 |
| `FreqAndNumberLimit.vue` | 频率和数量限制 |
| `CustomedSwitch.vue` | 自定义开关 |
| `FormItem.vue` | 表单项容器 |
| `RadioSetter.vue` | 单选设置器 |

**应用场景:**

- 配置题目的显示样式
- 设置校验规则
- 配置选项内容
- 高级功能配置（数据回填、配额限制等）

---

#### 3. 公共物料 (Communals)

**位置:** `web/src/materials/communals/widgets`

**用途:** 问卷页面的公共布局组件，在 B端和 C端都会使用

##### 组件列表

| 组件 | 功能 | 位置 |
|------|------|------|
| `HeaderContent` | 头部内容区域 | `communals/widgets/HeaderContent/` |
| `MainTitle` | 问卷主标题 | `communals/widgets/MainTitle/` |
| `LogoIcon` | Logo 图标 | `communals/widgets/LogoIcon/` |
| `SubmitButton` | 提交按钮 | `communals/widgets/SubmitButton/` |

**职责:** 负责问卷的整体布局和交互体验

---

### 逻辑引擎系统

**位置:** `web/src/common/logicEngine`

**功能:** 实现问卷的显示逻辑和跳转逻辑

#### 核心文件

| 文件 | 功能 |
|------|------|
| `RulesMatch.ts` | 规则匹配引擎 |
| `RuleBuild.ts` | 规则构建器 |
| `BasicType.ts` | 基础类型定义 |
| `ruleConf.ts` | 规则配置 |

#### 核心类

##### 1. ConditionNode - 条件节点

表示单个条件规则

```typescript
class ConditionNode<F, O> {
  field: F           // 字段名
  operator: O        // 运算符
  value: FieldTypes  // 比较值
  result: boolean    // 匹配结果
}
```

**支持的运算符:**

- `Equal` - 等于
- `Include` - 包含
- `NotInclude` - 不包含
- `NotEqual` - 不等于

##### 2. RuleNode - 规则节点

表示规则集合，包含多个条件

```typescript
class RuleNode {
  target: string              // 目标字段
  scope: string               // 作用域
  conditions: Map<string, ConditionNode>  // 条件集合（哈希表）
}
```

**逻辑组合:**

- `AND` - 所有条件都满足
- `OR` - 任一条件满足

#### 技术特点

- ✅ 使用哈希表存储条件规则，提高匹配效率
- ✅ 支持复杂的多条件组合
- ✅ 条件计算结果缓存
- ✅ 灵活的运算符扩展

#### 应用场景

1. **显示逻辑** - 根据答题情况控制题目/选项的显示
2. **跳转逻辑** - 根据答题情况控制答题流程的跳转

---

### 问卷编辑器

**位置:** `web/src/management/pages/edit`

**核心设计:** 采用模块化设计，划分为 7 个子领域模块

#### 编辑器架构

```
edit/
├── index.vue           # 主入口文件
├── components/         # 编辑器组件
├── modules/           # 7大功能模块
│   ├── generalModule/    # 通用配置模块
│   ├── questionModule/   # 题目编辑模块
│   ├── logicModule/      # 逻辑配置模块
│   ├── skinModule/       # 皮肤样式模块
│   ├── resultModule/     # 结果页配置模块
│   ├── contentModule/    # 内容模块
│   └── settingModule/    # 设置模块
├── setterConfig/      # 设置器配置
└── pages/            # 子页面
```

---

#### 七大功能模块

##### 1. generalModule - 通用配置模块

**位置:** `modules/generalModule`

**职责:**
- 问卷标题设置
- 导航配置
- 页面基础设置
- 问卷整体通用配置

---

##### 2. questionModule - 题目编辑模块

**位置:** `modules/questionModule`

**职责:**
- 题目的添加
- 题目的编辑
- 题目的删除
- 题目的排序（拖拽）

**特性:**
- 题目大纲视图
- 画布视图
- 与 `materials/questions` 紧密配合

**关键操作:**
- ✅ 拖拽排序
- ✅ 题目复制
- ✅ 题目删除
- ✅ 题目移动

---

##### 3. logicModule - 逻辑配置模块

**位置:** `modules/logicModule`

**职责:**
- 显示逻辑配置
- 跳转逻辑配置

**特性:**
- 可视化的逻辑编排界面
- 多条件组合（AND/OR）
- 多种比较运算符
- 与 `common/logicEngine` 紧密配合

**逻辑类型:**

| 逻辑类型 | 说明 |
|----------|------|
| 显示逻辑 | 控制题目/选项的显示条件 |
| 跳转逻辑 | 控制答题流程的跳转规则 |

---

##### 4. skinModule - 皮肤样式模块

**位置:** `modules/skinModule`

**职责:**
- 主题颜色配置
- 背景图片设置
- 字体样式配置
- 整体样式定制

**特性:**
- 提供多套预设主题模板
- 实时预览
- 自定义样式

---

##### 5. resultModule - 结果页配置模块

**位置:** `modules/resultModule`

**职责:**
- 提交成功提示信息配置
- 提交失败提示信息配置
- 结果页跳转逻辑配置

---

##### 6. contentModule - 内容模块

**位置:** `modules/contentModule`

**职责:** （具体功能待补充）

---

##### 7. settingModule - 设置模块

**位置:** `modules/settingModule`

**职责:** （具体功能待补充）

---

#### 编辑器核心状态管理

**文件:** `web/src/management/stores/edit.ts`

**技术栈:** Pinia Composition API

##### 组合的 Composables (5个)

| Composable | 功能 |
|------------|------|
| `useInitializeSchema` | 初始化问卷 Schema |
| `useBaseConfig` | 基础配置管理 |
| `useQuestionData` | 题目数据管理 |
| `useCurrentEdit` | 当前编辑状态管理 |
| `usePageEdit` | 分页编辑管理 |

##### 核心状态 (30+)

**Schema 相关:**
- `schema` - 问卷配置对象
- `questionDataList` - 题目列表
- `schemaUpdateTime` - 更新时间戳

**编辑状态:**
- `currentEditOne` - 当前编辑的题目
- `currentEditKey` - 当前编辑的字段
- `currentEditStatus` - 编辑状态
- `moduleConfig` - 模块配置
- `formConfigList` - 表单配置列表

**分页相关:**
- `pageEditOne` - 当前页码
- `pageConf` - 分页配置
- `pageCount` - 总页数
- `isFinallyPage` - 是否最后一页
- `pageQuestionData` - 当前页题目数据

**协作相关:**
- `cooperPermissions` - 协作权限

**逻辑引擎:**
- `showLogicEngine` - 显示逻辑引擎实例
- `jumpLogicEngine` - 跳转逻辑引擎实例

##### 核心方法

**初始化:**
- `init()` - 初始化编辑器
- `getSchemaFromRemote()` - 从服务器获取 Schema

**题目操作:**
- `addQuestion()` - 添加题目
- `deleteQuestion()` - 删除题目
- `copyQuestion()` - 复制题目
- `moveQuestion()` - 移动题目
- `createNewQuestion()` - 创建新题目

**Schema 操作:**
- `changeSchema()` - 修改 Schema
- `changeThemePreset()` - 修改主题预设
- `setQuestionDataList()` - 设置题目列表
- `moveQuestionDataList()` - 移动题目列表

**分页操作:**
- `addPage()` - 添加页面
- `deletePage()` - 删除页面
- `copyPage()` - 复制页面
- `updatePageEditOne()` - 更新当前页码

**编辑状态:**
- `setCurrentEditOne()` - 设置当前编辑题目
- `changeCurrentEditStatus()` - 修改编辑状态

---

## 🔗 模块关系图

### 整体依赖关系

```
小聚调研Web端
├── 包含 → web/src/management (B端管理端)
│   ├── 使用 → web/src/materials (物料系统)
│   ├── 使用 → web/src/common/logicEngine (逻辑引擎)
│   ├── 使用API → web/src/management/api
│   ├── 使用工具 → web/src/management/utils
│   └── 包含页面 → web/src/management/pages/edit (编辑器)
│       ├── 状态管理 ← web/src/management/stores/edit.ts
│       └── 包含模块 → 7大编辑器模块
│           ├── generalModule (通用配置)
│           ├── questionModule (题目编辑) → 使用 → questions
│           ├── logicModule (逻辑配置) → 使用 → logicEngine
│           ├── skinModule (皮肤样式)
│           ├── resultModule (结果页)
│           ├── contentModule (内容)
│           └── settingModule (设置)
│
├── 包含 → web/src/render (C端渲染端)
│   ├── 使用 → web/src/materials (物料系统)
│   ├── 使用 → web/src/common/logicEngine (逻辑引擎)
│   └── 使用适配器 → web/src/render/adapter
│
├── 依赖 → web/src/materials (物料系统)
│   ├── 包含 → web/src/materials/questions (题目物料)
│   ├── 包含 → web/src/materials/setters (设置器)
│   │   └── 用于配置 → questions
│   └── 包含 → web/src/materials/communals (公共物料)
│
└── 依赖 → web/src/common/logicEngine (逻辑引擎)
```

### 关键交互流程

#### 1. 编辑器题目管理流程

```
用户操作
  ↓
questionModule (题目编辑模块)
  ↓
edit.ts Store (状态管理)
  ↓
questionDataList (题目列表状态)
  ↓
materials/questions (题型物料)
  ↓
QuestionContainerB (B端容器)
  ↓
具体题型组件 (如 RadioModule)
```

#### 2. 逻辑配置流程

```
用户配置逻辑
  ↓
logicModule (逻辑配置模块)
  ↓
common/logicEngine (逻辑引擎)
  ↓
RuleBuild (构建规则)
  ↓
edit.ts Store (保存到 Schema)
  ↓
C端渲染时
  ↓
RulesMatch (匹配规则)
  ↓
控制题目显示/跳转
```

#### 3. C端渲染流程

```
用户访问 /render/:surveyPath
  ↓
RenderPage.vue
  ↓
survey.js Store (加载问卷数据)
  ↓
adapter (数据适配)
  ↓
materials/questions (题型物料)
  ↓
QuestionContainerC (C端容器)
  ↓
具体题型组件
  ↓
logicEngine (逻辑判断)
  ↓
用户提交
```

---

## 📚 开发指南

### 1. 添加新题型

**步骤:**

1. **创建题型组件**

   在 `web/src/materials/questions/widgets/` 创建新目录，如 `MyQuestionModule/`

   ```
   MyQuestionModule/
   ├── index.jsx      # 组件实现
   └── meta.js       # 元数据配置
   ```

2. **实现组件**

   `index.jsx` 需要实现 B端和 C端两个版本的组件

3. **配置元数据**

   `meta.js` 定义三大配置:
   - `field` - 字段配置
   - `setter` - 设置器配置
   - `validator` - 验证器配置

4. **注册题型**

   在 `web/src/materials/questions/common/config/moduleList.js` 添加映射:

   ```javascript
   export default {
     // ...
     'my-question': 'MyQuestionModule'
   }
   ```

5. **测试**

   在编辑器中测试新题型的添加、编辑、删除等操作

---

### 2. 扩展逻辑引擎

**添加新的运算符:**

1. 在 `BasicType.ts` 中定义新的运算符枚举

   ```typescript
   export enum Operator {
     // 现有运算符...
     GreaterThan = 'gt',  // 大于
     LessThan = 'lt'      // 小于
   }
   ```

2. 在 `RulesMatch.ts` 的 `ConditionNode.match()` 方法中添加匹配逻辑

   ```typescript
   match(facts: Fact): boolean {
     switch (this.operator) {
       // 现有逻辑...
       case Operator.GreaterThan:
         return Number(facts[this.field]) > Number(this.value)
       case Operator.LessThan:
         return Number(facts[this.field]) < Number(this.value)
     }
   }
   ```

---

### 3. 添加新的设置器

**步骤:**

1. 在 `web/src/materials/setters/widgets/` 创建新组件

   ```vue
   <!-- MySetter.vue -->
   <template>
     <div class="my-setter">
       <!-- 设置器UI -->
     </div>
   </template>

   <script setup>
   import { ref, watch } from 'vue'

   const props = defineProps({
     modelValue: {
       type: [String, Number, Boolean, Object, Array],
       default: ''
     }
   })

   const emit = defineEmits(['update:modelValue'])

   // 设置器逻辑...
   </script>
   ```

2. 在题型的 `meta.js` 中使用新设置器

   ```javascript
   export const meta = {
     setter: [
       {
         key: 'myConfig',
         title: '我的配置',
         type: 'MySetter',  // 引用新设置器
         // ...
       }
     ]
   }
   ```

---

### 4. 修改编辑器模块

**场景:** 在某个编辑器模块中添加新功能

**示例:** 在 skinModule 中添加新的样式配置项

1. 找到模块目录 `web/src/management/pages/edit/modules/skinModule`

2. 在模块组件中添加新的配置项

3. 更新 `edit.ts` Store 中的 Schema 结构（如需要）

4. 在 C端渲染时读取新配置并应用样式

---

### 5. 状态管理最佳实践

**使用 edit Store:**

```vue
<script setup>
import { useEditStore } from '@/management/stores/edit'

const editStore = useEditStore()

// 获取状态
const { schema, questionDataList, currentEditOne } = editStore

// 调用方法
const addNewQuestion = () => {
  const question = editStore.createNewQuestion({ type: 'radio' })
  editStore.addQuestion(question)
}

// 修改 Schema
const updateTitle = (newTitle) => {
  editStore.changeSchema({
    key: 'bannerConf.title',
    value: newTitle
  })
}
</script>
```

---

### 6. API 调用规范

**封装 API:**

```javascript
// management/api/myModule.js
import axios from './base'

export const getMyData = (params) => {
  return axios.get('/api/my-data', { params })
}

export const updateMyData = (data) => {
  return axios.post('/api/my-data', data)
}
```

**在组件中使用:**

```vue
<script setup>
import { getMyData } from '@/management/api/myModule'
import { CODE_MAP } from '@/management/api/base'

const loadData = async () => {
  try {
    const res = await getMyData({ id: '123' })
    if (res.code === CODE_MAP.SUCCESS) {
      // 处理成功
    }
  } catch (error) {
    // 处理错误
  }
}
</script>
```

---

### 7. 常见问题排查

**问题1: 题型不显示**

- 检查 `moduleList.js` 是否正确注册
- 检查题型组件是否正确导出
- 检查 meta.js 配置是否正确

**问题2: 逻辑引擎不生效**

- 检查逻辑配置是否保存到 Schema
- 检查 `RulesMatch` 匹配逻辑
- 检查 C端是否正确初始化逻辑引擎

**问题3: 状态更新不响应**

- 检查是否使用了 Pinia 的响应式 API
- 检查是否调用了正确的 Store 方法
- 检查组件是否正确监听状态变化

---

### 8. 代码规范

**Vue 组件:**

- 使用 Composition API (setup)
- Props 和 Emits 明确定义
- 使用 TypeScript 类型注解（推荐）

**命名规范:**

- 组件名: PascalCase (如 `MyComponent.vue`)
- 文件名: kebab-case (如 `my-util.js`) 或 camelCase (如 `myUtil.js`)
- 常量: UPPER_SNAKE_CASE (如 `MAX_COUNT`)
- Store: camelCase (如 `editStore`)

**提交规范:**

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

---

### 9. 调试技巧

**Vue Devtools:**

- 查看组件树
- 查看 Pinia Store 状态
- 追踪事件

**Console 调试:**

```javascript
// 查看 Schema
console.log('Schema:', editStore.schema)

// 查看题目列表
console.log('Questions:', editStore.questionDataList)

// 查看逻辑引擎
console.log('Logic Engine:', editStore.showLogicEngine)
```

**断点调试:**

在关键方法中设置断点，如：
- `useQuestionData.ts` 中的 `addQuestion`
- `RulesMatch.ts` 中的 `match`

---

### 10. 性能优化建议

**组件层面:**

- 使用 `v-show` 替代 `v-if` (频繁切换)
- 使用 `computed` 缓存计算结果
- 使用 `watchEffect` 替代 `watch` (简单场景)

**状态管理:**

- 避免在 Store 中存储大量临时数据
- 合理使用 `storeToRefs` 保持响应性

**物料加载:**

- `MaterialLoader` 已实现按需加载
- 避免一次性加载所有题型

---

## 📝 附录

### A. 支持的题型映射表

| type | moduleList | 中文名 |
|------|------------|--------|
| `text` | `InputModule` | 单行文本 |
| `textarea` | `TextareaModule` | 多行文本 |
| `radio` | `RadioModule` | 单选题 |
| `checkbox` | `CheckboxModule` | 多选题 |
| `binary-choice` | `BinaryChoiceModule` | 二元选择 |
| `radio-star` | `StarModule` | 星级评价 |
| `radio-nps` | `NpsModule` | NPS评分 |
| `city` | `CityModule` | 城市选择 |
| `vote` | `VoteModule` | 投票 |
| `matrix-checkbox` | `GroupModule` | 矩阵多选 |
| `selectMoreModule` | `SelectMoreModule` | 下拉多选 |
| `cascader` | `CascaderModule` | 级联选择 |
| `datetime` | `DateTimeModule` | 日期时间 |

### B. 逻辑运算符映射表

| Operator | 中文 | 说明 |
|----------|------|------|
| `Equal` | 等于 | 字段值等于指定值 |
| `Include` | 包含 | 字段值包含指定值 |
| `NotInclude` | 不包含 | 字段值不包含指定值 |
| `NotEqual` | 不等于 | 字段值不等于指定值 |

### C. Store 列表

| 应用 | Store | 文件 | 功能 |
|------|-------|------|------|
| B端 | `edit` | `management/stores/edit.ts` | 编辑器核心状态 |
| B端 | `surveyList` | `management/stores/surveyList.ts` | 问卷列表 |
| B端 | `workSpace` | `management/stores/workSpace.ts` | 工作空间 |
| B端 | `channel` | `management/stores/channel.ts` | 渠道管理 |
| B端 | `user` | `management/stores/user.ts` | 用户信息 |
| C端 | `survey` | `render/stores/survey.js` | 问卷数据 |
| C端 | `question` | `render/stores/question.js` | 题目状态 |
| C端 | `errorInfo` | `render/stores/errorInfo.js` | 错误信息 |

---

## 🔄 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-01-12 | v1.0.0 | 初始版本，基于知识图谱生成 |

---

## 📮 反馈与贡献

如发现文档有误或需要补充，请联系开发团队或提交 Issue。

---

**文档生成工具:** Claude Code + MCP Memory
**知识图谱:** 基于代码分析自动生成
