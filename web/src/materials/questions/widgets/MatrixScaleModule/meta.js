import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '矩阵评分',
  type: 'matrix-scale',
  componentName: 'MatrixScaleModule',
  attrs: [
    {
      name: 'field',
      propType: 'String',
      description: '题目ID',
      defaultValue: ''
    },
    {
      name: 'title',
      propType: 'String',
      description: '题目标题',
      defaultValue: '请对以下维度进行评分'
    },
    {
      name: 'type',
      propType: 'String',
      description: '题型类型',
      defaultValue: 'matrix-scale'
    },
    {
      name: 'isRequired',
      propType: Boolean,
      description: '是否必填',
      defaultValue: true
    },
    {
      name: 'showIndex',
      propType: Boolean,
      description: '显示序号',
      defaultValue: true
    },
    {
      name: 'showType',
      propType: Boolean,
      description: '显示类型',
      defaultValue: true
    },
    {
      name: 'showSpliter',
      propType: Boolean,
      description: '显示分割线',
      defaultValue: true
    },
    {
      name: 'starMax',
      propType: Number,
      description: '最大分值',
      defaultValue: 5
    },
    {
      name: 'starStyle',
      propType: 'String',
      description: '评分样式',
      defaultValue: 'star'
    },
    {
      name: 'rowTitles',
      propType: Array,
      description: '行题目列表',
      defaultValue: [
        {
          text: '外观设计',
          hash: 'row_1'
        },
        {
          text: '功能实用',
          hash: 'row_2'
        },
        {
          text: '性价比',
          hash: 'row_3'
        }
      ]
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'starConfig',
      title: '评分显示样式',
      type: 'RadioGroup',
      key: 'starStyle',
      options: [
        {
          label: [1, 2, 3, 4, 5]
            .map(() => `<i class='qicon qicon-xingxing' style='margin-right: 4px;'></i>`)
            .join(''),
          value: 'star'
        },
        {
          label: [1, 2, 3, 4, 5]
            .map(() => `<i class='qicon qicon-aixin' style='margin-right: 4px;'></i>`)
            .join(''),
          value: 'love'
        },
        {
          label: `1  2  3  4  5`,
          value: 'number'
        }
      ]
    },
    {
      name: 'starMax',
      title: '最大分值',
      key: 'starMax',
      type: 'SelectSetter',
      options: [3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        value: v,
        label: v
      }))
    },
    {
      name: 'rowConfig',
      label: '行题目编辑',
      type: 'MatrixRowConfig',
      valueAdapter({ moduleConfig }) {
        return moduleConfig.rowTitles || []
      },
      valueSetter({ rowTitles }) {
        return [
          {
            key: 'rowTitles',
            value: rowTitles
          }
        ]
      }
    }
  ],
  editConfigure: {
    optionEdit: {
      show: false
    },
    optionEditBar: {
      show: false
    }
  }
}

export default meta
