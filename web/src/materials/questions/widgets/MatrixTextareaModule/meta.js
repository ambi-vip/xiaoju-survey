import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
    title: '矩阵多行填空',
    type: 'matrix-textarea',
    componentName: 'MatrixTextareaModule',
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
            defaultValue: '请填写以下详细信息'
        },
        {
            name: 'type',
            propType: 'String',
            description: '题型类型',
            defaultValue: 'matrix-textarea'
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
            description: '输入框提示文字',
            defaultValue: '请输入'
        },
        {
            name: 'rowTitles',
            propType: Array,
            description: '行题目列表',
            defaultValue: [
                {
                    text: '意见建议',
                    hash: 'row_1'
                },
                {
                    text: '其他说明',
                    hash: 'row_2'
                }
            ]
        }
    ],
    formConfig: [
        basicConfig,
        {
            name: 'placeholder',
            title: '提示文字',
            type: 'InputSetter',
            key: 'placeholder',
            value: '请输入'
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
