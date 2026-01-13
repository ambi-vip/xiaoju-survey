import { defineComponent, computed } from 'vue'
import draggable from 'vuedraggable'

/**
 * 排序题组件
 * 参考 Element UI 设计,左右两栏布局
 * 支持配置：
 * - 最大排序数量 maxRankCount
 */
export default defineComponent({
    name: 'RankingModule',
    components: {
        draggable
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
            type: [Array, String],
            default: () => []
        },
        options: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        },
        maxRankCount: {
            type: Number,
            default: 0 // 0 表示不限制
        }
    },
    emits: ['change'],
    setup(props, { emit }) {
        // 标准化 value 值,确保是数组类型(C端可能传入空字符串)
        const normalizedValue = computed(() => {
            if (!props.value || props.value === '') {
                return []
            }
            return Array.isArray(props.value) ? props.value : []
        })

        // 已排序的选项
        const rankedOptions = computed(() => {
            return normalizedValue.value
                .map((hash) => props.options.find((opt) => opt.hash === hash))
                .filter(Boolean)
        })

        // 未排序的选项
        const unrankedOptions = computed(() => {
            return props.options.filter((opt) => !normalizedValue.value.includes(opt.hash))
        })

        // 是否已达到最大排序数量
        const isMaxRankReached = computed(() => {
            if (props.maxRankCount === 0) return false
            return normalizedValue.value.length >= props.maxRankCount
        })

        // 处理已排序列表变化
        const handleRankedChange = (evt) => {
            // 拖拽排序改变顺序
            if (evt.moved) {
                const newValue = rankedOptions.value.map((opt) => opt.hash)
                emit('change', {
                    key: props.field,
                    value: newValue
                })
            }
            // 从待选区拖入
            else if (evt.added) {
                // 检查是否超过最大排序数量
                if (props.maxRankCount > 0 && normalizedValue.value.length >= props.maxRankCount) {
                    return
                }
                const newOption = evt.added.element
                const newValue = [...normalizedValue.value]
                newValue.splice(evt.added.newIndex, 0, newOption.hash)
                emit('change', {
                    key: props.field,
                    value: newValue
                })
            }
            // 从已排序区移除
            else if (evt.removed) {
                const removedHash = evt.removed.element.hash
                const newValue = normalizedValue.value.filter((hash) => hash !== removedHash)
                emit('change', {
                    key: props.field,
                    value: newValue
                })
            }
        }

        // 处理点击删除按钮移除已排序项
        const handleRemoveItem = (hash) => {
            const newValue = normalizedValue.value.filter((h) => h !== hash)
            emit('change', {
                key: props.field,
                value: newValue
            })
        }

        return {
            rankedOptions,
            unrankedOptions,
            isMaxRankReached,
            handleRankedChange,
            handleRemoveItem
        }
    },
    render() {
        const { readonly, rankedOptions, unrankedOptions, isMaxRankReached, maxRankCount } = this

        return (
            <div class="ranking-module">
                <div class="ranking-container">
                    {/* 左侧：待选选项区域 */}
                    <div class="unranked-section">
                        <div class="section-title">请将左面的选项拖到右边完成排序</div>
                        <div class="section-content">
                            {readonly ? (
                                // 只读模式
                                unrankedOptions.length > 0 ? (
                                    unrankedOptions.map((option) => (
                                        <div key={option.hash} class="option-item readonly">
                                            {option.text}
                                        </div>
                                    ))
                                ) : null
                            ) : (
                                // 编辑模式：可拖拽
                                <draggable
                                    modelValue={unrankedOptions}
                                    group={{ name: 'ranking', pull: 'clone', put: false }}
                                    itemKey="hash"
                                    sort={false}
                                    class="draggable-list"
                                >
                                    {{
                                        item: ({ element }) => (
                                            <div
                                                key={element.hash}
                                                class={['option-item', { disabled: isMaxRankReached }]}
                                            >
                                                {element.text}
                                            </div>
                                        )
                                    }}
                                </draggable>
                            )}
                        </div>
                    </div>

                    {/* 右侧：已排序区域 */}
                    <div class="ranked-section">
                        <div class="section-title">
                            上下可拖动排序
                            {maxRankCount > 0 && (
                                <span class="count-hint">
                                    ({rankedOptions.length}/{maxRankCount})
                                </span>
                            )}
                        </div>
                        <div class="section-content">
                            {readonly ? (
                                // 只读模式
                                rankedOptions.length > 0 ? (
                                    rankedOptions.map((option, index) => (
                                        <div key={option.hash} class="ranked-item readonly">
                                            <span class="rank-number">{index + 1}</span>
                                            <span class="rank-text">{option.text}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div class="empty-hint">暂无排序</div>
                                )
                            ) : (
                                // 编辑模式：可拖拽排序
                                <draggable
                                    modelValue={rankedOptions}
                                    group="ranking"
                                    itemKey="hash"
                                    animation={200}
                                    onChange={this.handleRankedChange}
                                    class="draggable-list"
                                >
                                    {{
                                        item: ({ element, index }) => (
                                            <div key={element.hash} class="ranked-item">
                                                <span class="rank-number">{index + 1}</span>
                                                <span class="rank-text">{element.text}</span>
                                                <span
                                                    class="delete-btn"
                                                    onClick={() => this.handleRemoveItem(element.hash)}
                                                    title="删除"
                                                >
                                                    ×
                                                </span>
                                                <span class="drag-handle">⋮⋮</span>
                                            </div>
                                        ),
                                        footer: () =>
                                            rankedOptions.length === 0 ? (
                                                <div class="empty-hint">将选项拖拽到此处</div>
                                            ) : null
                                    }}
                                </draggable>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
          .ranking-module {
            width: 100%;
          }

          .ranking-container {
            display: flex;
            gap: 20px;
            width: 100%;
          }

          .unranked-section,
          .ranked-section {
            flex: 1;
            min-width: 0;
          }

          .section-title {
            font-size: 14px;
            color: #606266;
            margin-bottom: 12px;
            font-weight: 500;
          }

          .count-hint {
            color: #909399;
            font-weight: normal;
            margin-left: 8px;
          }

          .section-content {
            background: #f5f7fa;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            padding: 12px;
            min-height: 200px;
          }

          .draggable-list {
            min-height: 176px;
          }

          .option-item {
            background: #fff;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            padding: 12px 16px;
            margin-bottom: 8px;
            cursor: move;
            transition: all 0.3s;
            color: #606266;
            font-size: 14px;
          }

          .option-item:hover:not(.disabled):not(.readonly) {
            border-color: #409eff;
            color: #409eff;
          }

          .option-item:last-child {
            margin-bottom: 0;
          }

          .option-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .option-item.readonly {
            cursor: default;
          }

          .ranked-item {
            display: flex;
            align-items: center;
            background: #fff;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            padding: 10px 12px;
            margin-bottom: 8px;
            cursor: move;
            transition: all 0.3s;
          }

          .ranked-item:hover:not(.readonly) {
            border-color: #409eff;
            box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
          }

          .ranked-item:last-child {
            margin-bottom: 0;
          }

          .ranked-item.readonly {
            cursor: default;
          }

          .rank-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            background: #409eff;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 600;
            margin-right: 10px;
            flex-shrink: 0;
          }

          .rank-text {
            flex: 1;
            color: #606266;
            font-size: 14px;
          }

          .delete-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: #f56c6c;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 8px;
            border-radius: 50%;
            transition: all 0.2s;
          }

          .delete-btn:hover {
            background: #fef0f0;
            color: #f56c6c;
          }

          .drag-handle {
            color: #c0c4cc;
            font-size: 16px;
            cursor: grab;
            margin-left: 8px;
          }

          .drag-handle:active {
            cursor: grabbing;
          }

          .empty-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 176px;
            color: #c0c4cc;
            font-size: 14px;
          }

          /* 移动端适配 */
          @media (max-width: 768px) {
            .ranking-container {
              flex-direction: column;
              gap: 16px;
            }

            .section-content {
              min-height: 150px;
            }

            .draggable-list {
              min-height: 126px;
            }

            .empty-hint {
              min-height: 126px;
            }
          }
        `}</style>
            </div>
        )
    }
})
