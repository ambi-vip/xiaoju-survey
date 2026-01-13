<template>
  <div>
    <!-- 只读模式 -->
    <div v-if="readonly" class="select-module-readonly">
      <div class="select-readonly-text">{{ selectedText || placeholder }}</div>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="select-module">
      <el-select
        :model-value="value"
        @change="handleChange"
        :placeholder="placeholder"
        size="large"
        class="select-module-dropdown"
        clearable
      >
        <el-option
          v-for="item in myOptions"
          :key="item.hash"
          :label="getOptionLabel(item)"
          :value="item.hash"
          :disabled="item.disabled"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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
})

const emit = defineEmits(['change'])

// 处理选项配额逻辑
const myOptions = computed(() => {
  const { options } = props
  return options.map((item) => {
    return {
      ...item,
      disabled: item.release <= 0 || item.disabled
    }
  })
})

// 处理选择变化
const handleChange = (value) => {
  emit('change', value)
}

// 获取选中项的文本(用于只读模式展示)
const selectedText = computed(() => {
  if (!props.value) return ''
  const selectedOption = myOptions.value.find((item) => item.hash === props.value)
  return selectedOption ? selectedOption.text : ''
})

// 显示配额信息
const getOptionLabel = (option) => {
  if (props.quotaDisplay && option.limit && option.release !== undefined) {
    return `${option.text} (剩余 ${option.release})`
  }
  return option.text
}
</script>

<style scoped lang="scss">
.select-module {
  width: 100%;

  &-dropdown {
    width: 100%;
    max-width: 500px;
  }
}

.select-module-readonly {
  .select-readonly-text {
    padding: 12px 16px;
    background-color: #f5f7fa;
    border-radius: 4px;
    color: #606266;
    font-size: 14px;
    line-height: 1.5;
    min-height: 40px;
    display: flex;
    align-items: center;

    &:empty::before {
      content: attr(placeholder);
      color: #c0c4cc;
    }
  }
}

// 移动端适配
@media (max-width: 768px) {
  .select-module {
    &-dropdown {
      max-width: 100%;
    }
  }

  .select-module-readonly {
    .select-readonly-text {
      padding: 10px 12px;
      font-size: 16px;
    }
  }
}
</style>
