import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
    title: '图片上传',
    type: 'image-upload',
    componentName: 'ImageUploadModule',
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
            defaultValue: '请上传相关图片'
        },
        {
            name: 'type',
            propType: 'String',
            description: '题型类型',
            defaultValue: 'image-upload'
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
            name: 'maxSize',
            propType: Number,
            description: '最大文件大小(MB)',
            defaultValue: 5
        },
        {
            name: 'placeholder',
            propType: String,
            description: '占位提示',
            defaultValue: '点击上传图片'
        }
    ],
    formConfig: [
        basicConfig,
        {
            name: 'fileConfig',
            title: '上传配置',
            type: 'Customed',
            content: [
                {
                    label: '最大图片大小(MB)',
                    type: 'InputNumber',
                    key: 'maxSize',
                    min: 1,
                    max: 20,
                    value: 5
                }
            ]
        },
        {
            name: 'placeholder',
            title: '提示文案',
            type: 'InputSetter',
            key: 'placeholder',
            value: '点击上传图片'
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
