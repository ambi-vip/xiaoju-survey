import { defineComponent, computed } from 'vue'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'MatrixInputModule',
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
            <div class="matrix-input-wrapper">
                <div class="matrix-input-table">
                    {rowTitles.map((row) => (
                        <div class="matrix-input-row" key={row.hash}>
                            <div class="matrix-input-row-title">{row.text}</div>
                            <div class="matrix-input-cell">
                                <input
                                    type="text"
                                    class="matrix-input-box"
                                    name={`${field}_${row.hash}`}
                                    value={value[row.hash] || ''}
                                    placeholder={placeholder}
                                    readonly={readonly}
                                    onChange={(e) => handleInputChange(row.hash, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
})
