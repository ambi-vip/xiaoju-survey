---
name: add-question-type
description: 在小聚调研系统中添加新的问卷题型组件。涵盖题型分析、组件开发、配置注册的完整流程。用于添加新题型(如判断题、评分题)或扩展现有题型功能。
---

# 新增题型技能

## 使用场景

- 需要添加新的问卷题型(如判断题、评分题、级联选择等)
- 扩展现有题型的功能变体
- 基于现有题型创建自定义题型

## 前置条件

- 已完成题型需求分析(答题形式、属性配置、数据分析需求)
- 确认是否可以复用现有题型组件
- 了解问卷 Meta 协议规范

## 实施步骤

### 第一步: 题型分析

在开始开发前,需要明确以下问题:

**题型特性分析**
- [ ] 题型属于哪个类别?(选择类/填空类/评分类/上传类/其他)
- [ ] 预览态和编辑态的表现形式是否一致?
- [ ] 需要哪些基础功能?(必填、显示序号、显示分割线等)
- [ ] 需要哪些特殊功能?(选项编辑、高级配置、逻辑跳转等)

**答题规则分析**
- [ ] 用户如何与题型交互?(单选/多选/输入/上传等)
- [ ] 数据格式是什么?(字符串/数组/对象等)
- [ ] 是否可以复用现有题型的答题逻辑?

**数据分析需求**
- [ ] 回收数据如何展示和统计?
- [ ] 是否需要特殊的数据解析处理?
- [ ] 是否可以复用现有的分析功能?

### 第二步: 确定服务端开发需求

**无需服务端开发的情况** (大多数情况):
- 题型遵循标准问卷 Meta 协议
- 无特殊的题型扩展功能
- 无个性化数据分析诉求

**需要服务端开发的情况**:
- 需要扩展题型 Schema 定义
- 需要特殊的数据验证逻辑
- 需要自定义数据分析接口

### 第三步: 创建题型组件

**位置**: `web/src/materials/questions/widgets/<题型名称>Module/`

**必需文件**:
- `index.jsx` - 题型组件主文件
- `meta.js` - 题型元数据和配置

**组件开发规范**:

```javascript
// index.jsx 示例 (以判断题为例)
export default defineComponent({
  name: 'BinaryChoiceModule', // 组件名称,遵循 PascalCase
  components: { baseChoice },  // 可复用基础组件

  props: {
    type: String,        // 题型类型
    field: String,       // 题目ID
    value: [String, Array, Object], // 题目值
    layout: String,      // 布局方式
    options: Array,      // 选项列表
    readonly: Boolean,   // 只读模式(预览态)
    // ... 其他题型特定属性
  },

  setup(props, { emit }) {
    // 处理答题交互
    const onChange = (value) => {
      emit('change', {
        key: props.field,
        value: value
      });
    };

    return { onChange };
  },

  render() {
    const { readonly, fieldId } = this;

    // 如果可以复用现有组件
    return (
      <baseChoice
        uiTarget="radio"  // 指定UI渲染目标(radio/checkbox/input等)
        {...{ props: this.$props }}
        onChange={this.onChange}
      />
    );

    // 或者自定义渲染
    // return <div class="custom-question">...</div>;
  },
});
```

**可复用的基础组件**:
- `BaseChoice` - 选择类题型基础组件(单选/多选/判断)
- `BaseInput` - 输入类题型基础组件(单行/多行输入)
- `BaseRate` - 评分类题型基础组件
- 其他可在 `web/src/materials/questions/common/` 中查找

### 第四步: 配置题型元数据

**位置**: `web/src/materials/questions/widgets/<题型名称>Module/meta.js`

**配置项说明**:

```javascript
export default {
  // ===== 基础信息 =====
  title: '判断题',                    // 题型显示名称
  type: 'binary-choice',              // 题型唯一标识(kebab-case)
  componentName: 'BinaryChoiceModule', // 组件名称(需与 index.jsx 中的 name 一致)

  // ===== 属性配置面板 =====
  formConfig: [
    {
      name: 'basicConfig',            // 配置组名称
      label: '基础配置',              // 配置组显示标签
      type: 'CheckboxGroup',          // 设置器类型
      key: 'basicConfig',
      labelStyle: {
        'font-weight': 'bold',
      },
      options: [
        {
          label: '必填',              // 配置项显示标签
          key: 'isRequired',          // 配置项key(对应 moduleConfig 中的字段)
        },
        {
          label: '显示序号',
          key: 'showIndex',
        },
        {
          label: '显示分割线',
          key: 'showSpliter',
          tip: '题目下方分割线,仅在移动端展示。', // 配置项提示
        },
      ],
      valueAdapter({ moduleConfig }) {
        // 值适配器:从 moduleConfig 中提取当前配置组的值
        return _pick(
          moduleConfig,
          this.options.map((item) => item.key)
        );
      },
    },
    // 可添加更多配置组...
  ],

  // ===== 编辑态特殊配置 =====
  editConfigure: {
    optionEdit: {
      show: false,                   // 是否显示选项编辑区域
    },
    optionEditBar: {
      show: false,                   // 是否显示选项编辑工具条
      configure: {
        showOthers: false,           // 是否显示"其他"选项
        showAdvancedConfig: false,   // 是否显示高级配置
      },
    },
  },

  // ===== 默认配置 (可选) =====
  defaultConfig: {
    isRequired: false,
    showIndex: true,
    showSpliter: false,
    options: [
      { text: '对', hash: 'option_1' },
      { text: '错', hash: 'option_2' },
    ],
  },
};
```

