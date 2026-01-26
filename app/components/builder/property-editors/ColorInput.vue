<template>
  <div class="color-input">
    <label v-if="label">{{ label }}</label>
    <div class="color-input-wrapper">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="color"
        :disabled="disabled"
      />
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
      />
    </div>
    <div class="color-preview">
      <span class="preview-label">预览:</span>
      <div class="preview-color" :style="{ backgroundColor: modelValue }"></div>
      <span class="color-value">{{ modelValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.color-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-input label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.color-input-wrapper {
  display: flex;
  gap: 8px;
}

.color-input-wrapper input[type="color"] {
  width: 50px;
  height: 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
}

.color-input-wrapper input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.color-input-wrapper input[type="text"]:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.color-input-wrapper input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.preview-label {
  font-size: 12px;
  color: #6b7280;
}

.preview-color {
  width: 30px;
  height: 20px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.color-value {
  font-size: 12px;
  color: #374151;
  font-family: 'Courier New', monospace;
}
</style>