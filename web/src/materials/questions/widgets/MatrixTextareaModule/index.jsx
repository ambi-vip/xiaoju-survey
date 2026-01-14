import { defineComponent, computed } from 'vue'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'MatrixTextareaModule',
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
            type: Object,
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        },
        rowTitles: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: '请输入'
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const handleInputChange = (rowHash, val) => {
            const newValue = {
                ...props.value,
                [rowHash]: val
            }

            emit('change', {
                key: props.field,
                value: newValue
            })
        }

        return {
            handleInputChange
        }
    },
    render() {
        const {
            field,
            value,
            readonly,
            rowTitles,
            placeholder,
            handleInputChange
        } = this

        return (
            <div class="matrix-textarea-wrapper">
                <div class="matrix-textarea-table">
                    {rowTitles.map((row) => (
                        <div class="matrix-textarea-row" key={row.hash}>
                            <div class="matrix-textarea-row-title">{row.text}</div>
                            <div class="matrix-textarea-cell">
                                <textarea
                                    class="matrix-textarea-box"
                                    name={`${field}_${row.hash}`}
                                    value={value[row.hash] || ''}
                                    placeholder={placeholder}
                                    readonly={readonly}
                                    rows="3"
                                    onInput={(e) => handleInputChange(row.hash, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
})
