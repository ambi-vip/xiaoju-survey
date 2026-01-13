import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '下拉选择',
  type: 'select',
  componentName: 'SelectModule',
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
      defaultValue: 'select'
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
      name: 'options',
      propType: Array,
      description: '这是用于描述选项',
      defaultValue: [
        {
          text: '选项1',
          hash: '115019'
        },
        {
          text: '选项2',
          hash: '115020'
        },
        {
          text: '选项3',
          hash: '115021'
        }
      ]
    },
    {
      name: 'placeholder',
      propType: String,
      description: '占位提示文本',
      defaultValue: '请选择'
    },
    {
      name: 'quotaDisplay',
      propType: Boolean,
      description: '展示配额剩余数量',
      defaultValue: true
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'placeholder',
      label: '占位提示',
      type: 'Input',
      key: 'placeholder',
      value: '请选择',
      placeholder: '请输入占位提示文本',
      labelStyle: {
        'font-weight': 'bold'
      }
    },
    {
      name: 'optionQuota',
      label: '选项配额',
      labelStyle: {
        'font-weight': 'bold'
      },
      type: 'QuotaConfig',
      // 输出转换
      valueSetter({ options, quotaDisplay }) {
        return [
          {
            key: 'options',
            value: options
          },
          {
            key: 'quotaDisplay',
            value: quotaDisplay
          }
        ]
      }
    }
  ],
  editConfigure: {
    optionEdit: {
      show: true
    },
    optionEditBar: {
      show: true,
      configure: {
        showOthers: false, // 下拉选择不支持"其他"选项
        showAdvancedConfig: true
      }
    }
  }
}

export default meta
