import basicConfig from '@materials/questions/common/config/basicConfig'
import { pick as _pick } from 'lodash-es'

const meta = {
    title: '矩阵选择',
    type: 'matrix-choice',
    componentName: 'MatrixChoiceModule',
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
            defaultValue: '请对以下项目进行评价'
        },
        {
            name: 'type',
            propType: 'String',
            description: '题型类型',
            defaultValue: 'matrix-choice'
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
            name: 'matrixMode',
            propType: String,
            description: '矩阵模式(radio单选/checkbox多选)',
            defaultValue: 'radio'
        },
        {
            name: 'rowTitles',
            propType: Array,
            description: '行题目列表',
            defaultValue: [
                {
                    text: '产品功能',
                    hash: 'row_1'
                },
                {
                    text: '用户体验',
                    hash: 'row_2'
                },
                {
                    text: '性价比',
                    hash: 'row_3'
                }
            ]
        },
        {
            name: 'columnOptions',
            propType: Array,
            description: '列选项列表',
            defaultValue: [
                {
                    text: '非常满意',
                    hash: 'col_1'
                },
                {
                    text: '满意',
                    hash: 'col_2'
                },
                {
                    text: '一般',
                    hash: 'col_3'
                },
                {
                    text: '不满意',
                    hash: 'col_4'
                },
                {
                    text: '非常不满意',
                    hash: 'col_5'
                }
            ]
        }
    ],
    formConfig: [
        basicConfig,
        {
            name: 'matrixConfig',
            title: '矩阵配置',
            type: 'Customed',
            content: [
                {
                    label: '矩阵模式',
                    type: 'RadioGroup',
                    key: 'matrixMode',
                    value: 'radio',
                    options: [
                        {
                            label: '单选(每行只能选一个)',
                            value: 'radio'
                        },
                        {
                            label: '多选(每行可选多个)',
                            value: 'checkbox'
                        }
                    ]
                }
            ]
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
        },
        {
            name: 'columnConfig',
            label: '列选项编辑',
            type: 'MatrixColumnConfig',
            valueAdapter({ moduleConfig }) {
                return moduleConfig.columnOptions || []
            },
            valueSetter({ columnOptions }) {
                return [
                    {
                        key: 'columnOptions',
                        value: columnOptions
                    }
                ]
            }
        }
    ],
    editConfigure: {
        optionEdit: {
            show: false // 矩阵题使用自定义的行列编辑器
        },
        optionEditBar: {
            show: false
        }
    }
}

export default meta
