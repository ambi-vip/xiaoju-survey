import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
    title: '矩阵NPS',
    type: 'matrix-nps',
    componentName: 'MatrixNpsModule',
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
            defaultValue: '请对以下维度进行评分(0-10分)'
        },
        {
            name: 'type',
            propType: 'String',
            description: '题型类型',
            defaultValue: 'matrix-nps'
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
            name: 'rowTitles',
            propType: Array,
            description: '行题目列表',
            defaultValue: [
                {
                    text: '产品推荐度',
                    hash: 'row_1'
                },
                {
                    text: '服务满意度',
                    hash: 'row_2'
                }
            ]
        }
    ],
    formConfig: [
        basicConfig,
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
