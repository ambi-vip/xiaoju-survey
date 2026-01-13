import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
    title: '排序题',
    type: 'ranking',
    componentName: 'RankingModule',
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
            defaultValue: 'ranking'
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
                },
                {
                    text: '选项4',
                    hash: '115022'
                }
            ]
        },
        {
            name: 'maxRankCount',
            propType: Number,
            description: '最大排序数量',
            defaultValue: 0
        }
    ],
    formConfig: [
        basicConfig,
        {
            name: 'rankingConfig',
            title: '排序配置',
            type: 'Customed',
            content: [
                {
                    label: '最大排序数量',
                    type: 'InputNumber',
                    key: 'maxRankCount',
                    value: 0,
                    min: 0,
                    tip: '设置用户最多可以排序的选项数量，0 表示不限制',
                    placeholder: '0表示不限制'
                }
            ]
        }
    ],
    editConfigure: {
        optionEdit: {
            show: true
        },
        optionEditBar: {
            show: true,
            configure: {
                showOthers: false,
                showAdvancedConfig: false
            }
        }
    }
}

export default meta
