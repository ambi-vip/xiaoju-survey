import { computed, defineComponent } from 'vue'
import { isArray } from 'lodash-es'

import metaConfig from './meta.js'
import './style.scss'

export const meta = metaConfig

/**
 * 矩阵选择题组件
 * 支持配置：
 * - 选择模式 (单选/多选)
 * - 行题目列表
 * - 列选项列表
 * - 排列方式
 */
export default defineComponent({
    name: 'MatrixChoiceModule',
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
            type: [Object, Array],
            default: () => ({})
        },
        readonly: {
            type: Boolean,
            default: false
        },
        matrixMode: {
            // 'radio' 单选模式, 'checkbox' 多选模式
            type: String,
            default: 'radio'
        },
        rowTitles: {
            // 行题目列表
            type: Array,
            default: () => []
        },
        columnOptions: {
            // 列选项列表
            type: Array,
            default: () => []
        },
        layout: {
            type: String,
            default: 'vertical'
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        // 初始化值对象，确保每一行都有对应的值
        const normalizedValue = computed(() => {
            const value = props.value || {}
            const normalized = {}

            props.rowTitles.forEach((row) => {
                if (props.matrixMode === 'checkbox') {
                    // 多选模式：值是数组
                    normalized[row.hash] = isArray(value[row.hash]) ? value[row.hash] : []
                } else {
                    // 单选模式：值是字符串
                    normalized[row.hash] = value[row.hash] || ''
                }
            })

            return normalized
        })

        // 处理单选变化
        const handleRadioChange = (rowHash, columnHash) => {
            const newValue = {
                ...normalizedValue.value,
                [rowHash]: columnHash
            }

            emit('change', {
                key: props.field,
                value: newValue
            })
        }

        // 处理多选变化
        const handleCheckboxChange = (rowHash, columnHash, checked) => {
            const currentRowValue = normalizedValue.value[rowHash] || []
            let newRowValue

            if (checked) {
                // 添加选项
                newRowValue = [...currentRowValue, columnHash]
            } else {
                // 移除选项
                newRowValue = currentRowValue.filter(hash => hash !== columnHash)
            }

            const newValue = {
                ...normalizedValue.value,
                [rowHash]: newRowValue
            }

            emit('change', {
                key: props.field,
                value: newValue
            })
        }

        // 检查某个选项是否被选中
        const isChecked = (rowHash, columnHash) => {
            const rowValue = normalizedValue.value[rowHash]

            if (props.matrixMode === 'checkbox') {
                return isArray(rowValue) && rowValue.includes(columnHash)
            } else {
                return rowValue === columnHash
            }
        }

        return {
            normalizedValue,
            handleRadioChange,
            handleCheckboxChange,
            isChecked
        }
    },
    render() {
        const {
            readonly,
            field,
            matrixMode,
            rowTitles,
            columnOptions,
            handleRadioChange,
            handleCheckboxChange,
            isChecked
        } = this

        return (
            <div class="matrix-choice-wrapper">
                <div class="matrix-choice-table">
                    {/* 表头 */}
                    <div class="matrix-choice-header">
                        <div class="matrix-choice-header-cell matrix-choice-header-empty"></div>
                        {columnOptions.map((column) => (
                            <div class="matrix-choice-header-cell" key={column.hash}>
                                {column.text}
                            </div>
                        ))}
                    </div>

                    {/* 表格内容 */}
                    <div class="matrix-choice-body">
                        {rowTitles.map((row) => (
                            <div class="matrix-choice-row" key={row.hash}>
                                {/* 行标题 */}
                                <div class="matrix-choice-row-title">{row.text}</div>

                                {/* 选项单元格 */}
                                {columnOptions.map((column) => (
                                    <div class="matrix-choice-cell" key={`${row.hash}-${column.hash}`}>
                                        {matrixMode === 'radio' ? (
                                            // 单选模式
                                            <input
                                                type="radio"
                                                name={`${field}-${row.hash}`}
                                                value={column.hash}
                                                checked={isChecked(row.hash, column.hash)}
                                                disabled={readonly}
                                                onChange={() => {
                                                    if (!readonly) {
                                                        handleRadioChange(row.hash, column.hash)
                                                    }
                                                }}
                                                class="matrix-choice-radio"
                                            />
                                        ) : (
                                            // 多选模式
                                            <input
                                                type="checkbox"
                                                name={`${field}-${row.hash}`}
                                                value={column.hash}
                                                checked={isChecked(row.hash, column.hash)}
                                                disabled={readonly}
                                                onChange={(e) => {
                                                    if (!readonly) {
                                                        handleCheckboxChange(row.hash, column.hash, e.target.checked)
                                                    }
                                                }}
                                                class="matrix-choice-checkbox"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
})
