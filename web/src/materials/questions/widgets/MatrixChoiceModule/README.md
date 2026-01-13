# 矩阵选择题型 (Matrix Choice)

## 概述

矩阵选择题型是一种高级题型，允许用户在一个表格矩阵中对多个行题目进行评价或选择。支持单选和多选两种模式。

## 功能特性

### ✅ 核心功能
- **双模式支持**：支持单选模式（每行只能选一个选项）和多选模式（每行可选多个选项）
- **灵活配置**：可自定义行题目和列选项的数量和内容
- **响应式设计**：自适应桌面端和移动端
- **编辑器集成**：完整的编辑器配置面板支持

### 📋 使用场景
- 满意度调查（如产品功能、服务质量、用户体验等多维度评价）
- 比较评估（多个产品/服务的多个方面对比）
- 特征评分（对多个项目的多个特性进行评分）

## 数据结构

### 输入配置
```javascript
{
  type: 'matrix-choice',
  field: 'question_1',
  title: '请对以下项目进行评价',
  matrixMode: 'radio', // 'radio' 单选 | 'checkbox' 多选
  rowTitles: [
    { text: '产品功能', hash: 'row_1' },
    { text: '用户体验', hash: 'row_2' },
    { text: '性价比', hash: 'row_3' }
  ],
  columnOptions: [
    { text: '非常满意', hash: 'col_1' },
    { text: '满意', hash: 'col_2' },
    { text: '一般', hash: 'col_3' },
    { text: '不满意', hash: 'col_4' }
  ]
}
```

### 输出数据

**单选模式** (`matrixMode: 'radio'`)：
```javascript
{
  "row_1": "col_2",    // 产品功能 -> 满意
  "row_2": "col_1",    // 用户体验 -> 非常满意
  "row_3": "col_3"     // 性价比 -> 一般
}
```

**多选模式** (`matrixMode: 'checkbox'`)：
```javascript
{
  "row_1": ["col_1", "col_2"],  // 产品功能 -> 非常满意, 满意
  "row_2": ["col_1"],           // 用户体验 -> 非常满意
  "row_3": ["col_2", "col_3"]   // 性价比 -> 满意, 一般
}
```

## 文件结构

```
MatrixChoiceModule/
├── index.jsx       # 主组件文件
├── meta.js         # 元数据配置
└── style.scss      # 样式文件
```

## 配置说明

### 基础配置
- **必填**：是否必须填写
- **显示序号**：是否显示题目序号
- **显示类型**：是否显示题型标识
- **显示分割线**：是否显示题目分割线（仅移动端）

### 矩阵配置
- **矩阵模式**：
  - 单选：每行只能选择一个选项
  - 多选：每行可以选择多个选项

### 行题目编辑
通过"编辑行题目"按钮打开编辑器，可以：
- 添加新的行题目
- 编辑现有行题目文本
- 删除行题目（至少保留1个）

### 列选项编辑
通过"编辑列选项"按钮打开编辑器，可以：
- 添加新的列选项
- 编辑现有列选项文本
- 删除列选项（至少保留1个）

## 技术实现

### 组件Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | String | 'matrix-choice' | 题型类型 |
| field | String | '' | 题目ID |
| value | Object/Array | {} | 答案值 |
| readonly | Boolean | false | 只读模式 |
| matrixMode | String | 'radio' | 矩阵模式 |
| rowTitles | Array | [] | 行题目列表 |
| columnOptions | Array | [] | 列选项列表 |

### 事件
- **change**: 答案变化时触发
  ```javascript
  {
    key: '题目ID',
    value: '答案值对象'
  }
  ```

## 样式特性

### 桌面端
- 清晰的表格布局
- 悬停高亮效果
- 适当的内边距和边框

### 移动端
- 压缩的表格布局
- 较小的字体和内边距
- 保持可点击区域大小

## 开发者注意事项

### 扩展设置器
如需修改行/列编辑器的功能，请编辑：
- `/web/src/materials/setters/widgets/MatrixRowConfig.vue`
- `/web/src/materials/setters/widgets/MatrixColumnConfig.vue`

### 自定义样式
样式文件位于 `style.scss`，使用 SCSS 语法，支持：
- BEM 命名规范
- 响应式媒体查询
- 主题色变量

### 数据验证
数据结构会自动标准化：
- 单选模式：值为字符串
- 多选模式：值为数组
- 缺失的行会初始化为空值

## 测试建议

### B端测试（编辑器）
- [ ] 题型在菜单中正确显示
- [ ] 可以正常添加到问卷
- [ ] 配置面板功能正常
- [ ] 行题目编辑器工作正常
- [ ] 列选项编辑器工作正常
- [ ] 模式切换功能正常

### C端测试（渲染器）
- [ ] 单选模式：每行只能选一个
- [ ] 多选模式：每行可选多个
- [ ] 数据格式正确
- [ ] 移动端显示正常
- [ ] 只读模式正常

## 示例

### 满意度调查
```javascript
{
  title: '请对我们的产品进行评价',
  matrixMode: 'radio',
  rowTitles: [
    { text: '产品质量', hash: 'quality' },
    { text: '客户服务', hash: 'service' },
    { text: '价格合理性', hash: 'price' }
  ],
  columnOptions: [
    { text: '非常满意', hash: 'very_satisfied' },
    { text: '满意', hash: 'satisfied' },
    { text: '一般', hash: 'neutral' },
    { text: '不满意', hash: 'dissatisfied' }
  ]
}
```

### 功能需求收集
```javascript
{
  title: '您希望在未来版本中看到哪些功能？',
  matrixMode: 'checkbox',
  rowTitles: [
    { text: '移动应用', hash: 'mobile_app' },
    { text: '数据导出', hash: 'export' },
    { text: 'API集成', hash: 'api' }
  ],
  columnOptions: [
    { text: '非常需要', hash: 'must_have' },
    { text: '有就好', hash: 'nice_to_have' },
    { text: '不需要', hash: 'not_needed' }
  ]
}
```

## 版本历史

- **v1.0.0** (2026-01-13)
  - 初始版本
  - 支持单选/多选模式
  - 基础行列编辑功能
  - 响应式设计
