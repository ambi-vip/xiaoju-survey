import basicConfig from '@materials/questions/common/config/basicConfig'

const meta = {
    title: '文件上传',
    type: 'file-upload',
    componentName: 'FileUploadModule',
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
            defaultValue: '请上传相关文件'
        },
        {
            name: 'type',
            propType: 'String',
            description: '题型类型',
            defaultValue: 'file-upload'
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
            defaultValue: 10
        },
        {
            name: 'accept',
            propType: String,
            description: '允许上传的文件类型',
            defaultValue: '*'
        },
        {
            name: 'placeholder',
            propType: String,
            description: '占位提示',
            defaultValue: '点击上传文件'
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
                    label: '最大文件大小(MB)',
                    type: 'InputNumber',
                    key: 'maxSize',
                    min: 1,
                    max: 100,
                    value: 10
                },
                {
                    label: '允许的文件类型',
                    type: 'Input',
                    key: 'accept',
                    value: '*',
                    placeholder: '例如: .pdf,.doc,.docx'
                }
            ]
        },
        {
            name: 'placeholder',
            title: '提示文案',
            type: 'InputSetter',
            key: 'placeholder',
            value: '点击上传文件'
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