**常用设置器类型** (formConfig.type):
- `CheckboxGroup` - 多选框组
- `RadioGroup` - 单选框组
- `Input` - 输入框
- `Textarea` - 多行输入
- `Select` - 下拉选择
- `Switch` - 开关
- `InputNumber` - 数字输入
- 更多可在 `web/src/management/pages/edit/setters/` 中查找

### 第五步: 维护题型枚举和分类

**位置**: `web/src/common/typeEnum.ts`

**操作**: 添加题型到 QUESTION_TYPE 枚举和 typeTagLabels 映射

```typescript
// 1. 在 QUESTION_TYPE 枚举中添加新题型
export enum QUESTION_TYPE {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  // ... 现有题型
  BINARY_CHOICE = 'binary-choice',  // 新增题型常量(使用 SCREAMING_SNAKE_CASE)
}

// 2. 在 typeTagLabels 中添加题型的中文名称映射
export const typeTagLabels: Record<QUESTION_TYPE, string> = {
  [QUESTION_TYPE.TEXT]: '单行输入框',
  [QUESTION_TYPE.TEXTAREA]: '多行输入框',
  // ... 现有映射
  [QUESTION_TYPE.BINARY_CHOICE]: '判断题',  // 新增题型的中文显示名称
}

// 3. 根据题型特性,将其添加到相应的分类数组中
// 输入类题型
export const INPUT = [QUESTION_TYPE.TEXT, QUESTION_TYPE.TEXTAREA]

// 选择类题型
export const CHOICES = [
  QUESTION_TYPE.RADIO,
  QUESTION_TYPE.CHECKBOX,
  QUESTION_TYPE.BINARY_CHOICE,  // 判断题属于选择类,添加到这里
  QUESTION_TYPE.VOTE
]

// 评分题型
export const RATES = [QUESTION_TYPE.RADIO_STAR, QUESTION_TYPE.RADIO_NPS]

// 高级题型
export const ADVANCED = [QUESTION_TYPE.CASCADER]
```

**题型分类说明**:
- `INPUT` - 输入类题型(单行输入、多行输入等)
- `NORMAL_CHOICES` - 普通选择类题型(单选、多选)
- `CHOICES` - 所有选择类题型(包括判断题、投票等)
- `RATES` - 评分类题型(星级评分、NPS评分等)
- `ADVANCED` - 高级题型(级联选择等复杂题型)

**注意事项**:
- 枚举值必须与 meta.js 中的 `type` 字段保持一致
- 枚举常量名使用 SCREAMING_SNAKE_CASE 命名规范
- 中文名称应简洁明了,与题型功能相符
- 根据题型特性选择合适的分类数组,一个题型可能属于多个分类

### 第六步: 注册题型组件映射

**位置**: `web/src/materials/questions/common/config/moduleList.js`

**操作**: 添加题型 type 和组件名称的映射关系

```javascript
export default {
  // ... 现有映射
  'binary-choice': 'BinaryChoiceModule',  // 键为 meta.js 中的 type,值为 componentName
};
```

### 第七步: 配置题型分组菜单

**位置**: `web/src/management/config/questionMenuConfig.js`

**操作**: 将新题型添加到相应的题型分组中

```javascript
export default [
  {
    title: '选择类',
    type: 'choice',
    questionList: [
      'radio',      // 单选题
      'checkbox',   // 多选题
      'binary-choice', // 新增的判断题
    ],
  },
  {
    title: '填空类',
    type: 'text',
    questionList: [
      'input',
      'textarea',
    ],
  },
  // ... 其他分组
];
```

### 第八步: 测试验证

**B端测试** (编辑器):
- [ ] 在题型选择面板中能看到新题型
- [ ] 可以正常添加新题型到问卷
- [ ] 题型属性配置面板显示正确
- [ ] 修改配置后能正确保存
- [ ] 编辑态下题型渲染正常

**C端测试** (渲染器):
- [ ] 问卷预览中题型显示正确
- [ ] 用户可以正常答题
- [ ] 答题数据格式正确
- [ ] 必填校验等规则生效
- [ ] 移动端适配正常

**数据验证**:
- [ ] 查看问卷配置 JSON,确认题型数据结构符合预期
- [ ] 提交答题后,检查响应数据格式
- [ ] 在数据统计页面查看数据是否正确展示

## 常见题型开发模式

### 模式一: 基于基础组件扩展

