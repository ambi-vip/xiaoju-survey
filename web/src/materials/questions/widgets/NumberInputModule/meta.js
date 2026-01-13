import basicConfig from '@materials/questions/common/config/basicConfig'

export const meta = {
    title: '数字',
    type: 'number-input',
    componentName: 'NumberInputModule',
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
            defaultValue: 'number-input'
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
            defaultValue: '请输入数字'
        },
        {
            name: 'numberRange',
            propType: Object,
            description: '这是用于数字限制',
            defaultValue: {
                max: {
                    placeholder: '1000',
                    value: 1000
                },
                min: {
                    placeholder: '0',
                    value: 0
                }
            }
        }
    ],
    formConfig: [
        basicConfig,
        {
            name: 'numberRange',
            title: '数字限制',
            type: 'RangeSetter',
            key: 'numberRange',
            value: []
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
                    console.warn('引导提示文案字数不能超过20个字，请修改后重新保存')
                    return false
                }
                return true
            }
        }
    ]
}

export default meta
