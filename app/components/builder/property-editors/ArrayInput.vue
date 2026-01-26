<template>
  <div class="array-input">
    <label v-if="label">{{ label }}</label>
    
    <div class="array-actions">
      <button @click="addItem" class="add-btn" :disabled="disabled">
        + 添加
      </button>
      <span class="item-count">共 {{ modelValue?.length || 0 }} 项</span>
    </div>
    
    <div class="array-items">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="array-item"
      >
        <div class="item-header">
          <span class="item-index">第 {{ index + 1 }} 项</span>
          <button @click="removeItem(index)" class="remove-btn" :disabled="disabled">
            🗑️ 删除
          </button>
        </div>
        
        <div class="item-properties">
          <div
            v-for="(property, key) in itemSchema"
            :key="key"
            class="nested-property"
          >
            <component
              :is="getPropertyEditor(property.type)"
              :model-value="item[key]"
              @update:model-value="updateItemProperty(index, key, $event)"
              :label="property.label"
              :placeholder="property.placeholder"
              :disabled="disabled"
              :options="property.options"
              :min="property.min"
              :max="property.max"
              :rows="property.rows"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="modelValue?.length === 0" class="empty-array">
      <p>暂无数据，点击上方按钮添加</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropertySchema } from '~/types/component-builder'
import StringInput from './StringInput.vue'
import NumberInput from './NumberInput.vue'
import SelectInput from './SelectInput.vue'
import TextareaInput from './TextareaInput.vue'

const props = defineProps<{
  modelValue: Array<Record<string, any>>
  label?: string
  disabled?: boolean
  itemSchema: Record<string, PropertySchema>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Array<Record<string, any>>]
}>()

const getPropertyEditor = (type: string) => {
  const editors: Record<string, any> = {
    'string': StringInput,
    'number': NumberInput,
    'select': SelectInput,
    'textarea': TextareaInput
  }
  return editors[type] || StringInput
}

const addItem = () => {
  const newItem: Record<string, any> = {}
  Object.keys(props.itemSchema).forEach(key => {
    const property = props.itemSchema[key]
    newItem[key] = property.default || ''
  })
  
  const newValue = [...(props.modelValue || []), newItem]
  emit('update:modelValue', newValue)
}

const removeItem = (index: number) => {
  const newValue = [...(props.modelValue || [])]
  newValue.splice(index, 1)
  emit('update:modelValue', newValue)
}

const updateItemProperty = (index: number, key: string, value: any) => {
  const newValue = [...(props.modelValue || [])]
  newValue[index] = { ...newValue[index], [key]: value }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.array-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.array-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.array-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  padding: 6px 12px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.add-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.item-count {
  font-size: 12px;
  color: #6b7280;
}

.array-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.array-item {
  padding: 12px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.item-index {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.remove-btn {
  padding: 4px 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.remove-btn:disabled {
  background-color: #fca5a5;
  cursor: not-allowed;
}

.item-properties {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nested-property {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-array {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  color: #9ca3af;
  margin-top: 8px;
}

.empty-array p {
  font-size: 14px;
}
</style>