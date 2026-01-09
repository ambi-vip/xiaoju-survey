import { ElMessage } from 'element-plus'
import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '评分',
  type: 'radio-star',
  componentName: 'StarModule',
  attrs: [
    {
      name: 'field',
      propType: 'String',
      description: '这是用于描述题目id',
      defaultValue: ''
    },
    {
      name: 'title',
      propType: 'String',
      description: '这是用于描述题目标题',
      defaultValue: '标题一'
    },
    {
      name: 'type',
      propType: 'String',
      description: '这是用于描述题目类型',
      defaultValue: 'radio-star'
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
      name: 'starMin',
      propType: Number,
      description: '这是用于描述评分最小值',
      defaultValue: 1
    },
    {
      name: 'starMax',
      propType: Number,
      description: '这是用于描述评分最大值',
      defaultValue: 5
    },
    {
      name: 'starStyle',
      propType: String,
      description: '',
      defaultValue: 'star'
    },
    {
      name: 'allowHalf',
      propType: Boolean,
      description: '是否允许半选',
      defaultValue: false
    },
    {
      name: 'rangeConfig',
      propType: Object,
      description: '这是用于描述评分高级设置',
      defaultValue: {}
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
      })),
      validate: (val, moduleConfig) => {
        if (moduleConfig['starMin'] && val < moduleConfig['starMin']) {
          ElMessage.info('最大值不可小于最小值')
          return false
        }
        return true
      }
    },
    {
      name: 'allowHalf',
      title: '允许半星',
      key: 'allowHalf',
      type: 'SwitchSetter'
    }
  ],
  editConfigure: {
    optionEdit: {
      show: false
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false,
        showAdvancedConfig: true
      }
    }
  }
}

export default meta
