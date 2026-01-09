import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
  title: '日期时间',
  type: 'datetime',
  componentName: 'DateTimeModule',
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
      defaultValue: 'datetime'
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
      name: 'placeholder',
      propType: String,
      description: '这是用于描述引导提示文案',
      defaultValue: '请选择日期时间'
    },
    {
      name: 'dateType',
      propType: String,
      description: '日期时间类型',
      defaultValue: 'date'
    },
    {
      name: 'format',
      propType: String,
      description: '日期时间格式',
      defaultValue: 'YYYY-MM-DD'
    },
    {
      name: 'minDate',
      propType: String,
      description: '最小日期',
      defaultValue: ''
    },
    {
      name: 'maxDate',
      propType: String,
      description: '最大日期',
      defaultValue: ''
    }
  ],
  formConfig: [
    basicConfig,
    {
      name: 'dateType',
      title: '日期时间类型',
      type: 'SelectSetter',
      key: 'dateType',
      options: [
        {
          label: '日期',
          value: 'date'
        },
        {
          label: '日期时间',
          value: 'datetime'
        },
        {
          label: '时间',
          value: 'time'
        },
        {
          label: '年月',
          value: 'month'
        },
        {
          label: '年',
          value: 'year'
        }
      ]
    },
    {
      name: 'format',
      title: '日期格式',
      type: 'SelectSetter',
      key: 'format',
      options: [
        {
          label: 'YYYY-MM-DD',
          value: 'YYYY-MM-DD'
        },
        {
          label: 'YYYY/MM/DD',
          value: 'YYYY/MM/DD'
        },
        {
          label: 'YYYY-MM-DD HH:mm:ss',
          value: 'YYYY-MM-DD HH:mm:ss'
        },
        {
          label: 'YYYY/MM/DD HH:mm:ss',
          value: 'YYYY/MM/DD HH:mm:ss'
        },
        {
          label: 'HH:mm:ss',
          value: 'HH:mm:ss'
        },
        {
          label: 'YYYY-MM',
          value: 'YYYY-MM'
        },
        {
          label: 'YYYY',
          value: 'YYYY'
        }
      ],
      relyFunc: (data) => {
        const typeFormatMap = {
          date: ['YYYY-MM-DD', 'YYYY/MM/DD'],
          datetime: ['YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm:ss'],
          time: ['HH:mm:ss'],
          month: ['YYYY-MM'],
          year: ['YYYY']
        }
        return typeFormatMap[data.dateType] || []
      }
    },
    {
      name: 'dateRange',
      title: '日期范围',
      type: 'Customed',
      content: [
        {
          label: '最小日期',
          type: 'Input',
          key: 'minDate',
          value: '',
          placeholder: '例如: 2020-01-01'
        },
        {
          label: '最大日期',
          type: 'Input',
          key: 'maxDate',
          value: '',
          placeholder: '例如: 2030-12-31'
        }
      ]
    },
    {
      name: 'placeholder',
      title: '引导提示文案',
      type: 'InputSetter',
      placeholder: '限制20字',
      key: 'placeholder',
      tip: '限制20字',
      validate(value) {
        if (value && value.length > 20) {
          console.warn('引导提示文案字数不能超过20个字,请修改后重新保存')
          return false
        }
        return true
      }
    }
  ]
}

export default meta
