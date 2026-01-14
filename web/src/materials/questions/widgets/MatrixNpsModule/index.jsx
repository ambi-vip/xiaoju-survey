import { defineComponent, computed } from 'vue'
import BaseRate from '../BaseRate'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'MatrixNpsModule',
    components: {
        BaseRate
    },
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
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const handleRateChange = (rowHash, score) => {
            const newValue = {
                ...props.value,
                [rowHash]: score
            }

            emit('change', {
                key: props.field,
                value: newValue
            })
        }

        return {
            handleRateChange
        }
    },
    render() {
        const {
            field,
            value,
            readonly,
            rowTitles,
            handleRateChange
        } = this

        return (
            <div class="matrix-nps-wrapper">
                <div class="matrix-nps-table">
                    {rowTitles.map((row) => (
                        <div class="matrix-nps-row" key={row.hash}>
                            <div class="matrix-nps-row-title">{row.text}</div>
                            <div class="matrix-nps-cell">
                                <BaseRate
                                    name={`${field}_${row.hash}`}
                                    value={value[row.hash] === undefined ? -1 : value[row.hash]}
                                    min={0}
                                    max={10}
                                    readonly={readonly}
                                    iconClass="number"
                                    onChange={(val) => handleRateChange(row.hash, val)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
})
