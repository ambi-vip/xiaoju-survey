import { defineComponent, ref } from 'vue'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'FileUploadModule',
    props: {
        type: {
            type: String,
            default: ''
        },
        field: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Array],
            default: ''
        },
        readonly: {
            type: Boolean,
            default: false
        },
        maxSize: {
            type: Number,
            default: 5 // MB
        },
        accept: {
            type: String,
            default: '*'
        },
        placeholder: {
            type: String,
            default: '请上传文件'
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const fileInput = ref(null)

        const handleFileChange = (e) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            const file = files[0]
            if (file.size > props.maxSize * 1024 * 1024) {
                alert(`文件大小不能超过 ${props.maxSize}MB`)
                e.target.value = ''
                return
            }

            // In a real scenario, we would upload the file here and get a URL.
            // For now, we simulate a value change with the file name.
            // C-side implementation usually involves an upload handler.

            emit('change', {
                key: props.field,
                value: file.name
            })
        }

        const triggerUpload = () => {
            if (props.readonly) return
            fileInput.value.click()
        }

        return {
            fileInput,
            handleFileChange,
            triggerUpload
        }
    },
    render() {
        const {
            field,
            value,
            readonly,
            maxSize,
            accept,
            placeholder,
            triggerUpload
        } = this

        return (
            <div class="file-upload-wrapper">
                <div class={`upload-box ${readonly ? 'readonly' : ''}`} onClick={triggerUpload}>
                    <div class="upload-content">
                        {value ? (
                            <div class="file-info">
                                <i class="qicon qicon-wenjian"></i>
                                <span class="file-name">{value}</span>
                            </div>
                        ) : (
                            <div class="upload-placeholder">
                                <i class="qicon qicon-shangchuan"></i>
                                <span>{placeholder}</span>
                                <span class="limit-tip">（单个文件不超过{maxSize}MB）</span>
                            </div>
                        )}
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        class="hidden-input"
                        name={field}
                        accept={accept}
                        onChange={this.handleFileChange}
                        disabled={readonly}
                    />
                </div>
            </div>
        )
    }
})