**适用场景**: 题型与现有题型相似,只需调整配置或样式

**示例**: 判断题(基于单选题)、星级评分(基于评分题)

**优势**: 开发快,代码少,维护成本低

```javascript
// 复用 BaseChoice,通过 uiTarget 指定渲染方式
render() {
  return <baseChoice uiTarget="radio" {...this.$props} />;
}
```

### 模式二: 自定义组件开发

**适用场景**: 题型交互复杂,现有组件无法满足

**示例**: 矩阵题、级联选择、签名题

**优势**: 灵活度高,可实现复杂交互

```javascript
render() {
  return (
    <div class="custom-question">
      {/* 自定义渲染逻辑 */}
    </div>
  );
}
```

### 模式三: 混合模式

**适用场景**: 部分使用基础组件,部分自定义

**示例**: 带图片的选择题、带描述的评分题

**优势**: 兼顾复用和灵活性

## 注意事项

### 1. 命名规范

- **组件名称**: PascalCase,如 `BinaryChoiceModule`
- **题型 type**: kebab-case,如 `binary-choice`
- **文件夹名称**: PascalCase,如 `BinaryChoiceModule/`

### 2. Props 规范

题型组件必须接收以下标准 props:

```javascript
props: {
  type: String,        // 题型类型 (必需)
  field: String,       // 题目ID (必需)
  value: [String, Array, Object], // 题目值 (必需)
  readonly: Boolean,   // 只读模式 (必需)
  // ... 题型特定属性
}
```

### 3. 事件规范

题型组件必须触发以下标准事件:

```javascript
// 答题值变化时
emit('change', {
  key: props.field,  // 题目ID
  value: newValue    // 新的答题值
});
```

### 4. 数据格式规范

根据题型特性选择合适的数据格式:

- **单选题**: `String` - 选中选项的 hash 值
- **多选题**: `Array<String>` - 选中选项的 hash 值数组
- **填空题**: `String` - 用户输入的文本
- **评分题**: `Number` - 评分值
- **复杂题型**: `Object` - 自定义对象结构

### 5. 样式规范

- 使用 BEM 命名规范
- 考虑移动端适配(响应式设计)
- 遵循问卷整体风格(可通过 skinConf 自定义)

### 6. 可访问性

- 添加适当的 ARIA 属性
- 确保键盘可访问
- 提供清晰的焦点指示

### 7. 性能优化

- 大量选项时考虑虚拟滚动
- 避免不必要的重渲染
- 图片等资源使用懒加载

## 常见问题

### Q1: 如何复用现有题型的部分功能?

**A**: 使用组件组合而非继承:

```javascript
import BaseChoice from '../BaseChoice';
import CustomHeader from './CustomHeader';

render() {
  return (
    <div>
      <CustomHeader {...this.headerProps} />
      <BaseChoice {...this.choiceProps} />
    </div>
  );
}
```

### Q2: 如何实现题型的条件显示/跳转逻辑?

**A**: 逻辑引擎由系统自动处理,题型组件只需:
1. 正确触发 `change` 事件
2. 在 meta.js 中配置支持逻辑配置(默认支持)

### Q3: 如何支持题型的自定义验证规则?

**A**: 在 meta.js 中添加 validator 配置:

```javascript
formConfig: [
  {
    name: 'validation',
    label: '验证规则',
    type: 'ValidatorConfig',
    // ...
  }
]
```

### Q4: 如何让题型支持选项图片?

**A**: 在 meta.js 的 editConfigure 中配置:

```javascript
editConfigure: {
  optionEdit: {
    show: true,
  },
  optionEditBar: {
    show: true,
    configure: {
      showImage: true,  // 启用选项图片
    },
  },
}
```

### Q5: 如何调试题型组件?

**A**:
1. 在 B端编辑器中添加题型到问卷
2. 打开浏览器开发者工具
3. 在组件代码中添加 `console.log` 或使用 Vue Devtools
4. 查看问卷配置 JSON: 编辑器右上角 → 设置 → 查看配置

## 相关资源

- **问卷 Meta 协议**: `server/src/interfaces/survey.ts`
- **基础组件目录**: `web/src/materials/questions/common/`
- **设置器目录**: `web/src/management/pages/edit/setters/`
- **现有题型参考**: `web/src/materials/questions/widgets/`
- **渲染器逻辑**: `web/src/render/components/`

## 示例参考

系统中已有的题型实现可作为参考:

- **简单题型**: `RadioModule` (单选题), `CheckboxModule` (多选题)
- **输入题型**: `InputModule` (单行输入), `TextareaModule` (多行输入)
- **评分题型**: `StarModule` (星级评分), `NpsModule` (NPS评分)
- **复杂题型**: `CascadeModule` (级联选择), `MatrixModule` (矩阵题)
- **上传题型**: `UploadModule` (文件上传)

每个题型的实现细节都可以在对应的目录中找到,建议先阅读简单题型的代码,再参考复杂题型。
