<template>
  <div class="property-editor">
    <h3>组件属性</h3>
    
    <div v-if="selectedComponent" class="editor-content">
      <div class="property-group">
        <label>组件名称</label>
        <StringInput
          :model-value="selectedComponent.props.name"
          @update:model-value="selectedComponent.props.name = $event"
          placeholder="输入组件名称"
        />
      </div>
      
      <div v-for="(property, key) in propertySchema" :key="key" class="property-group">
        <component
          :is="getPropertyEditor(property.type)"
          :model-value="selectedComponent.props[key]"
          @update:model-value="selectedComponent.props[key] = $event"
          :label="property.label"
          :placeholder="property.placeholder"
          :options="property.options"
          :min="property.min"
          :max="property.max"
          :rows="property.rows"
          :item-schema="property.itemSchema"
        />
      </div>
    </div>
    
    <div v-else class="editor-empty">
      <p>选择一个组件以编辑其属性</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentConfig, PropertySchema } from '~/types/component-builder'
import { getComponentConfigMap } from '~/composables/useComponentRegistry'
import StringInput from './property-editors/StringInput.vue'
import NumberInput from './property-editors/NumberInput.vue'
import BooleanSwitch from './property-editors/BooleanSwitch.vue'
import SelectInput from './property-editors/SelectInput.vue'
import TextareaInput from './property-editors/TextareaInput.vue'
import ColorInput from './property-editors/ColorInput.vue'
import ArrayInput from './property-editors/ArrayInput.vue'
import ImageUpload from './property-editors/ImageUpload.vue'

const props = defineProps<{
  selectedComponent: ComponentConfig | null
}>()

const propertySchema = computed(() => {
  if (!props.selectedComponent) return {}
  const config = getComponentConfigMap()[props.selectedComponent.type]
  return config?.propertySchema || {}
})

const getPropertyEditor = (type: string) => {
  const editors: Record<string, any> = {
    'string': StringInput,
    'number': NumberInput,
    'boolean': BooleanSwitch,
    'select': SelectInput,
    'textarea': TextareaInput,
    'color': ColorInput,
    'array': ArrayInput,
    'image': ImageUpload
  }
  return editors[type] || StringInput
}
</script>

<style scoped>
.property-editor {
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  padding: 20px;
  overflow-y: auto;
}

.property-editor h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.editor-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.editor-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #9ca3af;
}

.editor-empty p {
  font-size: 14px;
}
</style>