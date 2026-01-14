import { defineComponent, ref } from 'vue'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'ImageUploadModule',
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
        placeholder: {
            type: String,
            default: '请上传图片'
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const fileInput = ref(null)
        const imgSrc = ref('')

        const handleFileChange = (e) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            const file = files[0]
            if (file.size > props.maxSize * 1024 * 1024) {
                alert(`图片大小不能超过 ${props.maxSize}MB`)
                e.target.value = ''
                return
            }

            // Preview local image
            const reader = new FileReader()
            reader.onload = (event) => {
                imgSrc.value = event.target.result
            }
            reader.readAsDataURL(file)

            // Emit value (usually a URL after upload)
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
            imgSrc,
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
            placeholder,
            imgSrc,
            triggerUpload
        } = this

        return (
            <div class="image-upload-wrapper">
                <div class={`upload-box ${readonly ? 'readonly' : ''} ${imgSrc || value ? 'has-image' : ''}`} onClick={triggerUpload}>
                    {imgSrc || value ? ( // In real app, value would be a URL
                        <div class="image-preview">
                            <img src={imgSrc || 'https://via.placeholder.com/150'} alt="preview" />
                            {!readonly && <div class="re-upload-mask"><i class="qicon qicon-shangchuan"></i></div>}
                        </div>
                    ) : (
                        <div class="upload-content">
                            <i class="qicon qicon-tupian"></i>
                            <span>{placeholder}</span>
                            <span class="limit-tip">（单张不超过{maxSize}MB）</span>
                        </div>
                    )}
                    <input
                        ref="fileInput"
                        type="file"
                        class="hidden-input"
                        name={field}
                        accept="image/*"
                        onChange={this.handleFileChange}
                        disabled={readonly}
                    />
                </div>
            </div>
        )
    }
})
