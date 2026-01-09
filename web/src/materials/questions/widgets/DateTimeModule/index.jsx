import { defineComponent, ref, computed, watch } from 'vue'
import './style.scss'
import myMeta from './meta'

export const meta = myMeta

/**
 * 日期时间选择组件 - 使用原生HTML5日期输入控件
 * 支持配置:
 * dateType: 日期时间类型 (date/datetime/time/month/year)
 * format: 日期格式 (用于显示,不影响原生控件)
 * minDate: 最小日期
 * maxDate: 最大日期
 * placeholder: 引导提示文案
 */
export default defineComponent({
  name: 'DateTimeModule',
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
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择日期时间'
    },
    dateType: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    minDate: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    // 格式化日期值以匹配原生input的格式要求
    const formatValueForInput = (value, dateType) => {
      if (!value) return ''

      try {
        const date = new Date(value)
        if (isNaN(date.getTime())) return ''

        // 根据dateType格式化为原生input需要的格式
        switch (dateType) {
          case 'date':
            return date.toISOString().split('T')[0] // YYYY-MM-DD
          case 'datetime': {
            // datetime-local需要格式: YYYY-MM-DDTHH:mm
            const datetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            return datetime.toISOString().slice(0, 16)
          }
          case 'time':
            return date.toTimeString().slice(0, 5) // HH:mm
          case 'month':
            return date.toISOString().slice(0, 7) // YYYY-MM
          case 'year':
            return date.getFullYear().toString()
          default:
            return date.toISOString().split('T')[0]
        }
      } catch (e) {
        return ''
      }
    }

    const dateValue = ref(formatValueForInput(props.value, props.dateType))

    // 监听props.value的变化,用于C端渲染时的数据回填
    watch(
      () => props.value,
      (newValue) => {
        dateValue.value = formatValueForInput(newValue, props.dateType)
      }
    )

    // 监听dateType变化,重新格式化值
    watch(
      () => props.dateType,
      (newType) => {
        dateValue.value = formatValueForInput(props.value, newType)
      }
    )

    // 获取原生input的type属性
    const inputType = computed(() => {
      const typeMap = {
        date: 'date',
        datetime: 'datetime-local', // HTML5标准使用datetime-local
        time: 'time',
        month: 'month',
        year: 'number' // year类型使用number input
      }
      return typeMap[props.dateType] || 'date'
    })

    // 格式化min/max属性值
    const minValue = computed(() => {
      if (!props.minDate) return ''
      return formatValueForInput(props.minDate, props.dateType)
    })

    const maxValue = computed(() => {
      if (!props.maxDate) return ''
      return formatValueForInput(props.maxDate, props.dateType)
    })

    const onChange = (e) => {
      const key = props.field
      const value = e.target.value || ''

      dateValue.value = value

      emit('change', {
        key,
        value
      })
    }

    return {
      dateValue,
      inputType,
      minValue,
      maxValue,
      onChange
    }
  },
  render() {
    const { readonly, placeholder, dateValue, inputType, minValue, maxValue, field, dateType } =
      this

    // year类型特殊处理
    if (dateType === 'year') {
      return (
        <div class="datetime-wrapper">
          <input
            class="datetime-input item-border"
            type="number"
            name={field}
            value={dateValue}
            placeholder={placeholder}
            readonly={readonly}
            min={minValue || '1900'}
            max={maxValue || '2100'}
            step="1"
            onChange={this.onChange}
          />
        </div>
      )
    }

    return (
      <div class="datetime-wrapper">
        <input
          class="datetime-input item-border"
          type={inputType}
          name={field}
          value={dateValue}
          placeholder={placeholder}
          readonly={readonly}
          min={minValue}
          max={maxValue}
          onChange={this.onChange}
        />
      </div>
    )
  }
})
