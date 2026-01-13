import { defineComponent, ref } from 'vue'
import { get } from 'lodash-es'

import BaseInput from '../BaseInput'

import './style.scss'
import myMeta from './meta'

export const meta = myMeta
/**
 * 数字题型组件
 * 支持配置：
 * 数字范围限制，numberRange
 * 引导提示文案，placeholder
 */
export default defineComponent({
    name: 'NumberInputModule',
    props: {
        type: {
            type: String,
            default: 'number-input'
        },
        field: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入数字'
        },
        numberRange: {
            type: Object,
            default: () => {
                return {
                    max: {
                        placeholder: '1000',
                        value: 1000
                    },
                    min: {
                        placeholder: '0',
                        value: 0
                    }
                }
            }
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    emits: ['blur', 'focus', 'input', 'change'],
    setup(props, { emit }) {
        const onBlur = () => {
            emit('blur')
        }
        const onFocus = () => {
            emit('focus')
        }
        const onInput = () => {
            emit('input')
        }
        const onChange = (e) => {
            const key = props.field
            let value = e.target.value

            // 转换为数字类型
            if (value !== '' && value !== null && value !== undefined) {
                value = Number(value)

                // 验证数字范围
                const minValue = get(props, 'numberRange.min.value')
                const maxValue = get(props, 'numberRange.max.value')

                if (minValue !== undefined && value < minValue) {
                    value = minValue
                    e.target.value = minValue
                }

                if (maxValue !== undefined && value > maxValue) {
                    value = maxValue
                    e.target.value = maxValue
                }
            }

            emit('change', {
                key,
                value: value
            })
        }
        return {
            props,
            onBlur,
            onFocus,
            onInput,
            onChange
        }
    },
    render() {
        const { numberRange, props } = this

        return (
            <div>
                <BaseInput
                    uiTarget="input"
                    type="number"
                    field={props.field}
                    name={props.field}
                    value={props.value}
                    placeholder={props.placeholder}
                    min={numberRange.min.value}
                    max={numberRange.max.value}
                    readonly={props.readonly}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onInput={this.onInput}
                    onChange={this.onChange}
                />
            </div>
        )
    }
})
