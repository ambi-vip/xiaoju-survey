<template>
  <div class="matrix-row-config-wrapper">
    <span class="config-trigger" @click="openDialog">高级设置 ></span>
    
    <el-dialog 
      v-model="dialogVisible" 
      title="行题目编辑" 
      width="60%"
      :append-to-body="true"
      class="matrix-config-dialog"
    >
      <div class="option-handwrite">
        <div class="option-header">
          <div class="header-item flex-1">行题目内容</div>
        </div>
        
        <draggable :list="rowList" handle=".drag-handle" itemKey="hash">
          <template #item="{ element, index }">
            <div class="option-item">
              <span class="drag-handle qicon qicon-tuodong"></span>
              <div class="flex-1 oitem">
                <div
                  contenteditable="true"
                  class="render-html"
                  v-html="rowList[index].text"
                  @blur="onBlur($event, index)"
                ></div>
              </div>
              
              <div class="operate-area">
                <i-ep-circlePlus 
                  class="area-btn-icon" 
                  @click="addRow(index)" 
                />
                <i-ep-remove
                  v-show="rowList.length > 1"
                  class="area-btn-icon"
                  @click="removeRow(index)"
                />
              </div>
            </div>
          </template>
        </draggable>
        
        <div class="add-btn-row">
          <div class="add-option" @click="addRow(-1)">
            <span class="add-option-item">
              <i-ep-circlePlus class="icon" /> 添加新行题目
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
const rowList = ref([])

// 初始化行列表
const initRowList = () => {
  const rows = props.formConfig?.valueAdapter?.({ moduleConfig: props.moduleConfig }) || []
  rowList.value = _cloneDeep(rows)
  
  // 如果没有行，至少添加一个
  if (rowList.value.length === 0) {
    rowList.value = [
      { text: '行题目1', hash: `row_${uniqueId()}` }
    ]
  }
}

const openDialog = () => {
  initRowList()
  dialogVisible.value = true
}

const addRow = (index) => {
  const newRow = {
    text: `行题目${rowList.value.length + 1}`,
    hash: `row_${uniqueId()}`
  }
  
  if (index < 0 || typeof index !== 'number') {
    rowList.value.push(newRow)
  } else {
    rowList.value.splice(index + 1, 0, newRow)
  }
}

const removeRow = (index) => {
  if (rowList.value.length > 1) {
    rowList.value.splice(index, 1)
  }
}

const onBlur = (e, index) => {
  if (cleanRichText(e.target.innerHTML) === '') return
  rowList.value[index].text = e.target.innerHTML
}

const cancel = () => {
  dialogVisible.value = false
}

const confirm = () => {
  dialogVisible.value = false
  emit(FORM_CHANGE_EVENT_KEY, {
    rowTitles: rowList.value
  })
}

// 监听 moduleConfig 变化
watch(
  () => props.moduleConfig,
  () => {
    if (!dialogVisible.value) {
      initRowList()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.matrix-row-config-wrapper {
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
