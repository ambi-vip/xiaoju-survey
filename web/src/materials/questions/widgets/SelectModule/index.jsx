import { defineComponent } from 'vue'
import BaseSelect from './BaseSelect/index.vue'

/**
 * 下拉选择题组件
 * 支持配置:
 * - 占位提示文本 placeholder
 * - 选项列表 options
 * - 只读模式 readonly
 */
export default defineComponent({
  name: 'SelectModule',
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
    options: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    quotaDisplay: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const onChange = (value) => {
      const key = props.field
      emit('change', {
        key,
        value
      })
    }

    return {
      props,
      onChange
    }
  },
  render() {
    const { props } = this
    return (
      <BaseSelect
        value={props.value}
        options={props.options}
        readonly={props.readonly}
        placeholder={props.placeholder}
        quotaDisplay={props.quotaDisplay}
        onChange={this.onChange}
      />
    )
  }
})
