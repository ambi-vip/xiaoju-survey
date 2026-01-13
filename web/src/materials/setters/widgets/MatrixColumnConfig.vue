<template>
  <div class="matrix-column-config-wrapper">
    <span class="config-trigger" @click="openDialog">高级设置 ></span>
    
    <el-dialog 
      v-model="dialogVisible" 
      title="列选项编辑" 
      width="60%"
      :append-to-body="true"
      class="matrix-config-dialog"
    >
      <div class="option-handwrite">
        <div class="option-header">
          <div class="header-item flex-1">列选项内容</div>
        </div>
        
        <draggable :list="columnList" handle=".drag-handle" itemKey="hash">
          <template #item="{ element, index }">
            <div class="option-item">
              <span class="drag-handle qicon qicon-tuodong"></span>
              <div class="flex-1 oitem">
                <div
                  contenteditable="true"
                  class="render-html"
                  v-html="columnList[index].text"
                  @blur="onBlur($event, index)"
                ></div>
              </div>
              
              <div class="operate-area">
                <i-ep-circlePlus 
                  class="area-btn-icon" 
                  @click="addColumn(index)" 
                />
                <i-ep-remove
                  v-show="columnList.length > 1"
                  class="area-btn-icon"
                  @click="removeColumn(index)"
                />
              </div>
            </div>
          </template>
        </draggable>
        
        <div class="add-btn-row">
          <div class="add-option" @click="addColumn(-1)">
            <span class="add-option-item">
              <i-ep-circlePlus class="icon" /> 添加新列选项
            </span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="confirm" type="primary">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
import { uniqueId, cloneDeep as _cloneDeep } from 'lodash-es'
import { cleanRichText } from '@/common/xss'

const props = defineProps(['formConfig', 'moduleConfig'])
const emit = defineEmits(['form-change'])

const dialogVisible = ref(false)
const columnList = ref([])

// 初始化列列表
const initColumnList = () => {
  const columns = props.formConfig?.valueAdapter?.({ moduleConfig: props.moduleConfig }) || []
  columnList.value = _cloneDeep(columns)
  
  // 如果没有列，至少添加一个
  if (columnList.value.length === 0) {
    columnList.value = [
      { text: '选项1', hash: `col_${uniqueId()}` }
    ]
  }
}

const openDialog = () => {
  initColumnList()
  dialogVisible.value = true
}

const addColumn = (index) => {
  const newColumn = {
    text: `选项${columnList.value.length + 1}`,
    hash: `col_${uniqueId()}`
  }
  
  if (index < 0 || typeof index !== 'number') {
    columnList.value.push(newColumn)
  } else {
    columnList.value.splice(index + 1, 0, newColumn)
  }
}

const removeColumn = (index) => {
  if (columnList.value.length > 1) {
    columnList.value.splice(index, 1)
  }
}

const onBlur = (e, index) => {
  if (cleanRichText(e.target.innerHTML) === '') return
  columnList.value[index].text = e.target.innerHTML
}

const cancel = () => {
  dialogVisible.value = false
}

const confirm = () => {
  dialogVisible.value = false
  emit(FORM_CHANGE_EVENT_KEY, {
    columnOptions: columnList.value
  })
}

// 监听 moduleConfig 变化
watch(
  () => props.moduleConfig,
  () => {
    if (!dialogVisible.value) {
      initColumnList()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.matrix-column-config-wrapper {
  width: 90%;
  display: flex;
  justify-content: flex-end;
  
  .config-trigger {
    color: $primary-color;
    cursor: pointer;
    font-size: 14px;
  }
}

.matrix-config-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.option-handwrite {
  .option-header {
    position: relative;
    background: #f9fafc;
    border: 1px solid #edeffc;
    border-radius: 2px;
    font-size: inherit;
    color: #506b7b;
    height: 32px;
    line-height: 32px;
    padding-left: 24px;
    padding-right: 50px;
    display: flex;
    overflow: hidden;
    
    .header-item {
      margin-right: 8px;
    }
  }
  
  .option-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding-right: 50px;
    position: relative;
    
    .drag-handle {
      margin-top: 0;
      cursor: move;
      margin-right: 8px;
      font-size: 16px;
      color: #92949d;
    }
    
    .oitem {
      margin-right: 8px;
      text-align: center;
    }
    
    .operate-area {
      width: 50px;
      position: absolute;
      right: 0;
      z-index: 2;
      border-color: #fff;
      font-size: 18px;
      text-align: right;
      
      .area-btn-icon {
        cursor: pointer;
        font-size: 16px;
        margin-right: 5px;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
  
  .flex-1 {
    flex: 1;
    
    .render-html {
      border-color: #e3e4e8;
      border-radius: 2px;
      color: #6e707c;
      height: auto;
      padding: 9px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 100%;
      border: 1px solid #dcdfe6;
      min-height: 36px;
      
      &:focus {
        outline: none;
        border-color: $primary-color;
      }
      
      &:empty:before {
        content: attr(placeholder);
        color: #c0c4cc;
      }
    }
  }
  
  .add-btn-row {
    color: $primary-color;
    display: flex;
    align-items: center;
    
    .add-option {
      margin-top: 15px;
      margin-bottom: 15px;
      font-size: 12px;
      cursor: pointer;
      
      .add-option-item {
        display: flex;
        align-items: center;
        
        .icon {
          margin-right: 5px;
        }
      }
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
