import { defineComponent, computed } from 'vue'
import BaseRate from '../BaseRate'
import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

export default defineComponent({
    name: 'MatrixScaleModule',
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
        },
        starMax: {
            type: Number,
            default: 5
        },
        starStyle: {
            type: String,
            default: 'star'
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        const starClass = computed(() => {
            const { starStyle } = props
            switch (starStyle) {
                case 'star':
                    return 'qicon qicon-xingxing'
                case 'love':
                    return 'qicon qicon-aixin'
                case 'number':
                    return 'number'
                default:
                    return 'qicon qicon-xingxing'
            }
        })

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
            starClass,
            handleRateChange
        }
    },
    render() {
        const {
            field,
            value,
            readonly,
            rowTitles,
            starMax,
            starClass,
            handleRateChange
        } = this

        return (
            <div class="matrix-scale-wrapper">
                <div class="matrix-scale-table">
                    {rowTitles.map((row) => (
                        <div class="matrix-scale-row" key={row.hash}>
                            <div class="matrix-scale-row-title">{row.text}</div>
                            <div class="matrix-scale-cell">
                                <BaseRate
                                    name={`${field}_${row.hash}`}
                                    value={value[row.hash] !== undefined ? value[row.hash] : ''}
                                    max={starMax}
                                    readonly={readonly}
                                    iconClass={starClass}
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
