import { defineComponent, computed } from 'vue'
import './style.scss'

export default defineComponent({
  name: 'BaseRate',
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: 0
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    iconClass: {
      type: String,
      default: 'number'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    allowHalf: {
      type: Boolean,
      default: false
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const rating = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('change', val)
      }
    })
    const range = computed(() => {
      const { min, max } = props
      if (min > max) {
        return []
      }
      const res = []
      for (let i = min; i <= max; i++) {
        res.push(i)
      }
      return res
    })
    const handleClick = (num) => {
      if (props.readonly) return

      if (rating.value !== num) {
        rating.value = num
      }
    }
    const getRatingClass = (num) => {
      const { value, allowHalf } = props
      if (allowHalf) {
        // 半选模式：判断是否全选、半选或未选
        if (value >= num) {
          return 'on'
        } else if (value >= num - 0.5) {
          return 'half'
        } else {
          return 'off'
        }
      } else {
        // 整选模式
        return value >= num ? 'on' : 'off'
      }
    }
    return {
      rating,
      range,
      handleClick,
      getRatingClass
    }
  },
  render() {
    const { rating, range, iconClass, getRatingClass } = this

    return (
      <div class="rate-wrapper-main">
        <div class="rate-box">
          {range.map((num, index) => {
            return (
              <div
                class={['rate-item', getRatingClass(num), iconClass]}
                key={'rate' + index}
                onClick={() => {
                  this.handleClick(num)
                }}
              >
                {iconClass === 'number' ? num : ''}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
